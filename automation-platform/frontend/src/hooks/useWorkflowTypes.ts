import { useMemo } from 'react';
import { useWorkflowStore } from '../store/workflowStore.js';
import type { WorkflowNode, Edge } from '../components/workflow/types.js';
import { NodeType } from '../components/workflow/types.js';
import type { Workflow } from '../types/database.js';
import { validateCompleteWorkflow, createValidationSummary } from '../components/workflow/validation.js';
import { nodeTypes } from '../components/workflow/NodeTypes.js';

// Hook for managing workflow types and validation
export const useWorkflowTypes = () => {
  const { workflow, nodes, edges, updateWorkflow, updateNodes, updateEdges } = useWorkflowStore();

  // Memoized validation result
  const validationResult = useMemo(() => {
    return validateCompleteWorkflow(workflow, nodes);
  }, [workflow, nodes]);

  // Memoized validation summary
  const validationSummary = useMemo(() => {
    return createValidationSummary(validationResult);
  }, [validationResult]);

  // Get node type information
  const getNodeTypeInfo = (type: NodeType) => {
    const nodeTypeMap = {
      [NodeType.START]: {
        label: 'Start',
        color: 'purple',
        description: 'Workflow entry point',
        icon: '▶️'
      },
      [NodeType.ACTION]: {
        label: 'Action',
        color: 'blue',
        description: 'Execute an action',
        icon: '⚡'
      },
      [NodeType.CONDITION]: {
        label: 'Condition',
        color: 'green',
        description: 'Evaluate conditions',
        icon: '❓'
      },
      [NodeType.END]: {
        label: 'End',
        color: 'red',
        description: 'Workflow exit point',
        icon: '⏹️'
      }
    };
    return nodeTypeMap[type];
  };

  // Get available node types for adding to workflow
  const availableNodeTypes = useMemo(() => {
    return Object.values(NodeType).map(type => ({
      type,
      ...getNodeTypeInfo(type)
    }));
  }, []);

  // Check if workflow is valid for execution
  const isWorkflowValid = useMemo(() => {
    return validationResult.isValid && validationSummary.criticalErrors.length === 0;
  }, [validationResult.isValid, validationSummary.criticalErrors]);

  // Get nodes by type
  const getNodesByType = (type: NodeType) => {
    return nodes.filter(node => node.type === type);
  };

  // Get connected nodes
  const getConnectedNodes = (nodeId: string) => {
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    const incomingEdges = edges.filter(edge => edge.target === nodeId);

    return {
      outgoing: outgoingEdges.map(edge => nodes.find(n => n.id === edge.target)).filter(Boolean),
      incoming: incomingEdges.map(edge => nodes.find(n => n.id === edge.source)).filter(Boolean)
    };
  };

  // Check if node can be added
  const canAddNode = (type: NodeType) => {
    switch (type) {
      case NodeType.START:
        return getNodesByType(NodeType.START).length === 0;
      case NodeType.END:
        return true; // Multiple end nodes allowed
      default:
        return getNodesByType(NodeType.START).length > 0; // Need start node first
    }
  };

  // Get workflow statistics
  const workflowStats = useMemo(() => {
    const nodeCount = nodes.length;
    const edgeCount = edges.length;
    const nodeTypeCounts = Object.values(NodeType).reduce((acc, type) => {
      acc[type] = getNodesByType(type).length;
      return acc;
    }, {} as Record<NodeType, number>);

    return {
      nodeCount,
      edgeCount,
      nodeTypeCounts,
      hasStartNode: nodeTypeCounts[NodeType.START] > 0,
      hasEndNode: nodeTypeCounts[NodeType.END] > 0,
      isConnected: edgeCount > 0
    };
  }, [nodes, edges]);

  // Export workflow data
  const exportWorkflow = () => {
    return {
      workflow,
      nodes,
      edges,
      validation: validationResult,
      stats: workflowStats
    };
  };

  // Import workflow data
  const importWorkflow = (data: { workflow: Partial<Workflow>; nodes: WorkflowNode[]; edges: Edge[] }) => {
    updateWorkflow(data.workflow);
    updateNodes(data.nodes);
    updateEdges(data.edges);
  };

  return {
    // Data
    workflow,
    nodes,
    edges,
    validationResult,
    validationSummary,
    workflowStats,

    // Computed values
    isWorkflowValid,
    availableNodeTypes,

    // Methods
    getNodeTypeInfo,
    getNodesByType,
    getConnectedNodes,
    canAddNode,
    exportWorkflow,
    importWorkflow,

    // Store actions
    updateWorkflow,
    updateNodes,
    updateEdges
  };
};

// Hook for managing individual node operations
export const useNodeOperations = (nodeId?: string) => {
  const { nodes, edges, updateNodes, updateEdges } = useWorkflowStore();

  const node = nodeId ? nodes.find(n => n.id === nodeId) : null;

  // Get node configuration form component
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

  // Update node configuration
  const updateNodeConfig = (config: any) => {
    if (!node) return;

    const updatedNode = { ...node, config };
    updateNodes(nodes.map(n => n.id === nodeId ? updatedNode : n));
  };

  // Validate single node
  const validateNode = () => {
    if (!node) return { isValid: false, errors: ['Node not found'] };

    // Simple validation - in real implementation, use the validation system
    const errors: string[] = [];

    if (!node.id) errors.push('Node ID is required');
    if (!node.type) errors.push('Node type is required');

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Get node connections
  const connections = useMemo(() => {
    if (!nodeId) return { incoming: [], outgoing: [] };

    const incoming = edges.filter(edge => edge.target === nodeId);
    const outgoing = edges.filter(edge => edge.source === nodeId);

    return { incoming, outgoing };
  }, [nodeId, edges]);

  return {
    node,
    connections,
    getNodeConfigForm,
    updateNodeConfig,
    validateNode
  };
};

// Hook for managing edge operations
export const useEdgeOperations = () => {
  const { edges, updateEdges } = useWorkflowStore();

  // Add edge
  const addEdge = (edge: Edge) => {
    updateEdges([...edges, edge]);
  };

  // Remove edge
  const removeEdge = (edgeId: string) => {
    updateEdges(edges.filter(edge => edge.id !== edgeId));
  };

  // Update edge
  const updateEdge = (edgeId: string, updates: Partial<Edge>) => {
    updateEdges(edges.map(edge =>
      edge.id === edgeId ? { ...edge, ...updates } : edge
    ));
  };

  return {
    addEdge,
    removeEdge,
    updateEdge
  };
};
