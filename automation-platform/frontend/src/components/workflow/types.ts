import { z } from 'zod';
import type { Node, Edge } from '../../types/database.js';

// Node types for the workflow builder
export enum NodeType {
  START = 'start',
  ACTION = 'action',
  CONDITION = 'condition',
  END = 'end',
}

// Action node configuration
export interface ActionNodeConfig {
  actionType: 'http' | 'delay' | 'setVariable' | 'log';
  httpConfig?: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
  };
  delayConfig?: {
    duration: number; // milliseconds
  };
  variableConfig?: {
    variableName: string;
    variableValue: any;
  };
  logConfig?: {
    level: 'info' | 'warn' | 'error';
    message: string;
  };
}

// Condition node configuration
export interface ConditionNodeConfig {
  conditions: Condition[];
  logicOperator: 'AND' | 'OR';
}

export interface Condition {
  type: 'value' | 'expression' | 'custom';
  left: string; // variable name or expression
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'matches';
  right: any; // comparison value
  expression?: string; // for expression conditions
  customLogic?: string; // for custom logic conditions
}

// Start node configuration
export interface StartNodeConfig {
  variables?: Record<string, any>; // initial variables
  trigger?: 'manual' | 'webhook' | 'schedule';
}

// End node configuration
export interface EndNodeConfig {
  outputMapping?: Record<string, string>; // map variables to output
  successMessage?: string;
}

// Union type for all node configurations
export type NodeConfig =
  | ActionNodeConfig
  | ConditionNodeConfig
  | StartNodeConfig
  | EndNodeConfig;

// Extended node interface for workflow builder
export interface WorkflowNode extends Omit<Node, 'type'> {
  type: NodeType;
  config: NodeConfig;
  validationErrors?: string[];
}

// Connection validation rules
export interface ConnectionRule {
  sourceType: NodeType;
  targetType: NodeType;
  maxConnections?: number;
  condition?: (sourceNode: WorkflowNode, targetNode: WorkflowNode) => boolean;
}

export const CONNECTION_RULES: ConnectionRule[] = [
  // Start node can only connect to action or condition nodes
  {
    sourceType: NodeType.START,
    targetType: NodeType.ACTION,
    maxConnections: 1,
  },
  {
    sourceType: NodeType.START,
    targetType: NodeType.CONDITION,
    maxConnections: 1,
  },

  // Action nodes can connect to action, condition, or end nodes
  {
    sourceType: NodeType.ACTION,
    targetType: NodeType.ACTION,
  },
  {
    sourceType: NodeType.ACTION,
    targetType: NodeType.CONDITION,
  },
  {
    sourceType: NodeType.ACTION,
    targetType: NodeType.END,
  },

  // Condition nodes can connect to action, condition, or end nodes
  {
    sourceType: NodeType.CONDITION,
    targetType: NodeType.ACTION,
  },
  {
    sourceType: NodeType.CONDITION,
    targetType: NodeType.CONDITION,
  },
  {
    sourceType: NodeType.CONDITION,
    targetType: NodeType.END,
  },

  // End node cannot connect to anything
];

// Validation functions
export const validateNodeConfig = (node: WorkflowNode): string[] => {
  const errors: string[] = [];

  switch (node.type) {
    case NodeType.ACTION:
      const actionConfig = node.config as ActionNodeConfig;
      if (!actionConfig.actionType) {
        errors.push('Action type is required');
      }

      if (actionConfig.actionType === 'http' && actionConfig.httpConfig) {
        if (!actionConfig.httpConfig.url) {
          errors.push('HTTP URL is required');
        }
        if (!actionConfig.httpConfig.method) {
          errors.push('HTTP method is required');
        }
      }

      if (actionConfig.actionType === 'delay' && actionConfig.delayConfig) {
        if (actionConfig.delayConfig.duration <= 0) {
          errors.push('Delay duration must be positive');
        }
      }

      if (actionConfig.actionType === 'setVariable' && actionConfig.variableConfig) {
        if (!actionConfig.variableConfig.variableName) {
          errors.push('Variable name is required');
        }
      }
      break;

    case NodeType.CONDITION:
      const conditionConfig = node.config as ConditionNodeConfig;
      if (!conditionConfig.conditions || conditionConfig.conditions.length === 0) {
        errors.push('At least one condition is required');
      }

      conditionConfig.conditions?.forEach((condition, index) => {
        if (!condition.left) {
          errors.push(`Condition ${index + 1}: Left operand is required`);
        }
        if (!condition.operator) {
          errors.push(`Condition ${index + 1}: Operator is required`);
        }
      });
      break;

    case NodeType.START:
      // Start node has minimal validation
      break;

    case NodeType.END:
      // End node has minimal validation
      break;
  }

  return errors;
};

