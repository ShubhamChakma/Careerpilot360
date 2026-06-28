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
    Compare the resume text with the job description and output a JSON response containing:
    - score (number, 0-100: general resume layout, metrics, structure quality)
    - matchPercentage (number, 0-100: alignment with the job description)
    - feedback (string: detailed review summary)
    - strengths (array of strings: match-points and skills highlighted well)
    - weaknesses (array of strings: gaps, missing keywords, formatting errors)
    - improvements (array of objects: each has 'section' and 'suggestion' explaining how to fix the gaps)
    - parsedSkills (array of strings: skills found in the resume)
    
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
