import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const LANGUAGES = [
    { value: 'malayalam', label: 'Malayalam' },
    { value: 'english', label: 'English' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'telugu', label: 'Telugu' },
    { value: 'kannada', label: 'Kannada' },
];
const MODELS = [
    { value: 'auto', label: 'Auto (Smart Selection)' },
    { value: 'sarvam', label: 'Sarvam AI (Malayalam/Indian)' },
    { value: 'groq', label: 'Groq Llama 3.1 (Fast Multilingual)' },
    { value: 'gemini', label: 'Gemini Flash 2.0 (Creative)' },
    { value: 'deepseek', label: 'DeepSeek (Trending/Viral)' },
];
const GENERATION_TYPES = [
    { value: 'reel_script', label: 'Reel Script' },
    { value: 'caption', label: 'Social Media Caption' },
    { value: 'blog', label: 'Blog Post' },
    { value: 'translation', label: 'Translation' },
    { value: 'general', label: 'General Content' },
];
export const AINodeConfig = ({ config, onChange }) => {
    const [localConfig, setLocalConfig] = useState(config);
    const updateConfig = (updates) => {
        const newConfig = { ...localConfig, ...updates };
        setLocalConfig(newConfig);
        onChange(newConfig);
    };
    return (_jsxs("div", { className: "space-y-4 p-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Model" }), _jsx("select", { value: localConfig.model, onChange: (e) => updateConfig({ model: e.target.value }), className: "w-full p-2 border rounded", children: MODELS.map((model) => (_jsx("option", { value: model.value, children: model.label }, model.value))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Language" }), _jsx("select", { value: localConfig.language, onChange: (e) => updateConfig({ language: e.target.value }), className: "w-full p-2 border rounded", children: LANGUAGES.map((lang) => (_jsx("option", { value: lang.value, children: lang.label }, lang.value))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Content Type" }), _jsx("select", { value: localConfig.generationType, onChange: (e) => updateConfig({ generationType: e.target.value }), className: "w-full p-2 border rounded", children: GENERATION_TYPES.map((type) => (_jsx("option", { value: type.value, children: type.label }, type.value))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Tone (Optional)" }), _jsx("input", { type: "text", value: localConfig.tone || '', onChange: (e) => updateConfig({ tone: e.target.value }), placeholder: "e.g., engaging, professional, casual", className: "w-full p-2 border rounded" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Platform (Optional)" }), _jsx("input", { type: "text", value: localConfig.platform || '', onChange: (e) => updateConfig({ platform: e.target.value }), placeholder: "e.g., instagram, youtube, facebook", className: "w-full p-2 border rounded" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Max Tokens" }), _jsx("input", { type: "number", value: localConfig.maxTokens || 1000, onChange: (e) => updateConfig({ maxTokens: parseInt(e.target.value) }), className: "w-full p-2 border rounded", min: 100, max: 4000 })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Temperature" }), _jsx("input", { type: "number", value: localConfig.temperature || 0.7, onChange: (e) => updateConfig({ temperature: parseFloat(e.target.value) }), className: "w-full p-2 border rounded", min: 0, max: 2, step: 0.1 })] })] })] }));
};
//# sourceMappingURL=AINodeConfig.js.map