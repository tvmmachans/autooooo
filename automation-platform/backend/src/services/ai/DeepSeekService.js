import axios from 'axios';
import { db } from '../../database/index.js';
import { aiUsageLogs } from '../../database/schema/ai.js';
export class DeepSeekService {
    apiKey;
    baseUrl = 'https://api.deepseek.com/v1';
    constructor() {
        this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    }
    async generateContent(request, userId) {
        const startTime = Date.now();
        let inputTokens = 0;
        let outputTokens = 0;
        let success = true;
        let error;
        try {
            const response = await axios.post(`${this.baseUrl}/chat/completions`, {
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: request.language
                            ? `You are an expert at creating viral and trending content. Respond in ${request.language}. Focus on engaging, shareable content.`
                            : 'You are an expert at creating viral and trending content. Focus on engaging, shareable content.',
                    },
                    {
                        role: 'user',
                        content: request.prompt,
                    },
                ],
                max_tokens: request.maxTokens || 1000,
                temperature: request.temperature || 0.8,
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });
            const generatedText = response.data.choices?.[0]?.message?.content || '';
            inputTokens = response.data.usage?.prompt_tokens || 0;
            outputTokens = response.data.usage?.completion_tokens || 0;
            // Log usage
            if (userId) {
                await this.logUsage({
                    userId,
                    model: 'deepseek-chat',
                    provider: 'deepseek',
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
        }
        catch (err) {
            success = false;
            error = err.response?.data?.error?.message || err.message || 'Unknown error';
            if (userId) {
                await this.logUsage({
                    userId,
                    model: 'deepseek-chat',
                    provider: 'deepseek',
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
            throw new Error(`DeepSeek AI error: ${error}`);
        }
    }
    async logUsage(data) {
        try {
            await db.insert(aiUsageLogs).values(data);
        }
        catch (err) {
            console.error('Failed to log AI usage:', err);
        }
    }
    isAvailable() {
        return !!this.apiKey;
    }
}
//# sourceMappingURL=DeepSeekService.js.map