export const validateConnection = (
  sourceNode: WorkflowNode,
  targetNode: WorkflowNode,
  existingConnections: Edge[]
): { valid: boolean; error?: string } => {
  // Check if connection rule exists
  const rule = CONNECTION_RULES.find(
    (r) => r.sourceType === sourceNode.type && r.targetType === targetNode.type
  );

  if (!rule) {
    return {
      valid: false,
      error: `Cannot connect ${sourceNode.type} to ${targetNode.type}`,
    };
  }

  // Check max connections
  if (rule.maxConnections) {
    const sourceConnections = existingConnections.filter(
      (edge) => edge.source === sourceNode.id
    );

    if (sourceConnections.length >= rule.maxConnections) {
      return {
        valid: false,
        error: `${sourceNode.type} node can only have ${rule.maxConnections} outgoing connection(s)`,
      };
    }
  }

  // Check custom condition
  if (rule.condition && !rule.condition(sourceNode, targetNode)) {
    return {
      valid: false,
      error: 'Connection not allowed by custom validation',
    };
  }

  return { valid: true };
};

// Zod schemas for runtime validation
export const ActionNodeConfigSchema = z.object({
  actionType: z.enum(['http', 'delay', 'setVariable', 'log']),
  httpConfig: z.object({
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    url: z.string().url(),
    headers: z.record(z.string(), z.string()).optional(),
    body: z.any().optional(),
    timeout: z.number().positive().optional(),
  }).optional(),
  delayConfig: z.object({
    duration: z.number().positive(),
  }).optional(),
  variableConfig: z.object({
    variableName: z.string().min(1),
    variableValue: z.any(),
  }).optional(),
  logConfig: z.object({
    level: z.enum(['info', 'warn', 'error']),
    message: z.string().min(1),
  }).optional(),
});

export const ConditionSchema = z.object({
  type: z.enum(['value', 'expression', 'custom']),
  left: z.string().min(1),
  operator: z.enum(['equals', 'notEquals', 'greaterThan', 'lessThan', 'contains', 'matches']),
  right: z.any(),
  expression: z.string().optional(),
  customLogic: z.string().optional(),
});

export const ConditionNodeConfigSchema = z.object({
  conditions: z.array(ConditionSchema).min(1),
  logicOperator: z.enum(['AND', 'OR']),
});

export const StartNodeConfigSchema = z.object({
  variables: z.record(z.string(), z.any()).optional(),
  trigger: z.enum(['manual', 'webhook', 'schedule']).optional(),
});

export const EndNodeConfigSchema = z.object({
  outputMapping: z.record(z.string(), z.string()).optional(),
  successMessage: z.string().optional(),
});

export const WorkflowNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.record(z.string(), z.any()),
  config: z.union([
    ActionNodeConfigSchema,
    ConditionNodeConfigSchema,
    StartNodeConfigSchema,
    EndNodeConfigSchema,
  ]),
  width: z.number().optional(),
  height: z.number().optional(),
  selected: z.boolean().optional(),
  dragging: z.boolean().optional(),
  label: z.string().optional(),
  style: z.record(z.string(), z.any()).optional(),
  validationErrors: z.array(z.string()).optional(),
});

// Type guards
export const isActionNode = (node: WorkflowNode): node is WorkflowNode & { config: ActionNodeConfig } => {
  return node.type === NodeType.ACTION;
};

export const isConditionNode = (node: WorkflowNode): node is WorkflowNode & { config: ConditionNodeConfig } => {
  return node.type === NodeType.CONDITION;
};

export const isStartNode = (node: WorkflowNode): node is WorkflowNode & { config: StartNodeConfig } => {
  return node.type === NodeType.START;
};

export const isEndNode = (node: WorkflowNode): node is WorkflowNode & { config: EndNodeConfig } => {
  return node.type === NodeType.END;
};

// Helper functions
export const createNode = (
  type: NodeType,
  position: { x: number; y: number },
  config: NodeConfig
): WorkflowNode => {
  const baseNode: Omit<WorkflowNode, 'config'> = {
    id: `${type}-${Date.now()}`,
    type: type as any,
    position,
    data: {},
  };

  return {
    ...baseNode,
    config,
  };
};

export const getNodeTypeLabel = (type: NodeType): string => {
  switch (type) {
    case NodeType.START:
      return 'Start';
    case NodeType.ACTION:
      return 'Action';
    case NodeType.CONDITION:
      return 'Condition';
    case NodeType.END:
      return 'End';
    default:
      return 'Unknown';
  }
};
