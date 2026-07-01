import { Router } from 'express';
import { getUserSubmissions } from '../controllers/submissions.controller.js';
import firebaseAuth from '../middleware/firebaseAuth.js';

const router = Router();

// GET /api/submissions — fetch the authenticated user's submissions
router.get('/', firebaseAuth, getUserSubmissions);

export default router;
