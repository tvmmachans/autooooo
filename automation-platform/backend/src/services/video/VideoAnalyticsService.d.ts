export interface AnalyticsData {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    watchTime: number;
    engagementRate: number;
    date: Date;
}
export declare class VideoAnalyticsService {
    recordAnalytics(videoId: number, platformUploadId: number, platform: string, data: Partial<AnalyticsData>): Promise<void>;
    getVideoAnalytics(videoId: number, startDate?: Date, endDate?: Date): Promise<{
        id: number;
        videoId: number;
        platformUploadId: number | null;
        platform: string;
        date: Date;
        views: number;
        likes: number;
        comments: number;
        shares: number;
        watchTime: number;
        engagementRate: number;
        metadata: Record<string, any> | null;
    }[]>;
    getPlatformAnalytics(platformUploadId: number, startDate?: Date, endDate?: Date): Promise<{
        id: number;
        videoId: number;
        platformUploadId: number | null;
        platform: string;
        date: Date;
        views: number;
        likes: number;
        comments: number;
        shares: number;
        watchTime: number;
        engagementRate: number;
        metadata: Record<string, any> | null;
    }[]>;
    getAggregatedAnalytics(videoId: number, platform?: string): Promise<{
        totalViews: number;
        totalLikes: number;
        totalComments: number;
        totalShares: number;
        totalWatchTime: number;
        averageEngagementRate: number;
        dataPoints: number;
    }>;
    syncPlatformAnalytics(platformUploadId: number): Promise<void>;
    private fetchPlatformAnalytics;
}
//# sourceMappingURL=VideoAnalyticsService.d.ts.map