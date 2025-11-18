import type { WorkflowNode } from '../components/workflow/types.js';
import { NodeType } from '../components/workflow/types.js';
import type { Workflow } from '../types/database';
import { type ValidationResult, type ValidationSummary } from '../components/workflow/validation.js';
import type { Edge as WorkflowEdge } from '../types/database';
export interface UseWorkflowTypesParams {
    workflow?: Partial<Workflow>;
    nodes?: WorkflowNode[];
    edges?: WorkflowEdge[];
}
export declare const useWorkflowTypes: (params?: UseWorkflowTypesParams) => {
    workflow: any;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    validationResult: ValidationResult;
    validationSummary: ValidationSummary;
    workflowStats: {
        nodeCount: number;
        edgeCount: number;
        nodeTypeCounts: Record<NodeType, number>;
        hasStartNode: boolean;
        hasEndNode: boolean;
        isConnected: boolean;
    };
    isWorkflowValid: boolean;
    availableNodeTypes: {
        label: string;
        color: string;
        description: string;
        icon: string;
        type: NodeType;
    }[];
    getNodeTypeInfo: (type: NodeType) => {
        label: string;
        color: string;
        description: string;
        icon: string;
    };
    getNodesByType: (type: NodeType) => WorkflowNode[];
    getConnectedNodes: (nodeId: string) => {
        outgoing: WorkflowNode[];
        incoming: WorkflowNode[];
    };
    canAddNode: (type: NodeType) => boolean;
    exportWorkflow: () => {
        workflow: any;
        nodes: WorkflowNode[];
        edges: WorkflowEdge[];
        validation: ValidationResult;
        stats: {
            nodeCount: number;
            edgeCount: number;
            nodeTypeCounts: Record<NodeType, number>;
            hasStartNode: boolean;
            hasEndNode: boolean;
            isConnected: boolean;
        };
    };
    importWorkflow: (_data: {
        workflow: Partial<Workflow>;
        nodes: WorkflowNode[];
        edges: WorkflowEdge[];
    }) => void;
};
export declare const useNodeOperations: (nodeId?: string, nodes?: WorkflowNode[], edges?: WorkflowEdge[]) => {
    node: WorkflowNode | null;
    connections: {
        incoming: WorkflowEdge[];
        outgoing: WorkflowEdge[];
    };
    getNodeConfigForm: (type: NodeType) => "StartNodeConfigForm" | "ActionNodeConfigForm" | "ConditionNodeConfigForm" | "EndNodeConfigForm" | null;
    updateNodeConfig: (_config: any) => void;
    validateNode: () => {
        isValid: boolean;
        errors: string[];
    };
};
export declare const useEdgeOperations: (edges?: WorkflowEdge[], _setEdges?: (edges: WorkflowEdge[]) => void) => {
    edges: WorkflowEdge[];
    addEdge: (_edge: WorkflowEdge) => void;
    removeEdge: (_edgeId: string) => void;
    updateEdge: (_edgeId: string, _updates: Partial<WorkflowEdge>) => void;
};
//# sourceMappingURL=useWorkflowTypes.d.ts.map