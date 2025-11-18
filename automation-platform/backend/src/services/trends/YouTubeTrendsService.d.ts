export interface YouTubeTrend {
    keyword: string;
    videoId: string;
    title: string;
    views: number;
    likes: number;
    category: string;
    channelName: string;
    publishedAt: Date;
}
export declare class YouTubeTrendsService {
    private apiKey;
    constructor();
    /**
     * Get trending videos for a region
     */
    getTrendingVideos(region?: string, categoryId?: string): Promise<YouTubeTrend[]>;
    /**
     * Get Malayalam trending videos
     */
    getMalayalamTrends(): Promise<YouTubeTrend[]>;
    /**
     * Get Tamil trending videos
     */
    getTamilTrends(): Promise<YouTubeTrend[]>;
    /**
     * Extract keywords from title and description
     */
    private extractKeywords;
    /**
     * Save trends to database
     */
    saveTrends(trends: YouTubeTrend[], sourceId: string, region: string): Promise<void>;
    private mapCategory;
    private getCachedTrends;
}
//# sourceMappingURL=YouTubeTrendsService.d.ts.map