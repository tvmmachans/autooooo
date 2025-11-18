export interface GoogleTrend {
    keyword: string;
    volume: number;
    momentum: number;
    category?: string;
    relatedQueries?: string[];
}
export declare class GoogleTrendsService {
    private apiKey;
    constructor();
    /**
     * Get daily trends for a region
     * Note: Google Trends doesn't have an official API, but we can use the RSS feed or scraping
     * For production, consider using pytrends library via a Python service
     */
    getDailyTrends(region?: string, language?: string): Promise<GoogleTrend[]>;
    /**
     * Get Kerala-specific trends (Malayalam)
     */
    getKeralaTrends(): Promise<GoogleTrend[]>;
    /**
     * Get Tamil Nadu-specific trends
     */
    getTamilNaduTrends(): Promise<GoogleTrend[]>;
    /**
     * Get India-wide trends
     */
    getIndiaTrends(language?: string): Promise<GoogleTrend[]>;
    /**
     * Search for specific keyword trends
     */
    searchKeyword(keyword: string, region?: string): Promise<GoogleTrend | null>;
    /**
     * Save trends to database
     */
    saveTrends(trends: GoogleTrend[], sourceId: string, region: string, language: string): Promise<void>;
    private parseGoogleTrendsResponse;
    private extractTrends;
    private getGeoCode;
    private getCachedTrends;
}
//# sourceMappingURL=GoogleTrendsService.d.ts.map