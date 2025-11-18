import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Workflow, Sparkles, Video, TrendingUp, Settings, Menu, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import { cn } from '../../lib/utils';
const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Workflows', href: '/workflows', icon: Workflow },
    { name: 'AI Studio', href: '/ai-studio', icon: Sparkles },
    { name: 'Video Studio', href: '/video-studio', icon: Video },
    { name: 'Trend Finder', href: '/trends', icon: TrendingUp },
    { name: 'Settings', href: '/settings', icon: Settings },
];
export const GlassSidebar = () => {
    const { sidebarOpen, toggleSidebar } = useUIStore();
    const location = useLocation();
    return (_jsxs(_Fragment, { children: [_jsx(motion.button, { className: "fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border border-white/20", onClick: toggleSidebar, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: sidebarOpen ? _jsx(X, { className: "w-6 h-6" }) : _jsx(Menu, { className: "w-6 h-6" }) }), _jsx(AnimatePresence, { children: sidebarOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: toggleSidebar }), _jsx(motion.aside, { "data-tour": "sidebar", className: cn('fixed left-0 top-0 h-full w-64 z-50', 'bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl', 'border-r border-white/20 dark:border-gray-700/20', 'shadow-2xl', 'lg:static lg:z-auto'), initial: { x: -280 }, animate: { x: 0 }, exit: { x: -280 }, transition: { type: 'spring', damping: 25, stiffness: 200 }, children: _jsxs("div", { className: "flex flex-col h-full p-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent", children: "Automation" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Platform" })] }), _jsx("nav", { className: "flex-1 space-y-2", children: navigation.map((item, index) => {
                                            const isActive = location.pathname === item.href;
                                            return (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, children: _jsxs(Link, { to: item.href, className: cn('flex items-center gap-3 px-4 py-3 rounded-lg transition-all', 'hover:bg-white/10 dark:hover:bg-gray-800/50', isActive
                                                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30'
                                                        : ''), onClick: () => {
                                                        if (window.innerWidth < 1024) {
                                                            toggleSidebar();
                                                        }
                                                    }, children: [_jsx(item.icon, { className: cn('w-5 h-5', isActive ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400') }), _jsx("span", { className: cn('font-medium', isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'), children: item.name })] }) }, item.href));
                                        }) }), _jsxs("div", { className: "mt-auto pt-6 border-t border-white/10 dark:border-gray-700/20 space-y-4", children: [_jsx("div", { className: "flex items-center justify-between px-4", children: _jsx(ThemeToggle, {}) }), _jsxs("div", { className: "flex items-center gap-3 px-4 py-2", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: "User" }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "user@example.com" })] })] })] })] }) })] })) })] }));
};
//# sourceMappingURL=GlassSidebar.js.map