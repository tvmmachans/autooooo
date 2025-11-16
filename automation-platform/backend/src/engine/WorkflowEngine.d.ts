import type { Node, Edge, WorkflowExecutionContext, ExecutionInput, ExecutionOutput } from '../database/schema.js';
interface NodeExecutionResult {
    success: boolean;
    output?: Record<string, any>;
    error?: string;
    nextNodeId?: string;
}
interface ExecutableNode {
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<NodeExecutionResult>;
}
export declare class WorkflowEngine {
    private nodeRegistry;
    constructor();
    registerNode(nodeType: string, node: ExecutableNode): void;
    executeWorkflow(workflowId: number, input: ExecutionInput): Promise<ExecutionOutput>;
    private executeWorkflowNodes;
    getExecutionStatus(executionId: number): Promise<{
        execution: {
            id: number;
            workflowId: number;
            status: string;
            startedAt: Date | null;
            completedAt: Date | null;
            error: string | null;
            inputData: Record<string, any> | null;
            outputData: Record<string, any> | null;
            progress: {
                currentNode?: string;
                completedNodes: string[];
                totalNodes: number;
                percentage: number;
                nodeProgress: Record<string, {
                    status: string;
                    startedAt?: string;
                    completedAt?: string;
                }>;
            } | null;
            createdAt: Date;
        } | undefined;
        logs: {
            id: number;
            level: string;
            message: string;
            data: Record<string, any> | null;
            timestamp: Date;
            nodeId: any;
        }[];
        progress: {
            currentNode?: string;
            completedNodes: string[];
            totalNodes: number;
            percentage: number;
            nodeProgress: Record<string, {
                status: string;
                startedAt?: string;
                completedAt?: string;
            }>;
        } | null;
    }>;
    getActiveExecutions(limit?: number): Promise<{
        execution: {
            id: number;
            workflowId: number;
            status: string;
            startedAt: Date | null;
            completedAt: Date | null;
            error: string | null;
            inputData: Record<string, any> | null;
            outputData: Record<string, any> | null;
            progress: {
                currentNode?: string;
                completedNodes: string[];
                totalNodes: number;
                percentage: number;
                nodeProgress: Record<string, {
                    status: string;
                    startedAt?: string;
                    completedAt?: string;
                }>;
            } | null;
            createdAt: Date;
        };
        workflow: {
            id: number;
            name: string;
            description: string | null;
            userId: number;
            nodes: Node[];
            edges: Edge[];
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }[]>;
    searchExecutions(workflowId: number, conditions: Record<string, any>, limit?: number): Promise<{
        id: number;
        workflowId: number;
        status: string;
        startedAt: Date | null;
        completedAt: Date | null;
        error: string | null;
        inputData: Record<string, any> | null;
        outputData: Record<string, any> | null;
        progress: {
            currentNode?: string;
            completedNodes: string[];
            totalNodes: number;
            percentage: number;
            nodeProgress: Record<string, {
                status: string;
                startedAt?: string;
                completedAt?: string;
            }>;
        } | null;
        createdAt: Date;
    }[]>;
    private updateExecutionProgress;
}
export declare const workflowEngine: WorkflowEngine;
export {};
//# sourceMappingURL=WorkflowEngine.d.ts.map