import { Router } from 'express';
import { scanResume, getActiveResume } from '../controllers/resume.controller.js';
import upload from '../middleware/upload.js';
import firebaseAuth from '../middleware/firebaseAuth.js';
import { aiLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Route for fetching the active resume
router.get('/', firebaseAuth, getActiveResume);

// Route for multipart uploading and scanning resumes
router.post('/scan', firebaseAuth, upload.single('resume'), aiLimiter, scanResume);

export default router;
