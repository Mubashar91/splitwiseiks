import { Router } from 'express';
import { getServices } from '../controllers/serviceController.js';

const router = Router();

// Public services endpoint
router.get('/', getServices);

export default router;

