import axios from 'axios';
import { db } from '../../database/index.js';
import { aiUsageLogs } from '../../database/schema/ai.js';

export interface SarvamRequest {
  prompt: string;
  language?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface SarvamResponse {
  text: string;
  tokens?: {
    input: number;
    output: number;
  };
}

export class SarvamService {
  private apiKey: string;
  private baseUrl: string = 'https://api.sarvam.ai/v1';

  constructor() {
    this.apiKey = process.env.SARVAM_API_KEY || '';
  }

  async generateContent(
    request: SarvamRequest,
    userId?: number
  ): Promise<SarvamResponse> {
    const startTime = Date.now();
    let inputTokens = 0;
    let outputTokens = 0;
    let success = true;
    let error: string | undefined;

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'sarvam-ai/ai4bharat-indic-llama3-8b-instruct',
          messages: [
            {
              role: 'user',
              content: request.prompt,
            },
          ],
          language: request.language || 'malayalam',
          max_tokens: request.maxTokens || 1000,
          temperature: request.temperature || 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const generatedText = response.data.choices?.[0]?.message?.content || '';
      inputTokens = response.data.usage?.prompt_tokens || 0;
      outputTokens = response.data.usage?.completion_tokens || 0;

      // Log usage
      if (userId) {
        await this.logUsage({
          userId,
          model: 'sarvam',
          provider: 'sarvam',
          language: request.language || 'malayalam',
          generationType: 'content',
          inputTokens,
          outputTokens,
          cost: 0,
          duration: Date.now() - startTime,
          success: true,
        });
      }

      return {
        text: generatedText,
        tokens: {
          input: inputTokens,
          output: outputTokens,
        },
      };
    } catch (err: any) {
      success = false;
      error = err.response?.data?.error?.message || err.message || 'Unknown error';

      if (userId) {
        await this.logUsage({
          userId,
          model: 'sarvam',
          provider: 'sarvam',
          language: request.language || 'malayalam',
          generationType: 'content',
          inputTokens,
          outputTokens,
          cost: 0,
          duration: Date.now() - startTime,
          success: false,
          error,
        });
      }

      throw new Error(`Sarvam AI error: ${error}`);
    }
  }

  private async logUsage(data: {
    userId: number;
    model: string;
    provider: string;
    language: string;
    generationType: string;
    inputTokens: number;
    outputTokens: number;
    cost: number;
    duration: number;
    success: boolean;
    error?: string;
  }) {
    try {
      await db.insert(aiUsageLogs).values(data);
    } catch (err) {
      console.error('Failed to log AI usage:', err);
    }
  }

  // Check if service is available
  isAvailable(): boolean {
    return !!this.apiKey;
  }
}

