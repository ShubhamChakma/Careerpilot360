import { predictJobFit } from '../services/jobPredictor.service.js';
import { db } from '../config/firebase.js';

/**
 * Predicts compatibility between a candidate's resume and a target role.
 * POST /api/job-predict
 */
export async function predictFit(req, res, next) {
  try {
    const userId = req.user.uid;
    const { resumeText } = req.body || {};

    let textToAnalyze = resumeText;

    // Query database to find the user's most recently uploaded resume.
    if (!textToAnalyze) {
      try {
        const doc = await db.collection('resumes').doc(userId).get();
        if (doc.exists) {
          textToAnalyze = doc.data().resumeText || '';
        }
      } catch (dbErr) {
        console.warn('⚠️ Firestore query for resumes failed in jobPredict:', dbErr.message);
      }
    }

    if (!textToAnalyze) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Please upload a resume in the ATS Scanner first to run job predictions.' } 
      });
    }

    const predictionReport = await predictJobFit(textToAnalyze);

    res.json({
      success: true,
      data: predictionReport
    });
  } catch (error) {
    next(error);
  }
}
