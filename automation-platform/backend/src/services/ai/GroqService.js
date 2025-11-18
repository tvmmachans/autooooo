import axios from 'axios';
import { db } from '../../database/index.js';
import { aiUsageLogs } from '../../database/schema/ai.js';
export class GroqService {
    apiKey;
    baseUrl = 'https://api.groq.com/openai/v1';
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY || '';
    }
    async generateContent(request, userId) {
        const startTime = Date.now();
        let inputTokens = 0;
        let outputTokens = 0;
        let success = true;
        let error;
        try {
            const model = request.model || 'llama-3.1-8b-instant';
            const response = await axios.post(`${this.baseUrl}/chat/completions`, {
                model,
                messages: [
                    {
                        role: 'system',
                        content: request.language
                            ? `You are a helpful assistant. Respond in ${request.language}.`
                            : 'You are a helpful assistant.',
                    },
                    {
                        role: 'user',
                        content: request.prompt,
                    },
                ],
                max_tokens: request.maxTokens || 1000,
                temperature: request.temperature || 0.7,
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
                    model: model,
                    provider: 'groq',
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
                    model: request.model || 'llama-3.1-8b-instant',
                    provider: 'groq',
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
            throw new Error(`Groq AI error: ${error}`);
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
//# sourceMappingURL=GroqService.js.map