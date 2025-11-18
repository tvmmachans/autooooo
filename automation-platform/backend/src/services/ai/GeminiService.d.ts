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
export declare class GeminiService {
    private apiKey;
    private baseUrl;
    constructor();
    generateContent(request: GeminiRequest, userId?: number): Promise<GeminiResponse>;
    private logUsage;
    isAvailable(): boolean;
}
//# sourceMappingURL=GeminiService.d.ts.map