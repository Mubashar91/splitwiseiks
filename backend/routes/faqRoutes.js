import { Router } from 'express';
import { getFAQs } from '../controllers/faqController.js';

const router = Router();

// Public FAQ endpoint
router.get('/', getFAQs);

export default router;

