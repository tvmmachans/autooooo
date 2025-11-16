import { db } from '../../database/index.js';
import { trendData, trendHistory, NewTrendHistory } from '../../database/schema/trends.js';
import { eq, and, gte, desc } from 'drizzle-orm';

export interface TrendAnalysis {
  keyword: string;
  trendScore: number;
  volume: number;
  momentum: number;
  relevanceScore: number;
  freshnessScore: number;
  predictedEndDate?: Date;
  seasonal?: boolean;
  fatigue?: boolean;
  competitorMentions?: number;
}

export class TrendAnalysisService {
  /**
   * Calculate comprehensive trend score
   */
  async calculateTrendScore(trendId: string): Promise<number> {
    const [trend] = await db.select()
      .from(trendData)
      .where(eq(trendData.id, trendId))
      .limit(1);

    if (!trend) return 0;

    const volume = trend.volume || 0;
    const momentum = trend.momentum || 0;
    const relevance = trend.relevanceScore || 0;
    const freshness = this.calculateFreshnessScore(trend.firstSeen, trend.lastUpdated);

    // Weighted scoring
    const score = (
      (this.normalizeVolume(volume) * 0.4) +
      (this.normalizeMomentum(momentum) * 0.3) +
      (relevance * 0.2) +
      (freshness * 0.1)
    );

    // Update trend score in database
    await db.update(trendData)
      .set({ trendScore: score })
      .where(eq(trendData.id, trendId));

    return score;
  }

  /**
   * Analyze trend and return comprehensive analysis
   */
  async analyzeTrend(trendId: string): Promise<TrendAnalysis> {
    const [trend] = await db.select()
      .from(trendData)
      .where(eq(trendData.id, trendId))
      .limit(1);

    if (!trend) {
      throw new Error('Trend not found');
    }

    const trendScore = await this.calculateTrendScore(trendId);
    const history = await this.getTrendHistory(trendId);
    const momentum = this.calculateMomentum(history);
    const freshness = this.calculateFreshnessScore(trend.firstSeen, trend.lastUpdated);
    const seasonal = await this.detectSeasonalPattern(trendId);
    const fatigue = this.detectTrendFatigue(history);
    const predictedEnd = this.predictTrendEnd(history);

    return {
      keyword: trend.keyword,
      trendScore,
      volume: trend.volume || 0,
      momentum,
      relevanceScore: trend.relevanceScore || 0,
      freshnessScore: freshness,
      predictedEndDate: predictedEnd,
      seasonal,
      fatigue,
      competitorMentions: trend.metadata?.competitorMentions || 0,
    };
  }

  /**
   * Get regional trends with analysis
   */
  async getRegionalTrends(
    region: string,
    language: string,
    limit: number = 20
  ): Promise<TrendAnalysis[]> {
    const trends = await db.select()
      .from(trendData)
      .where(
        and(
          eq(trendData.isRegional, region.includes('-KL') || region.includes('-TN')),
          eq(trendData.isActive, true)
        )
      )
      .orderBy(desc(trendData.trendScore))
      .limit(limit);

    const analyses: TrendAnalysis[] = [];

    for (const trend of trends) {
      const analysis = await this.analyzeTrend(trend.id);
      analyses.push(analysis);
    }

    return analyses.sort((a, b) => b.trendScore - a.trendScore);
  }

  /**
   * Track competitor trends
   */
  async trackCompetitorTrends(
    competitorHandles: string[],
    platform: string
  ): Promise<TrendAnalysis[]> {
    // This would integrate with platform APIs to track competitor content
    // For now, return empty array
    return [];
  }

  /**
   * Detect seasonal patterns
   */
  private async detectSeasonalPattern(trendId: string): Promise<boolean> {
    const history = await this.getTrendHistory(trendId);

    if (history.length < 12) return false; // Need at least 12 months of data

    // Check for recurring patterns
    const monthlyVolumes = new Map<number, number[]>();

    for (const record of history) {
      const month = record.recordedAt.getMonth();
      if (!monthlyVolumes.has(month)) {
        monthlyVolumes.set(month, []);
      }
      monthlyVolumes.get(month)!.push(record.volume);
    }

    // If same months consistently have higher volumes, it's seasonal
    let seasonalMonths = 0;
    for (const [month, volumes] of monthlyVolumes.entries()) {
      const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
      const overallAvg = history.reduce((sum, r) => sum + r.volume, 0) / history.length;
      
      if (avgVolume > overallAvg * 1.2) {
        seasonalMonths++;
      }
    }

    return seasonalMonths >= 2; // At least 2 months show seasonal pattern
  }

