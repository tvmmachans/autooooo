export interface TTSRequest {
    text: string;
    language: string;
    voice?: string;
    speed?: number;
    format?: 'mp3' | 'wav';
}
export interface TTSResponse {
    audioUrl: string;
    audioPath?: string;
    duration?: number;
    fileSize?: number;
    cached: boolean;
}
export declare class TTSService {
    private baseUrl;
    private storagePath;
    constructor();
    generateSpeech(request: TTSRequest, userId?: number): Promise<TTSResponse>;
    private callTTSService;
    private getDefaultVoice;
    private getCacheKey;
    private getCachedAudio;
    private cacheAudio;
    private ensureStorageDirectory;
}
//# sourceMappingURL=TTSService.d.ts.map