export interface MediaUploadResult {
    id: number;
    url: string;
    thumbnailUrl?: string;
    filename: string;
    mimeType: string;
    fileSize: number;
    width?: number;
    height?: number;
    duration?: number;
}
export declare class MediaService {
    private storagePath;
    private publicUrl;
    constructor();
    uploadFile(file: Express.Multer.File, userId: number, metadata?: Record<string, any>): Promise<MediaUploadResult>;
    getMediaById(id: number, userId: number): Promise<MediaUploadResult | null>;
    deleteMedia(id: number, userId: number): Promise<boolean>;
    private processImage;
    private generateFilename;
    private ensureStorageDirectory;
}
//# sourceMappingURL=MediaService.d.ts.map