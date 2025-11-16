import { pgTable, serial, text, timestamp, jsonb, integer, boolean, index, real } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { users } from './auth.js';

// AI usage logs table - track free model usage with zero cost
export const aiUsageLogs = pgTable('ai_usage_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  model: text('model').notNull(), // sarvam, groq, gemini, deepseek
  provider: text('provider').notNull(), // sarvam, groq, google, deepseek
  language: text('language').notNull(), // malayalam, english, tamil, hindi, etc.
  generationType: text('generation_type').notNull(), // reel_script, caption, blog, translation
  inputTokens: integer('input_tokens').default(0).notNull(),
  outputTokens: integer('output_tokens').default(0).notNull(),
  cost: real('cost').default(0).notNull(), // Always 0 for free models
  duration: integer('duration').default(0).notNull(), // milliseconds
  success: boolean('success').default(true).notNull(),
  error: text('error'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('ai_usage_logs_user_id_idx').on(table.userId),
  modelIdx: index('ai_usage_logs_model_idx').on(table.model),
  languageIdx: index('ai_usage_logs_language_idx').on(table.language),
  createdAtIdx: index('ai_usage_logs_created_at_idx').on(table.createdAt),
  userModelIdx: index('ai_usage_logs_user_model_idx').on(table.userId, table.model),
}));

// Trend cache table - store trending topics from YouTube/Instagram/Google Trends
export const trendCache = pgTable('trend_cache', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(), // youtube, instagram, google_trends
  region: text('region').notNull(), // IN, US, etc.
  language: text('language').notNull(), // malayalam, english, etc.
  category: text('category'), // technology, entertainment, etc.
  trends: jsonb('trends').$type<Array<{
    keyword: string;
    score: number;
    volume?: number;
    growth?: number;
    related?: string[];
  }>>().notNull(),
  cachedAt: timestamp('cached_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
}, (table) => ({
  platformIdx: index('trend_cache_platform_idx').on(table.platform),
  regionIdx: index('trend_cache_region_idx').on(table.region),
  languageIdx: index('trend_cache_language_idx').on(table.language),
  expiresAtIdx: index('trend_cache_expires_at_idx').on(table.expiresAt),
  platformRegionIdx: index('trend_cache_platform_region_idx').on(table.platform, table.region),
}));

// Voice cache table - cache TTS audio outputs
export const voiceCache = pgTable('voice_cache', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  language: text('language').notNull(), // malayalam, english, etc.
  voice: text('voice').notNull(), // voice model/name
  audioUrl: text('audio_url').notNull(), // URL to stored audio file
  audioPath: text('audio_path'), // Local file path
  duration: integer('duration'), // seconds
  fileSize: integer('file_size'), // bytes
  format: text('format').default('mp3').notNull(), // mp3, wav, etc.
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'), // Optional expiration
}, (table) => ({
  userIdIdx: index('voice_cache_user_id_idx').on(table.userId),
  languageIdx: index('voice_cache_language_idx').on(table.language),
  textHashIdx: index('voice_cache_text_hash_idx').on(sql`md5(${table.text})`),
  expiresAtIdx: index('voice_cache_expires_at_idx').on(table.expiresAt),
}));

// Relations
export const aiUsageLogsRelations = relations(aiUsageLogs, ({ one }) => ({
  user: one(users, {
    fields: [aiUsageLogs.userId],
    references: [users.id],
  }),
}));

export const voiceCacheRelations = relations(voiceCache, ({ one }) => ({
  user: one(users, {
    fields: [voiceCache.userId],
    references: [users.id],
  }),
}));

// Database types
export type AIUsageLog = typeof aiUsageLogs.$inferSelect;
export type NewAIUsageLog = typeof aiUsageLogs.$inferInsert;

export type TrendCache = typeof trendCache.$inferSelect;
export type NewTrendCache = typeof trendCache.$inferInsert;

export type VoiceCache = typeof voiceCache.$inferSelect;
export type NewVoiceCache = typeof voiceCache.$inferInsert;

