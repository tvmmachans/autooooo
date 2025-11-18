import type { WorkflowExecutionContext } from '../../database/schema.js';

// Node execution result interface
export interface NodeExecutionResult {
  success: boolean;
  output?: Record<string, any>;
  error?: string;
  nextNodeId?: string;
}

// Base node class with database-aware context management
export abstract class BaseNode {
  protected context: WorkflowExecutionContext;
  protected nodeId: string;
  protected nodeData: Record<string, any>;

  constructor(context: WorkflowExecutionContext, nodeId: string, nodeData: Record<string, any>) {
    this.context = context;
    this.nodeId = nodeId;
    this.nodeData = nodeData;
  }

  // Abstract method that must be implemented by concrete nodes
  abstract execute(input: Record<string, any>): Promise<NodeExecutionResult>;

  // Helper method to log execution steps with database batching
  protected log(level: 'info' | 'warn' | 'error', message: string, data?: Record<string, any>): void {
    // In the WorkflowEngine, logs are buffered and bulk inserted
    // This method can be used for immediate logging if needed
    console.log(`[${level.toUpperCase()}] ${this.nodeId}: ${message}`, data);
  }

  // Helper method to log to batch buffer (used by WorkflowEngine)
  protected logToBuffer(
    logBuffer: Array<{
      level: 'info' | 'warn' | 'error';
      message: string;
      data?: Record<string, any>;
      nodeId?: string;
    }>,
    level: 'info' | 'warn' | 'error',
    message: string,
    data?: Record<string, any>
  ): void {
    logBuffer.push({
      level,
      message,
      data: data || {},
      nodeId: this.nodeId,
    });
  }

  // Helper to get node configuration
  protected getConfig(): Record<string, any> {
    return this.nodeData.config || {};
  }

  // Helper to validate input data
  protected validateInput(input: Record<string, any>, requiredFields: string[]): { valid: boolean; error?: string } {
    for (const field of requiredFields) {
      if (!(field in input)) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }
    return { valid: true };
  }

  // Helper to set context variables
  protected setVariable(key: string, value: any): void {
    this.context.variables.set(key, value);
  }

  // Helper to get context variables
  protected getVariable(key: string): any {
    return this.context.variables.get(key);
  }

  // Helper to get previous node output
  protected getPreviousOutput(nodeId: string): any {
    const nodeState = this.context.nodeStates.get(nodeId);
    return nodeState?.output;
  }

  // Helper to update execution progress in database
  protected async updateProgress(progress: number, status?: string): Promise<void> {
    // This would update the execution record with progress information
    // Implementation depends on how progress is stored in the schema
    // For now, we'll use the existing JSON fields
    this.context.nodeStates.set(this.nodeId, {
      ...this.context.nodeStates.get(this.nodeId),
      progress,
      status,
    });
  }
}

// Factory function to create nodes by type
export function createNode(
  nodeType: string,
  context: WorkflowExecutionContext,
  nodeId: string,
  nodeData: Record<string, any>
): BaseNode {
  switch (nodeType) {
    case 'start':
      return new StartNode(context, nodeId, nodeData);
    case 'action':
      return new ActionNode(context, nodeId, nodeData);
    case 'condition':
      return new ConditionNode(context, nodeId, nodeData);
    case 'end':
      return new EndNode(context, nodeId, nodeData);
    default:
      throw new Error(`Unknown node type: ${nodeType}`);
  }
}

// Import concrete node implementations
// Moved to bottom to avoid circular dependency
import { StartNode } from './StartNode.js';
import { ActionNode } from './ActionNode.js';
import { ConditionNode } from './ConditionNode.js';
import { EndNode } from './EndNode.js';
