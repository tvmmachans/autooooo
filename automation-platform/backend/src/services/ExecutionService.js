import { db, dbUtils, withTransaction } from '../database/index.js';
import { executions, executionLogs, workflows } from '../database/schema.js';
import { eq, and, desc, asc, sql, inArray, gte, lte } from 'drizzle-orm';
import { workflowEngine } from '../engine/WorkflowEngine.js';
// Enhanced ExecutionService with bulk operations and real-time updates
export class ExecutionService {
    // Execute workflow with transaction support
    async executeWorkflow(workflowId, input, userId) {
        return await withTransaction(async (tx) => {
            // Create execution record
            const [execution] = await tx.insert(executions).values({
                workflowId,
                status: 'running',
                inputData: input,
                startedAt: new Date(),
                progress: null,
            }).returning();
            try {
                // Execute workflow using the engine
                const result = await workflowEngine.executeWorkflow(workflowId, {
                    trigger: 'manual',
                    data: input,
                });
                // Update execution with results
                await tx.update(executions)
                    .set({
                    status: result.success ? 'completed' : 'failed',
                    completedAt: new Date(),
                    outputData: result.data,
                    error: result.error,
                })
                    .where(eq(executions.id, execution.id));
                return {
                    executionId: execution.id,
                    success: result.success,
                    data: result.data,
                    error: result.error,
                };
            }
            catch (error) {
                // Handle execution failure
                const errorMessage = error instanceof Error ? error.message : 'Unknown execution error';
                await tx.update(executions)
                    .set({
                    status: 'failed',
                    completedAt: new Date(),
                    error: errorMessage,
                })
                    .where(eq(executions.id, execution.id));
                return {
                    executionId: execution.id,
                    success: false,
                    error: errorMessage,
                };
            }
        });
    }
    // Bulk execution log insertion for performance
    async bulkInsertLogs(executionId, logs) {
        if (!logs.length)
            return [];
        const logEntries = logs.map(log => ({
            executionId,
            level: log.level,
            message: log.message,
            data: log.data || {},
            timestamp: new Date(),
        }));
        return await db.insert(executionLogs).values(logEntries).returning();
    }
    // Real-time progress updates using Drizzle
    async updateExecutionProgress(executionId, progressUpdate) {
        const currentExecution = await db.select().from(executions).where(eq(executions.id, executionId)).limit(1);
        if (!currentExecution.length)
            return;
        const currentProgress = currentExecution[0].progress || {};
        const updatedProgress = {
            ...currentProgress,
            ...progressUpdate,
        };
        await db.update(executions)
            .set({ progress: updatedProgress })
            .where(eq(executions.id, executionId));
        return updatedProgress;
    }
    // Get execution with real-time status
    async getExecutionStatus(executionId) {
        const execution = await dbUtils.getExecutionById(executionId);
        if (!execution.length) {
            throw new Error(`Execution ${executionId} not found`);
        }
        const logs = await dbUtils.getExecutionLogs(executionId, 100);
        return {
            execution: execution[0],
            logs: logs.map(log => ({
                id: log.id,
                level: log.level,
                message: log.message,
                data: log.data,
                timestamp: log.timestamp,
                nodeId: log.data?.nodeId,
            })),
            progress: execution[0].progress,
        };
    }
    // Advanced execution history queries with filtering
    async searchExecutionHistory(workflowId, filters = {}) {
        const { status, dateFrom, dateTo, nodeId, inputData, outputData, page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
        const offset = (page - 1) * limit;
        let conditions = [eq(executions.workflowId, workflowId)];
        // Status filter
        if (status && status.length > 0) {
            conditions.push(inArray(executions.status, status));
        }
        // Date range filters
        if (dateFrom) {
            conditions.push(gte(executions.createdAt, dateFrom));
        }
        if (dateTo) {
            conditions.push(lte(executions.createdAt, dateTo));
        }
        // JSON-based filters for input/output data
        if (inputData) {
            conditions.push(sql `${executions.inputData}::jsonb @> ${JSON.stringify(inputData)}`);
        }
        if (outputData) {
            conditions.push(sql `${executions.outputData}::jsonb @> ${JSON.stringify(outputData)}`);
        }
        // Node-specific logs filter (using subquery)
        if (nodeId) {
            const executionIdsWithNode = await db
                .select({ executionId: executionLogs.executionId })
                .from(executionLogs)
                .where(and(eq(executionLogs.executionId, executions.id), sql `${executionLogs.data}::jsonb ->> 'nodeId' = ${nodeId}`));
            if (executionIdsWithNode.length > 0) {
                conditions.push(inArray(executions.id, executionIdsWithNode.map(e => e.executionId)));
            }
            else {
                // No executions found with this node, return empty
                return {
                    executions: [],
                    pagination: { page, limit, total: 0, totalPages: 0 },
                };
            }
        }
        // Build sort order
        const sortColumn = sortBy === 'startedAt' ? executions.startedAt :
            sortBy === 'completedAt' ? executions.completedAt :
                executions.createdAt;
        const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);
        // Execute query with pagination
        const executionList = await db
            .select({
            id: executions.id,
            status: executions.status,
            startedAt: executions.startedAt,
            completedAt: executions.completedAt,
            error: executions.error,
            inputData: executions.inputData,
            outputData: executions.outputData,
            progress: executions.progress,
            createdAt: executions.createdAt,
        })
            .from(executions)
            .where(and(...conditions))
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset);
        // Get total count
        const [{ count }] = await db
            .select({ count: sql `count(*)` })
            .from(executions)
            .where(and(...conditions));
        return {
            executions: executionList,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    }
    // Bulk operations for multiple executions
    async bulkUpdateExecutionStatus(executionIds, status) {
        return await db.update(executions)
            .set({ status })
            .where(inArray(executions.id, executionIds))
            .returning();
    }
    async bulkDeleteExecutions(executionIds, userId) {
        // First verify ownership through workflow relationship
        const executionsToDelete = await db
            .select({
            executionId: executions.id,
            workflowUserId: workflows.userId,
        })
            .from(executions)
            .innerJoin(workflows, eq(executions.workflowId, workflows.id))
            .where(and(inArray(executions.id, executionIds), eq(workflows.userId, userId)));
        const ownedExecutionIds = executionsToDelete.map(e => e.executionId);
        if (ownedExecutionIds.length === 0) {
            return { deletedCount: 0 };
        }
        // Delete execution logs first (cascade will handle this, but being explicit)
        await db.delete(executionLogs).where(inArray(executionLogs.executionId, ownedExecutionIds));
        // Delete executions
        const deletedExecutions = await db.delete(executions)
            .where(inArray(executions.id, ownedExecutionIds))
            .returning();
        return { deletedCount: deletedExecutions.length };
    }
    // JSON-based execution state management
    async updateExecutionState(executionId, stateUpdate) {
        const currentExecution = await db.select().from(executions).where(eq(executions.id, executionId)).limit(1);
        if (!currentExecution.length)
            return null;
        const currentState = currentExecution[0].progress || {};
        const updatedState = {
            ...currentState,
            ...stateUpdate,
            updatedAt: new Date().toISOString(),
        };
        return await db.update(executions)
            .set({ progress: updatedState })
            .where(eq(executions.id, executionId))
            .returning();
    }
    // Get execution logs with advanced filtering
    async getExecutionLogsAdvanced(executionId, filters = {}) {
        const { level, nodeId, dateFrom, dateTo, search, page = 1, limit = 100 } = filters;
        const offset = (page - 1) * limit;
        let conditions = [eq(executionLogs.executionId, executionId)];
        // Level filter
        if (level && level.length > 0) {
            conditions.push(inArray(executionLogs.level, level));
        }
        // Date range filters
        if (dateFrom) {
            conditions.push(gte(executionLogs.timestamp, dateFrom));
        }
        if (dateTo) {
            conditions.push(lte(executionLogs.timestamp, dateTo));
        }
        // Node ID filter using JSON path
        if (nodeId) {
            conditions.push(sql `${executionLogs.data}::jsonb ->> 'nodeId' = ${nodeId}`);
        }
        // Search in message
        if (search) {
            conditions.push(sql `LOWER(${executionLogs.message}) LIKE LOWER(${`%${search}%`})`);
        }
        // Execute query with pagination
        const logs = await db
            .select()
            .from(executionLogs)
            .where(and(...conditions))
            .orderBy(desc(executionLogs.timestamp))
            .limit(limit)
            .offset(offset);
        // Get total count
        const [{ count }] = await db
            .select({ count: sql `count(*)` })
            .from(executionLogs)
            .where(and(...conditions));
        return {
            logs,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    }
    // Performance monitoring and analytics
    async getExecutionMetrics(workflowId, timeRange) {
        const { from, to } = timeRange;
        const metrics = await db
            .select({
            totalExecutions: sql `count(*)`,
            successfulExecutions: sql `count(case when ${executions.status} = 'completed' then 1 end)`,
            failedExecutions: sql `count(case when ${executions.status} = 'failed' then 1 end)`,
            runningExecutions: sql `count(case when ${executions.status} = 'running' then 1 end)`,
            avgExecutionTime: sql `avg(extract(epoch from (${executions.completedAt} - ${executions.startedAt})))`,
            minExecutionTime: sql `min(extract(epoch from (${executions.completedAt} - ${executions.startedAt})))`,
            maxExecutionTime: sql `max(extract(epoch from (${executions.completedAt} - ${executions.startedAt})))`,
        })
            .from(executions)
            .where(and(eq(executions.workflowId, workflowId), gte(executions.createdAt, from), lte(executions.createdAt, to)));
        return metrics[0];
    }
    // Real-time execution monitoring for dashboard
    async getActiveExecutionsWithDetails(limit = 50) {
        return await db
            .select({
            execution: {
                id: executions.id,
                status: executions.status,
                startedAt: executions.startedAt,
                progress: executions.progress,
                createdAt: executions.createdAt,
            },
            workflow: {
                id: workflows.id,
                name: workflows.name,
            },
            recentLogs: sql `(
          select json_agg(
            json_build_object(
              'level', el.level,
              'message', el.message,
              'timestamp', el.timestamp,
              'nodeId', el.data->>'nodeId'
            ) order by el.timestamp desc
          ) from execution_logs el
          where el.execution_id = executions.id
          limit 5
        )`,
        })
            .from(executions)
            .innerJoin(workflows, eq(executions.workflowId, workflows.id))
            .where(and(eq(executions.status, 'running'), eq(workflows.isActive, true)))
            .orderBy(desc(executions.startedAt))
            .limit(limit);
    }
    // Cleanup old execution data (for maintenance)
    async cleanupOldExecutions(olderThanDays, userId) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
        // Get execution IDs to delete (only for user's workflows)
        const executionsToDelete = await db
            .select({ id: executions.id })
            .from(executions)
            .innerJoin(workflows, eq(executions.workflowId, workflows.id))
            .where(and(eq(workflows.userId, userId), lte(executions.createdAt, cutoffDate)));
        if (executionsToDelete.length === 0) {
            return { deletedCount: 0 };
        }
        const executionIds = executionsToDelete.map(e => e.id);
        // Delete in transaction for safety
        return await withTransaction(async (tx) => {
            // Delete logs first
            await tx.delete(executionLogs).where(inArray(executionLogs.executionId, executionIds));
            // Delete executions
            const deleted = await tx.delete(executions).where(inArray(executions.id, executionIds)).returning();
            return { deletedCount: deleted.length };
        });
    }
}
// Export singleton instance
export const executionService = new ExecutionService();
//# sourceMappingURL=ExecutionService.js.map