import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

router.get('/me', authenticateUser, getUserProfile);
router.put('/me', authenticateUser, updateUserProfile);

export default router;
