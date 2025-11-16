import { db } from '../database/index.js';
import { mediaFiles, NewMediaFile } from '../database/schema/media.js';
import { eq, and } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export interface MediaUploadResult {
  id: number;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
}

export class MediaService {
  private storagePath: string;
  private publicUrl: string;

  constructor() {
    this.storagePath = process.env.MEDIA_STORAGE_PATH || './storage/media';
    this.publicUrl = process.env.MEDIA_PUBLIC_URL || '/api/media';
    this.ensureStorageDirectory();
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: number,
    metadata?: Record<string, any>
  ): Promise<MediaUploadResult> {
    const filename = this.generateFilename(file.originalname);
    const filePath = path.join(this.storagePath, filename);
    const url = `${this.publicUrl}/${filename}`;

    // Save file
    await fs.writeFile(filePath, file.buffer);

    // Process media based on type
    let width: number | undefined;
    let height: number | undefined;
    let thumbnailUrl: string | undefined;
    let duration: number | undefined;

    if (file.mimetype.startsWith('image/')) {
      const imageInfo = await this.processImage(filePath, filename);
      width = imageInfo.width;
      height = imageInfo.height;
      thumbnailUrl = imageInfo.thumbnailUrl;
    } else if (file.mimetype.startsWith('video/')) {
      // Video processing would require ffmpeg
      // For now, we'll just store the file
    }

    // Create database record
    const [mediaFile] = await db.insert(mediaFiles).values({
      userId,
      filename,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      storagePath: filePath,
      storageType: 'local',
      url,
      thumbnailUrl,
      width,
      height,
      duration,
      metadata: metadata || {},
    }).returning();

    return {
      id: mediaFile.id,
      url: mediaFile.url,
      thumbnailUrl: mediaFile.thumbnailUrl || undefined,
      filename: mediaFile.filename,
      mimeType: mediaFile.mimeType,
      fileSize: mediaFile.fileSize,
      width: mediaFile.width || undefined,
      height: mediaFile.height || undefined,
      duration: mediaFile.duration || undefined,
    };
  }

  async getMediaById(id: number, userId: number): Promise<MediaUploadResult | null> {
    const [media] = await db.select()
      .from(mediaFiles)
      .where(and(eq(mediaFiles.id, id), eq(mediaFiles.userId, userId)))
      .limit(1);

    if (!media) return null;

    return {
      id: media.id,
      url: media.url,
      thumbnailUrl: media.thumbnailUrl || undefined,
      filename: media.filename,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      width: media.width || undefined,
      height: media.height || undefined,
      duration: media.duration || undefined,
    };
  }

  async deleteMedia(id: number, userId: number): Promise<boolean> {
    const media = await this.getMediaById(id, userId);
    if (!media) return false;

    // Delete file from storage
    try {
      const filePath = path.join(this.storagePath, media.filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }

    // Delete database record
    await db.delete(mediaFiles)
      .where(and(eq(mediaFiles.id, id), eq(mediaFiles.userId, userId)));

    return true;
  }

  private async processImage(filePath: string, filename: string): Promise<{
    width: number;
    height: number;
    thumbnailUrl: string;
  }> {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    // Generate thumbnail
    const thumbnailFilename = `thumb_${filename}`;
    const thumbnailPath = path.join(this.storagePath, thumbnailFilename);
    await image.resize(300, 300, { fit: 'inside' }).toFile(thumbnailPath);

    const thumbnailUrl = `${this.publicUrl}/${thumbnailFilename}`;

    return { width, height, thumbnailUrl };
  }

  private generateFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${name}_${timestamp}_${random}${ext}`;
  }

  private async ensureStorageDirectory() {
    try {
      await fs.mkdir(this.storagePath, { recursive: true });
    } catch (error) {
      console.error('Failed to create storage directory:', error);
    }
  }
}

