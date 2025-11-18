import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AINodeConfig } from '../components/AI/AINodeConfig';
import { ContentPreview } from '../components/AI/ContentPreview';
import { VoiceConfig } from '../components/AI/VoiceConfig';
import { TrendSelector } from '../components/AI/TrendSelector';
import { Sparkles } from 'lucide-react';
export const AIStudio = () => {
    const [config, setConfig] = React.useState({
        model: 'auto',
        language: 'malayalam',
        generationType: 'reel_script',
    });
    const [content, setContent] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);
    return (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, children: [_jsx("h1", { className: "text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent", children: "AI Studio" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Generate content with AI" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { glass: true, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Configuration" }), _jsxs(Button, { onClick: () => {
                                                    setIsGenerating(true);
                                                    // Simulate generation
                                                    setTimeout(() => {
                                                        setContent('Generated content will appear here...');
                                                        setIsGenerating(false);
                                                    }, 2000);
                                                }, isLoading: isGenerating, magnetic: true, children: [_jsx(Sparkles, { className: "w-4 h-4 mr-2" }), "Generate"] })] }), _jsx(AINodeConfig, { config: config, onChange: (newConfig) => setConfig(newConfig) })] }), _jsxs(Card, { glass: true, children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Preview" }), _jsx(ContentPreview, { content: content, isLoading: isGenerating, model: config.model, provider: config.model === 'auto' ? 'auto-selected' : config.model })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { glass: true, children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Voice Settings" }), _jsx(VoiceConfig, { config: { language: config.language }, onChange: () => { } })] }), _jsxs(Card, { glass: true, children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Trend Settings" }), _jsx(TrendSelector, { config: {
                                            platform: 'youtube',
                                            region: 'IN',
                                            language: config.language,
                                        }, onChange: () => { } })] })] })] })] }));
};
//# sourceMappingURL=AIStudio.js.map