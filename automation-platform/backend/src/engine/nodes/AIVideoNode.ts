import type { WorkflowExecutionContext } from '../../database/schema.js';
import { VideoCompositionService } from '../../services/video/VideoCompositionService.js';
import { StockMediaService } from '../../services/video/StockMediaService.js';
import { SubtitleService } from '../../services/video/SubtitleService.js';
import { AIContentService } from '../../services/ai/AIContentService.js';
import { TTSService } from '../../services/ai/TTSService.js';

export class AIVideoNode {
  private videoService: VideoCompositionService;
  private stockMediaService: StockMediaService;
  private subtitleService: SubtitleService;
  private aiService: AIContentService;
  private ttsService: TTSService;

  constructor() {
    this.videoService = new VideoCompositionService();
    this.stockMediaService = new StockMediaService();
    this.subtitleService = new SubtitleService();
    this.aiService = new AIContentService();
    this.ttsService = new TTSService();
  }

  async execute(
    context: WorkflowExecutionContext,
    input: Record<string, any>
  ): Promise<{ success: boolean; output?: Record<string, any>; error?: string }> {
    try {
      const nodeData = context.nodeStates.get('nodeData') || input.nodeData || {};
      const config = nodeData.data?.video_config || input.video_config || {};

      // Get script from input or generate
      let script = input.script || input.content || config.script || '';
      if (!script && config.generateScript) {
        const scriptResult = await this.aiService.generateContent(
          {
            prompt: config.prompt || 'Create a video script',
            language: config.language || 'english',
            generationType: 'reel_script',
            tone: config.tone,
            platform: config.platform,
          },
          context.userId
        );
        script = scriptResult.text;
      }

      if (!script) {
        return {
          success: false,
          error: 'Script is required for video generation',
        };
      }

      // Generate voiceover
      const audioResult = await this.ttsService.generateSpeech(
        {
          text: script,
          language: config.language || 'english',
          voice: config.voice,
          speed: config.speed || 1.0,
        },
        context.userId
      );

      // Search for stock media
      const mediaQuery = config.mediaQuery || this.extractKeywords(script);
      const stockMedia = await this.stockMediaService.searchMedia({
        query: mediaQuery,
        type: config.mediaType || 'video',
        orientation: config.aspectRatio === '9:16' ? 'portrait' : 'landscape',
        perPage: 5,
      });

      // Generate subtitles
      const subtitles = await this.subtitleService.generateSubtitles(
        script,
        audioResult.duration || 60,
        config.language || 'english',
        context.userId
      );

      // Prepare video assets
      const assets = stockMedia.slice(0, 3).map((media, index) => ({
        url: media.url,
        type: media.type,
        startTime: index * (audioResult.duration || 60) / stockMedia.length,
        duration: (audioResult.duration || 60) / stockMedia.length,
      }));

      // Determine aspect ratio and resolution
      const aspectRatio = config.aspectRatio || '9:16';
      const resolution = this.getResolution(aspectRatio);

      // Compose video
      const videoResult = await this.videoService.composeVideo(
        {
          script,
          audioUrl: audioResult.audioUrl,
          assets,
          aspectRatio: aspectRatio as '9:16' | '16:9' | '1:1',
          resolution,
          subtitles: config.includeSubtitles ? subtitles : undefined,
          backgroundMusic: config.backgroundMusic,
        },
        context.userId,
        config.title || 'Generated Video'
      );

      return {
        success: true,
        output: {
          videoUrl: videoResult.videoUrl,
          videoPath: videoResult.videoPath,
          thumbnailUrl: videoResult.thumbnailUrl,
          duration: videoResult.duration,
          fileSize: videoResult.fileSize,
          script,
          subtitles: config.includeSubtitles ? subtitles : undefined,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Video generation failed',
      };
    }
  }

  private extractKeywords(text: string): string {
    // Simple keyword extraction (can be enhanced with NLP)
    const words = text.toLowerCase().split(/\s+/);
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    const keywords = words.filter(w => w.length > 4 && !commonWords.has(w));
    return keywords.slice(0, 3).join(' ');
  }

  private getResolution(aspectRatio: string): { width: number; height: number } {
    const resolutions: Record<string, { width: number; height: number }> = {
      '9:16': { width: 1080, height: 1920 }, // Reels/Shorts
      '16:9': { width: 1920, height: 1080 }, // YouTube
      '1:1': { width: 1080, height: 1080 }, // Square
    };

    return resolutions[aspectRatio] || resolutions['9:16'];
  }
}

