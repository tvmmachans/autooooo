export interface TrendAnalysis {
    keyword: string;
    trendScore: number;
    volume: number;
    momentum: number;
    relevanceScore: number;
    freshnessScore: number;
    predictedEndDate?: Date;
    seasonal?: boolean;
    fatigue?: boolean;
    competitorMentions?: number;
}
export declare class TrendAnalysisService {
    /**
     * Calculate comprehensive trend score
     */
    calculateTrendScore(trendId: string): Promise<number>;
    /**
     * Analyze trend and return comprehensive analysis
     */
    analyzeTrend(trendId: string): Promise<TrendAnalysis>;
    /**
     * Get regional trends with analysis
     */
    getRegionalTrends(region: string, language: string, limit?: number): Promise<TrendAnalysis[]>;
    /**
     * Track competitor trends
     */
    trackCompetitorTrends(competitorHandles: string[], platform: string): Promise<TrendAnalysis[]>;
    /**
     * Detect seasonal patterns
     */
    private detectSeasonalPattern;
    /**
     * Detect trend fatigue (declining interest)
     */
    private detectTrendFatigue;
    /**
     * Predict when trend will end
     */
    private predictTrendEnd;
    /**
     * Calculate momentum from history
     */
    private calculateMomentum;
    /**
     * Get trend history
     */
    private getTrendHistory;
    /**
     * Calculate freshness score (0-100)
     */
    private calculateFreshnessScore;
    /**
     * Normalize volume to 0-100 scale
     */
    private normalizeVolume;
    /**
     * Normalize momentum to 0-100 scale
     */
    private normalizeMomentum;
    /**
     * Calculate linear trend (slope)
     */
    private calculateLinearTrend;
    /**
     * Record trend history snapshot
     */
    recordTrendSnapshot(trendId: string): Promise<void>;
}
//# sourceMappingURL=TrendAnalysisService.d.ts.map