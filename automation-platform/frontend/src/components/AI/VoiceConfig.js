import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
const LANGUAGES = [
    { value: 'malayalam', label: 'Malayalam' },
    { value: 'english', label: 'English' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'hindi', label: 'Hindi' },
];
export const VoiceConfig = ({ config, onChange }) => {
    const [localConfig, setLocalConfig] = useState(config);
    const updateConfig = (updates) => {
        const newConfig = { ...localConfig, ...updates };
        setLocalConfig(newConfig);
        onChange(newConfig);
    };
    return (_jsxs("div", { className: "space-y-4 p-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Language" }), _jsx("select", { value: localConfig.language, onChange: (e) => updateConfig({ language: e.target.value }), className: "w-full p-2 border rounded", children: LANGUAGES.map((lang) => (_jsx("option", { value: lang.value, children: lang.label }, lang.value))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Voice (Optional)" }), _jsx("input", { type: "text", value: localConfig.voice || '', onChange: (e) => updateConfig({ voice: e.target.value }), placeholder: "Leave empty for default voice", className: "w-full p-2 border rounded" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium mb-1", children: ["Speed: ", localConfig.speed || 1.0, "x"] }), _jsx("input", { type: "range", min: "0.5", max: "2", step: "0.1", value: localConfig.speed || 1.0, onChange: (e) => updateConfig({ speed: parseFloat(e.target.value) }), className: "w-full" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Format" }), _jsxs("select", { value: localConfig.format || 'mp3', onChange: (e) => updateConfig({ format: e.target.value }), className: "w-full p-2 border rounded", children: [_jsx("option", { value: "mp3", children: "MP3" }), _jsx("option", { value: "wav", children: "WAV" })] })] })] }));
};
//# sourceMappingURL=VoiceConfig.js.map