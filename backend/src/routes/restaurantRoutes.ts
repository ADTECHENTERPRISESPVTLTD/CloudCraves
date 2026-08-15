import { Router } from 'express';
import { getRestaurantInfo, getRestaurantSettings, updateRestaurantInfo } from '../controllers/restaurantController';
import { authenticateAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', getRestaurantInfo);
router.get('/settings', getRestaurantSettings);
router.put('/', authenticateAdmin, updateRestaurantInfo);

export default router;
