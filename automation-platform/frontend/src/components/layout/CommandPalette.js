import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate } from 'react-router-dom';
import { Search, Workflow, Sparkles, Video, TrendingUp, Settings } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../lib/utils';
const commands = [
    { id: 'workflows', label: 'Go to Workflows', icon: Workflow, href: '/workflows' },
    { id: 'ai-studio', label: 'Open AI Studio', icon: Sparkles, href: '/ai-studio' },
    { id: 'video-studio', label: 'Open Video Studio', icon: Video, href: '/video-studio' },
    { id: 'trends', label: 'View Trends', icon: TrendingUp, href: '/trends' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];
export const CommandPalette = () => {
    const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    useHotkeys('ctrl+k, cmd+k', (e) => {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
    });
    useHotkeys('escape', () => {
        if (commandPaletteOpen) {
            setCommandPaletteOpen(false);
        }
    });
    const filteredCommands = commands.filter(cmd => cmd.label.toLowerCase().includes(search.toLowerCase()));
    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);
    const handleSelect = (command) => {
        navigate(command.href);
        setCommandPaletteOpen(false);
        setSearch('');
    };
    useHotkeys('arrowdown', () => {
        if (commandPaletteOpen) {
            setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        }
    }, { enabled: commandPaletteOpen });
    useHotkeys('arrowup', () => {
        if (commandPaletteOpen) {
            setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        }
    }, { enabled: commandPaletteOpen });
    useHotkeys('enter', () => {
        if (commandPaletteOpen && filteredCommands[selectedIndex]) {
            handleSelect(filteredCommands[selectedIndex]);
        }
    }, { enabled: commandPaletteOpen });
    return (_jsx(AnimatePresence, { children: commandPaletteOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setCommandPaletteOpen(false) }), _jsx(motion.div, { className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl", initial: { opacity: 0, scale: 0.95, y: -20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -20 }, transition: { type: 'spring', damping: 25, stiffness: 300 }, children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700", children: [_jsx(Search, { className: "w-5 h-5 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Type a command or search...", className: "flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400", value: search, onChange: (e) => setSearch(e.target.value), autoFocus: true }), _jsx("kbd", { className: "px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 rounded", children: "ESC" })] }), _jsx("div", { className: "max-h-96 overflow-y-auto", children: filteredCommands.length > 0 ? (filteredCommands.map((command, index) => (_jsxs(motion.button, { className: cn('w-full flex items-center gap-3 px-4 py-3 text-left transition-colors', index === selectedIndex
                                        ? 'bg-blue-50 dark:bg-blue-900/20'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'), onClick: () => handleSelect(command), whileHover: { x: 4 }, children: [_jsx(command.icon, { className: "w-5 h-5 text-gray-400" }), _jsx("span", { className: "text-gray-900 dark:text-gray-100", children: command.label })] }, command.id)))) : (_jsx("div", { className: "px-4 py-8 text-center text-gray-500", children: "No commands found" })) })] }) })] })) }));
};
//# sourceMappingURL=CommandPalette.js.map