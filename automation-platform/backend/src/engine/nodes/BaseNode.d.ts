import type { WorkflowExecutionContext } from '../../database/schema.js';
export interface NodeExecutionResult {
    success: boolean;
    output?: Record<string, any>;
    error?: string;
    nextNodeId?: string;
}
export declare abstract class BaseNode {
    protected context: WorkflowExecutionContext;
    protected nodeId: string;
    protected nodeData: Record<string, any>;
    constructor(context: WorkflowExecutionContext, nodeId: string, nodeData: Record<string, any>);
    abstract execute(input: Record<string, any>): Promise<NodeExecutionResult>;
    protected log(level: 'info' | 'warn' | 'error', message: string, data?: Record<string, any>): void;
    protected logToBuffer(logBuffer: Array<{
        level: 'info' | 'warn' | 'error';
        message: string;
        data?: Record<string, any>;
        nodeId?: string;
    }>, level: 'info' | 'warn' | 'error', message: string, data?: Record<string, any>): void;
    protected getConfig(): Record<string, any>;
    protected validateInput(input: Record<string, any>, requiredFields: string[]): {
        valid: boolean;
        error?: string;
    };
    protected setVariable(key: string, value: any): void;
    protected getVariable(key: string): any;
    protected getPreviousOutput(nodeId: string): any;
    protected updateProgress(progress: number, status?: string): Promise<void>;
}
export declare function createNode(nodeType: string, context: WorkflowExecutionContext, nodeId: string, nodeData: Record<string, any>): BaseNode;
//# sourceMappingURL=BaseNode.d.ts.map