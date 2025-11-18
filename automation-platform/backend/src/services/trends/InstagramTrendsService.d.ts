export interface InstagramTrend {
    hashtag: string;
    postCount: number;
    recentPosts: number;
    engagement: number;
    category?: string;
}
export declare class InstagramTrendsService {
    private accessToken;
    constructor();
    /**
     * Get trending hashtags
     * Note: Instagram Graph API has limited hashtag access
     * For production, consider using Instagram Basic Display API or scraping
     */
    getTrendingHashtags(region?: string): Promise<InstagramTrend[]>;
    /**
     * Get Kerala-specific hashtags (Malayalam content)
     */
    getKeralaHashtags(): Promise<InstagramTrend[]>;
    /**
     * Get Tamil Nadu-specific hashtags
     */
    getTamilNaduHashtags(): Promise<InstagramTrend[]>;
    /**
     * Get hashtag data
     */
    private getHashtagData;
    /**
     * Save trends to database
     */
    saveTrends(trends: InstagramTrend[], sourceId: string, region: string): Promise<void>;
    private processHashtagData;
    private categorizeHashtag;
    private getCachedTrends;
}
//# sourceMappingURL=InstagramTrendsService.d.ts.map