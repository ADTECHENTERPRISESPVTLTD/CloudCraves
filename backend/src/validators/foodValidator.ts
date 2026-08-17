import mongoose from 'mongoose';

export const validateFoodInput = (data: any): { isValid: boolean; message?: string } => {
  const { name, categoryId, price } = data;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return { isValid: false, message: 'Food item name is required' };
  }

  if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
    return { isValid: false, message: 'Valid category ID is required' };
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    return { isValid: false, message: 'Food price must be a non-negative number' };
  }

  return { isValid: true };
};
