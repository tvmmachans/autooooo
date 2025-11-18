import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and, or, sql, desc, asc, inArray, like, gte } from 'drizzle-orm';
import * as schema from './schema.js';
// Database connection configuration with pooling
const connectionString = process.env.DATABASE_URL;
// Check if connecting to Supabase (connection string contains 'supabase.co')
const isSupabase = connectionString.includes('supabase.co');
// Connection pooling configuration
const client = postgres(connectionString, {
    prepare: false,
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '10'), // Maximum pool size
    idle_timeout: parseInt(process.env.DB_IDLE_TIMEOUT || '20'), // Idle timeout in seconds
    connect_timeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '10'), // Connection timeout in seconds
    // Supabase requires SSL connections
    ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
    onnotice: () => { }, // Ignore notices
});
// Create the database instance
export const db = drizzle(client, { schema });
export * from './schema.js';
// Query utilities for common operations
export class DatabaseUtils {
    db;
    constructor(db) {
        this.db = db;
    }
    // User queries
    async getUserById(id) {
        return this.db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    }
    async getUserByEmail(email) {
        return this.db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    }
    async getActiveUsers() {
        return this.db.select().from(schema.users).where(eq(schema.users.isActive, true));
    }
    // Workflow queries
    async getWorkflowsByUserId(userId, activeOnly = true) {
        const conditions = [eq(schema.workflows.userId, userId)];
        if (activeOnly) {
            conditions.push(eq(schema.workflows.isActive, true));
        }
        return this.db.select().from(schema.workflows).where(and(...conditions));
    }
    async getWorkflowById(id) {
        return this.db.select().from(schema.workflows).where(eq(schema.workflows.id, id)).limit(1);
    }
    async searchWorkflows(userId, searchTerm) {
        return this.db.select().from(schema.workflows)
            .where(and(eq(schema.workflows.userId, userId), or(like(schema.workflows.name, `%${searchTerm}%`), like(schema.workflows.description, `%${searchTerm}%`))));
    }
    // Execution queries
    async getExecutionsByWorkflowId(workflowId, limit = 50) {
        return this.db.select()
            .from(schema.executions)
            .where(eq(schema.executions.workflowId, workflowId))
            .orderBy(desc(schema.executions.createdAt))
            .limit(limit);
    }
    async getExecutionById(id) {
        return this.db.select().from(schema.executions).where(eq(schema.executions.id, id)).limit(1);
    }
    async getExecutionsByStatus(status, limit = 100) {
        return this.db.select()
            .from(schema.executions)
            .where(eq(schema.executions.status, status))
            .orderBy(desc(schema.executions.createdAt))
            .limit(limit);
    }
    async getRecentExecutions(userId, days = 7) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return this.db.select({
            execution: schema.executions,
            workflow: schema.workflows,
        })
            .from(schema.executions)
            .innerJoin(schema.workflows, eq(schema.executions.workflowId, schema.workflows.id))
            .where(and(eq(schema.workflows.userId, userId), gte(schema.executions.createdAt, cutoffDate)))
            .orderBy(desc(schema.executions.createdAt));
    }
    // Execution logs queries
    async getExecutionLogs(executionId, limit = 1000) {
        return this.db.select()
            .from(schema.executionLogs)
            .where(eq(schema.executionLogs.executionId, executionId))
            .orderBy(asc(schema.executionLogs.timestamp))
            .limit(limit);
    }
    // Enhanced workflow queries for execution engine
    async findWorkflowsByNodeType(userId, nodeType) {
        return this.db.select()
            .from(schema.workflows)
            .where(and(eq(schema.workflows.userId, userId), eq(schema.workflows.isActive, true), sql `${schema.workflows.nodes}::jsonb @> ${JSON.stringify([{ type: nodeType }])}`));
    }
    async searchExecutionHistory(workflowId, conditions, limit = 100) {
        const whereConditions = [eq(schema.executions.workflowId, workflowId)];
        // Add JSON conditions for input/output data
        if (conditions.inputData) {
            whereConditions.push(sql `${schema.executions.inputData}::jsonb @> ${JSON.stringify(conditions.inputData)}`);
        }
        if (conditions.outputData) {
            whereConditions.push(sql `${schema.executions.outputData}::jsonb @> ${JSON.stringify(conditions.outputData)}`);
        }
        return this.db.select()
            .from(schema.executions)
            .where(and(...whereConditions))
            .orderBy(desc(schema.executions.createdAt))
            .limit(limit);
    }
    // Bulk operations for performance
    async bulkInsertExecutionLogs(logs) {
        return this.db.insert(schema.executionLogs).values(logs).returning();
    }
    async bulkUpdateExecutionStatus(executionIds, status) {
        return this.db.update(schema.executions)
            .set({ status })
            .where(inArray(schema.executions.id, executionIds))
            .returning();
    }
    // Optimized workflow loading with JSON selections
    async loadWorkflowWithNodes(workflowId) {
        return this.db.select({
            id: schema.workflows.id,
            name: schema.workflows.name,
            nodes: schema.workflows.nodes,
            edges: schema.workflows.edges,
            userId: schema.workflows.userId,
        })
            .from(schema.workflows)
            .where(and(eq(schema.workflows.id, workflowId), eq(schema.workflows.isActive, true)))
            .limit(1);
    }
    // Real-time execution monitoring
    async getActiveExecutions(limit = 50) {
        return this.db.select({
            execution: schema.executions,
            workflow: schema.workflows,
        })
            .from(schema.executions)
            .innerJoin(schema.workflows, eq(schema.executions.workflowId, schema.workflows.id))
            .where(and(eq(schema.executions.status, 'running'), eq(schema.workflows.isActive, true)))
            .orderBy(desc(schema.executions.startedAt))
            .limit(limit);
    }
    // Execution context queries
    async getExecutionContext(executionId) {
        const [execution] = await this.db.select({
            execution: schema.executions,
            workflow: schema.workflows,
        })
            .from(schema.executions)
            .innerJoin(schema.workflows, eq(schema.executions.workflowId, schema.workflows.id))
            .where(eq(schema.executions.id, executionId))
            .limit(1);
        return execution;
    }
    async getLogsByLevel(level, limit = 100) {
        return this.db.select({
            log: schema.executionLogs,
            execution: schema.executions,
            workflow: schema.workflows,
        })
            .from(schema.executionLogs)
            .innerJoin(schema.executions, eq(schema.executionLogs.executionId, schema.executions.id))
            .innerJoin(schema.workflows, eq(schema.executions.workflowId, schema.workflows.id))
            .where(eq(schema.executionLogs.level, level))
            .orderBy(desc(schema.executionLogs.timestamp))
            .limit(limit);
    }
    // Credentials queries
    async getCredentialsByUserId(userId) {
        return this.db.select().from(schema.credentials).where(eq(schema.credentials.userId, userId));
    }
    async getCredentialById(id) {
        return this.db.select().from(schema.credentials).where(eq(schema.credentials.id, id)).limit(1);
    }
    async getCredentialsByType(userId, type) {
        return this.db.select()
            .from(schema.credentials)
            .where(and(eq(schema.credentials.userId, userId), eq(schema.credentials.type, type)));
    }
    // Webhooks queries
    async getWebhooksByUserId(userId, activeOnly = true) {
        const conditions = [eq(schema.webhooks.userId, userId)];
        if (activeOnly) {
            conditions.push(eq(schema.webhooks.isActive, true));
        }
        return this.db.select().from(schema.webhooks).where(and(...conditions));
    }
    async getWebhookById(id) {
        return this.db.select().from(schema.webhooks).where(eq(schema.webhooks.id, id)).limit(1);
    }
    async getWebhooksByWorkflowId(workflowId) {
        return this.db.select()
            .from(schema.webhooks)
            .where(and(eq(schema.webhooks.workflowId, workflowId), eq(schema.webhooks.isActive, true)));
    }
    // Statistics queries
    async getWorkflowStats(userId) {
        const result = await this.db.select({
            totalWorkflows: sql `count(*)`,
            activeWorkflows: sql `count(case when ${schema.workflows.isActive} then 1 end)`,
        })
            .from(schema.workflows)
            .where(eq(schema.workflows.userId, userId));
        return result[0];
    }
    async getExecutionStats(workflowId) {
        const result = await this.db.select({
            totalExecutions: sql `count(*)`,
            successfulExecutions: sql `count(case when ${schema.executions.status} = 'completed' then 1 end)`,
            failedExecutions: sql `count(case when ${schema.executions.status} = 'failed' then 1 end)`,
            runningExecutions: sql `count(case when ${schema.executions.status} = 'running' then 1 end)`,
        })
            .from(schema.executions)
            .where(eq(schema.executions.workflowId, workflowId));
        return result[0];
    }
    async getSystemStats() {
        const [userStats] = await this.db.select({
            totalUsers: sql `count(*)`,
            activeUsers: sql `count(case when ${schema.users.isActive} then 1 end)`,
        }).from(schema.users);
        const [workflowStats] = await this.db.select({
            totalWorkflows: sql `count(*)`,
            activeWorkflows: sql `count(case when ${schema.workflows.isActive} then 1 end)`,
        }).from(schema.workflows);
        const [executionStats] = await this.db.select({
            totalExecutions: sql `count(*)`,
            completedExecutions: sql `count(case when ${schema.executions.status} = 'completed' then 1 end)`,
            failedExecutions: sql `count(case when ${schema.executions.status} = 'failed' then 1 end)`,
        }).from(schema.executions);
        return {
            users: userStats,
            workflows: workflowStats,
            executions: executionStats,
        };
    }
}
// Create and export database utilities instance
export const dbUtils = new DatabaseUtils(db);
// Transaction helper
export async function withTransaction(callback) {
    return await db.transaction(callback);
}
// Health check function
export async function checkDatabaseConnection() {
    try {
        await db.execute(sql `SELECT 1`);
        return true;
    }
    catch (error) {
        console.error('Database connection check failed:', error);
        return false;
    }
}
