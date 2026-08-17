import { Router } from 'express';
import { getFoods, getFoodById } from '../controllers/foodController';

const router = Router();

router.get('/', getFoods);
router.get('/:id', getFoodById);

export default router;
