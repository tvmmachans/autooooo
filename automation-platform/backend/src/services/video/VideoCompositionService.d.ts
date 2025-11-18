export interface VideoCompositionConfig {
    script: string;
    audioUrl: string;
    assets: Array<{
        url: string;
        type: 'image' | 'video';
        startTime: number;
        duration: number;
        position?: {
            x: number;
            y: number;
        };
        scale?: number;
    }>;
    aspectRatio: '9:16' | '16:9' | '1:1';
    resolution: {
        width: number;
        height: number;
    };
    subtitles?: Array<{
        text: string;
        startTime: number;
        duration: number;
    }>;
    backgroundMusic?: {
        url: string;
        volume: number;
    };
}
export interface VideoCompositionResult {
    videoUrl: string;
    videoPath: string;
    duration: number;
    fileSize: number;
    thumbnailUrl?: string;
}
export declare class VideoCompositionService {
    private storagePath;
    private publicUrl;
    private ffmpegPath;
    constructor();
    composeVideo(config: VideoCompositionConfig, userId: number, title: string): Promise<VideoCompositionResult>;
    private downloadAssets;
    private downloadFile;
    private generateSubtitlesFile;
    private formatSRTTime;
    private buildFFmpegCommand;
    private generateThumbnail;
    private getVideoMetadata;
    private ensureStorageDirectory;
}
//# sourceMappingURL=VideoCompositionService.d.ts.map