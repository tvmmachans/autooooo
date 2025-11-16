import { BaseNode } from './BaseNode.js';
import type { NodeExecutionResult } from './BaseNode.js';

export class EndNode extends BaseNode {
  async execute(input: Record<string, any>): Promise<NodeExecutionResult> {
    this.log('info', 'Workflow execution completed', { input });

    const config = this.getConfig();

    // End node can perform final processing or cleanup
    let finalOutput = { ...input };

    if (config.finalizeVariables) {
      // Add any final variables to output
      Object.entries(config.finalizeVariables).forEach(([key, value]) => {
        finalOutput[key] = value;
      });
    }

    if (config.cleanup) {
      // Perform cleanup operations
      await this.performCleanup(config.cleanup);
    }

    // Mark execution as complete
    finalOutput.completedAt = new Date().toISOString();
    finalOutput.executionDuration = Date.now() - this.context.startTime.getTime();

    return {
      success: true,
      output: finalOutput,
    };
  }

  private async performCleanup(cleanupConfig: Record<string, any>): Promise<void> {
    // Perform cleanup operations based on configuration
    if (cleanupConfig.clearVariables) {
      // Clear workflow variables
      this.context.variables.clear();
    }

    if (cleanupConfig.logSummary) {
      // Log execution summary
      const summary = {
        executionId: this.context.executionId,
        workflowId: this.context.workflowId,
        nodeCount: this.context.nodeStates.size,
        duration: Date.now() - this.context.startTime.getTime(),
        variables: Object.fromEntries(this.context.variables),
      };

      this.log('info', 'Workflow execution summary', summary);
    }

    if (cleanupConfig.sendNotification) {
      // In a real implementation, this would send notifications
      this.log('info', 'Sending workflow completion notification', {
        workflowId: this.context.workflowId,
        executionId: this.context.executionId,
      });
    }
  }
}
