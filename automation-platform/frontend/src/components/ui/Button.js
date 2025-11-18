import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, magnetic = false, children, ...props }, ref) => {
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const handleMouseMove = (e) => {
        if (!magnetic)
            return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setPosition({ x: x * 0.3, y: y * 0.3 });
    };
    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };
    const variants = {
        primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/50',
        secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600',
        ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
        danger: 'bg-red-500 text-white hover:bg-red-600',
    };
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };
    return (_jsx(motion.button, { ref: ref, className: cn('relative rounded-lg font-medium transition-all duration-200', 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2', 'disabled:opacity-50 disabled:cursor-not-allowed', variants[variant], sizes[size], className), style: magnetic ? { x: position.x, y: position.y } : undefined, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, ...props, children: isLoading ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(motion.div, { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full", animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: 'linear' } }), "Loading..."] })) : (children) }));
});
Button.displayName = 'Button';
//# sourceMappingURL=Button.js.map