import { pgTable, serial, text, timestamp, jsonb, integer, boolean, index, bigint } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth.js';
// Media files table with metadata
export const mediaFiles = pgTable('media_files', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    filename: text('filename').notNull(),
    originalFilename: text('original_filename').notNull(),
    mimeType: text('mime_type').notNull(),
    fileSize: bigint('file_size', { mode: 'number' }).notNull(), // bytes
    storagePath: text('storage_path').notNull(), // Local or S3 path
    storageType: text('storage_type').default('local').notNull(), // local, s3
    url: text('url').notNull(), // Public URL
    thumbnailUrl: text('thumbnail_url'), // Thumbnail URL for images/videos
    width: integer('width'), // For images/videos
    height: integer('height'), // For images/videos
    duration: integer('duration'), // For videos/audio in seconds
    platformOptimizations: jsonb('platform_optimizations').$type(), // Optimized versions for different platforms
    metadata: jsonb('metadata').$type(),
    isPublic: boolean('is_public').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('media_files_user_id_idx').on(table.userId),
    mimeTypeIdx: index('media_files_mime_type_idx').on(table.mimeType),
    createdAtIdx: index('media_files_created_at_idx').on(table.createdAt),
    storageTypeIdx: index('media_files_storage_type_idx').on(table.storageType),
}));
// Relations
export const mediaFilesRelations = relations(mediaFiles, ({ one }) => ({
    user: one(users, {
        fields: [mediaFiles.userId],
        references: [users.id],
    }),
}));
//# sourceMappingURL=media.js.map