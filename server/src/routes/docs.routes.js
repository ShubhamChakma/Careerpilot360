import { Router } from 'express';
import { getLinks, getTutorial } from '../controllers/docs.controller.js';
import firebaseAuth from '../middleware/firebaseAuth.js';

const router = Router();

// Docs hub lookup requires active user session validation
router.use(firebaseAuth);

router.get('/links', getLinks);
router.get('/tutorial/:topic', getTutorial);

export default router;
