import React from 'react';
export interface AIConfig {
    model: 'auto' | 'sarvam' | 'groq' | 'gemini' | 'deepseek';
    language: string;
    generationType: 'reel_script' | 'caption' | 'blog' | 'translation' | 'general';
    tone?: string;
    platform?: string;
    maxTokens?: number;
    temperature?: number;
}
interface AINodeConfigProps {
    config: AIConfig;
    onChange: (config: AIConfig) => void;
}
export declare const AINodeConfig: React.FC<AINodeConfigProps>;
export {};
//# sourceMappingURL=AINodeConfig.d.ts.map