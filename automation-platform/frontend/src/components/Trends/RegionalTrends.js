import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
export const RegionalTrends = ({ region, language }) => {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchRegionalTrends();
    }, [region, language]);
    const fetchRegionalTrends = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/trends/regional?region=${region}&language=${language}`);
            const data = await response.json();
            setTrends(data.trends || []);
        }
        catch (error) {
            console.error('Failed to fetch regional trends:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const regionName = {
        'IN-KL': 'Kerala',
        'IN-TN': 'Tamil Nadu',
        'IN': 'India',
    }[region];
    return (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("h2", { className: "text-xl font-bold mb-2", children: [regionName, " Trends (", language, ")"] }), _jsxs("p", { className: "text-gray-600", children: ["Top trending topics specific to ", regionName, " in ", language] })] }), loading ? (_jsx("div", { className: "text-center py-8", children: "Loading regional trends..." })) : (_jsx("div", { className: "space-y-4", children: trends.map((trend, index) => (_jsxs("div", { className: "border rounded-lg p-4", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg", children: trend.keyword }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: trend.category })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-sm font-medium", children: ["Relevance: ", trend.relevanceScore.toFixed(0), "%"] }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Volume: ", trend.volume.toLocaleString()] })] })] }), _jsx("div", { className: "mt-2 flex gap-2", children: _jsxs("span", { className: `text-xs px-2 py-1 rounded ${trend.momentum > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: [trend.momentum > 0 ? '↑' : '↓', " ", Math.abs(trend.momentum)] }) })] }, index))) }))] }));
};
//# sourceMappingURL=RegionalTrends.js.map