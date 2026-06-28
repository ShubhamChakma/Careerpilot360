import { predictJobFit } from '../services/jobPredictor.service.js';
import { db } from '../config/firebase.js';

/**
 * Predicts compatibility between a candidate's resume and a target role.
 * POST /api/job-predict
 */
export async function predictFit(req, res, next) {
  try {
    const userId = req.user.uid;
    const { resumeText, targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Target role is required to run the job fit predictor.' } 
      });
    }

    let textToAnalyze = resumeText;

    // If resumeText is not directly provided in the request body,
    // query the database to find the user's most recently uploaded resume.
    if (!textToAnalyze) {
      try {
        const snapshot = await db.collection('resumes')
          .where('userId', '==', userId)
          .get();

        if (snapshot.docs.length > 0) {
          const resumesList = snapshot.docs.map(doc => doc.data());
          // Sort by upload date descending
          resumesList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          textToAnalyze = resumesList[0].resumeText;
        }
      } catch (dbErr) {
        console.warn('⚠️ Firestore query for resumes failed in jobPredict:', dbErr.message);
      }
    }

    if (!textToAnalyze) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'No resume text provided. Please upload a resume or pass raw text.' } 
      });
    }

    const predictionReport = await predictJobFit(textToAnalyze, targetRole);

    res.json({
      success: true,
      data: predictionReport
    });
  } catch (error) {
    next(error);
  }
}
