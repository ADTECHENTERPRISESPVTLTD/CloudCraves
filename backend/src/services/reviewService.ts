import mongoose from 'mongoose';
import { Review, IReview } from '../models/Review';
import { Order } from '../models/Order';
import { Food } from '../models/Food';

export interface CreateReviewPayload {
  userId: string;
  orderId: string;
  foodId: string;
  foodRating: number;
  serviceRating: number;
  comment: string;
}

export class ReviewService {
  static async createReview(payload: CreateReviewPayload): Promise<IReview> {
    const { userId, orderId, foodId, foodRating, serviceRating, comment } = payload;

    // 1. Validate ObjectId Formats
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw { statusCode: 400, message: 'Invalid order ID format', code: 'INVALID_ID' };
    }
    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      throw { statusCode: 400, message: 'Invalid food ID format', code: 'INVALID_ID' };
    }

    // 2. Validate Rating Ranges (1 to 5)
    if (!foodRating || typeof foodRating !== 'number' || foodRating < 1 || foodRating > 5) {
      throw { statusCode: 400, message: 'Food rating must be a number between 1 and 5', code: 'INVALID_RATING' };
    }
    if (!serviceRating || typeof serviceRating !== 'number' || serviceRating < 1 || serviceRating > 5) {
      throw { statusCode: 400, message: 'Service rating must be a number between 1 and 5', code: 'INVALID_RATING' };
    }
    if (!comment || comment.trim() === '') {
      throw { statusCode: 400, message: 'Review comment cannot be empty', code: 'MISSING_COMMENT' };
    }

    // 3. Find Order & Validate Ownership
    const order = await Order.findById(orderId);
    if (!order) {
      throw { statusCode: 404, message: 'Order not found', code: 'ORDER_NOT_FOUND' };
    }

    if (order.userId.toString() !== userId) {
      throw {
        statusCode: 403,
        message: 'You are not authorized to submit a review for this order',
        code: 'UNAUTHORIZED_ORDER_ACCESS'
      };
    }

    // 4. Verify Order Delivery Status
    if (order.orderStatus !== 'DELIVERED') {
      throw {
        statusCode: 400,
        message: `Reviews can only be submitted for completed orders. Current status: ${order.orderStatus}`,
        code: 'ORDER_NOT_DELIVERED'
      };
    }

    // 5. Verify Food Item Was Part of the Order
    const foodInOrder = order.items.some(
      (item) => item.foodId.toString() === foodId.toString()
    );
    if (!foodInOrder) {
      throw {
        statusCode: 400,
        message: 'The specified food item was not part of this order',
        code: 'FOOD_NOT_IN_ORDER'
      };
    }

    // 6. Duplicate Review Protection
    const existingReview = await Review.findOne({ userId, orderId, foodId });
    if (existingReview) {
      throw {
        statusCode: 409,
        message: 'You have already submitted a review for this food item in this order',
        code: 'REVIEW_ALREADY_EXISTS'
      };
    }

    // 7. Create Review
    const review = await Review.create({
      userId,
      orderId,
      foodId,
      foodRating,
      serviceRating,
      comment: comment.trim()
    });

    // 8. Update Average Food Rating
    const allFoodReviews = await Review.find({ foodId });
    if (allFoodReviews.length > 0) {
      const avgRating =
        allFoodReviews.reduce((sum, r) => sum + r.foodRating, 0) / allFoodReviews.length;
      await Food.findByIdAndUpdate(foodId, { rating: Math.round(avgRating * 10) / 10 });
    }

    return review;
  }

  static async getUserReviews(userId: string): Promise<IReview[]> {
    return await Review.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate('foodId', 'name image price')
      .populate('orderId', 'orderId createdAt')
      .sort({ createdAt: -1 });
  }

  static async getAllAdminReviews(): Promise<IReview[]> {
    return await Review.find()
      .populate('userId', 'name email phone')
      .populate('foodId', 'name image price')
      .populate('orderId', 'orderId createdAt')
      .sort({ createdAt: -1 });
  }
}
