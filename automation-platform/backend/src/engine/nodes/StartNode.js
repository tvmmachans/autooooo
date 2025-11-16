import { BaseNode } from './BaseNode.js';
export class StartNode extends BaseNode {
    async execute(input) {
        this.log('info', 'Workflow execution started', { input });
        // Start node simply passes through the input data
        // It can also initialize any workflow-level variables
        const config = this.getConfig();
        if (config.initializeVariables) {
            // Initialize variables from config
            Object.entries(config.initializeVariables).forEach(([key, value]) => {
                this.setVariable(key, value);
            });
        }
        return {
            success: true,
            output: {
                ...input,
                startedAt: new Date().toISOString(),
            },
        };
    }
}
//# sourceMappingURL=StartNode.js.map