import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';
import { validateRegistrationInput, validateLoginInput } from '../validators/authValidator';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = validateRegistrationInput(req.body);
    if (!validation.isValid) {
      sendError(res, validation.message || 'Invalid registration input', 400, 'VALIDATION_ERROR');
      return;
    }

    const { name, phone, email, password } = req.body;
    const result = await AuthService.registerUser({ name, phone, email, password });
    sendSuccess(res, 'User registered successfully', result, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Registration failed', error.statusCode || 500, error.code);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = validateLoginInput(req.body);
    if (!validation.isValid) {
      sendError(res, validation.message || 'Invalid login input', 400, 'VALIDATION_ERROR');
      return;
    }

    const { email, password } = req.body;
    const result = await AuthService.loginUser(email, password);
    sendSuccess(res, 'Login successful', result, 200);
  } catch (error: any) {
    sendError(res, error.message || 'Login failed', error.statusCode || 500, error.code);
  }
};
