import type { WorkflowExecutionContext } from '../database/schema.js';
import { BaseNode, createNode } from './nodes/BaseNode.js';

// Node execution result interface
interface NodeExecutionResult {
  success: boolean;
  output?: Record<string, any>;
  error?: string;
  nextNodeId?: string;
}

// Base node interface for execution
interface ExecutableNode {
  execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<NodeExecutionResult>;
}

/**
 * Adapter class that bridges ExecutableNode interface with BaseNode implementations
 * This allows the WorkflowEngine to use BaseNode classes through the ExecutableNode interface
 */
export class NodeAdapter implements ExecutableNode {
  private nodeType: string;

  constructor(nodeType: string) {
    this.nodeType = nodeType;
  }

  /**
   * Execute method that implements the ExecutableNode interface
   * Creates a BaseNode instance and delegates execution to it
   */
  async execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<NodeExecutionResult> {
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
    } catch (error) {
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
export function createNodeAdapter(nodeType: string): NodeAdapter {
  return new NodeAdapter(nodeType);
}
