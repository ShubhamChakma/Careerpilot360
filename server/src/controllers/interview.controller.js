import { db } from '../config/firebase.js';
import { generateQuestion, evaluateAnswer } from '../services/interview.service.js';

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

    const firstQuestion = await generateQuestion(
      jobTitle,
      experienceLevel || 'Mid-Level',
      [],
      resumeText || ''
    );

    const sessionData = {
      userId,
      jobTitle,
      experienceLevel: experienceLevel || 'Mid-Level',
      resumeText: resumeText || '',
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
        currentQuestionIndex: 0,
        question: firstQuestion.question,
        tips: firstQuestion.tips
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

    // Conclude session after 3 questions (or customize as needed)
    if (nextIdx < 3) {
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
        currentQuestionIndex: session.currentQuestionIndex
      }
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

    // Compute aggregate average score
    let scoreSum = 0;
    let scoreCount = 0;
    session.questions.forEach(q => {
      if (q.evaluation && q.evaluation.score !== undefined) {
        scoreSum += Number(q.evaluation.score);
        scoreCount++;
      }
    });

    const averageScore = scoreCount > 0 ? parseFloat((scoreSum / scoreCount).toFixed(1)) : 0;

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...session,
        averageScore
      }
    });
  } catch (error) {
    next(error);
  }
}
