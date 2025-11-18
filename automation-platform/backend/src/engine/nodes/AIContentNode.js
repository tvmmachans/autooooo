import { AIContentService } from '../../services/ai/AIContentService.js';
export class AIContentNode {
    aiService;
    constructor() {
        this.aiService = new AIContentService();
    }
    async execute(context, input) {
        try {
            // Get node data from context or input
            const nodeData = context.nodeStates.get('nodeData') || input.nodeData || {};
            const config = nodeData.data?.ai_config || input.ai_config || {};
            const prompt = input.prompt || config.prompt || '';
            const language = config.language || 'english';
            const generationType = config.generation_type || 'general';
            const tone = config.tone;
            const platform = config.platform;
            const model = config.model || 'auto';
            const maxTokens = config.maxTokens || 1000;
            const temperature = config.temperature || 0.7;
            if (!prompt) {
                return {
                    success: false,
                    error: 'Prompt is required for AI content generation',
                };
            }
            const result = await this.aiService.generateContent({
                prompt,
                language,
                generationType,
                tone,
                platform,
                maxTokens,
                temperature,
                model,
            }, context.userId);
            return {
                success: true,
                output: {
                    content: result.text,
                    model: result.model,
                    provider: result.provider,
                    tokens: result.tokens,
                    language,
                    generationType,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'AI content generation failed',
            };
        }
    }
}
//# sourceMappingURL=AIContentNode.js.map