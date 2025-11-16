import { db, dbUtils, withTransaction } from '../database/index.js';
import { executions, executionLogs, workflows } from '../database/schema.js';
import { eq, and } from 'drizzle-orm';
import { createNodeAdapter } from './NodeAdapter.js';
// Workflow execution engine optimized for Drizzle
export class WorkflowEngine {
    nodeRegistry = new Map();
    constructor() {
        // Register core node types using adapters
        this.registerNode('start', createNodeAdapter('start'));
        this.registerNode('action', createNodeAdapter('action'));
        this.registerNode('condition', createNodeAdapter('condition'));
        this.registerNode('end', createNodeAdapter('end'));
    }
    // Register a node type for execution
    registerNode(nodeType, node) {
        this.nodeRegistry.set(nodeType, node);
    }
    // Execute a workflow with full transaction support
    async executeWorkflow(workflowId, input) {
        return await withTransaction(async (tx) => {
            // 1. Load workflow with optimized JSON query
            const workflowData = await tx.select({
                id: workflows.id,
                name: workflows.name,
                nodes: workflows.nodes,
                edges: workflows.edges,
                userId: workflows.userId,
            })
                .from(workflows)
                .where(and(eq(workflows.id, workflowId), eq(workflows.isActive, true)))
                .limit(1);
            if (!workflowData.length) {
                throw new Error(`Workflow ${workflowId} not found or inactive`);
            }
            const workflow = workflowData[0];
            // 2. Create execution record with progress tracking
            const [execution] = await tx.insert(executions).values({
                workflowId,
                status: 'running',
                inputData: input.data || {},
                startedAt: new Date(),
                progress: {
                    currentNode: undefined,
                    completedNodes: [],
                    totalNodes: workflow.nodes.length,
                    percentage: 0,
                    nodeProgress: {},
                },
            }).returning();
            const executionId = execution.id;
            // 3. Initialize execution context
            const context = {
                executionId,
                workflowId,
                userId: workflow.userId,
                inputData: input.data || {},
                nodeStates: new Map(),
                variables: new Map(),
                startTime: new Date(),
            };
            // 4. Execute workflow with batch logging
            const logBuffer = [];
            try {
                const result = await this.executeWorkflowNodes(workflow.nodes, workflow.edges, context, logBuffer);
                // 5. Update execution status
                await tx.update(executions)
                    .set({
                    status: result.success ? 'completed' : 'failed',
                    completedAt: new Date(),
                    outputData: result.output,
                    error: result.error,
                })
                    .where(eq(executions.id, executionId));
                // 6. Bulk insert logs for performance
                if (logBuffer.length > 0) {
                    const logEntries = logBuffer.map(log => ({
                        executionId,
                        level: log.level,
                        message: log.message,
                        data: log.data || {},
                        timestamp: new Date(),
                    }));
                    await tx.insert(executionLogs).values(logEntries);
                }
                return {
                    success: result.success,
                    data: result.output,
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
                    .where(eq(executions.id, executionId));
                // Log the error
                await tx.insert(executionLogs).values({
                    executionId,
                    level: 'error',
                    message: `Workflow execution failed: ${errorMessage}`,
                    data: { error: errorMessage },
                    timestamp: new Date(),
                });
                return {
                    success: false,
                    error: errorMessage,
                };
            }
        });
    }
    // Execute workflow nodes following the edge connections
    async executeWorkflowNodes(nodes, edges, context, logBuffer) {
        // Find start node
        const startNode = nodes.find(node => node.type === 'start');
        if (!startNode) {
            throw new Error('No start node found in workflow');
        }
        let currentNodeId = startNode.id;
        let currentInput = context.inputData;
        const visitedNodes = new Set();
        // Execute nodes in sequence following edges
        while (currentNodeId && !visitedNodes.has(currentNodeId)) {
            visitedNodes.add(currentNodeId);
            const currentNode = nodes.find(node => node.id === currentNodeId);
            if (!currentNode) {
                throw new Error(`Node ${currentNodeId} not found`);
            }
            // Update progress: set current node
            await this.updateExecutionProgress(context.executionId, {
                currentNode: currentNodeId,
                nodeProgress: {
                    ...context.nodeStates.get('progress')?.nodeProgress || {},
                    [currentNodeId]: { status: 'running', startedAt: new Date().toISOString() },
                },
            });
            // Log node execution start
            logBuffer.push({
                level: 'info',
                message: `Executing node: ${currentNode.type}`,
                nodeId: currentNodeId,
                data: { nodeType: currentNode.type, input: currentInput },
            });
            // Execute the node
            const nodeExecutor = this.nodeRegistry.get(currentNode.type);
            if (!nodeExecutor) {
                throw new Error(`No executor registered for node type: ${currentNode.type}`);
            }
            const result = await nodeExecutor.execute(context, currentInput);
            // Update progress: mark node as completed/failed
            const nodeStatus = result.success ? 'completed' : 'failed';
            const completedNodes = result.success ? [...(context.nodeStates.get('progress')?.completedNodes || []), currentNodeId] : (context.nodeStates.get('progress')?.completedNodes || []);
            const percentage = Math.round((completedNodes.length / nodes.length) * 100);
            await this.updateExecutionProgress(context.executionId, {
                currentNode: result.success ? undefined : currentNodeId,
                completedNodes,
                percentage,
                nodeProgress: {
                    ...context.nodeStates.get('progress')?.nodeProgress || {},
                    [currentNodeId]: {
                        status: nodeStatus,
                        startedAt: context.nodeStates.get('progress')?.nodeProgress?.[currentNodeId]?.startedAt,
                        completedAt: new Date().toISOString(),
                    },
                },
            });
            // Log node execution result
            logBuffer.push({
                level: result.success ? 'info' : 'error',
                message: `Node ${currentNode.type} ${result.success ? 'completed' : 'failed'}`,
                nodeId: currentNodeId,
                data: {
                    success: result.success,
                    output: result.output,
                    error: result.error,
                },
            });
            if (!result.success) {
                return result;
            }
            // Update context with node output
            context.nodeStates.set(currentNodeId, result);
            // Determine next node from edges
            if (result.nextNodeId) {
                currentNodeId = result.nextNodeId;
                currentInput = result.output || {};
            }
            else {
                // Find next node from edges
                const outgoingEdges = edges.filter(edge => edge.source === currentNodeId);
                if (outgoingEdges.length === 0) {
                    // End of workflow
                    break;
                }
                else if (outgoingEdges.length === 1) {
                    currentNodeId = outgoingEdges[0].target;
                    currentInput = result.output || {};
                }
                else {
                    // Multiple paths - for now, take the first one
                    // In a real implementation, this would depend on conditions
                    currentNodeId = outgoingEdges[0].target;
                    currentInput = result.output || {};
                }
            }
            // Prevent infinite loops
            if (visitedNodes.size > nodes.length * 2) {
                throw new Error('Potential infinite loop detected in workflow execution');
            }
        }
        return {
            success: true,
            output: context.nodeStates.get(currentNodeId)?.output || {},
        };
    }
    // Get execution status with real-time monitoring
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
    // Bulk operations for performance monitoring
    async getActiveExecutions(limit = 50) {
        return dbUtils.getActiveExecutions(limit);
    }
    // Search executions with JSON conditions
    async searchExecutions(workflowId, conditions, limit = 100) {
        return dbUtils.searchExecutionHistory(workflowId, conditions, limit);
    }
    // Update execution progress in database
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
    }
}
// Export singleton instance
export const workflowEngine = new WorkflowEngine();
//# sourceMappingURL=WorkflowEngine.js.map