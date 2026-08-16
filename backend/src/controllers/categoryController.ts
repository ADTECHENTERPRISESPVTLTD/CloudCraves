import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { sendSuccess, sendError } from '../utils/response';

// Public GET categories
export const getPublicCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    sendSuccess(res, 'Categories fetched successfully', categories);
  } catch (error: any) {
    sendError(res, 'Failed to fetch categories', 500, 'SERVER_ERROR');
  }
};

// Admin GET all categories
export const getAdminCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 });
    sendSuccess(res, 'Admin categories fetched successfully', categories);
  } catch (error: any) {
    sendError(res, 'Failed to fetch admin categories', 500, 'SERVER_ERROR');
  }
};

// Admin CREATE category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, image, isActive, sortOrder } = req.body;
    if (!name) {
      sendError(res, 'Category name is required', 400, 'MISSING_FIELDS');
      return;
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      sendError(res, 'Category with this name already exists', 400, 'DUPLICATE_CATEGORY');
      return;
    }

    const category = await Category.create({
      name: name.trim(),
      description,
      image,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0
    });

    sendSuccess(res, 'Category created successfully', category, 201);
  } catch (error: any) {
    sendError(res, 'Failed to create category', 500, 'SERVER_ERROR');
  }
};

// Admin UPDATE category
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!category) {
      sendError(res, 'Category not found', 404, 'CATEGORY_NOT_FOUND');
      return;
    }

    sendSuccess(res, 'Category updated successfully', category);
  } catch (error: any) {
    sendError(res, 'Failed to update category', 500, 'SERVER_ERROR');
  }
};

// Admin DELETE category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      sendError(res, 'Category not found', 404, 'CATEGORY_NOT_FOUND');
      return;
    }

    sendSuccess(res, 'Category deleted successfully', category);
  } catch (error: any) {
    sendError(res, 'Failed to delete category', 500, 'SERVER_ERROR');
  }
};
