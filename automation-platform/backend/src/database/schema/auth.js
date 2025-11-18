import { pgTable, serial, text, timestamp, integer, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
// Roles table with predefined permissions
export const roles = pgTable('roles', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(), // admin, user, viewer
    description: text('description'),
    permissions: text('permissions').array().notNull(), // JSON array of permission strings
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    nameIdx: uniqueIndex('roles_name_idx').on(table.name),
    activeIdx: index('roles_active_idx').on(table.isActive),
}));
// Enhanced users table
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    activeIdx: index('users_active_idx').on(table.isActive),
    emailVerifiedIdx: index('users_email_verified_idx').on(table.emailVerified),
}));
// User roles junction table
export const userRoles = pgTable('user_roles', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    roleId: integer('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
    assignedAt: timestamp('assigned_at').defaultNow().notNull(),
    assignedBy: integer('assigned_by').references(() => users.id), // Who assigned this role
}, (table) => ({
    userRoleIdx: uniqueIndex('user_roles_user_role_idx').on(table.userId, table.roleId),
    userIdIdx: index('user_roles_user_id_idx').on(table.userId),
    roleIdIdx: index('user_roles_role_id_idx').on(table.roleId),
}));
// Sessions table for refresh tokens
export const sessions = pgTable('sessions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    refreshToken: text('refresh_token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    userAgent: text('user_agent'),
    ipAddress: text('ip_address'),
    isActive: boolean('is_active').default(true).notNull(),
}, (table) => ({
    userIdIdx: index('sessions_user_id_idx').on(table.userId),
    refreshTokenIdx: uniqueIndex('sessions_refresh_token_idx').on(table.refreshToken),
    expiresAtIdx: index('sessions_expires_at_idx').on(table.expiresAt),
    activeIdx: index('sessions_active_idx').on(table.isActive),
}));
// Relations
export const usersRelations = relations(users, ({ many }) => ({
    userRoles: many(userRoles),
    sessions: many(sessions),
}));
export const rolesRelations = relations(roles, ({ many }) => ({
    userRoles: many(userRoles),
}));
export const userRolesRelations = relations(userRoles, ({ one }) => ({
    user: one(users, {
        fields: [userRoles.userId],
        references: [users.id],
    }),
    role: one(roles, {
        fields: [userRoles.roleId],
        references: [roles.id],
    }),
    assignedByUser: one(users, {
        fields: [userRoles.assignedBy],
        references: [users.id],
    }),
}));
export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));
// Permission constants
export const PERMISSIONS = {
    // Workflow permissions
    WORKFLOW_CREATE: 'workflow:create',
    WORKFLOW_READ: 'workflow:read',
    WORKFLOW_UPDATE: 'workflow:update',
    WORKFLOW_DELETE: 'workflow:delete',
    WORKFLOW_EXECUTE: 'workflow:execute',
    // Credential permissions
    CREDENTIAL_CREATE: 'credential:create',
    CREDENTIAL_READ: 'credential:read',
    CREDENTIAL_UPDATE: 'credential:update',
    CREDENTIAL_DELETE: 'credential:delete',
    // Execution permissions
    EXECUTION_READ: 'execution:read',
    EXECUTION_DELETE: 'execution:delete',
    // Admin permissions
    ADMIN_ALL: 'admin:all',
};
// Role definitions with default permissions
export const DEFAULT_ROLES = {
    ADMIN: {
        name: 'admin',
        description: 'Full system access',
        permissions: Object.values(PERMISSIONS),
    },
    USER: {
        name: 'user',
        description: 'Standard user with workflow access',
        permissions: [
            PERMISSIONS.WORKFLOW_CREATE,
            PERMISSIONS.WORKFLOW_READ,
            PERMISSIONS.WORKFLOW_UPDATE,
            PERMISSIONS.WORKFLOW_DELETE,
            PERMISSIONS.WORKFLOW_EXECUTE,
            PERMISSIONS.CREDENTIAL_CREATE,
            PERMISSIONS.CREDENTIAL_READ,
            PERMISSIONS.CREDENTIAL_UPDATE,
            PERMISSIONS.CREDENTIAL_DELETE,
            PERMISSIONS.EXECUTION_READ,
        ],
    },
    VIEWER: {
        name: 'viewer',
        description: 'Read-only access',
        permissions: [
            PERMISSIONS.WORKFLOW_READ,
            PERMISSIONS.CREDENTIAL_READ,
            PERMISSIONS.EXECUTION_READ,
        ],
    },
};
//# sourceMappingURL=auth.js.map