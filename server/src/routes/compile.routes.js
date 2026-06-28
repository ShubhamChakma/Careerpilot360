import { Router } from 'express';
import { submitCode, compilerHealth } from '../controllers/compile.controller.js';
import firebaseAuth from '../middleware/firebaseAuth.js';
import { apiLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Health check (no auth needed)
router.get('/health', compilerHealth);

// Protect coding submissions and rate limit them
router.post('/', firebaseAuth, apiLimiter, submitCode);

export default router;
