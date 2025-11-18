import type { WorkflowNode } from './types.js';
import type { Workflow, Node, Edge as WorkflowEdge } from '../../types/database';
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
export declare const validateWorkflowSchema: (workflow: Partial<Workflow>) => ValidationResult;
export declare const validateWorkflowNode: (node: WorkflowNode) => ValidationResult;
export declare const validateWorkflowConnections: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => ValidationResult;
export declare const validateCompleteWorkflow: (workflow: Partial<Workflow>, enhancedNodes?: WorkflowNode[]) => ValidationResult;
export declare const isValidWorkflow: (workflow: any) => workflow is Workflow;
export declare const isValidNode: (node: any) => node is Node;
export declare const isValidEdge: (edge: any) => edge is WorkflowEdge;
export declare const isValidWorkflowNode: (node: any) => node is WorkflowNode;
export interface ValidationSummary {
    totalErrors: number;
    totalWarnings: number;
    errorsByType: Record<string, number>;
    warningsByType: Record<string, number>;
    criticalErrors: ValidationError[];
}
export declare const createValidationSummary: (result: ValidationResult) => ValidationSummary;
//# sourceMappingURL=validation.d.ts.map