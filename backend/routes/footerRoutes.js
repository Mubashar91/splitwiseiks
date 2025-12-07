import { Router } from 'express';
import { getFooter } from '../controllers/footerController.js';

const router = Router();

// Public footer endpoint
router.get('/', getFooter);

export default router;

