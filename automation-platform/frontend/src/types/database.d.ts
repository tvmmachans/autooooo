import { z } from 'zod';
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
        nodeProgress: Record<string, {
            status: string;
            startedAt?: string;
            completedAt?: string;
        }>;
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
export interface Node {
    id: string;
    type: string;
    position: {
        x: number;
        y: number;
    };
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
export interface WorkflowExecutionContext {
    executionId: number;
    workflowId: number;
    userId: number;
    inputData: Record<string, any>;
    nodeStates: Map<string, any>;
    variables: Map<string, any>;
    startTime: Date;
}
export declare const NodeSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>;
    data: z.ZodRecord<z.ZodString, z.ZodAny>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    selected: z.ZodOptional<z.ZodBoolean>;
    dragging: z.ZodOptional<z.ZodBoolean>;
    label: z.ZodOptional<z.ZodString>;
    style: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strip>;
export declare const EdgeSchema: z.ZodObject<{
    id: z.ZodString;
    source: z.ZodString;
    target: z.ZodString;
    sourceHandle: z.ZodOptional<z.ZodString>;
    targetHandle: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
    animated: z.ZodOptional<z.ZodBoolean>;
    style: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    label: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const WorkflowSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    userId: z.ZodNumber;
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strip>;
        data: z.ZodRecord<z.ZodString, z.ZodAny>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        selected: z.ZodOptional<z.ZodBoolean>;
        dragging: z.ZodOptional<z.ZodBoolean>;
        label: z.ZodOptional<z.ZodString>;
        style: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, z.core.$strip>>;
    edges: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        source: z.ZodString;
        target: z.ZodString;
        sourceHandle: z.ZodOptional<z.ZodString>;
        targetHandle: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        animated: z.ZodOptional<z.ZodBoolean>;
        style: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        label: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    isActive: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const ExecutionSchema: z.ZodObject<{
    id: z.ZodNumber;
    workflowId: z.ZodNumber;
    status: z.ZodEnum<{
        pending: "pending";
        running: "running";
        completed: "completed";
        failed: "failed";
    }>;
    startedAt: z.ZodNullable<z.ZodDate>;
    completedAt: z.ZodNullable<z.ZodDate>;
    error: z.ZodNullable<z.ZodString>;
    inputData: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>;
    outputData: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>;
    progress: z.ZodNullable<z.ZodObject<{
        currentNode: z.ZodOptional<z.ZodString>;
        completedNodes: z.ZodArray<z.ZodString>;
        totalNodes: z.ZodNumber;
        percentage: z.ZodNumber;
        nodeProgress: z.ZodRecord<z.ZodString, z.ZodObject<{
            status: z.ZodString;
            startedAt: z.ZodOptional<z.ZodString>;
            completedAt: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    createdAt: z.ZodDate;
}, z.core.$strip>;
export declare const isNode: (value: any) => value is Node;
export declare const isEdge: (value: any) => value is Edge;
export declare const isWorkflow: (value: any) => value is Workflow;
export declare const isExecution: (value: any) => value is Execution;
export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type NewWorkflow = Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>;
export type NewExecution = Omit<Execution, 'id' | 'createdAt'>;
export type NewExecutionLog = Omit<ExecutionLog, 'id' | 'timestamp'>;
export type NewCredential = Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>;
export type NewWebhook = Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>;
//# sourceMappingURL=database.d.ts.map