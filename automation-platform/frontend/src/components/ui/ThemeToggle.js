import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
export const ThemeToggle = () => {
    const { setTheme, resolvedTheme } = useThemeStore();
    const toggleTheme = () => {
        if (resolvedTheme === 'light') {
            setTheme('dark');
        }
        else {
            setTheme('light');
        }
    };
    return (_jsx(motion.button, { onClick: toggleTheme, className: "p-2 rounded-lg bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-colors", whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, "aria-label": "Toggle theme", children: _jsx(motion.div, { initial: false, animate: { rotate: resolvedTheme === 'dark' ? 180 : 0 }, transition: { duration: 0.3 }, children: resolvedTheme === 'dark' ? (_jsx(Sun, { className: "w-5 h-5 text-yellow-400" })) : (_jsx(Moon, { className: "w-5 h-5 text-gray-700" })) }) }));
};
//# sourceMappingURL=ThemeToggle.js.map