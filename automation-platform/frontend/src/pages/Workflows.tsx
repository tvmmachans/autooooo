import React from 'react';
import { motion } from 'framer-motion';
import { WorkflowCanvas } from '../components/workflow/WorkflowCanvas';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Play, Save } from 'lucide-react';

export const Workflows: React.FC = () => {
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);

  return (
    <div className="h-screen flex flex-col">
      <motion.div
        className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-2xl font-bold">Workflow Builder</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button size="sm">
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Node
          </Button>
        </div>
      </motion.div>
      <div className="flex-1">
        <WorkflowCanvas
          initialNodes={nodes}
          initialEdges={edges}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
        />
      </div>
    </div>
  );
};

