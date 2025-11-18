import type { Request, Response, NextFunction } from 'express';
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

  // Handle Vercel-specific errors (if error message contains Vercel error code)
  const vercelErrorCodes = [
    'BODY_NOT_A_STRING_FROM_FUNCTION', 'EDGE_FUNCTION_INVOCATION_FAILED', 'EDGE_FUNCTION_INVOCATION_TIMEOUT',
    'FUNCTION_INVOCATION_FAILED', 'FUNCTION_INVOCATION_TIMEOUT', 'FUNCTION_PAYLOAD_TOO_LARGE',
    'FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE', 'FUNCTION_THROTTLED', 'MICROFRONTENDS_MIDDLEWARE_ERROR',
    'MICROFRONTENDS_MISSING_FALLBACK_ERROR', 'MIDDLEWARE_INVOCATION_FAILED', 'MIDDLEWARE_INVOCATION_TIMEOUT',
    'NO_RESPONSE_FROM_FUNCTION', 'DEPLOYMENT_BLOCKED', 'DEPLOYMENT_DELETED', 'DEPLOYMENT_DISABLED',
    'DEPLOYMENT_NOT_FOUND', 'DEPLOYMENT_NOT_READY_REDIRECTING', 'DEPLOYMENT_PAUSED', 'NOT_FOUND',
    'DNS_HOSTNAME_EMPTY', 'DNS_HOSTNAME_NOT_FOUND', 'DNS_HOSTNAME_RESOLVE_FAILED', 'DNS_HOSTNAME_RESOLVED_PRIVATE',
    'DNS_HOSTNAME_SERVER_ERROR', 'INVALID_REQUEST_METHOD', 'MALFORMED_REQUEST_HEADER', 'RANGE_END_NOT_VALID',
    'RANGE_GROUP_NOT_VALID', 'RANGE_MISSING_UNIT', 'RANGE_START_NOT_VALID', 'RANGE_UNIT_NOT_SUPPORTED',
    'REQUEST_HEADER_TOO_LARGE', 'RESOURCE_NOT_FOUND', 'TOO_MANY_RANGES', 'URL_TOO_LONG',
    'FALLBACK_BODY_TOO_LARGE', 'INVALID_IMAGE_OPTIMIZE_REQUEST', 'OPTIMIZED_EXTERNAL_IMAGE_REQUEST_FAILED',
    'OPTIMIZED_EXTERNAL_IMAGE_REQUEST_INVALID', 'OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED',
    'OPTIMIZED_EXTERNAL_IMAGE_TOO_MANY_REDIRECTS', 'ROUTER_CANNOT_MATCH', 'ROUTER_EXTERNAL_TARGET_CONNECTION_ERROR',
    'ROUTER_EXTERNAL_TARGET_ERROR', 'ROUTER_EXTERNAL_TARGET_HANDSHAKE_ERROR', 'ROUTER_TOO_MANY_HAS_SELECTIONS',
    'TOO_MANY_FILESYSTEM_CHECKS', 'TOO_MANY_FORKS', 'SANDBOX_NOT_FOUND', 'SANDBOX_NOT_LISTENING',
    'SANDBOX_STOPPED', 'INFINITE_LOOP_DETECTED', 'MIDDLEWARE_RUNTIME_DEPRECATED', 'INTERNAL_CACHE_ERROR',
    'INTERNAL_CACHE_KEY_TOO_LONG', 'INTERNAL_CACHE_LOCK_FULL', 'INTERNAL_CACHE_LOCK_TIMEOUT',
    'INTERNAL_DEPLOYMENT_FETCH_FAILED', 'INTERNAL_EDGE_FUNCTION_INVOCATION_FAILED',
    'INTERNAL_EDGE_FUNCTION_INVOCATION_TIMEOUT', 'INTERNAL_FUNCTION_INVOCATION_FAILED',
    'INTERNAL_FUNCTION_INVOCATION_TIMEOUT', 'INTERNAL_FUNCTION_NOT_FOUND', 'INTERNAL_FUNCTION_NOT_READY',
    'INTERNAL_FUNCTION_SERVICE_UNAVAILABLE', 'INTERNAL_MICROFRONTENDS_BUILD_ERROR',
    'INTERNAL_MICROFRONTENDS_INVALID_CONFIGURATION_ERROR', 'INTERNAL_MICROFRONTENDS_UNEXPECTED_ERROR',
    'INTERNAL_MISSING_RESPONSE_FROM_CACHE', 'INTERNAL_OPTIMIZED_IMAGE_REQUEST_FAILED',
    'INTERNAL_ROUTER_CANNOT_PARSE_PATH', 'INTERNAL_STATIC_REQUEST_FAILED', 'INTERNAL_UNARCHIVE_FAILED',
    'INTERNAL_UNEXPECTED_ERROR'
  ];

  for (const code of vercelErrorCodes) {
    if (err.message.includes(code)) {
      const vercelErr = AppError.vercelError(code, err.message);
      return res.status(vercelErr.statusCode).json({
        success: false,
        error: {
          message: vercelErr.message,
          code: vercelErr.code,
          details: vercelErr.details,
        },
        timestamp: new Date().toISOString(),
        path: req.path,
      } as ErrorResponse);
    }
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

