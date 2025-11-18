export interface GroqRequest {
    prompt: string;
    language?: string;
    maxTokens?: number;
    temperature?: number;
    model?: string;
}
export interface GroqResponse {
    text: string;
    tokens?: {
        input: number;
        output: number;
    };
}
export declare class GroqService {
    private apiKey;
    private baseUrl;
    constructor();
    generateContent(request: GroqRequest, userId?: number): Promise<GroqResponse>;
    private logUsage;
    isAvailable(): boolean;
}
//# sourceMappingURL=GroqService.d.ts.map