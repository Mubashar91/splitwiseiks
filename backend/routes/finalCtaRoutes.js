import { Router } from 'express';
import { getFinalCTA } from '../controllers/finalCtaController.js';

const router = Router();

// Public Final CTA endpoint
router.get('/', getFinalCTA);

export default router;
