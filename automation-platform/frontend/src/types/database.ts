import { z } from 'zod';

// Database types inferred from Drizzle schema
export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Workflow = {
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

export type Execution = {
  id: number;
  workflowId: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
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
    nodeProgress: Record<string, { status: string; startedAt?: string; completedAt?: string }>;
  } | null;
  createdAt: Date;
};

export type ExecutionLog = {
  id: number;
  executionId: number;
  level: 'info' | 'warn' | 'error';
  message: string;
  data: Record<string, any> | null;
  timestamp: Date;
};

export type Credential = {
  id: number;
  userId: number;
  name: string;
  type: string;
  data: EncryptedCredentialData;
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Webhook = {
  id: number;
  userId: number;
  workflowId: number | null;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Workflow node and edge types
export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  width?: number;
  height?: number;
  selected?: boolean;
  dragging?: boolean;
  label?: string;
  style?: Record<string, any>;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  animated?: boolean;
  style?: Record<string, any>;
  data?: Record<string, any>;
  label?: string;
}

// Execution data types
export interface ExecutionInput {
  trigger: 'manual' | 'webhook' | 'schedule';
  data?: Record<string, any>;
  webhookId?: number;
}

export interface ExecutionOutput {
  success: boolean;
  data?: Record<string, any>;
  error?: string;
  nodeResults?: Record<string, any>;
}

export interface ExecutionLogEntry {
  nodeId?: string;
  action: string;
  status: 'success' | 'error' | 'info';
  message: string;
  data?: Record<string, any>;
  timestamp: Date;
}

// Credential types
export interface EncryptedCredentialData {
  encryptedData: string;
  iv: string;
  algorithm: string;
  keyVersion: string;
}

export interface DecryptedCredentialData {
  [key: string]: any;
}

export interface CredentialTypeConfig {
  type: string;
  fields: string[];
  validation?: (data: any) => boolean;
}

// Workflow execution context
export interface WorkflowExecutionContext {
  executionId: number;
  workflowId: number;
  userId: number;
  inputData: Record<string, any>;
  nodeStates: Map<string, any>;
  variables: Map<string, any>;
  startTime: Date;
}

// Zod schemas for runtime validation
export const NodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.record(z.any()),
  width: z.number().optional(),
  height: z.number().optional(),
  selected: z.boolean().optional(),
  dragging: z.boolean().optional(),
  label: z.string().optional(),
  style: z.record(z.any()).optional(),
});

export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  type: z.string().optional(),
  animated: z.boolean().optional(),
  style: z.record(z.any()).optional(),
  data: z.record(z.any()).optional(),
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
  inputData: z.record(z.any()).nullable(),
  outputData: z.record(z.any()).nullable(),
  progress: z.object({
    currentNode: z.string().optional(),
    completedNodes: z.array(z.string()),
    totalNodes: z.number(),
    percentage: z.number(),
    nodeProgress: z.record(z.object({
      status: z.string(),
      startedAt: z.string().optional(),
      completedAt: z.string().optional(),
    })),
  }).nullable(),
  createdAt: z.date(),
});

// Type guards
export const isNode = (value: any): value is Node => {
  return NodeSchema.safeParse(value).success;
};

export const isEdge = (value: any): value is Edge => {
  return EdgeSchema.safeParse(value).success;
};

export const isWorkflow = (value: any): value is Workflow => {
  return WorkflowSchema.safeParse(value).success;
};

export const isExecution = (value: any): value is Execution => {
  return ExecutionSchema.safeParse(value).success;
};

// Insert types for creating new records
export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type NewWorkflow = Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>;
export type NewExecution = Omit<Execution, 'id' | 'createdAt'>;
export type NewExecutionLog = Omit<ExecutionLog, 'id' | 'timestamp'>;
export type NewCredential = Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>;
export type NewWebhook = Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>;
