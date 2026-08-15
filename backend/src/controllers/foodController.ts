import { Request, Response } from 'express';
import { Food } from '../models/Food';
import { Category } from '../models/Category';
import { sendSuccess, sendError } from '../utils/response';
import mongoose from 'mongoose';

// Customer: List foods with filtering
export const getFoods = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, veg, available, popular, special } = req.query;
    const queryFilter: any = {};

    if (available !== undefined) {
      queryFilter.isAvailable = available === 'true';
    } else {
      queryFilter.isAvailable = true; // Default to available items for public
    }

    if (veg !== undefined) {
      queryFilter.isVeg = veg === 'true';
    }

    if (popular !== undefined) {
      queryFilter.isPopular = popular === 'true';
    }

    if (special !== undefined) {
      queryFilter.isSpecial = special === 'true';
    }

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category as string)) {
        queryFilter.categoryId = category;
      } else {
        const catObj = await Category.findOne({
          name: { $regex: new RegExp(`^${category}$`, 'i') }
        });
        if (catObj) {
          queryFilter.categoryId = catObj._id;
        } else {
          sendSuccess(res, 'Food items fetched', []);
          return;
        }
      }
    }

    if (search) {
      queryFilter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } }
      ];
    }

    const foods = await Food.find(queryFilter).populate('categoryId', 'name image');
    sendSuccess(res, 'Food items fetched successfully', foods);
  } catch (error: any) {
    sendError(res, 'Failed to fetch food items', 500, 'SERVER_ERROR');
  }
};

// Customer: Get food item details
export const getFoodById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendError(res, 'Invalid food ID', 400, 'INVALID_ID');
      return;
    }

    const food = await Food.findById(id).populate('categoryId', 'name image');
    if (!food) {
      sendError(res, 'Food item not found', 404, 'FOOD_NOT_FOUND');
      return;
    }

    sendSuccess(res, 'Food item details fetched successfully', food);
  } catch (error: any) {
    sendError(res, 'Failed to fetch food item details', 500, 'SERVER_ERROR');
  }
};

// Customer: Get full structured restaurant menu
export const getRestaurantMenu = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    const foods = await Food.find({ isAvailable: true }).populate('categoryId', 'name');

    const menu = categories.map((cat) => {
      const items = foods.filter((f) => f.categoryId && (f.categoryId as any)._id.toString() === cat._id.toString());
      return {
        category: cat,
        items
      };
    });

    sendSuccess(res, 'Restaurant menu fetched successfully', menu);
  } catch (error: any) {
    sendError(res, 'Failed to fetch restaurant menu', 500, 'SERVER_ERROR');
  }
};

// Admin: List all foods
export const getAdminFoods = async (_req: Request, res: Response): Promise<void> => {
  try {
    const foods = await Food.find().populate('categoryId', 'name').sort({ createdAt: -1 });
    sendSuccess(res, 'Admin foods list fetched successfully', foods);
  } catch (error: any) {
    sendError(res, 'Failed to fetch admin food items', 500, 'SERVER_ERROR');
  }
};

// Admin: Create new food item
export const createFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, image, categoryId, price, ingredients, preparationTime, spiceLevel, isVeg, isAvailable, isPopular, isSpecial } = req.body;

    if (!name || !categoryId || price === undefined) {
      sendError(res, 'Name, categoryId, and price are required fields', 400, 'MISSING_FIELDS');
      return;
    }

    const food = await Food.create({
      name,
      description,
      image,
      categoryId,
      price,
      ingredients: ingredients || [],
      preparationTime: preparationTime || '15-20 mins',
      spiceLevel: spiceLevel || 'Medium',
      isVeg: isVeg !== undefined ? isVeg : true,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isPopular: isPopular || false,
      isSpecial: isSpecial || false
    });

    const populated = await Food.findById(food._id).populate('categoryId', 'name');
    sendSuccess(res, 'Food item created successfully', populated, 201);
  } catch (error: any) {
    sendError(res, 'Failed to create food item', 500, 'SERVER_ERROR');
  }
};

// Admin: Update food item
export const updateFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendError(res, 'Invalid food ID', 400, 'INVALID_ID');
      return;
    }

    const food = await Food.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate('categoryId', 'name');
    if (!food) {
      sendError(res, 'Food item not found', 404, 'FOOD_NOT_FOUND');
      return;
    }

    sendSuccess(res, 'Food item updated successfully', food);
  } catch (error: any) {
    sendError(res, 'Failed to update food item', 500, 'SERVER_ERROR');
  }
};

// Admin: Delete food item
export const deleteFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendError(res, 'Invalid food ID', 400, 'INVALID_ID');
      return;
    }

    const food = await Food.findByIdAndDelete(id);
    if (!food) {
      sendError(res, 'Food item not found', 404, 'FOOD_NOT_FOUND');
      return;
    }

    sendSuccess(res, 'Food item deleted successfully', food);
  } catch (error: any) {
    sendError(res, 'Failed to delete food item', 500, 'SERVER_ERROR');
  }
};
