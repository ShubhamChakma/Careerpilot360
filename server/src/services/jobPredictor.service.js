import { generateJson } from './groq.service.js';

/**
 * Predicts the match score and skills gap for a target job role based on resume text.
 * @param {string} resumeText - Extracted resume content
 * @param {string} targetRole - Job role name (e.g. 'Frontend Developer')
 * @returns {Promise<object>} Match analysis report
 */
export async function predictJobFit(resumeText, targetRole) {
  if (!resumeText) {
    throw new Error('Resume text is required for prediction.');
  }
  if (!targetRole) {
    throw new Error('Target role is required for prediction.');
  }

  const systemPrompt = `
    You are an advanced AI Career Analyst and Job Match Predictor.
    Evaluate the candidate resume text against the target job role and output a JSON response containing:
    - matchScore (number, 0-100: degree of compatibility)
    - careerFit (string: qualitative summary, e.g. 'Strong', 'Moderate', 'Low')
    - recommendations (array of strings: other related jobs they qualify for)
    - skillsGap (array of strings: key skills or certifications the candidate lacks for the target role)
    - advice (string: actionable advice to land the job)
    
    Ensure your response is valid JSON and only contains the requested fields.
  `;

  const userPrompt = `
    --- TARGET ROLE ---
    ${targetRole}
    
    --- RESUME TEXT ---
    ${resumeText}
  `;

  try {
    return await generateJson(systemPrompt, userPrompt);
  } catch (error) {
    console.error('❌ Job fit predictor error:', error.message);
    throw new Error('Failed to perform job match prediction.');
  }
}
