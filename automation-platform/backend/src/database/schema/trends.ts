import { pgTable, serial, text, timestamp, jsonb, integer, boolean, index, real, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// Trend sources - track different data sources
export const trendSources = pgTable('trend_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // 'youtube', 'google_trends', 'instagram', 'twitter', 'tiktok'
  region: text('region').notNull(), // 'IN-KL', 'IN-TN', 'IN', 'US', etc.
  language: text('language').notNull(), // 'malayalam', 'tamil', 'hindi', 'english'
  category: text('category'), // 'technology', 'entertainment', 'news', 'culture'
  isActive: boolean('is_active').default(true).notNull(),
  apiConfig: jsonb('api_config').$type<Record<string, any>>(), // API credentials/config
  lastSyncAt: timestamp('last_sync_at'),
  syncFrequency: integer('sync_frequency').default(3600), // seconds
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  nameIdx: index('trend_sources_name_idx').on(table.name),
  regionIdx: index('trend_sources_region_idx').on(table.region),
  languageIdx: index('trend_sources_language_idx').on(table.language),
  activeIdx: index('trend_sources_active_idx').on(table.isActive),
  regionLanguageIdx: index('trend_sources_region_language_idx').on(table.region, table.language),
}));

// Trend data - actual trend information
export const trendData = pgTable('trend_data', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceId: uuid('source_id').references(() => trendSources.id, { onDelete: 'cascade' }),
  keyword: text('keyword').notNull(),
  volume: integer('volume'), // Search volume/mentions
  momentum: integer('momentum').default(0), // Growth rate (positive/negative)
  category: text('category'), // 'technology', 'entertainment', 'news', 'culture'
  sentiment: text('sentiment'), // 'positive', 'negative', 'neutral'
  relevanceScore: real('relevance_score').default(0), // 0-100
  trendScore: real('trend_score').default(0), // Calculated overall score
  firstSeen: timestamp('first_seen').defaultNow().notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  peakDate: timestamp('peak_date'), // When trend peaked
  isActive: boolean('is_active').default(true).notNull(),
  isRegional: boolean('is_regional').default(false).notNull(), // Kerala/Tamil Nadu specific
  metadata: jsonb('metadata').$type<{
    platform?: string;
    hashtag?: string;
    videoId?: string;
    postId?: string;
    relatedKeywords?: string[];
    competitorMentions?: number;
    seasonal?: boolean;
    predictedEndDate?: string;
  }>(),
}, (table) => ({
  keywordIdx: index('trend_data_keyword_idx').on(table.keyword),
  sourceIdIdx: index('trend_data_source_id_idx').on(table.sourceId),
  categoryIdx: index('trend_data_category_idx').on(table.category),
  trendScoreIdx: index('trend_data_trend_score_idx').on(table.trendScore),
  isActiveIdx: index('trend_data_is_active_idx').on(table.isActive),
  isRegionalIdx: index('trend_data_is_regional_idx').on(table.isRegional),
  lastUpdatedIdx: index('trend_data_last_updated_idx').on(table.lastUpdated),
}));

// Trend history - track trend changes over time
export const trendHistory = pgTable('trend_history', {
  id: serial('id').primaryKey(),
  trendDataId: uuid('trend_data_id').references(() => trendData.id, { onDelete: 'cascade' }).notNull(),
  volume: integer('volume').notNull(),
  momentum: integer('momentum').default(0).notNull(),
  trendScore: real('trend_score').default(0).notNull(),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
}, (table) => ({
  trendDataIdIdx: index('trend_history_trend_data_id_idx').on(table.trendDataId),
  recordedAtIdx: index('trend_history_recorded_at_idx').on(table.recordedAt),
}));

// Competitor trend tracking
export const competitorTrends = pgTable('competitor_trends', {
  id: serial('id').primaryKey(),
  competitorHandle: text('competitor_handle').notNull(), // @username or channel name
  platform: text('platform').notNull(), // 'youtube', 'instagram', 'tiktok'
  trendKeyword: text('trend_keyword').notNull(),
  contentUrl: text('content_url'),
  engagement: integer('engagement').default(0), // Likes, views, etc.
  postedAt: timestamp('posted_at'),
  detectedAt: timestamp('detected_at').defaultNow().notNull(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
}, (table) => ({
  competitorHandleIdx: index('competitor_trends_competitor_handle_idx').on(table.competitorHandle),
  platformIdx: index('competitor_trends_platform_idx').on(table.platform),
  trendKeywordIdx: index('competitor_trends_trend_keyword_idx').on(table.trendKeyword),
}));

// Relations
export const trendSourcesRelations = relations(trendSources, ({ many }) => ({
  trendData: many(trendData),
}));

export const trendDataRelations = relations(trendData, ({ one, many }) => ({
  source: one(trendSources, {
    fields: [trendData.sourceId],
    references: [trendSources.id],
  }),
  history: many(trendHistory),
}));

export const trendHistoryRelations = relations(trendHistory, ({ one }) => ({
  trendData: one(trendData, {
    fields: [trendHistory.trendDataId],
    references: [trendData.id],
  }),
}));

// Database types
export type TrendSource = typeof trendSources.$inferSelect;
export type NewTrendSource = typeof trendSources.$inferInsert;

export type TrendData = typeof trendData.$inferSelect;
export type NewTrendData = typeof trendData.$inferInsert;

export type TrendHistory = typeof trendHistory.$inferSelect;
export type NewTrendHistory = typeof trendHistory.$inferInsert;

export type CompetitorTrend = typeof competitorTrends.$inferSelect;
export type NewCompetitorTrend = typeof competitorTrends.$inferInsert;

