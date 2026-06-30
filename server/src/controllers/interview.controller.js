import { db } from '../config/firebase.js';
import { generateQuestion, evaluateAnswer, evaluateInterviewSession } from '../services/interview.service.js';

/**
 * Initializes a mock interview session and generates the first question.
 * POST /api/interview/start
 */
export async function startInterview(req, res, next) {
  try {
    const userId = req.user.uid;
    const { jobTitle, experienceLevel, resumeText } = req.body;

    if (!jobTitle) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Job title is required to trigger a mock interview.' } 
      });
    }

    let textToUse = resumeText || '';
    // If resume is not provided, check if the user has a saved resume in Firestore
    if (!textToUse) {
      try {
        const doc = await db.collection('resumes').doc(userId).get();
        if (doc.exists) {
          textToUse = doc.data().resumeText || '';
        }
      } catch (dbErr) {
        console.warn('⚠️ Firestore resume query failed in startInterview:', dbErr.message);
      }
    }

    const firstQuestion = await generateQuestion(
      jobTitle,
      experienceLevel || 'Mid-Level',
      [],
      textToUse
    );

    const sessionData = {
      userId,
      jobTitle,
      experienceLevel: experienceLevel || 'Mid-Level',
      resumeText: textToUse,
      currentQuestionIndex: 0,
      questions: [
        {
          question: firstQuestion.question,
          context: firstQuestion.context,
          tips: firstQuestion.tips,
          answer: null,
          evaluation: null
        }
      ],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('interview_sessions').add(sessionData);

    res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        sessionId: docRef.id, // For backward compatibility with some frontends
        currentQuestionIndex: 0,
        question: firstQuestion.question,
        tips: firstQuestion.tips,
        message: firstQuestion.question // fallback
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Submits response to the current question, evaluates it, and serves the next question.
 * POST /api/interview/submit-answer
 */
export async function submitInterviewAnswer(req, res, next) {
  try {
    const userId = req.user.uid;
    const { sessionId, answer } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Session ID is required.' } 
      });
    }

    if (answer === undefined || answer === null) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Answer string is required.' } 
      });
    }

    const docRef = db.collection('interview_sessions').doc(sessionId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Interview session not found.' } 
      });
    }

    const session = doc.data();
    if (session.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Forbidden access to this interview session.' } 
      });
    }

    if (session.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Interview is already completed.' } 
      });
    }

    const currentIdx = session.currentQuestionIndex;
    const questionNode = session.questions[currentIdx];

    // Evaluate answer via Groq LLM Grader
    const evaluation = await evaluateAnswer(questionNode.question, answer);

    // Save answer and grade
    session.questions[currentIdx].answer = answer;
    session.questions[currentIdx].evaluation = evaluation;

    let nextQuestionNode = null;
    const nextIdx = currentIdx + 1;
    const maxQuestions = 5;

    let report = null;

    if (nextIdx < maxQuestions) {
      const prevQuestions = session.questions.map(q => q.question);
      nextQuestionNode = await generateQuestion(
        session.jobTitle,
        session.experienceLevel,
        prevQuestions,
        session.resumeText
      );

      session.questions.push({
        question: nextQuestionNode.question,
        context: nextQuestionNode.context,
        tips: nextQuestionNode.tips,
        answer: null,
        evaluation: null
      });

      session.currentQuestionIndex = nextIdx;
    } else {
      session.status = 'completed';
      // Auto-evaluate entire session
      try {
        report = await evaluateInterviewSession(session);
        session.report = report;
      } catch (err) {
        console.warn('⚠️ Auto-evaluation failed, creating basic report:', err.message);
        report = createFallbackReport(session);
        session.report = report;
      }
    }

    session.updatedAt = new Date().toISOString();
    await docRef.update(session);

    res.json({
      success: true,
      data: {
        completed: session.status === 'completed',
        evaluation,
        nextQuestion: nextQuestionNode ? nextQuestionNode.question : null,
        nextQuestionTips: nextQuestionNode ? nextQuestionNode.tips : null,
        currentQuestionIndex: session.currentQuestionIndex,
        // Backward compatibility
        message: nextQuestionNode ? nextQuestionNode.question : null,
        reply: nextQuestionNode ? nextQuestionNode.question : null,
        score: report || null
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Ends interview session early and evaluates it.
 * POST /api/interview/save
 */
export async function saveAndEvaluateInterview(req, res, next) {
  try {
    const userId = req.user.uid;
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Session ID is required.' } 
      });
    }

    const docRef = db.collection('interview_sessions').doc(sessionId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Interview session not found.' } 
      });
    }

    const session = doc.data();
    if (session.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Forbidden access to this interview session.' } 
      });
    }

    session.status = 'completed';
    session.updatedAt = new Date().toISOString();

    let report = null;
    try {
      report = await evaluateInterviewSession(session);
      session.report = report;
    } catch (err) {
      console.warn('⚠️ Final evaluation failed, creating fallback:', err.message);
      report = createFallbackReport(session);
      session.report = report;
    }

    await docRef.update(session);

    res.json({
      success: true,
      data: {
        completed: true,
        score: report
      },
      // Backward compatibility keys
      score: report
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Returns complete interview feedback reports.
 * GET /api/interview/session/:id
 */
export async function getInterviewSession(req, res, next) {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const doc = await db.collection('interview_sessions').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Interview session not found.' } 
      });
    }

    const session = doc.data();
    if (session.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Forbidden access to this session report.' } 
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...session,
        averageScore: session.report?.overallScore || 0
      }
    });
  } catch (error) {
    next(error);
  }
}

function createFallbackReport(session) {
  let scoreSum = 0;
  let count = 0;
  session.questions.forEach(q => {
    if (q.evaluation && q.evaluation.score !== undefined) {
      scoreSum += Number(q.evaluation.score) * 10; // score is 0-10, scale to 0-100
      count++;
    }
  });
  const avg = count > 0 ? Math.round(scoreSum / count) : 70;

  return {
    overallScore: avg,
    technicalScore: avg,
    communicationScore: Math.max(40, avg - 5),
    confidenceScore: Math.max(40, avg - 3),
    problemSolvingScore: Math.max(40, avg + 2),
    resumeKnowledgeScore: avg,
    behaviourScore: Math.max(40, avg - 2),
    summary: 'Mock technical interview completed successfully. Evaluation aggregated based on response scores.',
    strengths: ['Covered technical definitions', 'Followed the questions sequentially'],
    weaknesses: ['Response depth can be improved', 'Quantify project details further'],
    suggestions: ['Structure behavioral answers with the STAR method (Situation, Task, Action, Result)'],
    nextSteps: ['Revise core development questions', 'Take another practice interview']
  };
}
