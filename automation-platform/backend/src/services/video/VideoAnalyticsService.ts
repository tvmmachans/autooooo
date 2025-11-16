import { db } from '../../database/index.js';
import { videoAnalytics, platformUploads, videos } from '../../database/schema/video.js';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

export interface AnalyticsData {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  watchTime: number;
  engagementRate: number;
  date: Date;
}

export class VideoAnalyticsService {
  async recordAnalytics(
    videoId: number,
    platformUploadId: number,
    platform: string,
    data: Partial<AnalyticsData>
  ) {
    await db.insert(videoAnalytics).values({
      videoId,
      platformUploadId,
      platform,
      views: data.views || 0,
      likes: data.likes || 0,
      comments: data.comments || 0,
      shares: data.shares || 0,
      watchTime: data.watchTime || 0,
      engagementRate: data.engagementRate || 0,
      date: data.date || new Date(),
    });
  }

  async getVideoAnalytics(
    videoId: number,
    startDate?: Date,
    endDate?: Date
  ) {
    const conditions = [eq(videoAnalytics.videoId, videoId)];

    if (startDate) {
      conditions.push(gte(videoAnalytics.date, startDate));
    }
    if (endDate) {
      conditions.push(lte(videoAnalytics.date, endDate));
    }

    return db.select()
      .from(videoAnalytics)
      .where(and(...conditions))
      .orderBy(desc(videoAnalytics.date));
  }

  async getPlatformAnalytics(
    platformUploadId: number,
    startDate?: Date,
    endDate?: Date
  ) {
    const conditions = [eq(videoAnalytics.platformUploadId, platformUploadId)];

    if (startDate) {
      conditions.push(gte(videoAnalytics.date, startDate));
    }
    if (endDate) {
      conditions.push(lte(videoAnalytics.date, endDate));
    }

    return db.select()
      .from(videoAnalytics)
      .where(and(...conditions))
      .orderBy(desc(videoAnalytics.date));
  }

  async getAggregatedAnalytics(
    videoId: number,
    platform?: string
  ) {
    const conditions: any[] = [eq(videoAnalytics.videoId, videoId)];
    if (platform) {
      conditions.push(eq(videoAnalytics.platform, platform));
    }

    const analytics = await db.select()
      .from(videoAnalytics)
      .where(and(...conditions));

    return {
      totalViews: analytics.reduce((sum, a) => sum + a.views, 0),
      totalLikes: analytics.reduce((sum, a) => sum + a.likes, 0),
      totalComments: analytics.reduce((sum, a) => sum + a.comments, 0),
      totalShares: analytics.reduce((sum, a) => sum + a.shares, 0),
      totalWatchTime: analytics.reduce((sum, a) => sum + a.watchTime, 0),
      averageEngagementRate: analytics.length > 0
        ? analytics.reduce((sum, a) => sum + a.engagementRate, 0) / analytics.length
        : 0,
      dataPoints: analytics.length,
    };
  }

  async syncPlatformAnalytics(platformUploadId: number) {
    // Fetch latest analytics from platform APIs
    const [upload] = await db.select()
      .from(platformUploads)
      .where(eq(platformUploads.id, platformUploadId))
      .limit(1);

    if (!upload || !upload.platformVideoId) {
      return;
    }

    // Fetch analytics from platform (simplified - in production, use actual APIs)
    const analytics = await this.fetchPlatformAnalytics(
      upload.platform,
      upload.platformVideoId
    );

    // Record in database
    await this.recordAnalytics(
      upload.videoId,
      platformUploadId,
      upload.platform,
      analytics
    );

    // Update platform upload record
    await db.update(platformUploads)
      .set({
        analytics: analytics as any,
      })
      .where(eq(platformUploads.id, platformUploadId));
  }

  private async fetchPlatformAnalytics(
    platform: string,
    platformVideoId: string
  ): Promise<Partial<AnalyticsData>> {
    // In production, this would call actual platform APIs
    // YouTube Analytics API, Instagram Insights API, etc.
    
    // Mock data for now
    return {
      views: Math.floor(Math.random() * 10000),
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50),
      watchTime: Math.floor(Math.random() * 3600),
      engagementRate: Math.random() * 10,
    };
  }
}

