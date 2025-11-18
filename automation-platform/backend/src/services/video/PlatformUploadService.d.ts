export interface PlatformUploadConfig {
    videoId: number;
    platform: 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'linkedin';
    title: string;
    description?: string;
    tags?: string[];
    scheduledAt?: Date;
    thumbnailUrl?: string;
    visibility?: 'public' | 'unlisted' | 'private';
}
export interface PlatformUploadResult {
    uploadId: number;
    platformVideoId?: string;
    platformUrl?: string;
    status: 'pending' | 'uploading' | 'published' | 'failed';
    error?: string;
}
export declare class PlatformUploadService {
    uploadToPlatform(config: PlatformUploadConfig, userId: number, videoPath: string): Promise<PlatformUploadResult>;
    private uploadToYouTube;
    private uploadToInstagram;
    private uploadToTikTok;
    private uploadToFacebook;
    private uploadToLinkedIn;
    getUploadStatus(uploadId: number): Promise<PlatformUploadResult | null>;
}
//# sourceMappingURL=PlatformUploadService.d.ts.map