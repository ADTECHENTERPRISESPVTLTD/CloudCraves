import { Router } from 'express';
import { getRestaurantInfo, getRestaurantSettings, updateRestaurantInfo } from '../controllers/restaurantController';
import { getRestaurantMenu } from '../controllers/foodController';
import { getPublicCategories } from '../controllers/categoryController';
import { authenticateAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', getRestaurantInfo);
router.get('/settings', getRestaurantSettings);
router.get('/menu', getRestaurantMenu);
router.get('/categories', getPublicCategories);
router.put('/', authenticateAdmin, updateRestaurantInfo);

export default router;
