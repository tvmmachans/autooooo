import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
export const TrendDashboard = ({ region = 'IN', language = 'english', }) => {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    useEffect(() => {
        fetchTrends();
    }, [region, language]);
    const fetchTrends = async () => {
        setLoading(true);
        try {
            // API call to fetch trends
            const response = await fetch(`/api/trends?region=${region}&language=${language}`);
            const data = await response.json();
            setTrends(data.trends || []);
        }
        catch (error) {
            console.error('Failed to fetch trends:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const categories = ['all', ...Array.from(new Set(trends.map(t => t.category)))];
    const filteredTrends = selectedCategory === 'all'
        ? trends
        : trends.filter(t => t.category === selectedCategory);
    return (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: "Trend Dashboard" }), _jsx("div", { className: "flex gap-4", children: _jsx("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "p-2 border rounded", children: categories.map(cat => (_jsx("option", { value: cat, children: cat }, cat))) }) })] }), loading ? (_jsx("div", { className: "text-center py-8", children: "Loading trends..." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredTrends.map((trend, index) => (_jsxs("div", { className: "border rounded-lg p-4 hover:shadow-lg transition", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h3", { className: "font-semibold text-lg", children: trend.keyword }), _jsxs("span", { className: "text-sm text-gray-500", children: ["#", index + 1] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Volume:" }), _jsx("span", { className: "font-medium", children: trend.volume.toLocaleString() })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Momentum:" }), _jsxs("span", { className: `font-medium ${trend.momentum > 0 ? 'text-green-600' : 'text-red-600'}`, children: [trend.momentum > 0 ? '+' : '', trend.momentum] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Trend Score:" }), _jsx("span", { className: "font-medium", children: trend.trendScore.toFixed(1) })] }), _jsx("div", { className: "flex gap-2 mt-2", children: trend.sources.map((source, i) => (_jsx("span", { className: "text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded", children: source }, i))) })] })] }, index))) }))] }));
};
//# sourceMappingURL=TrendDashboard.js.map