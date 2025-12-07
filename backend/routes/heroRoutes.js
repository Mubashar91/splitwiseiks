import { Router } from 'express';
import { getHero } from '../controllers/heroController.js';

const router = Router();

// Public hero endpoint
router.get('/', getHero);

export default router;

