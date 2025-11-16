import type { WorkflowExecutionContext } from '../../database/schema.js';
import { TTSService } from '../../services/ai/TTSService.js';

export class AITTSNode {
  private ttsService: TTSService;

  constructor() {
    this.ttsService = new TTSService();
  }

  async execute(
    context: WorkflowExecutionContext,
    input: Record<string, any>
  ): Promise<{ success: boolean; output?: Record<string, any>; error?: string }> {
    try {
      const nodeData = context.nodeStates.get('nodeData') || input.nodeData || {};
      const config = nodeData.data?.voice_config || input.voice_config || {};
      const text = input.text || input.content || input.script || '';
      const language = config.language || input.language || 'english';
      const voice = config.voice;
      const speed = config.speed || 1.0;
      const format = config.format || 'mp3';

      if (!text) {
        return {
          success: false,
          error: 'Text is required for TTS generation',
        };
      }

      const result = await this.ttsService.generateSpeech(
        {
          text,
          language,
          voice,
          speed,
          format,
        },
        context.userId
      );

      return {
        success: true,
        output: {
          audioUrl: result.audioUrl,
          audioPath: result.audioPath,
          duration: result.duration,
          fileSize: result.fileSize,
          cached: result.cached,
          language,
          voice: voice || 'default',
          format,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'TTS generation failed',
      };
    }
  }
}

