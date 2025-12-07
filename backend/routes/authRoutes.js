import { Router } from 'express';
import { signup, login, verifyToken } from '../controllers/authController.js';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public auth endpoints
router.post('/signup', signup);
router.post('/login', login);
router.get('/verify', adminAuth, verifyToken);

export default router;

