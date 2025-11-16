import type { WorkflowExecutionContext } from '../database/schema.js';
interface NodeExecutionResult {
    success: boolean;
    output?: Record<string, any>;
    error?: string;
    nextNodeId?: string;
}
interface ExecutableNode {
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<NodeExecutionResult>;
}
/**
 * Adapter class that bridges ExecutableNode interface with BaseNode implementations
 * This allows the WorkflowEngine to use BaseNode classes through the ExecutableNode interface
 */
export declare class NodeAdapter implements ExecutableNode {
    private nodeType;
    constructor(nodeType: string);
    /**
     * Execute method that implements the ExecutableNode interface
     * Creates a BaseNode instance and delegates execution to it
     */
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<NodeExecutionResult>;
}
/**
 * Factory function to create node adapters for different node types
 */
export declare function createNodeAdapter(nodeType: string): NodeAdapter;
export {};
//# sourceMappingURL=NodeAdapter.d.ts.map