import { Router } from 'express';
import { getWhyChooseUs } from '../controllers/whyChooseUsController.js';

const router = Router();

// Public why choose us endpoint
router.get('/', getWhyChooseUs);

export default router;

