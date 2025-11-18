export interface DeepSeekRequest {
    prompt: string;
    language?: string;
    maxTokens?: number;
    temperature?: number;
}
export interface DeepSeekResponse {
    text: string;
    tokens?: {
        input: number;
        output: number;
    };
}
export declare class DeepSeekService {
    private apiKey;
    private baseUrl;
    constructor();
    generateContent(request: DeepSeekRequest, userId?: number): Promise<DeepSeekResponse>;
    private logUsage;
    isAvailable(): boolean;
}
//# sourceMappingURL=DeepSeekService.d.ts.map