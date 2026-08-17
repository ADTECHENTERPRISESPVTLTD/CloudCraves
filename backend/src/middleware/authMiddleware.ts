import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/generateToken';
import { User, IUser } from '../models/User';
import { sendError } from '../utils/response';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Authentication required. No token provided.', 401, 'UNAUTHORIZED');
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (decoded.type !== 'user') {
      sendError(res, 'Invalid token type for customer access.', 403, 'FORBIDDEN');
      return;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      sendError(res, 'User associated with token no longer exists.', 401, 'USER_NOT_FOUND');
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token.', 401, 'INVALID_TOKEN');
  }
};
