import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { WorkflowCanvas } from '../components/workflow/WorkflowCanvas';
import { Button } from '../components/ui/Button';
import { Plus, Play, Save } from 'lucide-react';
export const Workflows = () => {
    const [nodes, setNodes] = React.useState([]);
    const [edges, setEdges] = React.useState([]);
    return (_jsxs("div", { className: "h-screen flex flex-col", children: [_jsxs(motion.div, { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md", initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, children: [_jsx("h1", { className: "text-2xl font-bold", children: "Workflow Builder" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "ghost", size: "sm", children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), "Save"] }), _jsxs(Button, { size: "sm", children: [_jsx(Play, { className: "w-4 h-4 mr-2" }), "Run"] }), _jsxs(Button, { variant: "secondary", size: "sm", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add Node"] })] })] }), _jsx("div", { className: "flex-1", children: _jsx(WorkflowCanvas, { initialNodes: nodes, initialEdges: edges, onNodesChange: setNodes, onEdgesChange: setEdges }) })] }));
};
//# sourceMappingURL=Workflows.js.map