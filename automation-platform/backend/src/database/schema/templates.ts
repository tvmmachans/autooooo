import { pgTable, serial, text, timestamp, jsonb, integer, boolean, index, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth.js';
import { workflows } from '../schema.js';

// Workflow templates table
export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(), // ai_content, automation, social_media, etc.
  tags: jsonb('tags').$type<string[]>().default([]).notNull(),
  workflowData: jsonb('workflow_data').$type<{
    nodes: any[];
    edges: any[];
    variables?: Record<string, any>;
  }>().notNull(),
  createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }),
  isPublic: boolean('is_public').default(false).notNull(),
  isOfficial: boolean('is_official').default(false).notNull(), // Official platform templates
  usageCount: integer('usage_count').default(0).notNull(),
  rating: real('rating').default(0).notNull(), // Average rating 0-5
  ratingCount: integer('rating_count').default(0).notNull(),
  version: text('version').default('1.0.0').notNull(),
  compatibility: jsonb('compatibility').$type<{
    minVersion?: string;
    maxVersion?: string;
    requiredNodes?: string[];
  }>(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index('templates_category_idx').on(table.category),
  isPublicIdx: index('templates_is_public_idx').on(table.isPublic),
  isOfficialIdx: index('templates_is_official_idx').on(table.isOfficial),
  ratingIdx: index('templates_rating_idx').on(table.rating),
  createdAtIdx: index('templates_created_at_idx').on(table.createdAt),
}));

// Template usage tracking
export const templateUsage = pgTable('template_usage', {
  id: serial('id').primaryKey(),
  templateId: integer('template_id').references(() => templates.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  workflowId: integer('workflow_id').references(() => workflows.id, { onDelete: 'cascade' }),
  rating: integer('rating'), // 1-5 stars
  review: text('review'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  templateIdIdx: index('template_usage_template_id_idx').on(table.templateId),
  userIdIdx: index('template_usage_user_id_idx').on(table.userId),
  templateUserIdx: index('template_usage_template_user_idx').on(table.templateId, table.userId),
}));

// Relations
export const templatesRelations = relations(templates, ({ one, many }) => ({
  creator: one(users, {
    fields: [templates.createdBy],
    references: [users.id],
  }),
  usages: many(templateUsage),
}));

export const templateUsageRelations = relations(templateUsage, ({ one }) => ({
  template: one(templates, {
    fields: [templateUsage.templateId],
    references: [templates.id],
  }),
  user: one(users, {
    fields: [templateUsage.userId],
    references: [users.id],
  }),
  workflow: one(workflows, {
    fields: [templateUsage.workflowId],
    references: [workflows.id],
  }),
}));

// Database types
export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;

export type TemplateUsage = typeof templateUsage.$inferSelect;
export type NewTemplateUsage = typeof templateUsage.$inferInsert;

