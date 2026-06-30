import { Router } from 'express';
import { startInterview, submitInterviewAnswer, getInterviewSession, saveAndEvaluateInterview } from '../controllers/interview.controller.js';
import firebaseAuth from '../middleware/firebaseAuth.js';
import { aiLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.use(firebaseAuth);

router.post('/start', aiLimiter, startInterview);
router.post('/submit-answer', aiLimiter, submitInterviewAnswer);
router.post('/save', aiLimiter, saveAndEvaluateInterview);
router.get('/session/:id', getInterviewSession);

export default router;
