import { Router } from 'express';
import { submitCode, getJobStatus } from '../controllers/compile.controller.js';
import firebaseAuth from '../middleware/firebaseAuth.js';
import { apiLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Protect coding submissions and rate limit them
router.use(firebaseAuth);
router.use(apiLimiter);

router.post('/', submitCode);
router.get('/:jobId', getJobStatus);

export default router;
