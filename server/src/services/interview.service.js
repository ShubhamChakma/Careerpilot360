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

  const systemPrompt = `
    You are an expert technical interviewer.
    Generate a relevant and role-appropriate interview question for a candidate.
    Return a JSON response containing:
    - question (string: the interview question)
    - context (string: what technical/behavioral skill this evaluates)
    - tips (string: hints on how a candidate can structure their response)
    
    Ensure the question is not in the list of previous questions: ${JSON.stringify(previousQuestions)}.
  `;

  const userPrompt = `
    Role: ${jobTitle}
    Experience Level: ${experienceLevel || 'Mid-Level'}
    Resume Context: ${resumeText || 'None provided'}
  `;

  try {
    return await generateJson(systemPrompt, userPrompt);
  } catch (error) {
    console.error('❌ Question generation failed:', error.message);
    throw new Error('Failed to generate interview question.');
  }
}

/**
 * Evaluates candidate response to a question.
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
