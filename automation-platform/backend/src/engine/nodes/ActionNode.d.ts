import { BaseNode } from './BaseNode.js';
import type { NodeExecutionResult } from './BaseNode.js';
export declare class ActionNode extends BaseNode {
    execute(input: Record<string, any>): Promise<NodeExecutionResult>;
    private executeAction;
    private executeHttpRequest;
    private executeDataTransform;
    private executeDelay;
    private executeSetVariable;
    private executeLogMessage;
    private evaluateExpression;
    private getNestedValue;
}
//# sourceMappingURL=ActionNode.d.ts.map