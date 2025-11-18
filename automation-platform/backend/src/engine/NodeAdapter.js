import { createNode } from './nodes/BaseNode.js';
/**
 * Adapter class that bridges ExecutableNode interface with BaseNode implementations
 * This allows the WorkflowEngine to use BaseNode classes through the ExecutableNode interface
 */
export class NodeAdapter {
    nodeType;
    constructor(nodeType) {
        this.nodeType = nodeType;
    }
    /**
     * Execute method that implements the ExecutableNode interface
     * Creates a BaseNode instance and delegates execution to it
     */
    async execute(context, input) {
        try {
            // Create a BaseNode instance for this execution
            // Note: We need to generate a unique nodeId for this execution context
            // For now, we'll use a combination of executionId and nodeType
            const nodeId = `${this.nodeType}_${context.executionId}_${Date.now()}`;
            // Create node data - this would typically come from the workflow definition
            // For now, we'll use empty config
            const nodeData = {
                config: {},
                // Add other node data as needed
            };
            // Create the BaseNode instance
            const baseNode = createNode(this.nodeType, context, nodeId, nodeData);
            // Execute the node
            const result = await baseNode.execute(input);
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown execution error';
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
}
/**
 * Factory function to create node adapters for different node types
 */
export function createNodeAdapter(nodeType) {
    return new NodeAdapter(nodeType);
}
//# sourceMappingURL=NodeAdapter.js.map