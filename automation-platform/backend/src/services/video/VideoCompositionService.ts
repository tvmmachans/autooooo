import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { db } from '../../database/index.js';
import { videos, videoAssets } from '../../database/schema/video.js';

const execAsync = promisify(exec);

export interface VideoCompositionConfig {
  script: string;
  audioUrl: string;
  assets: Array<{
    url: string;
    type: 'image' | 'video';
    startTime: number;
    duration: number;
    position?: { x: number; y: number };
    scale?: number;
  }>;
  aspectRatio: '9:16' | '16:9' | '1:1';
  resolution: { width: number; height: number };
  subtitles?: Array<{
    text: string;
    startTime: number;
    duration: number;
  }>;
  backgroundMusic?: {
    url: string;
    volume: number; // 0-1
  };
}

export interface VideoCompositionResult {
  videoUrl: string;
  videoPath: string;
  duration: number;
  fileSize: number;
  thumbnailUrl?: string;
}

export class VideoCompositionService {
  private storagePath: string;
  private publicUrl: string;
  private ffmpegPath: string;

  constructor() {
    this.storagePath = process.env.VIDEO_STORAGE_PATH || './storage/videos';
    this.publicUrl = process.env.VIDEO_PUBLIC_URL || '/api/videos';
    this.ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
    this.ensureStorageDirectory();
  }

  async composeVideo(
    config: VideoCompositionConfig,
    userId: number,
    title: string
  ): Promise<VideoCompositionResult> {
    const videoId = `video_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const outputPath = path.join(this.storagePath, `${videoId}.mp4`);
    const tempDir = path.join(this.storagePath, 'temp', videoId);

    try {
      await fs.mkdir(tempDir, { recursive: true });

      // Download assets to temp directory
      const assetPaths = await this.downloadAssets(config.assets, tempDir);

      // Download audio
      const audioPath = await this.downloadFile(config.audioUrl, path.join(tempDir, 'audio.mp3'));

      // Generate subtitles file if provided
      let subtitlesPath: string | undefined;
      if (config.subtitles && config.subtitles.length > 0) {
        subtitlesPath = await this.generateSubtitlesFile(config.subtitles, tempDir);
      }

      // Download background music if provided
      let bgMusicPath: string | undefined;
      if (config.backgroundMusic) {
        bgMusicPath = await this.downloadFile(config.backgroundMusic.url, path.join(tempDir, 'bg_music.mp3'));
      }

      // Build FFmpeg command
      const ffmpegCommand = this.buildFFmpegCommand({
        ...config,
        assetPaths,
        audioPath,
        subtitlesPath,
        bgMusicPath,
        outputPath,
        tempDir,
      });

      // Execute FFmpeg
      await execAsync(ffmpegCommand);

      // Generate thumbnail
      const thumbnailPath = await this.generateThumbnail(outputPath, tempDir);

      // Get video metadata
      const metadata = await this.getVideoMetadata(outputPath);

      // Clean up temp directory
      await fs.rm(tempDir, { recursive: true, force: true });

      const videoUrl = `${this.publicUrl}/${path.basename(outputPath)}`;
      const thumbnailUrl = thumbnailPath ? `${this.publicUrl}/thumbnails/${path.basename(thumbnailPath)}` : undefined;

      // Save to database
      const [video] = await db.insert(videos).values({
        userId,
        title,
        script: config.script,
        videoUrl,
        videoPath: outputPath,
        thumbnailUrl,
        duration: metadata.duration,
        fileSize: metadata.fileSize,
        format: 'mp4',
        aspectRatio: config.aspectRatio,
        resolution: config.resolution,
        status: 'completed',
      }).returning();

      if (!video) {
        throw new Error('Failed to persist composed video');
      }

      // Save video assets
      if (config.assets.length > 0) {
        await db.insert(videoAssets).values(
          config.assets.map((asset) => ({
            videoId: video.id,
            assetType: asset.type,
            source: 'local',
            url: asset.url,
            startTime: asset.startTime,
            duration: asset.duration,
            position: asset.position,
            scale: asset.scale ?? 1.0,
          }))
        );
      }

      return {
        videoUrl,
        videoPath: outputPath,
        duration: metadata.duration,
        fileSize: metadata.fileSize,
        ...(thumbnailUrl ? { thumbnailUrl } : {}),
      };
    } catch (error: any) {
      // Clean up on error
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
      throw new Error(`Video composition failed: ${error.message}`);
    }
  }

  private async downloadAssets(
    assets: VideoCompositionConfig['assets'],
    tempDir: string
  ): Promise<Array<{ path: string; type: string; startTime: number; duration: number }>> {
    const assetPaths: Array<{ path: string; type: string; startTime: number; duration: number }> = [];

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      if (!asset) {
        continue;
      }
      const ext = asset.type === 'image' ? 'jpg' : 'mp4';
      const assetPath = path.join(tempDir, `asset_${i}.${ext}`);
      await this.downloadFile(asset.url, assetPath);
      assetPaths.push({
        path: assetPath,
        type: asset.type,
        startTime: asset.startTime,
        duration: asset.duration,
      });
    }

    return assetPaths;
  }

  private async downloadFile(url: string, destPath: string): Promise<string> {
    // In production, use axios or similar to download files
    // For now, if it's a local file, just copy it
    if (url.startsWith('/') || url.startsWith('./')) {
      await fs.copyFile(url, destPath);
    } else {
      // Download from URL
      const axios = (await import('axios')).default;
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      await fs.writeFile(destPath, Buffer.from(response.data));
    }
    return destPath;
  }

  private async generateSubtitlesFile(
    subtitles: VideoCompositionConfig['subtitles'],
    tempDir: string
  ): Promise<string> {
    const subtitlesPath = path.join(tempDir, 'subtitles.srt');
    let srtContent = '';

    subtitles!.forEach((subtitle, index) => {
      const start = this.formatSRTTime(subtitle.startTime);
      const end = this.formatSRTTime(subtitle.startTime + subtitle.duration);
      srtContent += `${index + 1}\n${start} --> ${end}\n${subtitle.text}\n\n`;
    });

    await fs.writeFile(subtitlesPath, srtContent);
    return subtitlesPath;
  }

  private formatSRTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds % 1) * 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${millis.toString().padStart(3, '0')}`;
  }

