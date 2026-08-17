import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

// Centralized 404 Route Not Found Handler
export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Route not found - ${req.originalUrl}`, 404, 'NOT_FOUND');
};

// Centralized Global Error Handler Middleware
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Unhandled Server Error:', err);

  // Mongoose Invalid ObjectId Cast Error
  if (err.name === 'CastError') {
    sendError(res, `Invalid ID format for field '${err.path}'`, 400, 'INVALID_ID');
    return;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    sendError(res, `Validation error: ${messages.join(', ')}`, 400, 'VALIDATION_ERROR');
    return;
  }

  // MongoDB Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    sendError(res, `Duplicate value for ${field}. Resource already exists.`, 409, 'DUPLICATE_RESOURCE');
    return;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid authentication token signature', 401, 'INVALID_TOKEN');
    return;
  }
  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Authentication token has expired', 401, 'TOKEN_EXPIRED');
    return;
  }

  // Known Custom Errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const errorCode = err.code || 'SERVER_ERROR';

  sendError(res, message, statusCode, errorCode);
};
