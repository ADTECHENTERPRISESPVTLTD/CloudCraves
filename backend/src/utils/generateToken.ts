import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface TokenPayload {
  id: string;
  type: 'user' | 'admin';
  role?: string;
}

export const generateUserToken = (userId: string): string => {
  return jwt.sign(
    { id: userId, type: 'user' },
    config.jwtSecret,
    { expiresIn: '30d' }
  );
};

export const generateAdminToken = (adminId: string, role: string): string => {
  return jwt.sign(
    { id: adminId, type: 'admin', role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
};
