import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/generateToken';
import { Admin, IAdmin } from '../models/Admin';
import { sendError } from '../utils/response';

export interface AdminAuthRequest extends Request {
  admin?: IAdmin;
}

export const authenticateAdmin = async (
  req: AdminAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Admin authentication required. No token provided.', 401, 'UNAUTHORIZED');
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (decoded.type !== 'admin') {
      sendError(res, 'Access denied. Admin token required.', 403, 'FORBIDDEN');
      return;
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      sendError(res, 'Admin account not found.', 401, 'ADMIN_NOT_FOUND');
      return;
    }

    if (!admin.isActive) {
      sendError(res, 'Admin account is deactivated.', 403, 'ACCOUNT_DEACTIVATED');
      return;
    }

    req.admin = admin;
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired admin token.', 401, 'INVALID_TOKEN');
  }
};
