import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { sendSuccess, sendError } from '../utils/response';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', 401, 'UNAUTHORIZED');
      return;
    }
    const userObj = req.user.toObject();
    delete (userObj as any).passwordHash;
    sendSuccess(res, 'User profile fetched successfully', userObj, 200);
  } catch (error: any) {
    sendError(res, 'Failed to fetch user profile', 500, 'SERVER_ERROR');
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', 401, 'UNAUTHORIZED');
      return;
    }

    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      sendError(res, 'User not found', 404, 'USER_NOT_FOUND');
      return;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    const updatedObj = user.toObject();
    delete (updatedObj as any).passwordHash;

    sendSuccess(res, 'User profile updated successfully', updatedObj, 200);
  } catch (error: any) {
    sendError(res, 'Failed to update user profile', 500, 'SERVER_ERROR');
  }
};
