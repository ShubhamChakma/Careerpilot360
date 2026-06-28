import { generateJson } from './groq.service.js';

/**
 * Analyzes resume text against a target job description.
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobDescription - Target job description
 * @returns {Promise<object>} ATS Scan report JSON
 */
export async function analyzeResume(resumeText, jobDescription) {
  if (!resumeText) {
    throw new Error('Resume content is empty.');
  }
  if (!jobDescription) {
    throw new Error('Job description is empty.');
  }

  const systemPrompt = `
    You are an expert ATS (Applicant Tracking System) scanner and professional resume reviewer.
    Compare the resume text with the job description and output a JSON response containing EXACTLY these fields:
    - overall (number, 0-100: overall ATS compatibility score combining layout, keywords, and structure)
    - breakdown (object with exactly these numeric keys, each scored 0-100: keywords, formatting, experience, skills, education)
    - matchedKeywords (array of strings: key terms from the job description that are found in the resume)
    - missingKeywords (array of strings: important keywords from the job description that are missing from the resume)
    - suggestions (array of strings: specific, actionable improvements the candidate can make to increase the ATS score)
    - feedback (string: concise overall assessment summary in 2-3 sentences)
    
    Ensure your response is valid JSON and only contains the requested fields.
  `;

  const userPrompt = `
    --- RESUME TEXT ---
    ${resumeText}
    
    --- JOB DESCRIPTION ---
    ${jobDescription}
  `;

  try {
    const result = await generateJson(systemPrompt, userPrompt);
    return result;
  } catch (error) {
    console.error('❌ ATS service error:', error.message);
    throw new Error('Failed to run resume analysis.');
  }
}
