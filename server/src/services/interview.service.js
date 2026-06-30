import { generateJson } from './groq.service.js';

/**
 * Generates a mock interview question based on job details and previous questions.
 * @param {string} jobTitle 
 * @param {string} experienceLevel 
 * @param {Array} previousQuestions 
 * @param {string} resumeText 
 * @returns {Promise<object>}
 */
export async function generateQuestion(jobTitle, experienceLevel, previousQuestions = [], resumeText = '') {
  if (!jobTitle) {
    throw new Error('Job title is required to generate a question.');
  }

  const questionIndex = previousQuestions.length;
  let questionCategory = 'Technical';
  if (questionIndex === 0) questionCategory = 'HR & Background';
  else if (questionIndex === 1) questionCategory = 'Technical Concept (core language/framework)';
  else if (questionIndex === 2) questionCategory = 'Project-based / Resume Experience';
  else if (questionIndex === 3) questionCategory = 'Behavioral (STAR method)';
  else questionCategory = 'Problem Solving / DSA / System Design';

  const systemPrompt = `
    You are an expert technical interviewer conducting a mock interview for the role of ${jobTitle} at ${experienceLevel} level.
    You must generate the NEXT relevant and role-appropriate interview question for the candidate.
    
    Current Question Index: ${questionIndex} (out of 5 total questions).
    Target Category for this question: ${questionCategory}.
    
    Personalization rules:
    - Carefully read the candidate's resume content: "${resumeText || 'None provided'}".
    - If the resume is provided, personalize the question directly based on their listed skills, experiences, or projects.
    - If React is listed, ask about React. If Java is listed, ask about Java. If DSA is listed, ask about DSA.
    - NEVER ask completely generic questions. For example, instead of "Describe a project", ask "Describe how you built [Specific Project Name from Resume]".
    - Ensure the question is not similar to previous questions: ${JSON.stringify(previousQuestions)}.
    
    Return a JSON response containing:
    - question (string: the interview question)
    - context (string: what specific skills or behavioral aspects this evaluates)
    - tips (string: detailed advice on how the candidate can structure their response)
  `;

  const userPrompt = `
    Role: ${jobTitle}
    Experience Level: ${experienceLevel || 'Mid-Level'}
    Resume Context: ${resumeText || 'None provided'}
    Previous Questions asked: ${previousQuestions.join(' | ')}
  `;

  try {
    return await generateJson(systemPrompt, userPrompt);
  } catch (error) {
    console.error('❌ Question generation failed:', error.message);
    throw new Error('Failed to generate interview question.');
  }
}

/**
 * Evaluates candidate response to a single question.
 * @param {string} question 
 * @param {string} answer 
 * @returns {Promise<object>}
 */
export async function evaluateAnswer(question, answer) {
  if (!question || !answer) {
    throw new Error('Question and candidate answer are required for evaluation.');
  }

  const systemPrompt = `
    You are a professional hiring manager grading a candidate's answer to an interview question.
    Provide constructive feedback and a score.
    Return a JSON response containing:
    - score (number, 0-10: overall answer quality and technical depth)
    - feedback (string: qualitative analysis of the candidate's answer)
    - keyPointsAddressed (array of strings: important terms or concepts the candidate mentioned)
    - suggestedRevision (string: a polished example of a top-tier answer)
  `;

  const userPrompt = `
    Interview Question: ${question}
    Candidate Response: ${answer}
  `;

  try {
    return await generateJson(systemPrompt, userPrompt);
  } catch (error) {
    console.error('❌ Answer evaluation failed:', error.message);
    throw new Error('Failed to evaluate candidate response.');
  }
}

/**
 * Performs a comprehensive evaluation of the complete interview session.
 * @param {object} session - The interview session object from database containing questions, answers, and evaluations.
 * @returns {Promise<object>} Aggregate evaluation report
 */
export async function evaluateInterviewSession(session) {
  if (!session || !session.questions || session.questions.length === 0) {
    throw new Error('No interview questions or answers found to evaluate.');
  }

  const systemPrompt = `
    You are an expert Executive Hiring Panel and Director of Engineering.
    Evaluate the complete mock interview session for the candidate preparing for the role of "${session.jobTitle}" (${session.experienceLevel}).
    
    Review all questions asked and responses given by the candidate. Score each dimension on a scale of 0 to 100.
    
    You must output a single JSON response containing:
    - overallScore (number, 0-100: average of all categories)
    - technicalScore (number, 0-100: technical depth and accuracy shown in technical answers)
    - communicationScore (number, 0-100: clarity, structure, and articulation)
    - confidenceScore (number, 0-100: assertiveness, flow, and handling of difficult scenarios)
    - problemSolvingScore (number, 0-100: logic, analytical approach, and structure)
    - resumeKnowledgeScore (number, 0-100: familiarity and depth when explaining resume projects/skills)
    - behaviourScore (number, 0-100: response to behavioral questions, situational adaptability)
    - summary (string: concise summary of candidate performance, 3-4 sentences)
    - strengths (array of strings: 3 key standout strengths)
    - weaknesses (array of strings: 3 clear areas of gap or concern)
    - suggestions (array of strings: specific learning advice or response tuning suggestions)
    - nextSteps (array of strings: actionable next steps, e.g. "revise event-loop", "practice coding questions under time constraints")
    
    Ensure the response is valid JSON and only contains the requested fields.
  `;

  const transcript = session.questions.map((q, idx) => `
    Q${idx + 1}: ${q.question}
    A${idx + 1}: ${q.answer || '(No response provided)'}
  `).join('\n\n');

  const userPrompt = `
    Job Role: ${session.jobTitle}
    Experience Level: ${session.experienceLevel}
    Resume Context: ${session.resumeText ? 'Yes (provided)' : 'No'}
    
    --- INTERVIEW TRANSCRIPT ---
    ${transcript}
  `;

  try {
    return await generateJson(systemPrompt, userPrompt);
  } catch (error) {
    console.error('❌ Session aggregate evaluation failed:', error.message);
    throw new Error('Failed to generate full interview feedback report.');
  }
}
