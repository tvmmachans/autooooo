import axios from 'axios';
import { db } from '../../database/index.js';
import { aiUsageLogs } from '../../database/schema/ai.js';

export interface GeminiRequest {
  prompt: string;
  language?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GeminiResponse {
  text: string;
  tokens?: {
    input: number;
    output: number;
  };
}

export class GeminiService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }

  async generateContent(
    request: GeminiRequest,
    userId?: number
  ): Promise<GeminiResponse> {
    const startTime = Date.now();
    let inputTokens = 0;
    let outputTokens = 0;
    let success = true;
    let error: string | undefined;

    try {
      const model = 'models/gemini-2.0-flash-exp';
      
      const response = await axios.post(
        `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: request.language 
                    ? `Please respond in ${request.language}. ${request.prompt}`
                    : request.prompt,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: request.maxTokens || 1000,
            temperature: request.temperature || 0.7,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      inputTokens = response.data.usageMetadata?.promptTokenCount || 0;
      outputTokens = response.data.usageMetadata?.candidatesTokenCount || 0;

      // Log usage
      if (userId) {
        await this.logUsage({
          userId,
          model: 'gemini-2.0-flash-exp',
          provider: 'google',
          language: request.language || 'english',
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
          model: 'gemini-2.0-flash-exp',
          provider: 'google',
          language: request.language || 'english',
          generationType: 'content',
          inputTokens,
          outputTokens,
          cost: 0,
          duration: Date.now() - startTime,
          success: false,
          error,
        });
      }

      throw new Error(`Gemini AI error: ${error}`);
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

  isAvailable(): boolean {
    return !!this.apiKey;
  }
}

