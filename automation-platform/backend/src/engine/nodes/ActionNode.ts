import { BaseNode } from './BaseNode.js';
import type { NodeExecutionResult } from './BaseNode.js';

export class ActionNode extends BaseNode {
  async execute(input: Record<string, any>): Promise<NodeExecutionResult> {
    try {
      const config = this.getConfig();

      // Validate required configuration
      const validation = this.validateInput(config, ['actionType']);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      this.log('info', `Executing action: ${config.actionType}`, { input, config });

      // Execute the action based on type
      const result = await this.executeAction(config.actionType, input, config);

      this.log('info', `Action ${config.actionType} completed`, { result });

      return {
        success: true,
        output: result,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown action error';
      this.log('error', `Action execution failed: ${errorMessage}`, { error });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  private async executeAction(actionType: string, input: Record<string, any>, config: Record<string, any>): Promise<Record<string, any>> {
    switch (actionType) {
      case 'http_request':
        return this.executeHttpRequest(input, config);

      case 'transform_data':
        return this.executeDataTransform(input, config);

      case 'delay':
        return this.executeDelay(input, config);

      case 'set_variable':
        return this.executeSetVariable(input, config);

      case 'log_message':
        return this.executeLogMessage(input, config);

      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  }

  private async executeHttpRequest(input: Record<string, any>, config: Record<string, any>): Promise<Record<string, any>> {
    const { url, method = 'GET', headers = {}, body } = config;

    if (!url) {
      throw new Error('HTTP request requires url configuration');
    }

    // In a real implementation, this would make actual HTTP requests
    // For now, we'll simulate the response
    this.log('info', `Making HTTP ${method} request to ${url}`);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      status: 200,
      data: { message: 'HTTP request simulated', input },
      headers: { 'content-type': 'application/json' },
    };
  }

  private executeDataTransform(input: Record<string, any>, config: Record<string, any>): Record<string, any> {
    const { transformations = [] } = config;

    let result = { ...input };

    for (const transform of transformations) {
      switch (transform.type) {
        case 'map':
          if (transform.field && transform.expression) {
            // Simple field mapping
            result[transform.field] = this.evaluateExpression(transform.expression, result);
          }
          break;

        case 'filter':
          if (transform.condition) {
            const condition = this.evaluateExpression(transform.condition, result);
            if (!condition) {
              throw new Error('Data transformation filter condition failed');
            }
          }
          break;

        case 'add':
          if (transform.field && transform.value !== undefined) {
            result[transform.field] = transform.value;
          }
          break;

        case 'remove':
          if (transform.field) {
            delete result[transform.field];
          }
          break;
      }
    }

    return result;
  }

  private async executeDelay(input: Record<string, any>, config: Record<string, any>): Promise<Record<string, any>> {
    const { duration = 1000 } = config; // Default 1 second

    this.log('info', `Delaying execution for ${duration}ms`);
    await new Promise(resolve => setTimeout(resolve, duration));

    return {
      ...input,
      delayedAt: new Date().toISOString(),
    };
  }

  private executeSetVariable(input: Record<string, any>, config: Record<string, any>): Record<string, any> {
    const { variableName, variableValue } = config;

    if (!variableName) {
      throw new Error('Set variable action requires variableName');
    }

    this.setVariable(variableName, variableValue);

    return {
      ...input,
      variableSet: { name: variableName, value: variableValue },
    };
  }

  private executeLogMessage(input: Record<string, any>, config: Record<string, any>): Record<string, any> {
    const { message, level = 'info' } = config;

    const logMessage = message || 'Custom log message';
    this.log(level as 'info' | 'warn' | 'error', logMessage, { input, config });

    return {
      ...input,
      logged: true,
      logMessage,
    };
  }

  private evaluateExpression(expression: string, context: Record<string, any>): any {
    // Simple expression evaluator - in production, use a proper expression engine
    try {
      // Basic variable substitution
      if (expression.startsWith('{{') && expression.endsWith('}}')) {
        const path = expression.slice(2, -2).trim();
        return this.getNestedValue(context, path);
      }

      // For now, return the expression as-is if it's not a template
      return expression;
    } catch (error) {
      this.log('warn', `Expression evaluation failed: ${expression}`, { error });
      return null;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}
