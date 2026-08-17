import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AdminAuthRequest } from '../middleware/adminMiddleware';
import { ReviewService } from '../services/reviewService';
import { sendSuccess, sendError } from '../utils/response';

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User authentication required', 401, 'UNAUTHORIZED');
      return;
    }

    const { orderId, foodId, foodRating, serviceRating, comment } = req.body;

    const review = await ReviewService.createReview({
      userId: req.user._id.toString(),
      orderId,
      foodId,
      foodRating,
      serviceRating,
      comment
    });

    sendSuccess(res, 'Review created successfully', review, 201);
  } catch (error: any) {
    sendError(
      res,
      error.message || 'Failed to submit review',
      error.statusCode || 400,
      error.code || 'REVIEW_ERROR'
    );
  }
};

export const getUserReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User authentication required', 401, 'UNAUTHORIZED');
      return;
    }

    const reviews = await ReviewService.getUserReviews(req.user._id.toString());
    sendSuccess(res, 'User reviews fetched successfully', reviews, 200);
  } catch (error: any) {
    sendError(res, 'Failed to fetch user reviews', 500, 'SERVER_ERROR');
  }
};

export const getAdminReviews = async (_req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const reviews = await ReviewService.getAllAdminReviews();
    sendSuccess(res, 'Admin reviews fetched successfully', reviews, 200);
  } catch (error: any) {
    sendError(res, 'Failed to fetch admin reviews', 500, 'SERVER_ERROR');
  }
};
