import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { TrendDashboard } from '../components/Trends/TrendDashboard';
import { RegionalTrends } from '../components/Trends/RegionalTrends';
import { Card } from '../components/ui/Card';
import { useState } from 'react';
export const Trends = () => {
    const [activeTab, setActiveTab] = useState('all');
    return (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, children: [_jsx("h1", { className: "text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent", children: "Trend Finder" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Discover trending topics" })] }), _jsxs(Card, { glass: true, children: [_jsx("div", { className: "flex gap-2 mb-6", children: ['all', 'kerala', 'tamil'].map((tab) => (_jsx(motion.button, { className: `px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab
                                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`, onClick: () => setActiveTab(tab), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: tab === 'all' ? 'All Trends' : tab === 'kerala' ? 'Kerala' : 'Tamil Nadu' }, tab))) }), activeTab === 'all' && _jsx(TrendDashboard, {}), activeTab === 'kerala' && _jsx(RegionalTrends, { region: "IN-KL", language: "malayalam" }), activeTab === 'tamil' && _jsx(RegionalTrends, { region: "IN-TN", language: "tamil" })] })] }));
};
//# sourceMappingURL=Trends.js.map