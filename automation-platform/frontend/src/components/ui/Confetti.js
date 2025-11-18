import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { motion } from 'framer-motion';
export const Confetti = ({ trigger, onComplete }) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    useEffect(() => {
        if (trigger && onComplete) {
            const timer = setTimeout(onComplete, 3000);
            return () => clearTimeout(timer);
        }
    }, [trigger, onComplete]);
    if (!trigger)
        return null;
    return (_jsx("div", { className: "fixed inset-0 pointer-events-none z-50", children: Array.from({ length: 50 }).map((_, i) => (_jsx(motion.div, { className: "absolute w-2 h-2 rounded-full", style: {
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                left: `${Math.random() * 100}%`,
                top: '-10px',
            }, initial: { y: 0, rotate: 0, opacity: 1 }, animate: {
                y: window.innerHeight + 100,
                rotate: 360,
                opacity: 0,
                x: (Math.random() - 0.5) * 200,
            }, transition: {
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut',
            } }, i))) }));
};
//# sourceMappingURL=Confetti.js.map