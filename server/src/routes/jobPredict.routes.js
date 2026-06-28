import { Router } from 'express';
import { predictFit } from '../controllers/jobPredict.controller.js';
import firebaseAuth from '../middleware/firebaseAuth.js';
import { aiLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Route to perform job fit compatibility matching
router.post('/', firebaseAuth, aiLimiter, predictFit);

export default router;