  /**
   * Detect trend fatigue (declining interest)
   */
  private detectTrendFatigue(history: Array<{ volume: number; recordedAt: Date }>): boolean {
    if (history.length < 3) return false;

    const recent = history.slice(-3);
    const older = history.slice(-6, -3);

    if (older.length === 0) return false;

    const recentAvg = recent.reduce((sum, r) => sum + r.volume, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.volume, 0) / older.length;

    // If recent volume is 30% less than older, trend is fatiguing
    return recentAvg < olderAvg * 0.7;
  }

  /**
   * Predict when trend will end
   */
  private predictTrendEnd(history: Array<{ volume: number; recordedAt: Date }>): Date | undefined {
    if (history.length < 5) return undefined;

    // Simple linear regression to predict decline
    const volumes = history.map(h => h.volume);
    const trend = this.calculateLinearTrend(volumes);

    if (trend >= 0) return undefined; // Still growing

    // Predict when volume reaches 10% of peak
    const peak = Math.max(...volumes);
    const threshold = peak * 0.1;
    const currentVolume = volumes[volumes.length - 1];

    if (currentVolume <= threshold) {
      return new Date(); // Already below threshold
    }

    // Calculate days until threshold
    const daysToDecline = (currentVolume - threshold) / Math.abs(trend);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysToDecline);

    return endDate;
  }

  /**
   * Calculate momentum from history
   */
  private calculateMomentum(history: Array<{ volume: number; recordedAt: Date }>): number {
    if (history.length < 2) return 0;

    const recent = history.slice(-3);
    const older = history.slice(-6, -3);

    if (older.length === 0) return 0;

    const recentAvg = recent.reduce((sum, r) => sum + r.volume, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.volume, 0) / older.length;

    return recentAvg - olderAvg;
  }

  /**
   * Get trend history
   */
  private async getTrendHistory(trendId: string) {
    return db.select()
      .from(trendHistory)
      .where(eq(trendHistory.trendDataId, trendId))
      .orderBy(desc(trendHistory.recordedAt))
      .limit(12); // Last 12 records
  }

  /**
   * Calculate freshness score (0-100)
   */
  private calculateFreshnessScore(firstSeen: Date, lastUpdated: Date): number {
    const daysSinceFirst = (Date.now() - firstSeen.getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

    // Newer trends get higher scores
    let score = 100;
    score -= Math.min(daysSinceFirst * 2, 50); // Penalize old trends
    score -= Math.min(daysSinceUpdate * 5, 30); // Penalize stale updates

    return Math.max(score, 0);
  }

  /**
   * Normalize volume to 0-100 scale
   */
  private normalizeVolume(volume: number): number {
    // Logarithmic normalization
    if (volume === 0) return 0;
    return Math.min(Math.log10(volume + 1) * 20, 100);
  }

  /**
   * Normalize momentum to 0-100 scale
   */
  private normalizeMomentum(momentum: number): number {
    // Normalize to -100 to 100, then shift to 0-100
    return Math.max(0, Math.min(100, (momentum / 1000) * 50 + 50));
  }

  /**
   * Calculate linear trend (slope)
   */
  private calculateLinearTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  /**
   * Record trend history snapshot
   */
  async recordTrendSnapshot(trendId: string): Promise<void> {
    const [trend] = await db.select()
      .from(trendData)
      .where(eq(trendData.id, trendId))
      .limit(1);

    if (!trend) return;

    await db.insert(trendHistory).values({
      trendDataId: trendId,
      volume: trend.volume || 0,
      momentum: trend.momentum || 0,
      trendScore: trend.trendScore || 0,
    });
  }
}

