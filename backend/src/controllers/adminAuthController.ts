import { Response } from 'express';
import { AuthService } from '../services/authService';
import { AdminAuthRequest } from '../middleware/adminMiddleware';
import { sendSuccess, sendError } from '../utils/response';

export const adminLogin = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, 'Please provide admin email and password', 400, 'MISSING_FIELDS');
      return;
    }

    const result = await AuthService.loginAdmin(email, password);
    sendSuccess(res, 'Admin login successful', result, 200);
  } catch (error: any) {
    sendError(res, error.message || 'Admin login failed', error.statusCode || 500, error.code);
  }
};

export const getAdminProfile = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      sendError(res, 'Admin not authenticated', 401, 'UNAUTHORIZED');
      return;
    }
    const adminObj = req.admin.toObject();
    delete (adminObj as any).passwordHash;
    sendSuccess(res, 'Admin profile fetched successfully', adminObj, 200);
  } catch (error: any) {
    sendError(res, 'Failed to fetch admin profile', 500, 'SERVER_ERROR');
  }
};
