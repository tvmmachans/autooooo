import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const VideoPreview = ({ videoUrl, thumbnailUrl, title, duration, status, isLoading, }) => {
    if (isLoading || status === 'processing') {
        return (_jsx("div", { className: "p-8 border rounded-lg bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Processing video..." })] }) }));
    }
    if (status === 'failed') {
        return (_jsx("div", { className: "p-8 border rounded-lg bg-red-50 text-center", children: _jsx("p", { className: "text-red-600", children: "Video generation failed" }) }));
    }
    return (_jsxs("div", { className: "border rounded-lg overflow-hidden", children: [videoUrl ? (_jsx("video", { src: videoUrl, controls: true, className: "w-full", poster: thumbnailUrl, children: "Your browser does not support the video tag." })) : thumbnailUrl ? (_jsx("img", { src: thumbnailUrl, alt: title || 'Video thumbnail', className: "w-full" })) : (_jsx("div", { className: "p-8 bg-gray-100 text-center text-gray-500", children: "No video preview available" })), title && (_jsxs("div", { className: "p-4 bg-white", children: [_jsx("h3", { className: "font-medium", children: title }), duration && (_jsxs("p", { className: "text-sm text-gray-500", children: ["Duration: ", Math.floor(duration / 60), ":", (duration % 60).toString().padStart(2, '0')] }))] }))] }));
};
//# sourceMappingURL=VideoPreview.js.map