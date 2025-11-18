import { TrendAnalysisService } from '../../services/trends/TrendAnalysisService.js';
import { db } from '../../database/index.js';
import { trendData } from '../../database/schema/trends.js';
import { eq, and, desc } from 'drizzle-orm';
export class TrendAnalyzerNode {
    analysisService;
    constructor() {
        this.analysisService = new TrendAnalysisService();
    }
    async execute(context, input) {
        try {
            const nodeData = context.nodeStates.get('nodeData') || input.nodeData || {};
            const config = nodeData.data?.analyzer_config || input.analyzer_config || {};
            const keywords = input.keywords || config.keywords || [];
            const region = config.region || input.region;
            const language = config.language || input.language;
            const analyzeAll = config.analyzeAll || false;
            let analyses = [];
            if (analyzeAll) {
                // Analyze top trends
                const trends = await db.select()
                    .from(trendData)
                    .where(eq(trendData.isActive, true))
                    .orderBy(desc(trendData.trendScore))
                    .limit(20);
                for (const trend of trends) {
                    const analysis = await this.analysisService.analyzeTrend(trend.id);
                    analyses.push(analysis);
                }
            }
            else if (keywords.length > 0) {
                // Analyze specific keywords
                for (const keyword of keywords) {
                    const trends = await db.select()
                        .from(trendData)
                        .where(and(eq(trendData.keyword, keyword), eq(trendData.isActive, true)))
                        .limit(1);
                    if (trends.length > 0) {
                        const analysis = await this.analysisService.analyzeTrend(trends[0].id);
                        analyses.push(analysis);
                    }
                }
            }
            else if (region && language) {
                // Analyze regional trends
                analyses = await this.analysisService.getRegionalTrends(region, language, 20);
            }
            else {
                return {
                    success: false,
                    error: 'Provide keywords, region+language, or set analyzeAll=true',
                };
            }
            // Sort by trend score
            analyses.sort((a, b) => b.trendScore - a.trendScore);
            return {
                success: true,
                output: {
                    analyses,
                    count: analyses.length,
                    topTrends: analyses.slice(0, 10),
                    insights: this.generateInsights(analyses),
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Trend analysis failed',
            };
        }
    }
    generateInsights(analyses) {
        const insights = {
            totalTrends: analyses.length,
            averageScore: analyses.reduce((sum, a) => sum + a.trendScore, 0) / analyses.length,
            seasonalTrends: analyses.filter(a => a.seasonal).length,
            fatiguingTrends: analyses.filter(a => a.fatigue).length,
            topCategory: this.getTopCategory(analyses),
            growthTrends: analyses.filter(a => a.momentum > 0).length,
            decliningTrends: analyses.filter(a => a.momentum < 0).length,
        };
        return insights;
    }
    getTopCategory(analyses) {
        const categoryCount = new Map();
        for (const analysis of analyses) {
            const category = analysis.category || 'general';
            categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
        }
        let topCategory = 'general';
        let maxCount = 0;
        for (const [category, count] of categoryCount.entries()) {
            if (count > maxCount) {
                maxCount = count;
                topCategory = category;
            }
        }
        return topCategory;
    }
}
//# sourceMappingURL=TrendAnalyzerNode.js.map