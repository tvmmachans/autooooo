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
export declare class SarvamService {
    private apiKey;
    private baseUrl;
    constructor();
    generateContent(request: SarvamRequest, userId?: number): Promise<SarvamResponse>;
    private logUsage;
    isAvailable(): boolean;
}
//# sourceMappingURL=SarvamService.d.ts.map