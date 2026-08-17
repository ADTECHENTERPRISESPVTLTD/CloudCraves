import { Router } from 'express';
import { adminLogin, getAdminProfile } from '../controllers/adminAuthController';
import { authenticateAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.post('/login', adminLogin);
router.get('/me', authenticateAdmin, getAdminProfile);

export default router;
