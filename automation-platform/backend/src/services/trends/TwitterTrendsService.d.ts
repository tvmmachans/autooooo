export interface TwitterTrend {
    keyword: string;
    tweetVolume: number;
    trendScore: number;
    category?: string;
}
export declare class TwitterTrendsService {
    private bearerToken;
    constructor();
    /**
     * Get trending topics for a location
     * Twitter API v2 - Trends endpoint
     */
    getTrendingTopics(woeid?: number): Promise<TwitterTrend[]>;
    /**
     * Get India trending topics
     */
    getIndiaTrends(): Promise<TwitterTrend[]>;
    /**
     * Search for keyword trends
     */
    searchKeyword(keyword: string): Promise<TwitterTrend | null>;
    /**
     * Save trends to database
     */
    saveTrends(trends: TwitterTrend[], sourceId: string, region: string): Promise<void>;
    private processTrends;
    private calculateTrendScore;
    private categorizeTrend;
    private getCachedTrends;
}
//# sourceMappingURL=TwitterTrendsService.d.ts.map