import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { VideoPreview } from '../components/Video/VideoPreview';
import { PlatformSelector } from '../components/Video/PlatformSelector';
export const VideoStudio = () => {
    const [selectedPlatforms, setSelectedPlatforms] = React.useState(['youtube']);
    const [platformConfigs, setPlatformConfigs] = React.useState({});
    return (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, children: [_jsx("h1", { className: "text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent", children: "Video Studio" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Create and publish videos" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2 space-y-6", children: _jsxs(Card, { glass: true, children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Video Preview" }), _jsx(VideoPreview, { videoUrl: "", status: "processing", isLoading: true })] }) }), _jsx("div", { children: _jsxs(Card, { glass: true, children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Platform Upload" }), _jsx(PlatformSelector, { selectedPlatforms: selectedPlatforms, onPlatformsChange: setSelectedPlatforms, configs: platformConfigs, onConfigChange: (platform, config) => {
                                        setPlatformConfigs(prev => ({
                                            ...prev,
                                            [platform]: { ...prev[platform], ...config },
                                        }));
                                    } })] }) })] })] }));
};
//# sourceMappingURL=VideoStudio.js.map