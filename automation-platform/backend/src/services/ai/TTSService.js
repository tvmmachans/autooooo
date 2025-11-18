import axios from 'axios';
import { db } from '../../database/index.js';
import { voiceCache } from '../../database/schema/ai.js';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { sql } from 'drizzle-orm';
export class TTSService {
    baseUrl = process.env.TTS_API_URL || 'http://localhost:8000';
    storagePath = process.env.TTS_STORAGE_PATH || './storage/audio';
    constructor() {
        // Ensure storage directory exists
        this.ensureStorageDirectory();
    }
    async generateSpeech(request, userId) {
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
        }
        catch (error) {
            throw new Error(`TTS generation failed: ${error.message}`);
        }
    }
    async callTTSService(request) {
        // Using XTTS v2 API (example implementation)
        // You can replace this with actual XTTS v2 API call
        try {
            const response = await axios.post(`${this.baseUrl}/tts/generate`, {
                text: request.text,
                language: request.language,
                voice: request.voice || this.getDefaultVoice(request.language),
                speed: request.speed || 1.0,
                format: request.format || 'mp3',
            }, {
                responseType: 'arraybuffer',
                timeout: 60000,
            });
            return Buffer.from(response.data);
        }
        catch (error) {
            // Fallback: Use browser TTS API or alternative service
            throw new Error(`TTS API error: ${error.message}`);
        }
    }
    getDefaultVoice(language) {
        const voiceMap = {
            malayalam: 'ml-IN-Standard-A',
            english: 'en-US-Standard-D',
            tamil: 'ta-IN-Standard-A',
            hindi: 'hi-IN-Standard-A',
            telugu: 'te-IN-Standard-A',
            kannada: 'kn-IN-Standard-A',
        };
        return voiceMap[language.toLowerCase()] || 'en-US-Standard-D';
    }
    getCacheKey(request) {
        const keyString = `${request.text}-${request.language}-${request.voice || 'default'}-${request.speed || 1.0}`;
        return crypto.createHash('md5').update(keyString).digest('hex');
    }
    async getCachedAudio(cacheKey, userId) {
        try {
            const conditions = [];
            if (userId) {
                conditions.push({ userId });
            }
            // Search by text hash (simplified - in production, use proper hash index)
            const cached = await db.select()
                .from(voiceCache)
                .where(sql `true`)
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
                }
                catch {
                    // File doesn't exist, remove cache entry
                    await db.delete(voiceCache).where(sql `${voiceCache.id} = ${entry.id}`);
                }
            }
            return null;
        }
        catch (error) {
            console.error('Cache lookup error:', error);
            return null;
        }
    }
    async cacheAudio(data) {
        try {
            await db.insert(voiceCache).values({
                userId: data.userId || null,
                text: data.text,
                language: data.language,
                voice: data.voice,
                audioUrl: data.audioUrl,
                audioPath: data.audioPath,
                format: data.format,
                fileSize: data.fileSize,
            });
        }
        catch (error) {
            console.error('Failed to cache audio:', error);
        }
    }
    async ensureStorageDirectory() {
        try {
            await fs.mkdir(this.storagePath, { recursive: true });
        }
        catch (error) {
            console.error('Failed to create storage directory:', error);
        }
    }
}
//# sourceMappingURL=TTSService.js.map