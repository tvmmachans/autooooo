import { pgTable, serial, text, timestamp, jsonb, integer, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth.js';
// User settings table for personal preferences
export const userSettings = pgTable('user_settings', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
    profilePicture: text('profile_picture'), // URL or path to profile picture
    preferences: jsonb('preferences').$type(),
    twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
    twoFactorSecret: text('two_factor_secret'), // Encrypted TOTP secret
    twoFactorBackupCodes: jsonb('two_factor_backup_codes').$type(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: uniqueIndex('user_settings_user_id_idx').on(table.userId),
}));
// Workspace settings table
export const workspaceSettings = pgTable('workspace_settings', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(), // Workspace owner
    name: text('name').notNull(),
    description: text('description'),
    logo: text('logo'), // URL or path to logo
    settings: jsonb('settings').$type(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('workspace_settings_user_id_idx').on(table.userId),
}));
// API keys table with encryption
export const apiKeys = pgTable('api_keys', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    keyPrefix: text('key_prefix').notNull(), // First 8 chars for display
    keyHash: text('key_hash').notNull(), // Hashed full key
    scopes: jsonb('scopes').$type().notNull(), // Permissions
    lastUsedAt: timestamp('last_used_at'),
    expiresAt: timestamp('expires_at'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('api_keys_user_id_idx').on(table.userId),
    keyPrefixIdx: index('api_keys_key_prefix_idx').on(table.keyPrefix),
    activeIdx: index('api_keys_active_idx').on(table.isActive),
}));
// Integration tokens for social media platforms
export const integrationTokens = pgTable('integration_tokens', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    platform: text('platform').notNull(), // youtube, instagram, twitter, facebook, linkedin
    accessToken: text('access_token').notNull(), // Encrypted
    refreshToken: text('refresh_token'), // Encrypted
    tokenExpiresAt: timestamp('token_expires_at'),
    platformUserId: text('platform_user_id'),
    platformUsername: text('platform_username'),
    scopes: jsonb('scopes').$type(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('integration_tokens_user_id_idx').on(table.userId),
    platformIdx: index('integration_tokens_platform_idx').on(table.platform),
    userPlatformIdx: uniqueIndex('integration_tokens_user_platform_idx').on(table.userId, table.platform),
    activeIdx: index('integration_tokens_active_idx').on(table.isActive),
}));
// AI service configuration
export const aiServiceConfig = pgTable('ai_service_config', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    service: text('service').notNull(), // sarvam, groq, gemini, deepseek
    apiKey: text('api_key').notNull(), // Encrypted
    baseUrl: text('base_url'),
    defaultModel: text('default_model'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('ai_service_config_user_id_idx').on(table.userId),
    serviceIdx: index('ai_service_config_service_idx').on(table.service),
    userServiceIdx: uniqueIndex('ai_service_config_user_service_idx').on(table.userId, table.service),
    activeIdx: index('ai_service_config_active_idx').on(table.isActive),
}));
// Audit logs for security tracking
export const auditLogs = pgTable('audit_logs', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(), // login, logout, password_change, settings_update, etc.
    resource: text('resource'), // What was affected
    resourceId: integer('resource_id'),
    details: jsonb('details').$type(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    status: text('status').notNull().default('success'), // success, failed
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
    actionIdx: index('audit_logs_action_idx').on(table.action),
    resourceIdx: index('audit_logs_resource_idx').on(table.resource),
    createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
    statusIdx: index('audit_logs_status_idx').on(table.status),
}));
// Workflow preferences
export const workflowPreferences = pgTable('workflow_preferences', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
    preferences: jsonb('preferences').$type(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: uniqueIndex('workflow_preferences_user_id_idx').on(table.userId),
}));
// Relations
export const userSettingsRelations = relations(userSettings, ({ one }) => ({
    user: one(users, {
        fields: [userSettings.userId],
        references: [users.id],
    }),
}));
export const workspaceSettingsRelations = relations(workspaceSettings, ({ one }) => ({
    user: one(users, {
        fields: [workspaceSettings.userId],
        references: [users.id],
    }),
}));
export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
    user: one(users, {
        fields: [apiKeys.userId],
        references: [users.id],
    }),
}));
export const integrationTokensRelations = relations(integrationTokens, ({ one }) => ({
    user: one(users, {
        fields: [integrationTokens.userId],
        references: [users.id],
    }),
}));
export const aiServiceConfigRelations = relations(aiServiceConfig, ({ one }) => ({
    user: one(users, {
        fields: [aiServiceConfig.userId],
        references: [users.id],
    }),
}));
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
    user: one(users, {
        fields: [auditLogs.userId],
        references: [users.id],
    }),
}));
export const workflowPreferencesRelations = relations(workflowPreferences, ({ one }) => ({
    user: one(users, {
        fields: [workflowPreferences.userId],
        references: [users.id],
    }),
}));
//# sourceMappingURL=settings.js.map