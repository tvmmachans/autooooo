import { Request, Response } from 'express';
import { ApiKeyService } from '../services/ApiKeyService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AppError } from '../utils/AppError.js';
import { z } from 'zod';

const apiKeyService = new ApiKeyService();

const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z.array(z.string()).default([]),
  rateLimit: z.number().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const createApiKey = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    throw AppError.unauthorized('User authentication required');
  }

  const body = createApiKeySchema.parse(req.body);
  const result = await apiKeyService.createApiKey(
    userId,
    body.name,
    body.scopes,
    body.rateLimit,
    body.expiresAt ? new Date(body.expiresAt) : undefined
  );

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const getApiKeys = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    throw AppError.unauthorized('User authentication required');
  }

  const keys = await apiKeyService.getApiKeysByUserId(userId);

  res.json({
    success: true,
    data: keys.map(key => ({
      id: key.id,
      keyPrefix: key.keyPrefix,
      name: key.name,
      scopes: key.scopes,
      rateLimit: key.rateLimit,
      usageCount: key.usageCount,
      lastUsedAt: key.lastUsedAt,
      expiresAt: key.expiresAt,
      isActive: key.isActive,
      createdAt: key.createdAt,
    })),
  });
});

export const revokeApiKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;
  if (!userId) {
    throw AppError.unauthorized('User authentication required');
  }

  const revoked = await apiKeyService.revokeApiKey(Number(id), userId);

  if (!revoked) {
    throw AppError.notFound('API key not found');
  }

  res.json({
    success: true,
    message: 'API key revoked successfully',
  });
});

