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
export declare class AIContentService {
    private sarvamService;
    private groqService;
    private geminiService;
    private deepSeekService;
    constructor();
    generateContent(request: AIContentRequest, userId?: number): Promise<AIContentResponse>;
    private selectBestModel;
    private isIndianLanguage;
    private buildPrompt;
}
//# sourceMappingURL=AIContentService.d.ts.map