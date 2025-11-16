import { GoogleTrendsService } from './GoogleTrendsService.js';
import { YouTubeTrendsService } from './YouTubeTrendsService.js';
import { InstagramTrendsService } from './InstagramTrendsService.js';
import { TwitterTrendsService } from './TwitterTrendsService.js';
import { TikTokTrendsService } from './TikTokTrendsService.js';
import { db } from '../../database/index.js';
import { trendData, trendSources } from '../../database/schema/trends.js';
import { eq, and, desc } from 'drizzle-orm';

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

export class RegionalTrendsService {
  private googleTrends: GoogleTrendsService;
  private youtubeTrends: YouTubeTrendsService;
  private instagramTrends: InstagramTrendsService;
  private twitterTrends: TwitterTrendsService;
  private tiktokTrends: TikTokTrendsService;

  constructor() {
    this.googleTrends = new GoogleTrendsService();
    this.youtubeTrends = new YouTubeTrendsService();
    this.instagramTrends = new InstagramTrendsService();
    this.twitterTrends = new TwitterTrendsService();
    this.tiktokTrends = new TikTokTrendsService();
  }

  /**
   * Get Kerala-specific trends (Malayalam)
   */
  async getKeralaTrends(): Promise<RegionalTrend[]> {
    const trends: RegionalTrend[] = [];

    // Get from all sources
    const [googleTrends, youtubeTrends, instagramTrends] = await Promise.all([
      this.googleTrends.getKeralaTrends().catch(() => []),
      this.youtubeTrends.getMalayalamTrends().catch(() => []),
      this.instagramTrends.getKeralaHashtags().catch(() => []),
    ]);

    // Aggregate and deduplicate
    const trendMap = new Map<string, RegionalTrend>();

    // Process Google Trends
    for (const trend of googleTrends) {
      const key = trend.keyword.toLowerCase();
      if (!trendMap.has(key)) {
        trendMap.set(key, {
          keyword: trend.keyword,
          volume: trend.volume,
          momentum: trend.momentum,
          category: trend.category || 'general',
          region: 'IN-KL',
          language: 'malayalam',
          sources: ['google_trends'],
          relevanceScore: this.calculateRelevanceScore(trend.keyword, 'malayalam', 'IN-KL'),
        });
      } else {
        const existing = trendMap.get(key)!;
        existing.volume += trend.volume;
        existing.sources.push('google_trends');
      }
    }

    // Process YouTube Trends
    for (const trend of youtubeTrends) {
      const key = trend.keyword.toLowerCase();
      if (!trendMap.has(key)) {
        trendMap.set(key, {
          keyword: trend.keyword,
          volume: trend.views,
          momentum: 0,
          category: trend.category,
          region: 'IN-KL',
          language: 'malayalam',
          sources: ['youtube'],
          relevanceScore: this.calculateRelevanceScore(trend.keyword, 'malayalam', 'IN-KL'),
        });
      } else {
        const existing = trendMap.get(key)!;
        existing.volume += trend.views;
        existing.sources.push('youtube');
      }
    }

    // Process Instagram Trends
    for (const trend of instagramTrends) {
      const key = trend.hashtag.toLowerCase().replace('#', '');
      if (!trendMap.has(key)) {
        trendMap.set(key, {
          keyword: trend.hashtag,
          volume: trend.postCount,
          momentum: trend.recentPosts,
          category: trend.category || 'general',
          region: 'IN-KL',
          language: 'malayalam',
          sources: ['instagram'],
          relevanceScore: this.calculateRelevanceScore(trend.hashtag, 'malayalam', 'IN-KL'),
        });
      } else {
        const existing = trendMap.get(key)!;
        existing.volume += trend.postCount;
        existing.sources.push('instagram');
      }
    }

    return Array.from(trendMap.values())
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 50);
  }

  /**
   * Get Tamil Nadu-specific trends
   */
  async getTamilNaduTrends(): Promise<RegionalTrend[]> {
    const trends: RegionalTrend[] = [];

    const [googleTrends, youtubeTrends, instagramTrends] = await Promise.all([
      this.googleTrends.getTamilNaduTrends().catch(() => []),
      this.youtubeTrends.getTamilTrends().catch(() => []),
      this.instagramTrends.getTamilNaduHashtags().catch(() => []),
    ]);

    const trendMap = new Map<string, RegionalTrend>();

    // Similar aggregation logic as Kerala
    for (const trend of googleTrends) {
      const key = trend.keyword.toLowerCase();
      if (!trendMap.has(key)) {
        trendMap.set(key, {
          keyword: trend.keyword,
          volume: trend.volume,
          momentum: trend.momentum,
          category: trend.category || 'general',
          region: 'IN-TN',
          language: 'tamil',
          sources: ['google_trends'],
          relevanceScore: this.calculateRelevanceScore(trend.keyword, 'tamil', 'IN-TN'),
        });
      }
    }

    // Add YouTube and Instagram trends similarly...

    return Array.from(trendMap.values())
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 50);
  }

  /**
   * Get India-wide trends with language filtering
   */
  async getIndiaTrends(language?: string): Promise<RegionalTrend[]> {
    const trends: RegionalTrend[] = [];

    const [googleTrends, youtubeTrends] = await Promise.all([
      this.googleTrends.getIndiaTrends(language || 'en').catch(() => []),
      this.youtubeTrends.getTrendingVideos('IN').catch(() => []),
    ]);

    const trendMap = new Map<string, RegionalTrend>();

    for (const trend of googleTrends) {
      const key = trend.keyword.toLowerCase();
      if (!trendMap.has(key)) {
        trendMap.set(key, {
          keyword: trend.keyword,
          volume: trend.volume,
          momentum: trend.momentum,
          category: trend.category || 'general',
          region: 'IN',
          language: language || 'english',
          sources: ['google_trends'],
          relevanceScore: this.calculateRelevanceScore(trend.keyword, language || 'english', 'IN'),
        });
      }
    }

    return Array.from(trendMap.values())
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 50);
  }

  /**
   * Calculate relevance score for a keyword in a region/language
   */
  private calculateRelevanceScore(
    keyword: string,
    language: string,
    region: string
  ): number {
    let score = 50; // Base score

    const lowerKeyword = keyword.toLowerCase();

    // Language-specific keywords boost
    const languageKeywords: Record<string, string[]> = {
      malayalam: ['kerala', 'keralam', 'malayalam', 'mollywood', 'onam', 'vishu'],
      tamil: ['tamil', 'tamilnadu', 'kollywood', 'pongal', 'jallikattu'],
      hindi: ['hindi', 'bollywood', 'delhi', 'mumbai'],
    };

    if (languageKeywords[language]) {
      for (const langKeyword of languageKeywords[language]) {
        if (lowerKeyword.includes(langKeyword)) {
          score += 20;
        }
      }
    }

    // Regional keywords boost
    if (region === 'IN-KL') {
      const keralaKeywords = ['kerala', 'kochi', 'trivandrum', 'calicut', 'malabar'];
      for (const keralaKeyword of keralaKeywords) {
        if (lowerKeyword.includes(keralaKeyword)) {
          score += 15;
        }
      }
    } else if (region === 'IN-TN') {
      const tamilKeywords = ['tamil', 'chennai', 'madurai', 'coimbatore'];
      for (const tamilKeyword of tamilKeywords) {
        if (lowerKeyword.includes(tamilKeyword)) {
          score += 15;
        }
      }
    }

    // Category relevance
    const categoryKeywords: Record<string, string[]> = {
      entertainment: ['movie', 'film', 'cinema', 'actor', 'actress', 'song'],
      culture: ['festival', 'tradition', 'culture', 'heritage'],
      food: ['food', 'recipe', 'cuisine', 'dish'],
      technology: ['tech', 'ai', 'software', 'app', 'digital'],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const catKeyword of keywords) {
        if (lowerKeyword.includes(catKeyword)) {
          score += 10;
          break;
        }
      }
    }

    return Math.min(score, 100);
  }

  /**
   * Get cached regional trends from database
   */
  async getCachedRegionalTrends(
    region: string,
    language: string
  ): Promise<RegionalTrend[]> {
    const sources = await db.select()
      .from(trendSources)
      .where(
        and(
          eq(trendSources.region, region),
          eq(trendSources.language, language),
          eq(trendSources.isActive, true)
        )
      );

    const allTrends: RegionalTrend[] = [];

    for (const source of sources) {
      const trends = await db.select()
        .from(trendData)
        .where(
          and(
            eq(trendData.sourceId, source.id),
            eq(trendData.isActive, true)
          )
        )
        .orderBy(desc(trendData.trendScore))
        .limit(20);

      for (const trend of trends) {
        allTrends.push({
          keyword: trend.keyword,
          volume: trend.volume || 0,
          momentum: trend.momentum || 0,
          category: trend.category || 'general',
          region: source.region,
          language: source.language,
          sources: [source.name],
          relevanceScore: trend.relevanceScore || 0,
        });
      }
    }

    // Deduplicate and sort
    const trendMap = new Map<string, RegionalTrend>();
    for (const trend of allTrends) {
      const key = trend.keyword.toLowerCase();
      if (!trendMap.has(key)) {
        trendMap.set(key, trend);
      } else {
        const existing = trendMap.get(key)!;
        existing.volume += trend.volume;
        existing.sources.push(...trend.sources);
      }
    }

    return Array.from(trendMap.values())
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 50);
  }
}

