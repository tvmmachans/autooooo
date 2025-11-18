import { useMemo } from 'react';
import { NodeType } from '../components/workflow/types.js';
import { validateCompleteWorkflow, createValidationSummary, } from '../components/workflow/validation.js';
export const useWorkflowTypes = (params = {}) => {
    const workflow = params.workflow ?? {};
    const nodes = params.nodes ?? [];
    const edges = params.edges ?? [];
    const validationResult = useMemo(() => validateCompleteWorkflow(workflow, nodes), [workflow, nodes]);
    const validationSummary = useMemo(() => createValidationSummary(validationResult), [validationResult]);
    const getNodeTypeInfo = (type) => {
        const nodeTypeMap = {
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
    const availableNodeTypes = useMemo(() => Object.values(NodeType).map((type) => ({
        type,
        ...getNodeTypeInfo(type),
    })), []);
    const getNodesByType = (type) => nodes.filter((node) => node.type === type);
    const workflowStats = useMemo(() => {
        const nodeCount = nodes.length;
        const edgeCount = edges.length;
        const nodeTypeCounts = Object.values(NodeType).reduce((acc, type) => {
            acc[type] = getNodesByType(type).length;
            return acc;
        }, {});
        return {
            nodeCount,
            edgeCount,
            nodeTypeCounts,
            hasStartNode: nodeTypeCounts[NodeType.START] > 0,
            hasEndNode: nodeTypeCounts[NodeType.END] > 0,
            isConnected: edgeCount > 0,
        };
    }, [nodes, edges]);
    const isWorkflowValid = useMemo(() => validationResult.isValid && validationSummary.criticalErrors.length === 0, [validationResult, validationSummary]);
    const getConnectedNodes = (nodeId) => {
        const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
        const incomingEdges = edges.filter((edge) => edge.target === nodeId);
        return {
            outgoing: outgoingEdges.map((edge) => nodes.find((n) => n.id === edge.target)).filter(Boolean),
            incoming: incomingEdges.map((edge) => nodes.find((n) => n.id === edge.source)).filter(Boolean),
        };
    };
    const canAddNode = (type) => {
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
    const importWorkflow = (_data) => {
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
export const useNodeOperations = (nodeId, nodes = [], edges = []) => {
    const node = nodeId ? nodes.find((n) => n.id === nodeId) ?? null : null;
    const getNodeConfigForm = (type) => {
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
    const updateNodeConfig = (_config) => {
        // No-op – state updates should be handled by the caller.
    };
    const validateNode = () => {
        if (!node)
            return { isValid: false, errors: ['Node not found'] };
        const errors = [];
        if (!node.id)
            errors.push('Node ID is required');
        if (!node.type)
            errors.push('Node type is required');
        return { isValid: errors.length === 0, errors };
    };
    const connections = useMemo(() => {
        if (!nodeId)
            return { incoming: [], outgoing: [] };
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
export const useEdgeOperations = (edges = [], _setEdges) => {
    const addEdge = (_edge) => {
        // No-op – state updates should be handled by the caller.
    };
    const removeEdge = (_edgeId) => {
        // No-op placeholder.
    };
    const updateEdge = (_edgeId, _updates) => {
        // No-op placeholder.
    };
    return {
        edges,
        addEdge,
        removeEdge,
        updateEdge,
    };
};
//# sourceMappingURL=useWorkflowTypes.js.map