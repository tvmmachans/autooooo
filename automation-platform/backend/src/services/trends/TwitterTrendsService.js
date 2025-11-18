import axios from 'axios';
import { db } from '../../database/index.js';
import { trendData, trendSources, NewTrendData } from '../../database/schema/trends.js';
import { eq, and } from 'drizzle-orm';
export class TwitterTrendsService {
    bearerToken;
    constructor() {
        this.bearerToken = process.env.TWITTER_BEARER_TOKEN || '';
    }
    /**
     * Get trending topics for a location
     * Twitter API v2 - Trends endpoint
     */
    async getTrendingTopics(woeid = 23424848) {
        // WOEID 23424848 = India
        // WOEID 2295420 = Kerala (if available)
        if (!this.bearerToken) {
            return this.getCachedTrends(woeid);
        }
        try {
            const response = await axios.get(`https://api.twitter.com/2/trends/place`, {
                params: {
                    id: woeid,
                },
                headers: {
                    Authorization: `Bearer ${this.bearerToken}`,
                },
            });
            return this.processTrends(response.data);
        }
        catch (error) {
            console.error('Twitter Trends API error:', error.message);
            return this.getCachedTrends(woeid);
        }
    }
    /**
     * Get India trending topics
     */
    async getIndiaTrends() {
        return this.getTrendingTopics(23424848); // India WOEID
    }
    /**
     * Search for keyword trends
     */
    async searchKeyword(keyword) {
        if (!this.bearerToken) {
            return null;
        }
        try {
            const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
                params: {
                    query: keyword,
                    max_results: 10,
                },
                headers: {
                    Authorization: `Bearer ${this.bearerToken}`,
                },
            });
            const tweetCount = response.data.meta?.result_count || 0;
            return {
                keyword,
                tweetVolume: tweetCount,
                trendScore: tweetCount,
            };
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Save trends to database
     */
    async saveTrends(trends, sourceId, region) {
        const trendRecords = trends.map(trend => ({
            sourceId,
            keyword: trend.keyword,
            volume: trend.tweetVolume,
            momentum: trend.trendScore,
            category: trend.category,
            isRegional: region.includes('-KL') || region.includes('-TN'),
            metadata: {
                platform: 'twitter',
            },
        }));
        for (const trend of trendRecords) {
            const existing = await db.select()
                .from(trendData)
                .where(and(eq(trendData.keyword, trend.keyword), eq(trendData.sourceId, sourceId)))
                .limit(1);
            if (existing.length > 0) {
                await db.update(trendData)
                    .set({
                    volume: trend.volume,
                    momentum: trend.momentum,
                    lastUpdated: new Date(),
                })
                    .where(eq(trendData.id, existing[0].id));
            }
            else {
                await db.insert(trendData).values(trend);
            }
        }
    }
    processTrends(data) {
        const trends = [];
        if (data[0]?.trends) {
            for (const trend of data[0].trends) {
                trends.push({
                    keyword: trend.name,
                    tweetVolume: trend.tweet_volume || 0,
                    trendScore: this.calculateTrendScore(trend),
                    category: this.categorizeTrend(trend.name),
                });
            }
        }
        return trends;
    }
    calculateTrendScore(trend) {
        // Calculate trend score based on tweet volume and growth
        const volume = trend.tweet_volume || 0;
        return Math.min(volume / 1000, 100); // Normalize to 0-100
    }
    categorizeTrend(keyword) {
        const categories = {
            'kerala': 'culture',
            'malayalam': 'entertainment',
            'tamil': 'entertainment',
            'tech': 'technology',
            'news': 'news',
            'sports': 'sports',
        };
        const lowerKeyword = keyword.toLowerCase();
        for (const [key, category] of Object.entries(categories)) {
            if (lowerKeyword.includes(key)) {
                return category;
            }
        }
        return 'general';
    }
    async getCachedTrends(woeid) {
        const region = woeid === 23424848 ? 'IN' : 'IN-KL';
        const source = await db.select()
            .from(trendSources)
            .where(and(eq(trendSources.name, 'twitter'), eq(trendSources.region, region)))
            .limit(1);
        if (source.length > 0) {
            const cached = await db.select()
                .from(trendData)
                .where(eq(trendData.sourceId, source[0].id))
                .limit(20);
            return cached.map(t => ({
                keyword: t.keyword,
                tweetVolume: t.volume || 0,
                trendScore: t.trendScore || 0,
                category: t.category || undefined,
            }));
        }
        return [];
    }
}
//# sourceMappingURL=TwitterTrendsService.js.map