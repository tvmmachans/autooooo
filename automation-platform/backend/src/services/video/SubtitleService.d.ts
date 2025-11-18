export interface SubtitleConfig {
    text: string;
    language: string;
    style?: {
        fontSize?: number;
        fontFamily?: string;
        color?: string;
        backgroundColor?: string;
        position?: 'bottom' | 'top' | 'center';
    };
}
export interface SubtitleSegment {
    text: string;
    startTime: number;
    duration: number;
    words?: Array<{
        word: string;
        startTime: number;
        duration: number;
    }>;
}
export declare class SubtitleService {
    private aiService;
    constructor();
    /**
     * Generate subtitles from audio transcript or text
     */
    generateSubtitles(text: string, audioDuration: number, language?: string, userId?: number): Promise<SubtitleSegment[]>;
    /**
     * Generate word-level timing (for advanced subtitle effects)
     */
    generateWordLevelTiming(text: string, audioDuration: number, language: string): Promise<SubtitleSegment[]>;
    /**
     * Auto-translate subtitles to target language
     */
    translateSubtitles(subtitles: SubtitleSegment[], targetLanguage: string, userId?: number): Promise<SubtitleSegment[]>;
    /**
     * Format subtitles as SRT (SubRip) format
     */
    formatSRT(subtitles: SubtitleSegment[]): string;
    /**
     * Format subtitles as VTT (WebVTT) format
     */
    formatVTT(subtitles: SubtitleSegment[]): string;
    private splitIntoSentences;
    private getReadingSpeed;
    private formatSRTTime;
    private formatVTTTime;
}
//# sourceMappingURL=SubtitleService.d.ts.map