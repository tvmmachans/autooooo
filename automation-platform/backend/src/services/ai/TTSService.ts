import axios from 'axios';
import { db } from '../../database/index.js';
import { voiceCache } from '../../database/schema/ai.js';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export interface TTSRequest {
  text: string;
  language: string;
  voice?: string;
  speed?: number;
  format?: 'mp3' | 'wav';
}

export interface TTSResponse {
  audioUrl: string;
  audioPath?: string;
  duration?: number;
  fileSize?: number;
  cached: boolean;
}

export class TTSService {
  private baseUrl: string = process.env.TTS_API_URL || 'http://localhost:8000';
  private storagePath: string = process.env.TTS_STORAGE_PATH || './storage/audio';

  constructor() {
    // Ensure storage directory exists
    this.ensureStorageDirectory();
  }

  async generateSpeech(
    request: TTSRequest,
    userId?: number
  ): Promise<TTSResponse> {
    // Check cache first
    const cacheKey = this.getCacheKey(request);
    const cached = await this.getCachedAudio(cacheKey, userId);
    if (cached) {
      return {
        audioUrl: cached.audioUrl,
        audioPath: cached.audioPath || undefined,
        duration: cached.duration || undefined,
        fileSize: cached.fileSize || undefined,
        cached: true,
      };
    }

    // Generate new audio
    try {
      const audioData = await this.callTTSService(request);
      
      // Save to storage
      const filename = `${cacheKey}.${request.format || 'mp3'}`;
      const filePath = path.join(this.storagePath, filename);
      await fs.writeFile(filePath, audioData);

      // Get file stats
      const stats = await fs.stat(filePath);
      const fileSize = stats.size;

      // Generate URL
      const audioUrl = `/api/media/audio/${filename}`;

      // Cache the result
      await this.cacheAudio({
        userId,
        text: request.text,
        language: request.language,
        voice: request.voice || 'default',
        audioUrl,
        audioPath: filePath,
        format: request.format || 'mp3',
        fileSize,
      });

      return {
        audioUrl,
        audioPath: filePath,
        fileSize,
        cached: false,
      };
    } catch (error: any) {
      throw new Error(`TTS generation failed: ${error.message}`);
    }
  }

  private async callTTSService(request: TTSRequest): Promise<Buffer> {
    // Using XTTS v2 API (example implementation)
    // You can replace this with actual XTTS v2 API call
    try {
      const response = await axios.post(
        `${this.baseUrl}/tts/generate`,
        {
          text: request.text,
          language: request.language,
          voice: request.voice || this.getDefaultVoice(request.language),
          speed: request.speed || 1.0,
          format: request.format || 'mp3',
        },
        {
          responseType: 'arraybuffer',
          timeout: 60000,
        }
      );

      return Buffer.from(response.data);
    } catch (error: any) {
      // Fallback: Use browser TTS API or alternative service
      throw new Error(`TTS API error: ${error.message}`);
    }
  }

  private getDefaultVoice(language: string): string {
    const voiceMap: Record<string, string> = {
      malayalam: 'ml-IN-Standard-A',
      english: 'en-US-Standard-D',
      tamil: 'ta-IN-Standard-A',
      hindi: 'hi-IN-Standard-A',
      telugu: 'te-IN-Standard-A',
      kannada: 'kn-IN-Standard-A',
    };

    return voiceMap[language.toLowerCase()] || 'en-US-Standard-D';
  }

  private getCacheKey(request: TTSRequest): string {
    const keyString = `${request.text}-${request.language}-${request.voice || 'default'}-${request.speed || 1.0}`;
    return crypto.createHash('md5').update(keyString).digest('hex');
  }

  private async getCachedAudio(
    cacheKey: string,
    userId?: number
  ): Promise<{ audioUrl: string; audioPath?: string; duration?: number; fileSize?: number } | null> {
    try {
      const conditions: any[] = [];
      if (userId) {
        conditions.push({ userId });
      }

      // Search by text hash (simplified - in production, use proper hash index)
      const cached = await db.select()
        .from(voiceCache)
        .where(
          // This is simplified - you'd want to use a proper hash index
          // For now, we'll check if file exists
        )
        .limit(1);

      if (cached.length > 0) {
        const entry = cached[0];
        // Check if file still exists
        try {
          if (entry.audioPath) {
            await fs.access(entry.audioPath);
            return {
              audioUrl: entry.audioUrl,
              audioPath: entry.audioPath,
              duration: entry.duration || undefined,
              fileSize: entry.fileSize || undefined,
            };
          }
        } catch {
          // File doesn't exist, remove cache entry
          await db.delete(voiceCache).where({ id: entry.id });
        }
      }

      return null;
    } catch (error) {
      console.error('Cache lookup error:', error);
      return null;
    }
  }

  private async cacheAudio(data: {
    userId?: number;
    text: string;
    language: string;
    voice: string;
    audioUrl: string;
    audioPath: string;
    format: string;
    fileSize: number;
  }) {
    try {
      await db.insert(voiceCache).values({
        userId: data.userId || null,
        text: data.text,
        language: data.language,
        voice: data.voice,
        audioUrl: data.audioUrl,
        audioPath: data.audioPath,
        format: data.format as any,
        fileSize: data.fileSize,
      });
    } catch (error) {
      console.error('Failed to cache audio:', error);
    }
  }

  private async ensureStorageDirectory() {
    try {
      await fs.mkdir(this.storagePath, { recursive: true });
    } catch (error) {
      console.error('Failed to create storage directory:', error);
    }
  }
}

