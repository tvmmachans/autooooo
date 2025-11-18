export interface RegionalTrend {
    keyword: string;
    volume: number;
    momentum: number;
    category: string;
    region: string;
    language: string;
    sources: string[];
    relevanceScore: number;
}
export declare class RegionalTrendsService {
    private googleTrends;
    private youtubeTrends;
    private instagramTrends;
    private twitterTrends;
    private tiktokTrends;
    constructor();
    /**
     * Get Kerala-specific trends (Malayalam)
     */
    getKeralaTrends(): Promise<RegionalTrend[]>;
    /**
     * Get Tamil Nadu-specific trends
     */
    getTamilNaduTrends(): Promise<RegionalTrend[]>;
    /**
     * Get India-wide trends with language filtering
     */
    getIndiaTrends(language?: string): Promise<RegionalTrend[]>;
    /**
     * Calculate relevance score for a keyword in a region/language
     */
    private calculateRelevanceScore;
    /**
     * Get cached regional trends from database
     */
    getCachedRegionalTrends(region: string, language: string): Promise<RegionalTrend[]>;
}
//# sourceMappingURL=RegionalTrendsService.d.ts.map