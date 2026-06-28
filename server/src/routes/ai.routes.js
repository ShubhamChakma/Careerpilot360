import { Router } from 'express';
import { chat } from '../controllers/ai.controller.js';
import firebaseAuth from '../middleware/firebaseAuth.js';
import { aiLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Route for general PrepBot conversation
router.post('/chat', firebaseAuth, aiLimiter, chat);

export default router;
