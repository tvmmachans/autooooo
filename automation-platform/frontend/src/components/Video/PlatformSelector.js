import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PLATFORMS = [
    { value: 'youtube', label: 'YouTube', icon: '📺' },
    { value: 'instagram', label: 'Instagram Reels', icon: '📷' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'facebook', label: 'Facebook', icon: '👥' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
];
export const PlatformSelector = ({ selectedPlatforms, onPlatformsChange, onConfigChange, configs, }) => {
    const togglePlatform = (platform) => {
        if (selectedPlatforms.includes(platform)) {
            onPlatformsChange(selectedPlatforms.filter(p => p !== platform));
        }
        else {
            onPlatformsChange([...selectedPlatforms, platform]);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Select Platforms" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: PLATFORMS.map((platform) => (_jsxs("label", { className: `flex items-center p-3 border rounded cursor-pointer ${selectedPlatforms.includes(platform.value)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300'}`, children: [_jsx("input", { type: "checkbox", checked: selectedPlatforms.includes(platform.value), onChange: () => togglePlatform(platform.value), className: "mr-2" }), _jsx("span", { className: "mr-2", children: platform.icon }), _jsx("span", { children: platform.label })] }, platform.value))) })] }), selectedPlatforms.map((platform) => (_jsxs("div", { className: "p-4 border rounded", children: [_jsxs("h3", { className: "font-medium mb-3", children: [PLATFORMS.find(p => p.value === platform)?.label, " Settings"] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Title" }), _jsx("input", { type: "text", value: configs[platform]?.title || '', onChange: (e) => onConfigChange(platform, { title: e.target.value }), className: "w-full p-2 border rounded", placeholder: "Video title" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Description" }), _jsx("textarea", { value: configs[platform]?.description || '', onChange: (e) => onConfigChange(platform, { description: e.target.value }), className: "w-full p-2 border rounded", rows: 3, placeholder: "Video description" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Tags (comma-separated)" }), _jsx("input", { type: "text", value: configs[platform]?.tags?.join(', ') || '', onChange: (e) => onConfigChange(platform, {
                                            tags: e.target.value.split(',').map(t => t.trim()),
                                        }), className: "w-full p-2 border rounded", placeholder: "tag1, tag2, tag3" })] }), platform === 'youtube' && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Visibility" }), _jsxs("select", { value: configs[platform]?.visibility || 'public', onChange: (e) => onConfigChange(platform, {
                                            visibility: e.target.value,
                                        }), className: "w-full p-2 border rounded", children: [_jsx("option", { value: "public", children: "Public" }), _jsx("option", { value: "unlisted", children: "Unlisted" }), _jsx("option", { value: "private", children: "Private" })] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Schedule (Optional)" }), _jsx("input", { type: "datetime-local", value: configs[platform]?.scheduledAt || '', onChange: (e) => onConfigChange(platform, { scheduledAt: e.target.value }), className: "w-full p-2 border rounded" })] })] })] }, platform)))] }));
};
//# sourceMappingURL=PlatformSelector.js.map