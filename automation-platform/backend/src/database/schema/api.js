import { pgTable, serial, text, timestamp, jsonb, integer, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth.js';
// API keys table with permissions
export const apiKeys = pgTable('api_keys', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    keyHash: text('key_hash').notNull().unique(), // Hashed API key
    keyPrefix: text('key_prefix').notNull(), // First 8 chars for identification
    name: text('name').notNull(), // User-friendly name
    scopes: jsonb('scopes').$type().notNull(), // Permissions array
    rateLimit: integer('rate_limit').default(100).notNull(), // Requests per hour
    usageCount: integer('usage_count').default(0).notNull(),
    lastUsedAt: timestamp('last_used_at'),
    expiresAt: timestamp('expires_at'), // Optional expiration
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('api_keys_user_id_idx').on(table.userId),
    keyHashIdx: uniqueIndex('api_keys_key_hash_idx').on(table.keyHash),
    keyPrefixIdx: index('api_keys_key_prefix_idx').on(table.keyPrefix),
    isActiveIdx: index('api_keys_is_active_idx').on(table.isActive),
    expiresAtIdx: index('api_keys_expires_at_idx').on(table.expiresAt),
}));
// API usage logs for analytics
export const apiUsageLogs = pgTable('api_usage_logs', {
    id: serial('id').primaryKey(),
    apiKeyId: integer('api_key_id').references(() => apiKeys.id, { onDelete: 'cascade' }).notNull(),
    endpoint: text('endpoint').notNull(),
    method: text('method').notNull(),
    statusCode: integer('status_code').notNull(),
    responseTime: integer('response_time').notNull(), // milliseconds
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    apiKeyIdIdx: index('api_usage_logs_api_key_id_idx').on(table.apiKeyId),
    endpointIdx: index('api_usage_logs_endpoint_idx').on(table.endpoint),
    createdAtIdx: index('api_usage_logs_created_at_idx').on(table.createdAt),
}));
// Relations
export const apiKeysRelations = relations(apiKeys, ({ one, many }) => ({
    user: one(users, {
        fields: [apiKeys.userId],
        references: [users.id],
    }),
    usageLogs: many(apiUsageLogs),
}));
export const apiUsageLogsRelations = relations(apiUsageLogs, ({ one }) => ({
    apiKey: one(apiKeys, {
        fields: [apiUsageLogs.apiKeyId],
        references: [apiKeys.id],
    }),
}));
//# sourceMappingURL=api.js.map