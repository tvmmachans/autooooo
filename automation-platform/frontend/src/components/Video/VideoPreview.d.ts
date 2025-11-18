import React from 'react';
interface VideoPreviewProps {
    videoUrl?: string;
    thumbnailUrl?: string;
    title?: string;
    duration?: number;
    status?: 'processing' | 'completed' | 'failed';
    isLoading?: boolean;
}
export declare const VideoPreview: React.FC<VideoPreviewProps>;
export {};
//# sourceMappingURL=VideoPreview.d.ts.map