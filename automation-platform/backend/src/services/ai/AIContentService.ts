import { SarvamService } from './SarvamService.js';
import { GroqService } from './GroqService.js';
import { GeminiService } from './GeminiService.js';
import { DeepSeekService } from './DeepSeekService.js';

export interface AIContentRequest {
  prompt: string;
  language: string;
  generationType: 'reel_script' | 'caption' | 'blog' | 'translation' | 'general';
  tone?: string;
  platform?: string;
  maxTokens?: number;
  temperature?: number;
  model?: 'auto' | 'sarvam' | 'groq' | 'gemini' | 'deepseek';
}

export interface AIContentResponse {
  text: string;
  model: string;
  provider: string;
  tokens?: {
    input: number;
    output: number;
  };
}

export class AIContentService {
  private sarvamService: SarvamService;
  private groqService: GroqService;
  private geminiService: GeminiService;
  private deepSeekService: DeepSeekService;

  constructor() {
    this.sarvamService = new SarvamService();
    this.groqService = new GroqService();
    this.geminiService = new GeminiService();
    this.deepSeekService = new DeepSeekService();
  }

  async generateContent(
    request: AIContentRequest,
    userId?: number
  ): Promise<AIContentResponse> {
    // Auto-select model if not specified
    const selectedModel = request.model === 'auto' 
      ? this.selectBestModel(request)
      : request.model || 'auto';

    // Build enhanced prompt based on generation type
    const enhancedPrompt = this.buildPrompt(request);

    // Route to appropriate service
    switch (selectedModel) {
      case 'sarvam':
        if (!this.sarvamService.isAvailable()) {
          throw new Error('Sarvam AI service is not available');
        }
        const sarvamResult = await this.sarvamService.generateContent(
          {
            prompt: enhancedPrompt,
            language: request.language,
            maxTokens: request.maxTokens,
            temperature: request.temperature,
          },
          userId
        );
        return {
          text: sarvamResult.text,
          model: 'sarvam',
          provider: 'sarvam',
          tokens: sarvamResult.tokens,
        };

      case 'groq':
        if (!this.groqService.isAvailable()) {
          throw new Error('Groq service is not available');
        }
        const groqResult = await this.groqService.generateContent(
          {
            prompt: enhancedPrompt,
            language: request.language,
            maxTokens: request.maxTokens,
            temperature: request.temperature,
          },
          userId
        );
        return {
          text: groqResult.text,
          model: 'llama-3.1-8b-instant',
          provider: 'groq',
          tokens: groqResult.tokens,
        };

      case 'gemini':
        if (!this.geminiService.isAvailable()) {
          throw new Error('Gemini service is not available');
        }
        const geminiResult = await this.geminiService.generateContent(
          {
            prompt: enhancedPrompt,
            language: request.language,
            maxTokens: request.maxTokens,
            temperature: request.temperature,
          },
          userId
        );
        return {
          text: geminiResult.text,
          model: 'gemini-2.0-flash-exp',
          provider: 'google',
          tokens: geminiResult.tokens,
        };

      case 'deepseek':
        if (!this.deepSeekService.isAvailable()) {
          throw new Error('DeepSeek service is not available');
        }
        const deepSeekResult = await this.deepSeekService.generateContent(
          {
            prompt: enhancedPrompt,
            language: request.language,
            maxTokens: request.maxTokens,
            temperature: request.temperature,
          },
          userId
        );
        return {
          text: deepSeekResult.text,
          model: 'deepseek-chat',
          provider: 'deepseek',
          tokens: deepSeekResult.tokens,
        };

      default:
        // Fallback: try services in order of preference
        if (this.sarvamService.isAvailable() && this.isIndianLanguage(request.language)) {
          const fallbackResult = await this.sarvamService.generateContent(
            {
              prompt: enhancedPrompt,
              language: request.language,
              maxTokens: request.maxTokens,
              temperature: request.temperature,
            },
            userId
          );
          return {
            text: fallbackResult.text,
            model: 'sarvam',
            provider: 'sarvam',
            tokens: fallbackResult.tokens,
          };
        }

        if (this.groqService.isAvailable()) {
          const fallbackResult = await this.groqService.generateContent(
            {
              prompt: enhancedPrompt,
              language: request.language,
              maxTokens: request.maxTokens,
              temperature: request.temperature,
            },
            userId
          );
          return {
            text: fallbackResult.text,
            model: 'llama-3.1-8b-instant',
            provider: 'groq',
            tokens: fallbackResult.tokens,
          };
        }

        throw new Error('No AI service is available');
    }
  }

  private selectBestModel(request: AIContentRequest): 'sarvam' | 'groq' | 'gemini' | 'deepseek' {
    const language = request.language.toLowerCase();
    const generationType = request.generationType;

    // Malayalam and Indian languages → Sarvam
    if (this.isIndianLanguage(language) && this.sarvamService.isAvailable()) {
      return 'sarvam';
    }

    // Trend-heavy content → DeepSeek
    if (generationType === 'reel_script' && this.deepSeekService.isAvailable()) {
      return 'deepseek';
    }

    // Creative content → Gemini
    if (generationType === 'blog' && this.geminiService.isAvailable()) {
      return 'gemini';
    }

    // Default: Groq (fast and multilingual)
    if (this.groqService.isAvailable()) {
      return 'groq';
    }

    // Fallbacks
    if (this.sarvamService.isAvailable()) return 'sarvam';
    if (this.geminiService.isAvailable()) return 'gemini';
    if (this.deepSeekService.isAvailable()) return 'deepseek';

    throw new Error('No AI service is available');
  }

  private isIndianLanguage(language: string): boolean {
    const indianLanguages = [
      'malayalam', 'tamil', 'hindi', 'telugu', 'kannada',
      'bengali', 'gujarati', 'marathi', 'punjabi', 'urdu',
      'odia', 'assamese', 'nepali', 'sanskrit',
    ];
    return indianLanguages.includes(language.toLowerCase());
  }

  private buildPrompt(request: AIContentRequest): string {
    let prompt = request.prompt;

    // Add generation type specific instructions
    switch (request.generationType) {
      case 'reel_script':
        prompt = `Create a 30-60 second reel script in ${request.language} with:
- Hook (first 3 seconds to grab attention)
- Story/Content (main message)
- Value (what viewer learns)
- CTA (call to action)
- Hashtags (5-10 relevant hashtags)

Topic: ${request.prompt}
${request.tone ? `Tone: ${request.tone}` : ''}
${request.platform ? `Platform: ${request.platform}` : ''}`;
        break;

      case 'caption':
        prompt = `Create a social media caption in ${request.language}:
- Short version (under 150 characters)
- Medium version (150-500 characters)
- Long version (500+ characters)

Topic: ${request.prompt}
${request.tone ? `Tone: ${request.tone}` : ''}
${request.platform ? `Platform: ${request.platform}` : ''}`;
        break;

      case 'blog':
        prompt = `Write a blog post in ${request.language} about: ${request.prompt}
${request.tone ? `Tone: ${request.tone}` : ''}
Make it engaging, informative, and well-structured.`;
        break;

      case 'translation':
        prompt = `Translate the following text to ${request.language}:
${request.prompt}
Maintain the original tone and meaning.`;
        break;
    }

    return prompt;
  }
}

