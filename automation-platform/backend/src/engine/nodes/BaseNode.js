// Base node class with database-aware context management
export class BaseNode {
    context;
    nodeId;
    nodeData;
    constructor(context, nodeId, nodeData) {
        this.context = context;
        this.nodeId = nodeId;
        this.nodeData = nodeData;
    }
    // Helper method to log execution steps with database batching
    log(level, message, data) {
        // In the WorkflowEngine, logs are buffered and bulk inserted
        // This method can be used for immediate logging if needed
        console.log(`[${level.toUpperCase()}] ${this.nodeId}: ${message}`, data);
    }
    // Helper method to log to batch buffer (used by WorkflowEngine)
    logToBuffer(logBuffer, level, message, data) {
        logBuffer.push({
            level,
            message,
            data: data || {},
            nodeId: this.nodeId,
        });
    }
    // Helper to get node configuration
    getConfig() {
        return this.nodeData.config || {};
    }
    // Helper to validate input data
    validateInput(input, requiredFields) {
        for (const field of requiredFields) {
            if (!(field in input)) {
                return { valid: false, error: `Missing required field: ${field}` };
            }
        }
        return { valid: true };
    }
    // Helper to set context variables
    setVariable(key, value) {
        this.context.variables.set(key, value);
    }
    // Helper to get context variables
    getVariable(key) {
        return this.context.variables.get(key);
    }
    // Helper to get previous node output
    getPreviousOutput(nodeId) {
        const nodeState = this.context.nodeStates.get(nodeId);
        return nodeState?.output;
    }
    // Helper to update execution progress in database
    async updateProgress(progress, status) {
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
export function createNode(nodeType, context, nodeId, nodeData) {
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
//# sourceMappingURL=BaseNode.js.map