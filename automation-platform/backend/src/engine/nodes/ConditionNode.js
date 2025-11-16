import { BaseNode } from './BaseNode.js';
export class ConditionNode extends BaseNode {
    async execute(input) {
        try {
            const config = this.getConfig();
            // Validate required configuration
            const validation = this.validateInput(config, ['conditions']);
            if (!validation.valid) {
                return {
                    success: false,
                    error: validation.error,
                };
            }
            this.log('info', 'Evaluating conditions', { input, config });
            // Evaluate conditions
            const result = await this.evaluateConditions(config.conditions, input);
            this.log('info', `Condition evaluation result: ${result.nextPath}`, { result });
            return {
                success: true,
                output: {
                    ...input,
                    conditionResult: result,
                    evaluatedAt: new Date().toISOString(),
                },
                nextNodeId: result.nextNodeId,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown condition error';
            this.log('error', `Condition evaluation failed: ${errorMessage}`, { error });
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    async evaluateConditions(conditions, input) {
        const evaluatedConditions = [];
        for (const condition of conditions) {
            const result = await this.evaluateSingleCondition(condition, input);
            evaluatedConditions.push({ condition, result });
            if (result) {
                // Condition met, return the corresponding path
                return {
                    nextPath: condition.path || 'true',
                    nextNodeId: condition.nextNodeId,
                    conditionMet: true,
                    evaluatedConditions,
                };
            }
        }
        // No conditions met, check for default/else path
        const defaultCondition = conditions.find(c => c.type === 'default' || c.isDefault);
        if (defaultCondition) {
            return {
                nextPath: defaultCondition.path || 'default',
                nextNodeId: defaultCondition.nextNodeId,
                conditionMet: false,
                evaluatedConditions,
            };
        }
        // No default path, throw error
        throw new Error('No conditions met and no default path defined');
    }
    async evaluateSingleCondition(condition, input) {
        const { type, field, operator, value, expression } = condition;
        switch (type) {
            case 'field_comparison':
                return this.evaluateFieldComparison(field, operator, value, input);
            case 'expression':
                return this.evaluateExpression(expression, input);
            case 'variable_check':
                return this.evaluateVariableCheck(condition.variable, operator, value);
            case 'time_based':
                return this.evaluateTimeBasedCondition(condition);
            case 'custom_logic':
                return this.evaluateCustomLogic(condition, input);
            default:
                this.log('warn', `Unknown condition type: ${type}`);
                return false;
        }
    }
    evaluateFieldComparison(field, operator, value, input) {
        const fieldValue = this.getNestedValue(input, field);
        switch (operator) {
            case 'equals':
            case '==':
                return fieldValue === value;
            case 'not_equals':
            case '!=':
                return fieldValue !== value;
            case 'greater_than':
            case '>':
                return typeof fieldValue === 'number' && typeof value === 'number' && fieldValue > value;
            case 'less_than':
            case '<':
                return typeof fieldValue === 'number' && typeof value === 'number' && fieldValue < value;
            case 'greater_equal':
            case '>=':
                return typeof fieldValue === 'number' && typeof value === 'number' && fieldValue >= value;
            case 'less_equal':
            case '<=':
                return typeof fieldValue === 'number' && typeof value === 'number' && fieldValue <= value;
            case 'contains':
                return typeof fieldValue === 'string' && typeof value === 'string' &&
                    fieldValue.toLowerCase().includes(value.toLowerCase());
            case 'starts_with':
                return typeof fieldValue === 'string' && typeof value === 'string' &&
                    fieldValue.toLowerCase().startsWith(value.toLowerCase());
            case 'ends_with':
                return typeof fieldValue === 'string' && typeof value === 'string' &&
                    fieldValue.toLowerCase().endsWith(value.toLowerCase());
            case 'in':
                return Array.isArray(value) && value.includes(fieldValue);
            case 'is_empty':
                return fieldValue === null || fieldValue === undefined ||
                    (typeof fieldValue === 'string' && fieldValue.trim() === '') ||
                    (Array.isArray(fieldValue) && fieldValue.length === 0);
            case 'is_not_empty':
                return fieldValue !== null && fieldValue !== undefined &&
                    (typeof fieldValue !== 'string' || fieldValue.trim() !== '') &&
                    (!Array.isArray(fieldValue) || fieldValue.length > 0);
            default:
                this.log('warn', `Unknown operator: ${operator}`);
                return false;
        }
    }
    evaluateExpression(expression, input) {
        try {
            // Simple expression evaluation - in production, use a proper expression engine
            if (expression.includes('&&')) {
                const parts = expression.split('&&').map(p => p.trim());
                return parts.every(part => this.evaluateSimpleExpression(part, input));
            }
            else if (expression.includes('||')) {
                const parts = expression.split('||').map(p => p.trim());
                return parts.some(part => this.evaluateSimpleExpression(part, input));
            }
            else {
                return this.evaluateSimpleExpression(expression, input);
            }
        }
        catch (error) {
            this.log('error', `Expression evaluation failed: ${expression}`, { error });
            return false;
        }
    }
    evaluateSimpleExpression(expression, input) {
        // Handle template expressions like {{field}} == "value"
        const parts = expression.split(/\s+/);
        if (parts.length === 3) {
            const [left, op, right] = parts;
            const leftValue = this.resolveValue(left, input);
            const rightValue = this.resolveValue(right, input);
            return this.compareValues(leftValue, op, rightValue);
        }
        // Handle single boolean expressions
        if (expression.startsWith('!')) {
            const innerExpr = expression.slice(1);
            return !this.evaluateSimpleExpression(innerExpr, input);
        }
        // Default to truthy check
        const value = this.resolveValue(expression, input);
        return Boolean(value);
    }
    resolveValue(expr, input) {
        if (expr.startsWith('{{') && expr.endsWith('}}')) {
            const path = expr.slice(2, -2).trim();
            return this.getNestedValue(input, path);
        }
        else if (expr.startsWith('"') && expr.endsWith('"')) {
            return expr.slice(1, -1);
        }
        else if (expr === 'true') {
            return true;
        }
        else if (expr === 'false') {
            return false;
        }
        else if (!isNaN(Number(expr))) {
            return Number(expr);
        }
        else {
            // Try to get from input
            return this.getNestedValue(input, expr);
        }
    }
    compareValues(left, op, right) {
        switch (op) {
            case '==': return left == right;
            case '===': return left === right;
            case '!=': return left != right;
            case '!==': return left !== right;
            case '>': return left > right;
            case '<': return left < right;
            case '>=': return left >= right;
            case '<=': return left <= right;
            default: return false;
        }
    }
    evaluateVariableCheck(variableName, operator, value) {
        const variableValue = this.getVariable(variableName);
        switch (operator) {
            case 'equals':
                return variableValue === value;
            case 'exists':
                return variableValue !== undefined;
            case 'not_exists':
                return variableValue === undefined;
            default:
                return false;
        }
    }
    evaluateTimeBasedCondition(condition) {
        const now = new Date();
        const { timeType, hour, minute, dayOfWeek, date } = condition;
        switch (timeType) {
            case 'time_of_day':
                return now.getHours() === hour && (!minute || now.getMinutes() === minute);
            case 'day_of_week':
                return now.getDay() === dayOfWeek; // 0 = Sunday, 1 = Monday, etc.
            case 'specific_date':
                const targetDate = new Date(date);
                return now.toDateString() === targetDate.toDateString();
            case 'time_range':
                const currentTime = now.getHours() * 60 + now.getMinutes();
                const startTime = condition.startHour * 60 + (condition.startMinute || 0);
                const endTime = condition.endHour * 60 + (condition.endMinute || 0);
                return currentTime >= startTime && currentTime <= endTime;
            default:
                return false;
        }
    }
    evaluateCustomLogic(condition, input) {
        // Placeholder for custom logic evaluation
        // In a real implementation, this could call custom functions or scripts
        this.log('info', 'Evaluating custom logic condition', { condition, input });
        return condition.result !== undefined ? condition.result : false;
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
}
//# sourceMappingURL=ConditionNode.js.map