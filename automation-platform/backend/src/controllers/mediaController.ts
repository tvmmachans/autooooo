import { Request, Response } from 'express';
import { MediaService } from '../services/MediaService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AppError } from '../utils/AppError.js';

const mediaService = new MediaService();

export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  const userId = (req as any).user?.id;

  if (!file) {
    throw AppError.badRequest('No file uploaded');
  }

  if (!userId) {
    throw AppError.unauthorized('User authentication required');
  }

  const result = await mediaService.uploadFile(file, userId, req.body.metadata ? JSON.parse(req.body.metadata) : undefined);

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const getMedia = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw AppError.unauthorized('User authentication required');
  }

  const media = await mediaService.getMediaById(Number(id), userId);

  if (!media) {
    throw AppError.notFound('Media file not found');
  }

  res.json({
    success: true,
    data: media,
  });
});

export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw AppError.unauthorized('User authentication required');
  }

  const deleted = await mediaService.deleteMedia(Number(id), userId);

  if (!deleted) {
    throw AppError.notFound('Media file not found');
  }

  res.json({
    success: true,
    message: 'Media file deleted successfully',
  });
});

