import { pgTable, serial, text, timestamp, jsonb, integer, boolean, uuid, index, uniqueIndex, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
// Import auth schema
export * from './schema/auth.ts';
import { users, roles, userRoles, sessions, usersRelations as authUsersRelations, rolesRelations, userRolesRelations, sessionsRelations } from './schema/auth.ts';
// Import AI schema
export * from './schema/ai.ts';
// Import media schema
export * from './schema/media.ts';
// Import API schema
export * from './schema/api.ts';
// Import templates schema
export * from './schema/templates.ts';
// Import video schema
export * from './schema/video.ts';
// Import trends schema
export * from './schema/trends.ts';
// Import settings schema
export * from './schema/settings.ts';
// Workflow table with JSON columns for nodes/edges
export const workflows = pgTable('workflows', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    nodes: jsonb('nodes').$type().notNull(),
    edges: jsonb('edges').$type().notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('workflows_user_id_idx').on(table.userId),
    activeIdx: index('workflows_active_idx').on(table.isActive),
    nameIdx: index('workflows_name_idx').on(table.name),
}));
// Execution table with status tracking and progress
export const executions = pgTable('executions', {
    id: serial('id').primaryKey(),
    workflowId: integer('workflow_id').references(() => workflows.id, { onDelete: 'cascade' }).notNull(),
    status: text('status').default('pending').notNull(), // pending, running, completed, failed
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    error: text('error'),
    inputData: jsonb('input_data').$type(),
    outputData: jsonb('output_data').$type(),
    progress: jsonb('progress').$type(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    workflowIdIdx: index('executions_workflow_id_idx').on(table.workflowId),
    statusIdx: index('executions_status_idx').on(table.status),
    createdAtIdx: index('executions_created_at_idx').on(table.createdAt),
    statusCheck: check('executions_status_check', sql `${table.status} IN ('pending', 'running', 'completed', 'failed')`),
}));
// Execution logs table for real-time logging
export const executionLogs = pgTable('execution_logs', {
    id: serial('id').primaryKey(),
    executionId: integer('execution_id').references(() => executions.id, { onDelete: 'cascade' }).notNull(),
    level: text('level').notNull(), // info, warn, error
    message: text('message').notNull(),
    data: jsonb('data').$type(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
    executionIdIdx: index('execution_logs_execution_id_idx').on(table.executionId),
    levelIdx: index('execution_logs_level_idx').on(table.level),
    timestampIdx: index('execution_logs_timestamp_idx').on(table.timestamp),
    levelCheck: check('execution_logs_level_check', sql `${table.level} IN ('info', 'warn', 'error')`),
}));
// Credentials table with encrypted data
export const credentials = pgTable('credentials', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    type: text('type').notNull(), // api_key, oauth, basic_auth, etc.
    data: jsonb('data').$type().notNull(),
    isEncrypted: boolean('is_encrypted').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('credentials_user_id_idx').on(table.userId),
    typeIdx: index('credentials_type_idx').on(table.type),
    nameIdx: index('credentials_name_idx').on(table.name),
    userTypeIdx: index('credentials_user_type_idx').on(table.userId, table.type),
}));
// Webhooks table for incoming triggers
export const webhooks = pgTable('webhooks', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    workflowId: integer('workflow_id').references(() => workflows.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    secret: text('secret').notNull(),
    events: jsonb('events').$type().notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('webhooks_user_id_idx').on(table.userId),
    workflowIdIdx: index('webhooks_workflow_id_idx').on(table.workflowId),
    activeIdx: index('webhooks_active_idx').on(table.isActive),
    urlIdx: index('webhooks_url_idx').on(table.url),
}));
// Relations
export const usersRelations = relations(users, ({ many }) => ({
    workflows: many(workflows),
    credentials: many(credentials),
    webhooks: many(webhooks),
}));
export const workflowsRelations = relations(workflows, ({ one, many }) => ({
    user: one(users, {
        fields: [workflows.userId],
        references: [users.id],
    }),
    executions: many(executions),
    webhooks: many(webhooks),
}));
export const executionsRelations = relations(executions, ({ one, many }) => ({
    workflow: one(workflows, {
        fields: [executions.workflowId],
        references: [workflows.id],
    }),
    logs: many(executionLogs),
}));
export const executionLogsRelations = relations(executionLogs, ({ one }) => ({
    execution: one(executions, {
        fields: [executionLogs.executionId],
        references: [executions.id],
    }),
}));
export const credentialsRelations = relations(credentials, ({ one }) => ({
    user: one(users, {
        fields: [credentials.userId],
        references: [users.id],
    }),
}));
export const webhooksRelations = relations(webhooks, ({ one }) => ({
    user: one(users, {
        fields: [webhooks.userId],
        references: [users.id],
    }),
    workflow: one(workflows, {
        fields: [webhooks.workflowId],
        references: [workflows.id],
    }),
}));
