import type { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from '../services/ApiKeyService.js';
import { AppError } from '../utils/AppError.js';

const apiKeyService = new ApiKeyService();

export interface AuthenticatedRequest extends Request {
  apiKey?: any;
  user?: any;
}

export const apiKeyAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get API key from header
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw AppError.unauthorized('API key is required');
    }

    // Validate API key
    const validation = await apiKeyService.validateApiKey(apiKey);

    if (!validation.valid) {
      throw AppError.unauthorized(validation.error || 'Invalid API key');
    }

    // Attach API key info to request
    req.apiKey = validation.apiKey;
    req.user = { id: validation.apiKey.userId };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw AppError.unauthorized('API authentication failed');
  }
};

// Check if API key has required scope
export const requireScope = (scope: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.apiKey) {
      throw AppError.unauthorized('API key required');
    }

    const scopes = req.apiKey.scopes as string[];
    if (!scopes.includes(scope) && !scopes.includes('*')) {
      throw AppError.forbidden(`Required scope: ${scope}`);
    }

    next();
  };
};

