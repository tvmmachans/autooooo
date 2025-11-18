import { useMemo } from 'react';
import type { WorkflowNode } from '../components/workflow/types.js';
import { NodeType } from '../components/workflow/types.js';
import type { Workflow } from '../types/database';
import {
  validateCompleteWorkflow,
  createValidationSummary,
  type ValidationResult,
  type ValidationSummary,
} from '../components/workflow/validation.js';
import type { Edge as WorkflowEdge } from '../types/database';

// Lightweight, self-contained workflow types hook.
// Currently no components consume this hook, so it is implemented as a
// read-only helper around the passed-in workflow data.

export interface UseWorkflowTypesParams {
  workflow?: Partial<Workflow>;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
}

export const useWorkflowTypes = (params: UseWorkflowTypesParams = {}) => {
  const workflow = params.workflow ?? ({} as Partial<Workflow>);
  const nodes = params.nodes ?? ([] as WorkflowNode[]);
  const edges = params.edges ?? ([] as WorkflowEdge[]);

  const validationResult: ValidationResult = useMemo(
    () => validateCompleteWorkflow(workflow, nodes),
    [workflow, nodes]
  );

  const validationSummary: ValidationSummary = useMemo(
    () => createValidationSummary(validationResult),
    [validationResult]
  );

  const getNodeTypeInfo = (type: NodeType) => {
    const nodeTypeMap: Record<NodeType, { label: string; color: string; description: string; icon: string }> = {
      [NodeType.START]: {
        label: 'Start',
        color: 'purple',
        description: 'Workflow entry point',
        icon: '▶️',
      },
      [NodeType.ACTION]: {
        label: 'Action',
        color: 'blue',
        description: 'Execute an action',
        icon: '⚡',
      },
      [NodeType.CONDITION]: {
        label: 'Condition',
        color: 'green',
        description: 'Evaluate conditions',
        icon: '❓',
      },
      [NodeType.END]: {
        label: 'End',
        color: 'red',
        description: 'Workflow exit point',
        icon: '⏹️',
      },
    };

    return nodeTypeMap[type];
  };

  const availableNodeTypes = useMemo(
    () =>
      (Object.values(NodeType) as NodeType[]).map((type) => ({
        type,
        ...getNodeTypeInfo(type),
      })),
    []
  );

  const getNodesByType = (type: NodeType) => nodes.filter((node) => node.type === type);

  const workflowStats = useMemo(() => {
    const nodeCount = nodes.length;
    const edgeCount = edges.length;

    const nodeTypeCounts = (Object.values(NodeType) as NodeType[]).reduce(
      (acc, type) => {
        acc[type] = getNodesByType(type).length;
        return acc;
      },
      {} as Record<NodeType, number>
    );

    return {
      nodeCount,
      edgeCount,
      nodeTypeCounts,
      hasStartNode: nodeTypeCounts[NodeType.START] > 0,
      hasEndNode: nodeTypeCounts[NodeType.END] > 0,
      isConnected: edgeCount > 0,
    };
  }, [nodes, edges]);

  const isWorkflowValid = useMemo(
    () => validationResult.isValid && validationSummary.criticalErrors.length === 0,
    [validationResult, validationSummary]
  );

  const getConnectedNodes = (nodeId: string) => {
    const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
    const incomingEdges = edges.filter((edge) => edge.target === nodeId);

    return {
      outgoing: outgoingEdges.map((edge) => nodes.find((n) => n.id === edge.target)).filter(Boolean) as WorkflowNode[],
      incoming: incomingEdges.map((edge) => nodes.find((n) => n.id === edge.source)).filter(Boolean) as WorkflowNode[],
    };
  };

  const canAddNode = (type: NodeType) => {
    switch (type) {
      case NodeType.START:
        return getNodesByType(NodeType.START).length === 0;
      case NodeType.END:
        return true;
      default:
        return getNodesByType(NodeType.START).length > 0;
    }
  };

  const exportWorkflow = () => ({
    workflow,
    nodes,
    edges,
    validation: validationResult,
    stats: workflowStats,
  });

  const importWorkflow = (_data: { workflow: Partial<Workflow>; nodes: WorkflowNode[]; edges: WorkflowEdge[] }) => {
    // No-op placeholder – mutating workflow state is currently handled elsewhere.
  };

  return {
    workflow,
    nodes,
    edges,
    validationResult,
    validationSummary,
    workflowStats,
    isWorkflowValid,
    availableNodeTypes,
    getNodeTypeInfo,
    getNodesByType,
    getConnectedNodes,
    canAddNode,
    exportWorkflow,
    importWorkflow,
  };
};

// Legacy-compatible stubs for node and edge operations.
// These are provided to keep the public API stable; they currently do not
// mutate any shared state.

export const useNodeOperations = (nodeId?: string, nodes: WorkflowNode[] = [], edges: WorkflowEdge[] = []) => {
  const node = nodeId ? nodes.find((n) => n.id === nodeId) ?? null : null;

  const getNodeConfigForm = (type: NodeType) => {
    switch (type) {
      case NodeType.START:
        return 'StartNodeConfigForm';
      case NodeType.ACTION:
        return 'ActionNodeConfigForm';
      case NodeType.CONDITION:
        return 'ConditionNodeConfigForm';
      case NodeType.END:
        return 'EndNodeConfigForm';
      default:
        return null;
    }
  };

  const updateNodeConfig = (_config: any) => {
    // No-op – state updates should be handled by the caller.
  };

  const validateNode = () => {
    if (!node) return { isValid: false, errors: ['Node not found'] };

    const errors: string[] = [];
    if (!node.id) errors.push('Node ID is required');
    if (!node.type) errors.push('Node type is required');

    return { isValid: errors.length === 0, errors };
  };

  const connections = useMemo(() => {
    if (!nodeId) return { incoming: [] as WorkflowEdge[], outgoing: [] as WorkflowEdge[] };

    const incoming = edges.filter((edge) => edge.target === nodeId);
    const outgoing = edges.filter((edge) => edge.source === nodeId);

    return { incoming, outgoing };
  }, [nodeId, edges]);

  return {
    node,
    connections,
    getNodeConfigForm,
    updateNodeConfig,
    validateNode,
  };
};

export const useEdgeOperations = (edges: WorkflowEdge[] = [], _setEdges?: (edges: WorkflowEdge[]) => void) => {
  const addEdge = (_edge: WorkflowEdge) => {
    // No-op – state updates should be handled by the caller.
  };

  const removeEdge = (_edgeId: string) => {
    // No-op placeholder.
  };

  const updateEdge = (_edgeId: string, _updates: Partial<WorkflowEdge>) => {
    // No-op placeholder.
  };

  return {
    edges,
    addEdge,
    removeEdge,
    updateEdge,
  };
};
