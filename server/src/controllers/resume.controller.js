import { parseResume, parseResumeData } from '../services/resume.parser.js';
import { analyzeResume } from '../services/ats.service.js';
import { db } from '../config/firebase.js';

/**
 * Handles resume file uploads, extracts text, runs ATS analysis, and stores the details in Firestore.
 * POST /api/resume/scan
 */
export async function scanResume(req, res, next) {
  try {
    const userId = req.user.uid;
    const { jobDescription, useExisting } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Job description is required to perform ATS scanning comparison.' } 
      });
    }

    let resumeText = '';
    let parsedData = null;
    let fileName = '';
    let mimeType = '';
    let existingRecord = null;

    // 1. If we are instructed to use the existing resume or no file is attached, check Firestore
    if ((useExisting === 'true' || useExisting === true || !req.file)) {
      try {
        const doc = await db.collection('resumes').doc(userId).get();
        if (doc.exists) {
          existingRecord = doc.data();
          resumeText = existingRecord.resumeText || '';
          parsedData = existingRecord.parsedData || null;
          fileName = existingRecord.fileName || 'Existing Resume';
          mimeType = existingRecord.mimeType || 'application/pdf';
        }
      } catch (dbErr) {
        console.warn('⚠️ Could not fetch existing resume from Firestore:', dbErr.message);
      }

      if (!resumeText) {
        return res.status(400).json({
          success: false,
          error: { message: 'No existing resume found on file. Please upload a PDF, DOCX, or DOC resume.' }
        });
      }
    } else {
      // New file uploaded
      fileName = req.file.originalname;
      mimeType = req.file.mimetype;
      // Extract text from the uploaded document buffer
      resumeText = await parseResume(req.file.buffer, req.file.mimetype, req.file.originalname);
      
      // Structure the resume content using Groq LLM
      try {
        parsedData = await parseResumeData(resumeText);
      } catch (err) {
        console.warn('⚠️ Resume structure extraction failed, saving raw text only:', err.message);
      }
    }

    // 2. Perform the ATS compatibility evaluation using Groq LLM
    const scanReport = await analyzeResume(resumeText, jobDescription);

    // 3. Store record in database for history lookup and reuse
    const record = {
      userId,
      fileName,
      mimeType,
      resumeText,
      jobDescription,
      report: scanReport,
      updatedAt: new Date().toISOString()
    };

    if (parsedData) {
      record.parsedData = parsedData;
    } else if (existingRecord && existingRecord.parsedData) {
      record.parsedData = existingRecord.parsedData;
    }

    if (!existingRecord) {
      record.createdAt = new Date().toISOString();
    } else {
      record.createdAt = existingRecord.createdAt || new Date().toISOString();
    }

    let docId = null;
    try {
      await db.collection('resumes').doc(userId).set(record, { merge: true });
      docId = userId;
    } catch (dbErr) {
      console.warn('⚠️ Could not save resume record to Firestore:', dbErr.message);
    }

    res.json({
      success: true,
      data: {
        id: docId || 'mock-id',
        fileName,
        parsedData: record.parsedData || null,
        report: scanReport
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Fetches the user's active resume details from Firestore.
 * GET /api/resume
 */
export async function getActiveResume(req, res, next) {
  try {
    const userId = req.user.uid;
    const doc = await db.collection('resumes').doc(userId).get();
    if (!doc.exists) {
      return res.json({ success: true, data: null });
    }
    return res.json({ success: true, data: doc.data() });
  } catch (error) {
    next(error);
  }
}
