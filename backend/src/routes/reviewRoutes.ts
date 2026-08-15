import { Router } from 'express';
import { createReview, getUserReviews } from '../controllers/reviewController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateUser);

router.post('/', createReview);
router.get('/', getUserReviews);

export default router;
