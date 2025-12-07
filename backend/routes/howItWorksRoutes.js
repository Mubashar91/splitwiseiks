import { Router } from 'express';
import { getHowItWorks } from '../controllers/howItWorksController.js';

const router = Router();

// Public how it works endpoint
router.get('/', getHowItWorks);

export default router;

