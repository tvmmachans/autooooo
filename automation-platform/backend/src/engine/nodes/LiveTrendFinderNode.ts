import type { WorkflowExecutionContext } from '../../database/schema.js';
import { GoogleTrendsService } from '../../services/trends/GoogleTrendsService.js';
import { YouTubeTrendsService } from '../../services/trends/YouTubeTrendsService.js';
import { InstagramTrendsService } from '../../services/trends/InstagramTrendsService.js';
import { TwitterTrendsService } from '../../services/trends/TwitterTrendsService.js';
import { TikTokTrendsService } from '../../services/trends/TikTokTrendsService.js';
import { RegionalTrendsService } from '../../services/trends/RegionalTrendsService.js';
import { db } from '../../database/index.js';
import { trendSources } from '../../database/schema/trends.js';
import { eq, and } from 'drizzle-orm';

export class LiveTrendFinderNode {
  private googleTrends: GoogleTrendsService;
  private youtubeTrends: YouTubeTrendsService;
  private instagramTrends: InstagramTrendsService;
  private twitterTrends: TwitterTrendsService;
  private tiktokTrends: TikTokTrendsService;
  private regionalTrends: RegionalTrendsService;

  constructor() {
    this.googleTrends = new GoogleTrendsService();
    this.youtubeTrends = new YouTubeTrendsService();
    this.instagramTrends = new InstagramTrendsService();
    this.twitterTrends = new TwitterTrendsService();
    this.tiktokTrends = new TikTokTrendsService();
    this.regionalTrends = new RegionalTrendsService();
  }

  async execute(
    context: WorkflowExecutionContext,
    input: Record<string, any>
  ): Promise<{ success: boolean; output?: Record<string, any>; error?: string }> {
    try {
      const nodeData = context.nodeStates.get('nodeData') || input.nodeData || {};
      const config = nodeData.data?.trend_config || input.trend_config || {};

      const region = config.region || input.region || 'IN';
      const language = config.language || input.language || 'english';
      const platforms = config.platforms || input.platforms || ['google_trends', 'youtube'];
      const category = config.category || input.category;
      const maxTrends = config.maxTrends || 20;

      let trends: any[] = [];

      // Get regional trends if specified
      if (region === 'IN-KL' && language === 'malayalam') {
        const keralaTrends = await this.regionalTrends.getKeralaTrends();
        trends = keralaTrends.map(t => ({
          keyword: t.keyword,
          volume: t.volume,
          momentum: t.momentum,
          category: t.category,
          sources: t.sources,
          relevanceScore: t.relevanceScore,
        }));
      } else if (region === 'IN-TN' && language === 'tamil') {
        const tamilTrends = await this.regionalTrends.getTamilNaduTrends();
        trends = tamilTrends.map(t => ({
          keyword: t.keyword,
          volume: t.volume,
          momentum: t.momentum,
          category: t.category,
          sources: t.sources,
          relevanceScore: t.relevanceScore,
        }));
      } else {
        // Get from specific platforms
        const allTrends: any[] = [];

        if (platforms.includes('google_trends')) {
          const googleTrends = await this.googleTrends.getDailyTrends(region, language);
          allTrends.push(...googleTrends.map(t => ({ ...t, source: 'google_trends' })));
        }

        if (platforms.includes('youtube')) {
          const youtubeTrends = await this.youtubeTrends.getTrendingVideos(region);
          allTrends.push(...youtubeTrends.map(t => ({ keyword: t.keyword, volume: t.views, source: 'youtube' })));
        }

        if (platforms.includes('instagram')) {
          const instagramTrends = await this.instagramTrends.getTrendingHashtags(region);
          allTrends.push(...instagramTrends.map(t => ({ keyword: t.hashtag, volume: t.postCount, source: 'instagram' })));
        }

        if (platforms.includes('twitter')) {
          const twitterTrends = await this.twitterTrends.getTrendingTopics(23424848); // India
          allTrends.push(...twitterTrends.map(t => ({ keyword: t.keyword, volume: t.tweetVolume, source: 'twitter' })));
        }

        if (platforms.includes('tiktok')) {
          const tiktokTrends = await this.tiktokTrends.getTrendingHashtags(region);
          allTrends.push(...tiktokTrends.map(t => ({ keyword: t.hashtag, volume: t.videoCount, source: 'tiktok' })));
        }

        // Aggregate and deduplicate
        const trendMap = new Map<string, any>();
        for (const trend of allTrends) {
          const key = trend.keyword.toLowerCase();
          if (!trendMap.has(key)) {
            trendMap.set(key, {
              keyword: trend.keyword,
              volume: trend.volume || 0,
              momentum: trend.momentum || 0,
              sources: [trend.source],
            });
          } else {
            const existing = trendMap.get(key)!;
            existing.volume += trend.volume || 0;
            existing.sources.push(trend.source);
          }
        }

        trends = Array.from(trendMap.values());
      }

      // Filter by category if specified
      if (category) {
        trends = trends.filter(t => t.category === category);
      }

      // Sort by volume and limit
      trends = trends
        .sort((a, b) => (b.volume || 0) - (a.volume || 0))
        .slice(0, maxTrends);

      // Save to database
      await this.saveTrends(trends, region, language, platforms);

      return {
        success: true,
        output: {
          trends,
          region,
          language,
          platforms,
          count: trends.length,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Trend finding failed',
      };
    }
  }

  private async saveTrends(
    trends: any[],
    region: string,
    language: string,
    platforms: string[]
  ): Promise<void> {
    // Get or create trend source
    for (const platform of platforms) {
      let [source] = await db.select()
        .from(trendSources)
        .where(
          and(
            eq(trendSources.name, platform),
            eq(trendSources.region, region),
            eq(trendSources.language, language)
          )
        )
        .limit(1);

      if (!source) {
        [source] = await db.insert(trendSources).values({
          name: platform,
          region,
          language,
          isActive: true,
        }).returning();
      }

      // Save trends using appropriate service
      if (platform === 'google_trends') {
        await this.googleTrends.saveTrends(
          trends.filter(t => t.sources?.includes('google_trends') || !t.sources),
          source.id,
          region,
          language
        );
      } else if (platform === 'youtube') {
        await this.youtubeTrends.saveTrends(
          trends.filter(t => t.sources?.includes('youtube')),
          source.id,
          region
        );
      }
      // Add other platforms similarly...
    }
  }
}

