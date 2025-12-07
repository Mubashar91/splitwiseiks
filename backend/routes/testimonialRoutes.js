import { Router } from 'express';
import { getTestimonials } from '../controllers/testimonialController.js';

const router = Router();

// Public testimonials endpoint
router.get('/', getTestimonials);

export default router;

