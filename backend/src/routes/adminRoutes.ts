import { Router } from 'express';
import { authenticateAdmin } from '../middleware/adminMiddleware';
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import {
  getAdminFoods,
  createFood,
  getFoodById,
  updateFood,
  deleteFood
} from '../controllers/foodController';
import {
  getAdminOrders,
  getAdminOrderDetails,
  updateAdminOrderStatus,
  cancelAdminOrder
} from '../controllers/adminOrderController';
import { getAdminReviews } from '../controllers/reviewController';

const router = Router();

// Protect all routes under /api/admin with admin auth middleware
router.use(authenticateAdmin);

// Admin Category Routes
router.get('/categories', getAdminCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Admin Food Routes
router.get('/foods', getAdminFoods);
router.post('/foods', createFood);
router.get('/foods/:id', getFoodById);
router.put('/foods/:id', updateFood);
router.delete('/foods/:id', deleteFood);

// Admin Order Management Routes
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderDetails);
router.patch('/orders/:id/status', updateAdminOrderStatus);
router.patch('/orders/:id/cancel', cancelAdminOrder);

// Admin Review Management Route
router.get('/reviews', getAdminReviews);

export default router;
