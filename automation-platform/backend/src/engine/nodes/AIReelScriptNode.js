import { AIContentService } from '../../services/ai/AIContentService.js';
export class AIReelScriptNode {
    aiService;
    constructor() {
        this.aiService = new AIContentService();
    }
    async execute(context, input) {
        try {
            const nodeData = context.nodeStates.get('nodeData') || input.nodeData || {};
            const config = nodeData.data?.reel_config || input.reel_config || {};
            const topic = input.topic || config.topic || '';
            const language = config.language || 'english';
            const tone = config.tone || 'engaging';
            const platform = config.platform || 'instagram';
            const duration = config.duration || 60; // seconds
            if (!topic) {
                return {
                    success: false,
                    error: 'Topic is required for reel script generation',
                };
            }
            const prompt = `Create a ${duration}-second reel script about: ${topic}`;
            const result = await this.aiService.generateContent({
                prompt,
                language,
                generationType: 'reel_script',
                tone,
                platform,
                model: 'deepseek', // Best for viral content
            }, context.userId);
            // Parse the generated script into structured format
            const parsedScript = this.parseReelScript(result.text, language);
            return {
                success: true,
                output: {
                    script: parsedScript,
                    rawText: result.text,
                    model: result.model,
                    provider: result.provider,
                    language,
                    platform,
                    duration,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Reel script generation failed',
            };
        }
    }
    parseReelScript(text, language) {
        // Parse the AI-generated script into structured components
        // This is a simplified parser - you may want to use more sophisticated parsing
        const lines = text.split('\n').filter(line => line.trim());
        const script = {
            hook: '',
            story: '',
            value: '',
            cta: '',
            hashtags: [],
        };
        let currentSection = '';
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('hook') || lowerLine.includes('attention')) {
                currentSection = 'hook';
                script.hook = line.replace(/^.*hook.*?:?\s*/i, '').trim();
            }
            else if (lowerLine.includes('story') || lowerLine.includes('content') || lowerLine.includes('main')) {
                currentSection = 'story';
                script.story = line.replace(/^.*story.*?:?\s*/i, '').trim();
            }
            else if (lowerLine.includes('value') || lowerLine.includes('learn')) {
                currentSection = 'value';
                script.value = line.replace(/^.*value.*?:?\s*/i, '').trim();
            }
            else if (lowerLine.includes('cta') || lowerLine.includes('call to action') || lowerLine.includes('action')) {
                currentSection = 'cta';
                script.cta = line.replace(/^.*cta.*?:?\s*/i, '').trim();
            }
            else if (lowerLine.includes('hashtag') || lowerLine.startsWith('#')) {
                const hashtags = line.match(/#\w+/g) || [];
                script.hashtags.push(...hashtags.map(h => h.substring(1)));
            }
            else if (currentSection && script[currentSection]) {
                script[currentSection] += ' ' + line.trim();
            }
            else if (currentSection) {
                script[currentSection] = line.trim();
            }
        }
        // Fallback: if parsing failed, use the raw text
        if (!script.hook && !script.story) {
            const parts = text.split(/\n\n+/);
            script.hook = parts[0] || text.substring(0, 100);
            script.story = parts.slice(1, -1).join('\n\n') || text.substring(100);
            script.value = parts[parts.length - 1] || '';
        }
        return script;
    }
}
//# sourceMappingURL=AIReelScriptNode.js.map