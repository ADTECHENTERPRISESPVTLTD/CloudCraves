import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password) {
      sendError(res, 'Please provide name, phone, email, and password', 400, 'MISSING_FIELDS');
      return;
    }

    const result = await AuthService.registerUser({ name, phone, email, password });
    sendSuccess(res, 'User registered successfully', result, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Registration failed', error.statusCode || 500, error.code);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, 'Please provide email and password', 400, 'MISSING_FIELDS');
      return;
    }

    const result = await AuthService.loginUser(email, password);
    sendSuccess(res, 'Login successful', result, 200);
  } catch (error: any) {
    sendError(res, error.message || 'Login failed', error.statusCode || 500, error.code);
  }
};
