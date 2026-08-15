import { Router } from 'express';
import { createOrder } from '../controllers/orderController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateUser);

router.post('/', createOrder);

export default router;
