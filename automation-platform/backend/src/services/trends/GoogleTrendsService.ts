import axios from 'axios';
import { db } from '../../database/index.js';
import { trendData, trendSources } from '../../database/schema/trends.js';
import type { NewTrendData } from '../../database/schema/trends.js';
import { eq, and } from 'drizzle-orm';

export interface GoogleTrend {
  keyword: string;
  volume: number;
  momentum: number;
  category?: string;
  relatedQueries?: string[];
}

export class GoogleTrendsService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_TRENDS_API_KEY || '';
  }

  /**
   * Get daily trends for a region
   * Note: Google Trends doesn't have an official API, but we can use the RSS feed or scraping
   * For production, consider using pytrends library via a Python service
   */
  async getDailyTrends(region: string = 'IN', language: string = 'en'): Promise<GoogleTrend[]> {
    try {
      // Google Trends RSS feed (unofficial but works)
      const geoCode = this.getGeoCode(region);
      const url = `https://trends.google.com/trends/api/dailytrends?geo=${geoCode}&hl=${language}`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      });

      // Parse the response (Google Trends returns JSONP)
      const jsonData = this.parseGoogleTrendsResponse(response.data);
      
      return this.extractTrends(jsonData);
    } catch (error: any) {
      console.error('Google Trends API error:', error.message);
      // Fallback to cached data or empty array
      return this.getCachedTrends(region, language);
    }
  }

  /**
   * Get Kerala-specific trends (Malayalam)
   */
  async getKeralaTrends(): Promise<GoogleTrend[]> {
    return this.getDailyTrends('IN-KL', 'ml');
  }

  /**
   * Get Tamil Nadu-specific trends
   */
  async getTamilNaduTrends(): Promise<GoogleTrend[]> {
    return this.getDailyTrends('IN-TN', 'ta');
  }

  /**
   * Get India-wide trends
   */
  async getIndiaTrends(language: string = 'en'): Promise<GoogleTrend[]> {
    return this.getDailyTrends('IN', language);
  }

  /**
   * Search for specific keyword trends
   */
  async searchKeyword(keyword: string, region: string = 'IN'): Promise<GoogleTrend | null> {
    try {
      // Use Google Trends API if available, or scrape
      const geoCode = this.getGeoCode(region);
      const url = `https://trends.google.com/trends/api/explore?hl=en&geo=${geoCode}&q=${encodeURIComponent(keyword)}`;

      const response = await axios.get(url);
      const data = this.parseGoogleTrendsResponse(response.data);

      if (data.default?.timelineData) {
        const timeline = data.default.timelineData;
        const latest = timeline[timeline.length - 1];
        const previous = timeline[timeline.length - 2] || latest;

        return {
          keyword,
          volume: latest.value[0] || 0,
          momentum: (latest.value[0] || 0) - (previous.value[0] || 0),
          relatedQueries: data.default.relatedQueries?.map((q: any) => q.query) || [],
        };
      }

      return null;
    } catch (error) {
      console.error('Keyword search error:', error);
      return null;
    }
  }

  /**
   * Save trends to database
   */
  async saveTrends(
    trends: GoogleTrend[],
    sourceId: string,
    region: string,
    language: string
  ): Promise<void> {
    const trendRecords: NewTrendData[] = trends.map(trend => ({
      sourceId,
      keyword: trend.keyword,
      volume: trend.volume,
      momentum: trend.momentum,
      category: trend.category,
      isRegional: region.includes('-KL') || region.includes('-TN'),
      metadata: {
        relatedKeywords: trend.relatedQueries,
        platform: 'google_trends',
      },
    }));

    // Upsert trends
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
            momentum: trend.momentum,
            lastUpdated: new Date(),
          })
          .where(eq(trendData.id, existing[0].id));
      } else {
        await db.insert(trendData).values(trend);
      }
    }
  }

  private parseGoogleTrendsResponse(data: string): any {
    // Google Trends returns JSONP, need to extract JSON
    const jsonMatch = data.match(/^\s*\)\]\}\'\s*(.+)$/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    return JSON.parse(data);
  }

  private extractTrends(data: any): GoogleTrend[] {
    const trends: GoogleTrend[] = [];

    if (data.default?.trendingSearchesDays) {
      for (const day of data.default.trendingSearchesDays) {
        if (day.trendingSearches) {
          for (const search of day.trendingSearches) {
            trends.push({
              keyword: search.title?.query || '',
              volume: search.formattedTraffic || '0',
              momentum: 0, // Calculate from historical data
              relatedQueries: search.relatedQueries?.map((q: any) => q.query) || [],
            });
          }
        }
      }
    }

    return trends;
  }

  private getGeoCode(region: string): string {
    const geoMap: Record<string, string> = {
      'IN': 'IN',
      'IN-KL': 'IN-KL', // Kerala
      'IN-TN': 'IN-TN', // Tamil Nadu
      'IN-MH': 'IN-MH', // Maharashtra
      'IN-KA': 'IN-KA', // Karnataka
      'US': 'US',
    };

    return geoMap[region] || region;
  }

  private async getCachedTrends(region: string, language: string): Promise<GoogleTrend[]> {
    // Get from database cache
    const source = await db.select()
      .from(trendSources)
      .where(
        and(
          eq(trendSources.name, 'google_trends'),
          eq(trendSources.region, region),
          eq(trendSources.language, language)
        )
      )
      .limit(1);

    if (source.length > 0) {
      const cached = await db.select()
        .from(trendData)
        .where(eq(trendData.sourceId, source[0].id))
        .limit(20);

      return cached.map(t => ({
        keyword: t.keyword,
        volume: t.volume || 0,
        momentum: t.momentum || 0,
        category: t.category || undefined,
      }));
    }

    return [];
  }
}

