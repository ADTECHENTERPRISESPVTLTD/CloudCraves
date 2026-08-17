import { Router } from 'express';
import {
  createOrder,
  getCustomerOrders,
  getCustomerOrderById,
  getCustomerOrderStatus
} from '../controllers/orderController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

// Protect all customer order endpoints
router.use(authenticateUser);

router.post('/', createOrder);
router.get('/', getCustomerOrders);
router.get('/:id', getCustomerOrderById);
router.get('/:id/status', getCustomerOrderStatus);

export default router;
