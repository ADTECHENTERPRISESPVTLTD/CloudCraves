import mongoose from 'mongoose';

export const validateReviewInput = (data: any): { isValid: boolean; message?: string } => {
  const { orderId, foodId, foodRating, serviceRating, comment } = data;

  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    return { isValid: false, message: 'Valid order ID is required' };
  }

  if (!foodId || !mongoose.Types.ObjectId.isValid(foodId)) {
    return { isValid: false, message: 'Valid food ID is required' };
  }

  if (!foodRating || typeof foodRating !== 'number' || foodRating < 1 || foodRating > 5) {
    return { isValid: false, message: 'Food rating must be between 1 and 5' };
  }

  if (!serviceRating || typeof serviceRating !== 'number' || serviceRating < 1 || serviceRating > 5) {
    return { isValid: false, message: 'Service rating must be between 1 and 5' };
  }

  if (!comment || typeof comment !== 'string' || comment.trim() === '') {
    return { isValid: false, message: 'Comment cannot be empty' };
  }

  return { isValid: true };
};
