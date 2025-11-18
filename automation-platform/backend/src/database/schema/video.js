import { pgTable, serial, text, timestamp, jsonb, integer, index, real, bigint } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth.js';
import { mediaFiles } from './media.js';
// Videos table - stores generated video metadata
export const videos = pgTable('videos', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    workflowId: integer('workflow_id'), // Optional: link to workflow
    executionId: integer('execution_id'), // Optional: link to execution
    title: text('title').notNull(),
    description: text('description'),
    script: text('script'), // Original script used
    videoUrl: text('video_url').notNull(), // URL to video file
    videoPath: text('video_path'), // Local storage path
    thumbnailUrl: text('thumbnail_url'),
    duration: integer('duration'), // seconds
    fileSize: bigint('file_size', { mode: 'number' }), // bytes
    format: text('format').default('mp4').notNull(), // mp4, mov, etc.
    aspectRatio: text('aspect_ratio').default('9:16').notNull(), // 9:16, 16:9, 1:1
    resolution: jsonb('resolution').$type(),
    status: text('status').default('processing').notNull(), // processing, completed, failed
    platformConfig: jsonb('platform_config').$type(),
    metadata: jsonb('metadata').$type(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('videos_user_id_idx').on(table.userId),
    statusIdx: index('videos_status_idx').on(table.status),
    createdAtIdx: index('videos_created_at_idx').on(table.createdAt),
}));
// Video assets - links to media files used in video
export const videoAssets = pgTable('video_assets', {
    id: serial('id').primaryKey(),
    videoId: integer('video_id').references(() => videos.id, { onDelete: 'cascade' }).notNull(),
    mediaFileId: integer('media_file_id').references(() => mediaFiles.id, { onDelete: 'set null' }),
    assetType: text('asset_type').notNull(), // video, image, audio, stock_media
    source: text('source'), // local, pexels, unsplash, ai_generated
    sourceId: text('source_id'), // External source ID
    url: text('url').notNull(),
    startTime: real('start_time').default(0).notNull(), // When asset appears in video (seconds)
    duration: real('duration'), // How long asset is shown (seconds)
    position: jsonb('position').$type(), // Position in frame
    scale: real('scale').default(1.0), // Scale factor
    metadata: jsonb('metadata').$type(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    videoIdIdx: index('video_assets_video_id_idx').on(table.videoId),
    assetTypeIdx: index('video_assets_asset_type_idx').on(table.assetType),
}));
// Platform uploads - track video uploads to social platforms
export const platformUploads = pgTable('platform_uploads', {
    id: serial('id').primaryKey(),
    videoId: integer('video_id').references(() => videos.id, { onDelete: 'cascade' }).notNull(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    platform: text('platform').notNull(), // youtube, instagram, tiktok, facebook, linkedin
    platformVideoId: text('platform_video_id'), // ID on the platform
    platformUrl: text('platform_url'), // URL to published video
    status: text('status').default('pending').notNull(), // pending, uploading, published, failed
    error: text('error'),
    scheduledAt: timestamp('scheduled_at'), // When to publish
    publishedAt: timestamp('published_at'), // When actually published
    analytics: jsonb('analytics').$type(),
    metadata: jsonb('metadata').$type(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    videoIdIdx: index('platform_uploads_video_id_idx').on(table.videoId),
    userIdIdx: index('platform_uploads_user_id_idx').on(table.userId),
    platformIdx: index('platform_uploads_platform_idx').on(table.platform),
    statusIdx: index('platform_uploads_status_idx').on(table.status),
    platformVideoIdIdx: index('platform_uploads_platform_video_id_idx').on(table.platformVideoId),
}));
// Video analytics - performance tracking
export const videoAnalytics = pgTable('video_analytics', {
    id: serial('id').primaryKey(),
    videoId: integer('video_id').references(() => videos.id, { onDelete: 'cascade' }).notNull(),
    platformUploadId: integer('platform_upload_id').references(() => platformUploads.id, { onDelete: 'cascade' }),
    platform: text('platform').notNull(),
    date: timestamp('date').defaultNow().notNull(),
    views: integer('views').default(0).notNull(),
    likes: integer('likes').default(0).notNull(),
    comments: integer('comments').default(0).notNull(),
    shares: integer('shares').default(0).notNull(),
    watchTime: integer('watch_time').default(0).notNull(), // seconds
    engagementRate: real('engagement_rate').default(0).notNull(),
    metadata: jsonb('metadata').$type(),
}, (table) => ({
    videoIdIdx: index('video_analytics_video_id_idx').on(table.videoId),
    platformIdx: index('video_analytics_platform_idx').on(table.platform),
    dateIdx: index('video_analytics_date_idx').on(table.date),
}));
// Relations
export const videosRelations = relations(videos, ({ one, many }) => ({
    user: one(users, {
        fields: [videos.userId],
        references: [users.id],
    }),
    assets: many(videoAssets),
    platformUploads: many(platformUploads),
    analytics: many(videoAnalytics),
}));
export const videoAssetsRelations = relations(videoAssets, ({ one }) => ({
    video: one(videos, {
        fields: [videoAssets.videoId],
        references: [videos.id],
    }),
    mediaFile: one(mediaFiles, {
        fields: [videoAssets.mediaFileId],
        references: [mediaFiles.id],
    }),
}));
export const platformUploadsRelations = relations(platformUploads, ({ one, many }) => ({
    video: one(videos, {
        fields: [platformUploads.videoId],
        references: [videos.id],
    }),
    user: one(users, {
        fields: [platformUploads.userId],
        references: [users.id],
    }),
    analytics: many(videoAnalytics),
}));
export const videoAnalyticsRelations = relations(videoAnalytics, ({ one }) => ({
    video: one(videos, {
        fields: [videoAnalytics.videoId],
        references: [videos.id],
    }),
    platformUpload: one(platformUploads, {
        fields: [videoAnalytics.platformUploadId],
        references: [platformUploads.id],
    }),
}));
//# sourceMappingURL=video.js.map