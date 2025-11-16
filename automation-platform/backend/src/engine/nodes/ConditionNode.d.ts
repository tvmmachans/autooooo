import { BaseNode } from './BaseNode.js';
import type { NodeExecutionResult } from './BaseNode.js';
export declare class ConditionNode extends BaseNode {
    execute(input: Record<string, any>): Promise<NodeExecutionResult>;
    private evaluateConditions;
    private evaluateSingleCondition;
    private evaluateFieldComparison;
    private evaluateExpression;
    private evaluateSimpleExpression;
    private resolveValue;
    private compareValues;
    private evaluateVariableCheck;
    private evaluateTimeBasedCondition;
    private evaluateCustomLogic;
    private getNestedValue;
}
//# sourceMappingURL=ConditionNode.d.ts.map