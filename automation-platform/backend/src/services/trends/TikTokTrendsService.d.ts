export interface TikTokTrend {
    hashtag: string;
    videoCount: number;
    views: number;
    category?: string;
}
export declare class TikTokTrendsService {
    private accessToken;
    constructor();
    /**
     * Get trending hashtags
     * TikTok Creative Center API or Business API
     */
    getTrendingHashtags(region?: string): Promise<TikTokTrend[]>;
    /**
     * Get trending videos
     */
    getTrendingVideos(region?: string): Promise<TikTokTrend[]>;
    /**
     * Save trends to database
     */
    saveTrends(trends: TikTokTrend[], sourceId: string, region: string): Promise<void>;
    private processHashtags;
    private processVideos;
    private categorizeHashtag;
    private getCachedTrends;
}
//# sourceMappingURL=TikTokTrendsService.d.ts.map