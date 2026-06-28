import { parseResume } from '../services/resume.parser.js';
import { analyzeResume } from '../services/ats.service.js';
import { db } from '../config/firebase.js';

/**
 * Handles resume file uploads, extracts text, runs ATS analysis, and stores the details in Firestore.
 * POST /api/resume/scan
 */
export async function scanResume(req, res, next) {
  try {
    const userId = req.user.uid;
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'No file uploaded. Please upload a PDF, DOCX, or TXT resume.' } 
      });
    }

    if (!jobDescription) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Job description is required to perform ATS scanning comparison.' } 
      });
    }

    // 1. Extract text from the uploaded document buffer
    const resumeText = await parseResume(req.file.buffer, req.file.mimetype);

    // 2. Perform the ATS compatibility evaluation using Groq LLM
    const scanReport = await analyzeResume(resumeText, jobDescription);

    // 3. Store record in database for history lookup and reuse
    const record = {
      userId,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      resumeText,
      jobDescription,
      report: scanReport,
      createdAt: new Date().toISOString()
    };

    let docId = null;
    try {
      await db.collection('resumes').doc(userId).set(record);
      docId = userId;
    } catch (dbErr) {
      console.warn('⚠️ Could not save resume record to Firestore:', dbErr.message);
    }

    res.json({
      success: true,
      data: {
        id: docId || 'mock-id',
        fileName: req.file.originalname,
        report: scanReport
      }
    });
  } catch (error) {
    next(error);
  }
}
