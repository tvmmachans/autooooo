import axios from 'axios';
import { db } from '../../database/index.js';
import { trendData, trendSources } from '../../database/schema/trends.js';
import type { NewTrendData } from '../../database/schema/trends.js';
import { eq, and } from 'drizzle-orm';

export interface YouTubeTrend {
  keyword: string;
  videoId: string;
  title: string;
  views: number;
  likes: number;
  category: string;
  channelName: string;
  publishedAt: Date;
}

export class YouTubeTrendsService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
  }

  /**
   * Get trending videos for a region
   */
  async getTrendingVideos(region: string = 'IN', categoryId?: string): Promise<YouTubeTrend[]> {
    if (!this.apiKey) {
      throw new Error('YouTube API key not configured');
    }

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,statistics,contentDetails',
          chart: 'mostPopular',
          regionCode: region,
          maxResults: 50,
          categoryId: categoryId || undefined,
          key: this.apiKey,
        },
      });

      return response.data.items.map((item: any) => ({
        keyword: this.extractKeywords(item.snippet.title, item.snippet.description),
        videoId: item.id,
        title: item.snippet.title,
        views: parseInt(item.statistics.viewCount || '0'),
        likes: parseInt(item.statistics.likeCount || '0'),
        category: item.snippet.categoryId,
        channelName: item.snippet.channelTitle,
        publishedAt: new Date(item.snippet.publishedAt),
      }));
    } catch (error: any) {
      console.error('YouTube Trends API error:', error.message);
      return this.getCachedTrends(region);
    }
  }

  /**
   * Get Malayalam trending videos
   */
  async getMalayalamTrends(): Promise<YouTubeTrend[]> {
    // Search for Malayalam content
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: 'malayalam',
        type: 'video',
        order: 'viewCount',
        maxResults: 25,
        regionCode: 'IN',
        relevanceLanguage: 'ml',
        key: this.apiKey,
      },
    });

    return response.data.items.map((item: any) => ({
      keyword: 'malayalam',
      videoId: item.id.videoId,
      title: item.snippet.title,
      views: 0, // Would need additional API call
      likes: 0,
      category: 'entertainment',
      channelName: item.snippet.channelTitle,
      publishedAt: new Date(item.snippet.publishedAt),
    }));
  }

  /**
   * Get Tamil trending videos
   */
  async getTamilTrends(): Promise<YouTubeTrend[]> {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: 'tamil',
        type: 'video',
        order: 'viewCount',
        maxResults: 25,
        regionCode: 'IN',
        relevanceLanguage: 'ta',
        key: this.apiKey,
      },
    });

    return response.data.items.map((item: any) => ({
      keyword: 'tamil',
      videoId: item.id.videoId,
      title: item.snippet.title,
      views: 0,
      likes: 0,
      category: 'entertainment',
      channelName: item.snippet.channelTitle,
      publishedAt: new Date(item.snippet.publishedAt),
    }));
  }

  /**
   * Extract keywords from title and description
   */
  private extractKeywords(title: string, description: string): string {
    const text = `${title} ${description}`.toLowerCase();
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    const words = text.split(/\s+/).filter(w => w.length > 4 && !commonWords.has(w));
    return words.slice(0, 3).join(' ');
  }

  /**
   * Save trends to database
   */
  async saveTrends(
    trends: YouTubeTrend[],
    sourceId: string,
    region: string
  ): Promise<void> {
    const trendRecords: NewTrendData[] = trends.map(trend => ({
      sourceId,
      keyword: trend.keyword,
      volume: trend.views,
      momentum: 0, // Calculate from historical data
      category: this.mapCategory(trend.category),
      isRegional: region.includes('-KL') || region.includes('-TN'),
      metadata: {
        platform: 'youtube',
        videoId: trend.videoId,
        title: trend.title,
        channelName: trend.channelName,
      },
    }));

    for (const trend of trendRecords) {
      const existing = await db.select()
        .from(trendData)
        .where(
          and(
            eq(trendData.keyword, trend.keyword),
            eq(trendData.sourceId, sourceId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db.update(trendData)
          .set({
            volume: trend.volume,
            lastUpdated: new Date(),
          })
          .where(eq(trendData.id, existing[0].id));
      } else {
        await db.insert(trendData).values(trend);
      }
    }
  }

  private mapCategory(categoryId: string): string {
    const categoryMap: Record<string, string> = {
      '1': 'film',
      '2': 'autos',
      '10': 'music',
      '15': 'pets',
      '17': 'sports',
      '19': 'travel',
      '20': 'gaming',
      '22': 'people',
      '23': 'comedy',
      '24': 'entertainment',
      '25': 'news',
      '26': 'howto',
      '27': 'education',
      '28': 'science',
    };

    return categoryMap[categoryId] || 'general';
  }

  private async getCachedTrends(region: string): Promise<YouTubeTrend[]> {
    const source = await db.select()
      .from(trendSources)
      .where(
        and(
          eq(trendSources.name, 'youtube'),
          eq(trendSources.region, region)
        )
      )
      .limit(1);

    if (source.length > 0) {
      const cached = await db.select()
        .from(trendData)
        .where(eq(trendData.sourceId, source[0].id))
        .limit(20);

      return cached.map(t => {
        const metadata = (t.metadata as {
          videoId?: string;
          title?: string;
          channelName?: string;
        } | null) ?? null;

        return {
        keyword: t.keyword,
          videoId: metadata?.videoId || '',
          title: metadata?.title || '',
          views: t.volume || 0,
          likes: 0,
          category: t.category || 'general',
          channelName: metadata?.channelName || '',
          publishedAt: new Date(),
        };
      });
    }

    return [];
  }
}

