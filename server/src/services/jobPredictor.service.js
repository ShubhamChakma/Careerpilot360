import { generateJson } from './groq.service.js';

/**
 * Predicts the match score and skills gap for a target job role based on resume text.
 * @param {string} resumeText - Extracted resume content
 * @param {string} targetRole - Job role name (e.g. 'Frontend Developer')
 * @returns {Promise<object>} Match analysis report
 */
export async function predictJobFit(resumeText) {
  if (!resumeText) {
    throw new Error('Resume text is required for prediction.');
  }

  const systemPrompt = `
    You are an advanced AI Career Analyst, Technical Recruiter, and Job Match Predictor.
    Analyze the candidate's resume text and predict the TOP 5 most suitable job roles they could target.
    
    You must output a single JSON response containing EXACTLY these fields:
    - predictions (array of exactly 5 objects, representing the top matching job roles. Each object must contain:
        - role (string: the job title/role name, e.g. "Frontend Developer")
        - match (number, 0-100: match percentage)
        - confidence (number, 0-100: AI confidence score in this prediction, 0-100)
        - selectionProbability (number, 0-100: estimated selection probability, 0-100)
        - avgSalary (string: estimated annual salary range, e.g. "$90,000 - $120,000")
        - requiredSkills (array of strings: important skills required for this job)
        - missingSkills (array of strings: skills required for this job that are missing in the candidate's resume)
        - reasoning (string: detailed reason why this role was predicted and how the candidate qualifies)
        - suggestions (array of strings: specific learning advice, e.g. ["Learn Next.js", "Build one production project"])
        - learningTime (string: estimated learning time to bridge missing skills, e.g. "2-4 weeks")
        - topCompanies (array of strings: 3 typical companies hiring for this, e.g. ["Google", "Meta", "Stripe"])
        - careerPath (array of strings: 3 sequence steps, e.g. ["Junior Frontend Developer", "Senior Engineer", "Frontend Architect"])
    )
    - overallReadiness (number, 0-100: candidate's overall readiness across all suitable tech roles)
    - strongestArea (string: candidate's strongest skill area, e.g. "React & Frontend Architecture")
    - weakestArea (string: candidate's weakest area / largest skill gap, e.g. "Cloud Orchestration / CI/CD")
    
    Ensure your response is valid JSON and only contains the requested fields.
  `;

  const userPrompt = `
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
