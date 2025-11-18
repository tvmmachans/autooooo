import axios from 'axios';
import { db } from '../../database/index.js';
import { trendData, trendSources, NewTrendData } from '../../database/schema/trends.js';
import { eq, and } from 'drizzle-orm';
export class TikTokTrendsService {
    accessToken;
    constructor() {
        this.accessToken = process.env.TIKTOK_ACCESS_TOKEN || '';
    }
    /**
     * Get trending hashtags
     * TikTok Creative Center API or Business API
     */
    async getTrendingHashtags(region = 'IN') {
        if (!this.accessToken) {
            return this.getCachedTrends(region);
        }
        try {
            // TikTok Business API - Trending Hashtags
            const response = await axios.get('https://business-api.tiktok.com/open_api/v1.3/trending/hashtag/list/', {
                params: {
                    access_token: this.accessToken,
                    region: region,
                },
            });
            return this.processHashtags(response.data);
        }
        catch (error) {
            console.error('TikTok Trends API error:', error.message);
            return this.getCachedTrends(region);
        }
    }
    /**
     * Get trending videos
     */
    async getTrendingVideos(region = 'IN') {
        if (!this.accessToken) {
            return this.getCachedTrends(region);
        }
        try {
            const response = await axios.get('https://business-api.tiktok.com/open_api/v1.3/trending/video/list/', {
                params: {
                    access_token: this.accessToken,
                    region: region,
                },
            });
            return this.processVideos(response.data);
        }
        catch (error) {
            console.error('TikTok Videos API error:', error.message);
            return this.getCachedTrends(region);
        }
    }
    /**
     * Save trends to database
     */
    async saveTrends(trends, sourceId, region) {
        const trendRecords = trends.map(trend => ({
            sourceId,
            keyword: trend.hashtag,
            volume: trend.videoCount,
            momentum: trend.views,
            category: trend.category,
            isRegional: region.includes('-KL') || region.includes('-TN'),
            metadata: {
                platform: 'tiktok',
                hashtag: trend.hashtag,
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
    processHashtags(data) {
        const trends = [];
        if (data.data?.list) {
            for (const item of data.data.list) {
                trends.push({
                    hashtag: `#${item.hashtag_name}`,
                    videoCount: item.video_count || 0,
                    views: item.view_count || 0,
                    category: this.categorizeHashtag(item.hashtag_name),
                });
            }
        }
        return trends;
    }
    processVideos(data) {
        // Extract hashtags from trending videos
        const hashtagMap = new Map();
        if (data.data?.list) {
            for (const video of data.data.list) {
                const hashtags = video.hashtags || [];
                for (const hashtag of hashtags) {
                    const name = hashtag.name || '';
                    if (!hashtagMap.has(name)) {
                        hashtagMap.set(name, { count: 0, views: 0 });
                    }
                    const current = hashtagMap.get(name);
                    hashtagMap.set(name, {
                        count: current.count + 1,
                        views: current.views + (video.view_count || 0),
                    });
                }
            }
        }
        return Array.from(hashtagMap.entries()).map(([hashtag, data]) => ({
            hashtag: `#${hashtag}`,
            videoCount: data.count,
            views: data.views,
            category: this.categorizeHashtag(hashtag),
        }));
    }
    categorizeHashtag(hashtag) {
        const lowerHashtag = hashtag.toLowerCase();
        if (lowerHashtag.includes('dance') || lowerHashtag.includes('music')) {
            return 'entertainment';
        }
        if (lowerHashtag.includes('food') || lowerHashtag.includes('recipe')) {
            return 'food';
        }
        if (lowerHashtag.includes('tech') || lowerHashtag.includes('ai')) {
            return 'technology';
        }
        if (lowerHashtag.includes('fashion') || lowerHashtag.includes('style')) {
            return 'fashion';
        }
        return 'general';
    }
    async getCachedTrends(region) {
        const source = await db.select()
            .from(trendSources)
            .where(and(eq(trendSources.name, 'tiktok'), eq(trendSources.region, region)))
            .limit(1);
        if (source.length > 0) {
            const cached = await db.select()
                .from(trendData)
                .where(eq(trendData.sourceId, source[0].id))
                .limit(20);
            return cached.map(t => ({
                hashtag: t.keyword,
                videoCount: t.volume || 0,
                views: t.momentum || 0,
                category: t.category || undefined,
            }));
        }
        return [];
    }
}
//# sourceMappingURL=TikTokTrendsService.js.map