import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
export const AnimatedNode = ({ data, selected }) => {
    const nodeColors = {
        start: 'from-green-500 to-emerald-600',
        end: 'from-red-500 to-rose-600',
        ai_content: 'from-blue-500 to-cyan-600',
        ai_video: 'from-purple-500 to-pink-600',
        trend_content: 'from-orange-500 to-amber-600',
        live_trend_finder: 'from-violet-500 to-purple-600',
        platform_upload: 'from-indigo-500 to-blue-600',
        default: 'from-gray-500 to-gray-600',
    };
    const colorClass = nodeColors[data.type] || nodeColors.default;
    return (_jsxs(motion.div, { className: cn('px-4 py-3 rounded-lg shadow-lg border-2 min-w-[150px]', `bg-gradient-to-r ${colorClass}`, selected ? 'border-blue-400 ring-2 ring-blue-400/50' : 'border-transparent'), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { type: 'spring', damping: 15 }, children: [_jsx(Handle, { type: "target", position: Position.Top, className: "w-3 h-3 bg-white border-2 border-blue-500" }), _jsx("div", { className: "text-white font-semibold text-sm", children: data.label || data.type }), data.description && (_jsx("div", { className: "text-white/80 text-xs mt-1", children: data.description })), _jsx(Handle, { type: "source", position: Position.Bottom, className: "w-3 h-3 bg-white border-2 border-blue-500" })] }));
};
//# sourceMappingURL=AnimatedNode.js.map