import { Router } from 'express';
import { getCaseStudies, getCaseStudyById } from '../controllers/caseStudyController.js';

const router = Router();

// Public case study endpoints
router.get('/', getCaseStudies);
router.get('/:id', getCaseStudyById);

export default router;

