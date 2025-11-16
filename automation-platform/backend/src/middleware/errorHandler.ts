import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/AppError.js';

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
  timestamp: string;
  path: string;
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Handle AppError (known errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        details: err.details,
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    } as ErrorResponse);
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: err.message,
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    } as ErrorResponse);
  }

  // Handle database errors
  if (err.name === 'DatabaseError' || err.message.includes('database')) {
    return res.status(500).json({
      success: false,
      error: {
        message: 'Database error occurred',
        code: 'DATABASE_ERROR',
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    } as ErrorResponse);
  }

  // Default error response
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV !== 'production' && { details: err.stack }),
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  } as ErrorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

