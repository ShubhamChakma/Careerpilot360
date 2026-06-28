import { Router } from 'express';
import {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession
} from '../controllers/chatSession.controller.js';
import firebaseAuth from '../middleware/firebaseAuth.js';

const router = Router();

// Secure all chat session management endpoints
router.use(firebaseAuth);

router.post('/', createSession);
router.get('/', getSessions);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

export default router;
