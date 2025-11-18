import { AIContentService } from '../../services/ai/AIContentService.js';
export class ContentTranslateNode {
    aiService;
    constructor() {
        this.aiService = new AIContentService();
    }
    async execute(context, input) {
        try {
            const nodeData = context.nodeStates.get('nodeData') || input.nodeData || {};
            const config = nodeData.data?.translate_config || input.translate_config || {};
            const text = input.text || input.content || '';
            const sourceLanguage = config.sourceLanguage || input.sourceLanguage || 'auto';
            const targetLanguage = config.targetLanguage || config.language || 'english';
            if (!text) {
                return {
                    success: false,
                    error: 'Text to translate is required',
                };
            }
            // Select best model for translation
            const model = this.selectTranslationModel(targetLanguage);
            const result = await this.aiService.generateContent({
                prompt: text,
                language: targetLanguage,
                generationType: 'translation',
                model,
            }, context.userId);
            return {
                success: true,
                output: {
                    originalText: text,
                    translatedText: result.text,
                    sourceLanguage,
                    targetLanguage,
                    model: result.model,
                    provider: result.provider,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Translation failed',
            };
        }
    }
    selectTranslationModel(targetLanguage) {
        // Use Sarvam for Indian languages
        const indianLanguages = [
            'malayalam', 'tamil', 'hindi', 'telugu', 'kannada',
            'bengali', 'gujarati', 'marathi', 'punjabi', 'urdu',
        ];
        if (indianLanguages.includes(targetLanguage.toLowerCase())) {
            return 'sarvam';
        }
        // Use Groq for fast translations
        return 'groq';
    }
}
//# sourceMappingURL=ContentTranslateNode.js.map