import { db, dbUtils, withTransaction } from '../database/index.js';
import { workflows, executions, users } from '../database/schema.js';
import { eq, and, or, like, desc, asc, sql, inArray } from 'drizzle-orm';
import { executionService } from '../services/ExecutionService.js';
// Type-safe workflow CRUD operations using Drizzle query builder
export class WorkflowController {
    // Get all workflows for a user with optional filtering
    async getWorkflows(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { search, nodeType, activeOnly = 'true', page = '1', limit = '20', sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const offset = (pageNum - 1) * limitNum;
            const isActiveOnly = activeOnly === 'true';
            let conditions = [eq(workflows.userId, userId)];
            if (isActiveOnly) {
                conditions.push(eq(workflows.isActive, true));
            }
            // Search by name or description
            if (search && typeof search === 'string' && search.trim()) {
                conditions.push(or(like(workflows.name, `%${search}%`), like(workflows.description, `%${search}%`)));
            }
            // Filter by node type using JSON query
            if (nodeType) {
                conditions.push(sql `${workflows.nodes}::jsonb @> ${JSON.stringify([{ type: nodeType }])}`);
            }
            // Build sort order
            const sortColumn = sortBy === 'name' ? workflows.name :
                sortBy === 'createdAt' ? workflows.createdAt :
                    workflows.updatedAt;
            const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);
            // Execute query with pagination
            const workflowList = await db
                .select({
                id: workflows.id,
                name: workflows.name,
                description: workflows.description,
                isActive: workflows.isActive,
                createdAt: workflows.createdAt,
                updatedAt: workflows.updatedAt,
                nodeCount: sql `jsonb_array_length(${workflows.nodes})`,
                // Extract node types for filtering
                nodeTypes: sql `array_agg(distinct elem->>'type') filter (where elem->>'type' is not null)`,
            })
                .from(workflows)
                .where(and(...conditions))
                .groupBy(workflows.id, workflows.name, workflows.description, workflows.isActive, workflows.createdAt, workflows.updatedAt)
                .orderBy(orderBy)
                .limit(limitNum)
                .offset(offset);
            // Get total count for pagination
            const countResult = await db
                .select({ count: sql `count(*)` })
                .from(workflows)
                .where(and(...conditions));
            const count = countResult[0]?.count || 0;
            res.json({
                workflows: workflowList,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: count,
                    totalPages: Math.ceil(count / limitNum),
                },
            });
        }
        catch (error) {
            console.error('Error fetching workflows:', error);
            res.status(500).json({ error: 'Failed to fetch workflows' });
        }
    }
    // Get workflow by ID with full details
    async getWorkflowById(req, res) {
        try {
            const userId = req.user?.id;
            const workflowId = parseInt(req.params.id);
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const workflow = await db
                .select()
                .from(workflows)
                .where(and(eq(workflows.id, workflowId), eq(workflows.userId, userId)))
                .limit(1);
            if (!workflow.length) {
                return res.status(404).json({ error: 'Workflow not found' });
            }
            // Get execution stats
            const stats = await dbUtils.getExecutionStats(workflowId);
            res.json({
                ...workflow[0],
                stats,
            });
        }
        catch (error) {
            console.error('Error fetching workflow:', error);
            res.status(500).json({ error: 'Failed to fetch workflow' });
        }
    }
    // Create new workflow
    async createWorkflow(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { name, description, nodes, edges } = req.body;
            // Validate required fields
            if (!name || !nodes || !edges) {
                return res.status(400).json({ error: 'Name, nodes, and edges are required' });
            }
            // Validate nodes structure
            if (!Array.isArray(nodes) || nodes.length === 0) {
                return res.status(400).json({ error: 'At least one node is required' });
            }
            // Check for start node
            const hasStartNode = nodes.some((node) => node.type === 'start');
            if (!hasStartNode) {
                return res.status(400).json({ error: 'Workflow must have a start node' });
            }
            const newWorkflow = await db
                .insert(workflows)
                .values({
                name,
                description,
                userId,
                nodes,
                edges,
            })
                .returning();
            res.status(201).json(newWorkflow[0]);
        }
        catch (error) {
            console.error('Error creating workflow:', error);
            res.status(500).json({ error: 'Failed to create workflow' });
        }
    }
    // Update workflow
    async updateWorkflow(req, res) {
        try {
            const userId = req.user?.id;
            const workflowId = parseInt(req.params.id);
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { name, description, nodes, edges, isActive } = req.body;
            // Check if workflow exists and belongs to user
            const existingWorkflow = await db
                .select()
                .from(workflows)
                .where(and(eq(workflows.id, workflowId), eq(workflows.userId, userId)))
                .limit(1);
            if (!existingWorkflow.length) {
                return res.status(404).json({ error: 'Workflow not found' });
            }
            // Validate nodes if provided
            if (nodes && (!Array.isArray(nodes) || nodes.length === 0)) {
                return res.status(400).json({ error: 'At least one node is required' });
            }
            if (nodes) {
                const hasStartNode = nodes.some((node) => node.type === 'start');
                if (!hasStartNode) {
                    return res.status(400).json({ error: 'Workflow must have a start node' });
                }
            }
            const updatedWorkflow = await db
                .update(workflows)
                .set({
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(nodes && { nodes }),
                ...(edges && { edges }),
                ...(isActive !== undefined && { isActive }),
                updatedAt: new Date(),
            })
                .where(and(eq(workflows.id, workflowId), eq(workflows.userId, userId)))
                .returning();
            res.json(updatedWorkflow[0]);
        }
        catch (error) {
            console.error('Error updating workflow:', error);
            res.status(500).json({ error: 'Failed to update workflow' });
        }
    }
    // Delete workflow (soft delete by setting isActive to false)
    async deleteWorkflow(req, res) {
        try {
            const userId = req.user?.id;
            const workflowId = parseInt(req.params.id);
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            // Check if workflow exists and belongs to user
            const existingWorkflow = await db
                .select()
                .from(workflows)
                .where(and(eq(workflows.id, workflowId), eq(workflows.userId, userId)))
                .limit(1);
            if (!existingWorkflow.length) {
                return res.status(404).json({ error: 'Workflow not found' });
            }
            // Soft delete by setting isActive to false
            await db
                .update(workflows)
                .set({
                isActive: false,
                updatedAt: new Date(),
            })
                .where(and(eq(workflows.id, workflowId), eq(workflows.userId, userId)));
            res.json({ message: 'Workflow deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting workflow:', error);
            res.status(500).json({ error: 'Failed to delete workflow' });
        }
    }
    // Get executions for a workflow with pagination
    async getWorkflowExecutions(req, res) {
        try {
            const userId = req.user?.id;
            const workflowId = parseInt(req.params.id);
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            // Verify workflow ownership
            const workflow = await db
                .select()
                .from(workflows)
                .where(and(eq(workflows.id, workflowId), eq(workflows.userId, userId)))
                .limit(1);
            if (!workflow.length) {
                return res.status(404).json({ error: 'Workflow not found' });
            }
            const { status, page = '1', limit = '20', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const offset = (pageNum - 1) * limitNum;
            let conditions = [eq(executions.workflowId, workflowId)];
            // Filter by status
            if (status) {
                conditions.push(eq(executions.status, status));
            }
            // Build sort order
            const sortColumn = sortBy === 'startedAt' ? executions.startedAt :
                sortBy === 'completedAt' ? executions.completedAt :
                    executions.createdAt;
            const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);
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
                .limit(limitNum)
                .offset(offset);
            // Get total count
            const countResult = await db
                .select({ count: sql `count(*)` })
                .from(executions)
                .where(and(...conditions));
            const count = countResult[0]?.count || 0;
            res.json({
                executions: executionList,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: count,
                    totalPages: Math.ceil(count / limitNum),
                },
            });
        }
        catch (error) {
            console.error('Error fetching workflow executions:', error);
            res.status(500).json({ error: 'Failed to fetch executions' });
        }
    }
    // Advanced search workflows by node properties
    async searchWorkflowsByNodeProperties(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { nodeType, nodeData, page = '1', limit = '20' } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const offset = (pageNum - 1) * limitNum;
            let conditions = [eq(workflows.userId, userId), eq(workflows.isActive, true)];
            // Build JSON query for node properties
            if (nodeType || nodeData) {
                let jsonQuery = {};
                if (nodeType) {
                    jsonQuery = { ...jsonQuery, type: nodeType };
                }
                if (nodeData) {
                    // Parse nodeData as JSON if it's a string
                    const dataFilter = typeof nodeData === 'string' ? JSON.parse(nodeData) : nodeData;
                    jsonQuery = { ...jsonQuery, data: dataFilter };
                }
                conditions.push(sql `${workflows.nodes}::jsonb @> ${JSON.stringify([jsonQuery])}`);
            }
            const workflowList = await db
                .select({
                id: workflows.id,
                name: workflows.name,
                description: workflows.description,
                createdAt: workflows.createdAt,
                updatedAt: workflows.updatedAt,
                nodeCount: sql `jsonb_array_length(${workflows.nodes})`,
            })
                .from(workflows)
                .where(and(...conditions))
                .orderBy(desc(workflows.updatedAt))
                .limit(limitNum)
                .offset(offset);
            // Get total count
            const countResult = await db
                .select({ count: sql `count(*)` })
                .from(workflows)
                .where(and(...conditions));
            const count = countResult[0]?.count || 0;
            res.json({
                workflows: workflowList,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: count,
                    totalPages: Math.ceil(count / limitNum),
                },
            });
        }
        catch (error) {
            console.error('Error searching workflows by node properties:', error);
            res.status(500).json({ error: 'Failed to search workflows' });
        }
    }
    // Clone workflow
    async cloneWorkflow(req, res) {
        try {
            const userId = req.user?.id;
            const workflowId = parseInt(req.params.id);
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { name } = req.body;
            // Get original workflow
            const originalWorkflow = await db
                .select()
                .from(workflows)
                .where(and(eq(workflows.id, workflowId), eq(workflows.userId, userId)))
                .limit(1);
            if (!originalWorkflow.length) {
                return res.status(404).json({ error: 'Workflow not found' });
            }
            const workflow = originalWorkflow[0];
            // Create clone
            const clonedWorkflow = await db
                .insert(workflows)
                .values({
                name: name || `${workflow.name} (Copy)`,
                description: workflow.description,
                userId,
                nodes: workflow.nodes,
                edges: workflow.edges,
            })
                .returning();
            res.status(201).json(clonedWorkflow[0]);
        }
        catch (error) {
            console.error('Error cloning workflow:', error);
            res.status(500).json({ error: 'Failed to clone workflow' });
        }
    }
}
// Export singleton instance
export const workflowController = new WorkflowController();
//# sourceMappingURL=workflowController.js.map