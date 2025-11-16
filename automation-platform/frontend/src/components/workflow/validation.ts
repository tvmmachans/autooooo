import { z } from 'zod';
import type { WorkflowNode, Edge } from './types.js';
import { NodeType } from './types.js';
import type { Workflow, Node, Edge as WorkflowEdge } from '../types/database.js';
import { WorkflowSchema, NodeSchema, EdgeSchema } from '../types/database.js';
import {
  validateNodeConfig,
  validateConnection,
  CONNECTION_RULES,
  WorkflowNodeSchema
} from './types.js';

// Enhanced workflow validation with Drizzle schema integration
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: 'node' | 'connection' | 'workflow' | 'schema';
  nodeId?: string;
  edgeId?: string;
  message: string;
  field?: string;
}

export interface ValidationWarning {
  type: 'node' | 'connection' | 'workflow';
  nodeId?: string;
  edgeId?: string;
  message: string;
}

// Validate workflow against Drizzle schema
export const validateWorkflowSchema = (workflow: Partial<Workflow>): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate workflow structure
  const workflowResult = WorkflowSchema.safeParse(workflow);
  if (!workflowResult.success) {
    workflowResult.error.errors.forEach(error => {
      errors.push({
        type: 'schema',
        message: `Workflow ${error.path.join('.')}: ${error.message}`,
        field: error.path.join('.')
      });
    });
  }

  // Validate nodes array
  if (workflow.nodes) {
    workflow.nodes.forEach((node, index) => {
      const nodeResult = NodeSchema.safeParse(node);
      if (!nodeResult.success) {
        nodeResult.error.errors.forEach(error => {
          errors.push({
            type: 'node',
            nodeId: node.id,
            message: `Node ${index} ${error.path.join('.')}: ${error.message}`,
            field: error.path.join('.')
          });
        });
      }
    });
  }

  // Validate edges array
  if (workflow.edges) {
    workflow.edges.forEach((edge, index) => {
      const edgeResult = EdgeSchema.safeParse(edge);
      if (!edgeResult.success) {
        edgeResult.error.errors.forEach(error => {
          errors.push({
            type: 'connection',
            edgeId: edge.id,
            message: `Edge ${index} ${error.path.join('.')}: ${error.message}`,
            field: error.path.join('.')
          });
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate individual node configuration with enhanced type checking
export const validateWorkflowNode = (node: WorkflowNode): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate node structure against WorkflowNodeSchema
  const nodeResult = WorkflowNodeSchema.safeParse(node);
  if (!nodeResult.success) {
    nodeResult.error.errors.forEach(error => {
      errors.push({
        type: 'node',
        nodeId: node.id,
        message: `Node validation: ${error.path.join('.')}: ${error.message}`,
        field: error.path.join('.')
      });
    });
  }

  // Validate node-specific configuration
  const configErrors = validateNodeConfig(node);
  configErrors.forEach(error => {
    errors.push({
      type: 'node',
      nodeId: node.id,
      message: error,
      field: 'config'
    });
  });

  // Node-specific validations
  switch (node.type) {
    case NodeType.START:
      if ((node.data.config as any).trigger === 'webhook' && !(node.data.config as any).variables?.webhookUrl) {
        warnings.push({
          type: 'node',
          nodeId: node.id,
          message: 'Webhook trigger should have webhookUrl in variables'
        });
      }
      break;

    case NodeType.ACTION:
      if ((node.data.config as any).actionType === 'http' && (node.data.config as any).httpConfig) {
        const httpConfig = (node.data.config as any).httpConfig;
        if (httpConfig.timeout && httpConfig.timeout > 30000) {
          warnings.push({
            type: 'node',
            nodeId: node.id,
            message: 'HTTP timeout exceeds 30 seconds, consider reducing'
          });
        }
      }
      break;

    case NodeType.CONDITION:
      if ((node.data.config as any).conditions?.length === 0) {
        errors.push({
          type: 'node',
          nodeId: node.id,
          message: 'Condition node must have at least one condition',
          field: 'config.conditions'
        });
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate connections between nodes with type safety
export const validateWorkflowConnections = (
  nodes: WorkflowNode[],
  edges: Edge[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Create node map for quick lookup
  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  // Validate each connection
  edges.forEach(edge => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    if (!sourceNode) {
      errors.push({
        type: 'connection',
        edgeId: edge.id,
        message: `Source node ${edge.source} does not exist`,
      });
      return;
    }

    if (!targetNode) {
      errors.push({
        type: 'connection',
        edgeId: edge.id,
        message: `Target node ${edge.target} does not exist`,
      });
      return;
    }

    // Use existing connection validation
    const connectionResult = validateConnection(sourceNode, targetNode, edges);
    if (!connectionResult.valid) {
      errors.push({
        type: 'connection',
        edgeId: edge.id,
        message: connectionResult.error || 'Invalid connection',
      });
    }
  });

  // Check for orphaned nodes
  const connectedNodeIds = new Set([
    ...edges.map(edge => edge.source),
    ...edges.map(edge => edge.target)
  ]);

  nodes.forEach(node => {
    if (!connectedNodeIds.has(node.id) && node.type !== NodeType.START) {
      warnings.push({
        type: 'node',
        nodeId: node.id,
        message: 'Node is not connected to the workflow'
      });
    }
  });

  // Check for cycles (basic cycle detection)
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    errors.push({
      type: 'workflow',
      message: 'Workflow contains cycles which are not allowed'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate complete workflow with all components
export const validateCompleteWorkflow = (
  workflow: Partial<Workflow>,
  enhancedNodes?: WorkflowNode[]
): ValidationResult => {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  // Schema validation
  const schemaResult = validateWorkflowSchema(workflow);
  allErrors.push(...schemaResult.errors);
  allWarnings.push(...schemaResult.warnings);

  // Enhanced node validation if provided
  if (enhancedNodes) {
    enhancedNodes.forEach(node => {
      const nodeResult = validateWorkflowNode(node);
      allErrors.push(...nodeResult.errors);
      allWarnings.push(...nodeResult.warnings);
    });

    // Connection validation
    if (workflow.edges) {
      const connectionResult = validateWorkflowConnections(enhancedNodes, workflow.edges);
      allErrors.push(...connectionResult.errors);
      allWarnings.push(...connectionResult.warnings);
    }
  }

  // Workflow-level validations
  if (!workflow.name?.trim()) {
    allErrors.push({
      type: 'workflow',
      message: 'Workflow name is required',
      field: 'name'
    });
  }

  if (!workflow.nodes || workflow.nodes.length === 0) {
    allErrors.push({
      type: 'workflow',
      message: 'Workflow must contain at least one node'
    });
  } else {
    // Check for start node
    const hasStartNode = workflow.nodes.some(node => node.type === 'start');
    if (!hasStartNode) {
      allErrors.push({
        type: 'workflow',
        message: 'Workflow must have exactly one start node'
      });
    }

    // Check for end node
    const hasEndNode = workflow.nodes.some(node => node.type === 'end');
    if (!hasEndNode) {
      allErrors.push({
        type: 'workflow',
        message: 'Workflow must have at least one end node'
      });
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};

// Helper function to detect cycles in workflow
const detectCycle = (nodes: WorkflowNode[], edges: Edge[]): boolean => {
  const adjList = new Map<string, string[]>();
  const visited = new Set<string>();
  const recStack = new Set<string>();

  // Build adjacency list
  edges.forEach(edge => {
    if (!adjList.has(edge.source)) {
      adjList.set(edge.source, []);
    }
    adjList.get(edge.source)!.push(edge.target);
  });

  // DFS to detect cycle
  const hasCycleDFS = (nodeId: string): boolean => {
    if (recStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = adjList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (hasCycleDFS(neighbor)) return true;
    }

    recStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id) && hasCycleDFS(node.id)) {
      return true;
    }
  }

  return false;
};

// Type-safe validation helpers
export const isValidWorkflow = (workflow: any): workflow is Workflow => {
  return WorkflowSchema.safeParse(workflow).success;
};

export const isValidNode = (node: any): node is Node => {
  return NodeSchema.safeParse(node).success;
};

export const isValidEdge = (edge: any): edge is WorkflowEdge => {
  return EdgeSchema.safeParse(edge).success;
};

export const isValidWorkflowNode = (node: any): node is WorkflowNode => {
  return WorkflowNodeSchema.safeParse(node).success;
};

// Validation summary for UI display
export interface ValidationSummary {
  totalErrors: number;
  totalWarnings: number;
  errorsByType: Record<string, number>;
  warningsByType: Record<string, number>;
  criticalErrors: ValidationError[];
}

export const createValidationSummary = (result: ValidationResult): ValidationSummary => {
  const errorsByType = result.errors.reduce((acc, error) => {
    acc[error.type] = (acc[error.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const warningsByType = result.warnings.reduce((acc, warning) => {
    acc[warning.type] = (acc[warning.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const criticalErrors = result.errors.filter(error =>
    error.type === 'schema' || error.type === 'workflow'
  );

  return {
    totalErrors: result.errors.length,
    totalWarnings: result.warnings.length,
    errorsByType,
    warningsByType,
    criticalErrors
  };
};
