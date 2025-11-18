import { PlatformUploadService } from '../../services/video/PlatformUploadService.js';
export class PlatformUploadNode {
    uploadService;
    constructor() {
        this.uploadService = new PlatformUploadService();
    }
    async execute(context, input) {
        try {
            const nodeData = context.nodeStates.get('nodeData') || input.nodeData || {};
            const config = nodeData.data?.upload_config || input.upload_config || {};
            const videoId = input.videoId || config.videoId;
            const videoPath = input.videoPath || config.videoPath;
            if (!videoId || !videoPath) {
                return {
                    success: false,
                    error: 'Video ID and path are required for upload',
                };
            }
            const platforms = config.platforms || [config.platform || 'youtube'];
            const uploadResults = {};
            // Upload to each platform
            for (const platform of platforms) {
                try {
                    const result = await this.uploadService.uploadToPlatform({
                        videoId: typeof videoId === 'number' ? videoId : parseInt(videoId),
                        platform: platform,
                        title: config.title || input.title || 'Generated Video',
                        description: config.description || input.description,
                        tags: config.tags || input.tags,
                        scheduledAt: config.scheduledAt ? new Date(config.scheduledAt) : undefined,
                        thumbnailUrl: config.thumbnailUrl || input.thumbnailUrl,
                        visibility: config.visibility || 'public',
                    }, context.userId, videoPath);
                    uploadResults[platform] = {
                        success: true,
                        uploadId: result.uploadId,
                        platformVideoId: result.platformVideoId,
                        platformUrl: result.platformUrl,
                        status: result.status,
                    };
                }
                catch (error) {
                    uploadResults[platform] = {
                        success: false,
                        error: error.message,
                    };
                }
            }
            return {
                success: true,
                output: {
                    uploads: uploadResults,
                    platforms: Object.keys(uploadResults),
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Platform upload failed',
            };
        }
    }
}
//# sourceMappingURL=PlatformUploadNode.js.map