import { Router } from 'express';
import { getPricing } from '../controllers/planController.js';

const router = Router();

// Public pricing endpoint
router.get('/', getPricing);

export default router;
