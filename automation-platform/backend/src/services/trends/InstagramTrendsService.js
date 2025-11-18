import axios from 'axios';
import { db } from '../../database/index.js';
import { trendData, trendSources, NewTrendData } from '../../database/schema/trends.js';
import { eq, and } from 'drizzle-orm';
export class InstagramTrendsService {
    accessToken;
    constructor() {
        this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || '';
    }
    /**
     * Get trending hashtags
     * Note: Instagram Graph API has limited hashtag access
     * For production, consider using Instagram Basic Display API or scraping
     */
    async getTrendingHashtags(region = 'IN') {
        if (!this.accessToken) {
            // Fallback to mock data or cached data
            return this.getCachedTrends(region);
        }
        try {
            // Instagram Graph API - Hashtag Search
            // Note: Requires Instagram Business Account
            const response = await axios.get('https://graph.instagram.com/v18.0/ig_hashtag_search', {
                params: {
                    user_id: process.env.INSTAGRAM_USER_ID,
                    q: 'trending', // Search query
                    access_token: this.accessToken,
                },
            });
            // Process hashtag data
            return this.processHashtagData(response.data);
        }
        catch (error) {
            console.error('Instagram Trends API error:', error.message);
            return this.getCachedTrends(region);
        }
    }
    /**
     * Get Kerala-specific hashtags (Malayalam content)
     */
    async getKeralaHashtags() {
        const keralaHashtags = [
            'kerala', 'keralam', 'malayalam', 'mollywood',
            'keralatourism', 'keralafood', 'keralaculture',
        ];
        const trends = [];
        for (const hashtag of keralaHashtags) {
            try {
                const data = await this.getHashtagData(hashtag);
                if (data) {
                    trends.push(data);
                }
            }
            catch (error) {
                // Continue with other hashtags
            }
        }
        return trends;
    }
    /**
     * Get Tamil Nadu-specific hashtags
     */
    async getTamilNaduHashtags() {
        const tamilHashtags = [
            'tamil', 'tamilnadu', 'kollywood', 'tamilcinema',
            'tamilculture', 'tamiltradition',
        ];
        const trends = [];
        for (const hashtag of tamilHashtags) {
            try {
                const data = await this.getHashtagData(hashtag);
                if (data) {
                    trends.push(data);
                }
            }
            catch (error) {
                // Continue
            }
        }
        return trends;
    }
    /**
     * Get hashtag data
     */
    async getHashtagData(hashtag) {
        if (!this.accessToken) {
            return null;
        }
        try {
            // Get hashtag ID
            const searchResponse = await axios.get('https://graph.instagram.com/v18.0/ig_hashtag_search', {
                params: {
                    user_id: process.env.INSTAGRAM_USER_ID,
                    q: hashtag,
                    access_token: this.accessToken,
                },
            });
            const hashtagId = searchResponse.data.data[0]?.id;
            if (!hashtagId)
                return null;
            // Get hashtag media
            const mediaResponse = await axios.get(`https://graph.instagram.com/v18.0/${hashtagId}/top_media`, {
                params: {
                    user_id: process.env.INSTAGRAM_USER_ID,
                    fields: 'like_count,comments_count,media_type',
                    access_token: this.accessToken,
                },
            });
            const posts = mediaResponse.data.data || [];
            const totalEngagement = posts.reduce((sum, post) => {
                return sum + (post.like_count || 0) + (post.comments_count || 0);
            }, 0);
            return {
                hashtag: `#${hashtag}`,
                postCount: posts.length,
                recentPosts: posts.length,
                engagement: totalEngagement,
                category: this.categorizeHashtag(hashtag),
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
            keyword: trend.hashtag,
            volume: trend.postCount,
            momentum: trend.recentPosts,
            category: trend.category,
            isRegional: region.includes('-KL') || region.includes('-TN'),
            metadata: {
                platform: 'instagram',
                hashtag: trend.hashtag,
                engagement: trend.engagement,
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
    processHashtagData(data) {
        // Process Instagram API response
        return [];
    }
    categorizeHashtag(hashtag) {
        const categories = {
            'kerala': 'culture',
            'malayalam': 'entertainment',
            'mollywood': 'entertainment',
            'tamil': 'entertainment',
            'kollywood': 'entertainment',
            'food': 'food',
            'tourism': 'travel',
        };
        for (const [key, category] of Object.entries(categories)) {
            if (hashtag.toLowerCase().includes(key)) {
                return category;
            }
        }
        return 'general';
    }
    async getCachedTrends(region) {
        const source = await db.select()
            .from(trendSources)
            .where(and(eq(trendSources.name, 'instagram'), eq(trendSources.region, region)))
            .limit(1);
        if (source.length > 0) {
            const cached = await db.select()
                .from(trendData)
                .where(eq(trendData.sourceId, source[0].id))
                .limit(20);
            return cached.map(t => ({
                hashtag: t.keyword,
                postCount: t.volume || 0,
                recentPosts: t.momentum || 0,
                engagement: 0,
                category: t.category || undefined,
            }));
        }
        return [];
    }
}
//# sourceMappingURL=InstagramTrendsService.js.map