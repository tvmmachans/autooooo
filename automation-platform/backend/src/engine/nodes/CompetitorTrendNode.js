import { db } from '../../database/index.js';
import { competitorTrends, NewCompetitorTrend } from '../../database/schema/trends.js';
import { eq, and, desc } from 'drizzle-orm';
export class CompetitorTrendNode {
    async execute(context, input) {
        try {
            const nodeData = context.nodeStates.get('nodeData') || input.nodeData || {};
            const config = nodeData.data?.competitor_config || input.competitor_config || {};
            const competitorHandles = config.competitorHandles || input.competitorHandles || [];
            const platform = config.platform || input.platform || 'youtube';
            const trackNew = config.trackNew !== false;
            if (competitorHandles.length === 0) {
                return {
                    success: false,
                    error: 'Competitor handles are required',
                };
            }
            const trackedTrends = [];
            // Track each competitor
            for (const handle of competitorHandles) {
                const trends = await this.trackCompetitor(handle, platform, trackNew);
                trackedTrends.push(...trends);
            }
            // Aggregate trends
            const trendMap = new Map();
            for (const trend of trackedTrends) {
                const key = trend.trendKeyword.toLowerCase();
                if (!trendMap.has(key)) {
                    trendMap.set(key, {
                        keyword: trend.trendKeyword,
                        competitors: [trend.competitorHandle],
                        platforms: [trend.platform],
                        totalEngagement: trend.engagement,
                        firstSeen: trend.postedAt,
                    });
                }
                else {
                    const existing = trendMap.get(key);
                    existing.competitors.push(trend.competitorHandle);
                    existing.totalEngagement += trend.engagement;
                }
            }
            const aggregatedTrends = Array.from(trendMap.values())
                .sort((a, b) => b.totalEngagement - a.totalEngagement);
            return {
                success: true,
                output: {
                    trends: aggregatedTrends,
                    competitors: competitorHandles,
                    platform,
                    count: aggregatedTrends.length,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Competitor tracking failed',
            };
        }
    }
    async trackCompetitor(handle, platform, trackNew) {
        // Get existing tracked trends
        const existing = await db.select()
            .from(competitorTrends)
            .where(and(eq(competitorTrends.competitorHandle, handle), eq(competitorTrends.platform, platform)))
            .orderBy(desc(competitorTrends.detectedAt))
            .limit(50);
        // In production, this would:
        // 1. Call platform API to get competitor's recent content
        // 2. Extract keywords/hashtags from content
        // 3. Compare with existing trends
        // 4. Save new trends
        // For now, return existing trends
        return existing.map(t => ({
            competitorHandle: t.competitorHandle,
            platform: t.platform,
            trendKeyword: t.trendKeyword,
            contentUrl: t.contentUrl,
            engagement: t.engagement,
            postedAt: t.postedAt,
        }));
    }
}
//# sourceMappingURL=CompetitorTrendNode.js.map