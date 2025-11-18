import { z } from 'zod';
// Zod schemas for runtime validation
export const NodeSchema = z.object({
    id: z.string(),
    type: z.string(),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
    data: z.record(z.string(), z.any()),
    width: z.number().optional(),
    height: z.number().optional(),
    selected: z.boolean().optional(),
    dragging: z.boolean().optional(),
    label: z.string().optional(),
    style: z.record(z.string(), z.any()).optional(),
});
export const EdgeSchema = z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string().optional(),
    targetHandle: z.string().optional(),
    type: z.string().optional(),
    animated: z.boolean().optional(),
    style: z.record(z.string(), z.any()).optional(),
    data: z.record(z.string(), z.any()).optional(),
    label: z.string().optional(),
});
export const WorkflowSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    userId: z.number(),
    nodes: z.array(NodeSchema),
    edges: z.array(EdgeSchema),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const ExecutionSchema = z.object({
    id: z.number(),
    workflowId: z.number(),
    status: z.enum(['pending', 'running', 'completed', 'failed']),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    error: z.string().nullable(),
    inputData: z.record(z.string(), z.any()).nullable(),
    outputData: z.record(z.string(), z.any()).nullable(),
    progress: z.object({
        currentNode: z.string().optional(),
        completedNodes: z.array(z.string()),
        totalNodes: z.number(),
        percentage: z.number(),
        nodeProgress: z.record(z.string(), z.object({
            status: z.string(),
            startedAt: z.string().optional(),
            completedAt: z.string().optional(),
        })),
    }).nullable(),
    createdAt: z.date(),
});
// Type guards
export const isNode = (value) => {
    return NodeSchema.safeParse(value).success;
};
export const isEdge = (value) => {
    return EdgeSchema.safeParse(value).success;
};
export const isWorkflow = (value) => {
    return WorkflowSchema.safeParse(value).success;
};
export const isExecution = (value) => {
    return ExecutionSchema.safeParse(value).success;
};
//# sourceMappingURL=database.js.map