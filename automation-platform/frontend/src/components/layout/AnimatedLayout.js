import { jsx as _jsx } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
export const AnimatedLayout = ({ children }) => {
    const location = useLocation();
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3, ease: 'easeInOut' }, children: children }, location.pathname) }));
};
//# sourceMappingURL=AnimatedLayout.js.map