  private buildFFmpegCommand(params: {
    assetPaths: Array<{ path: string; type: string; startTime: number; duration: number }>;
    audioPath: string;
    subtitlesPath?: string;
    bgMusicPath?: string;
    outputPath: string;
    tempDir: string;
    resolution: { width: number; height: number };
    aspectRatio: string;
  }): string {
    // This is a simplified FFmpeg command
    // In production, you'd build a more complex filter graph
    let command = `${this.ffmpegPath} -y `;

    // Input assets
    for (const asset of params.assetPaths) {
      if (asset.type === 'image') {
        command += `-loop 1 -t ${asset.duration} -i "${asset.path}" `;
      } else {
        command += `-i "${asset.path}" `;
      }
    }

    // Audio input
    command += `-i "${params.audioPath}" `;

    // Background music
    if (params.bgMusicPath) {
      command += `-i "${params.bgMusicPath}" `;
    }

    // Video filter (concatenate, scale, etc.)
    command += `-filter_complex "[0:v]scale=${params.resolution.width}:${params.resolution.height}[v0]" `;

    // Audio mixing
    if (params.bgMusicPath) {
      command += `-filter_complex "[1:a]volume=1.0[a1];[2:a]volume=0.3[a2];[a1][a2]amix=inputs=2:duration=first[aout]" `;
      command += `-map "[v0]" -map "[aout]" `;
    } else {
      command += `-map "[v0]" -map 1:a `;
    }

    // Subtitles
    if (params.subtitlesPath) {
      command += `-vf "subtitles='${params.subtitlesPath}'" `;
    }

    // Output settings
    command += `-c:v libx264 -preset medium -crf 23 -c:a aac -b:a 192k `;
    command += `-pix_fmt yuv420p -r 30 -shortest "${params.outputPath}"`;

    return command;
  }

  private async generateThumbnail(videoPath: string, tempDir: string): Promise<string | undefined> {
    try {
      const thumbnailPath = path.join(this.storagePath, 'thumbnails', `${path.basename(videoPath, '.mp4')}.jpg`);
      await fs.mkdir(path.dirname(thumbnailPath), { recursive: true });

      // Extract frame at 1 second
      await execAsync(
        `${this.ffmpegPath} -i "${videoPath}" -ss 00:00:01 -vframes 1 "${thumbnailPath}"`
      );

      return thumbnailPath;
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
      return undefined;
    }
  }

  private async getVideoMetadata(videoPath: string): Promise<{ duration: number; fileSize: number }> {
    const stats = await fs.stat(videoPath);
    const fileSize = stats.size;

    // Get duration using FFprobe
    try {
      const { stdout } = await execAsync(
        `${this.ffmpegPath.replace('ffmpeg', 'ffprobe')} -i "${videoPath}" -show_entries format=duration -v quiet -of csv="p=0"`
      );
      const duration = Math.floor(parseFloat(stdout.trim()));
      return { duration, fileSize };
    } catch (error) {
      // Fallback: estimate duration from file size
      return { duration: 60, fileSize };
    }
  }

  private async ensureStorageDirectory() {
    try {
      await fs.mkdir(this.storagePath, { recursive: true });
      await fs.mkdir(path.join(this.storagePath, 'thumbnails'), { recursive: true });
    } catch (error) {
      console.error('Failed to create storage directory:', error);
    }
  }
}

