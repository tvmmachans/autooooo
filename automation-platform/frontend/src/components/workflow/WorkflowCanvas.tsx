import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AnimatedNode } from './AnimatedNode';
import { motion } from 'framer-motion';

const nodeTypes = {
  animated: AnimatedNode,
};

interface WorkflowCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
}) => {
  const [nodes, , onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  React.useEffect(() => {
    if (onNodesChange) {
      onNodesChange(nodes);
    }
  }, [nodes, onNodesChange]);

  React.useEffect(() => {
    if (onEdgesChange) {
      onEdgesChange(edges);
    }
  }, [edges, onEdgesChange]);

  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeInternal}
        onEdgesChange={onEdgesChangeInternal}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50 dark:bg-gray-900"
      >
        <Background gap={12} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'ai_content':
              case 'ai_video':
                return '#3b82f6';
              case 'trend_content':
              case 'live_trend_finder':
                return '#8b5cf6';
              default:
                return '#6b7280';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </motion.div>
  );
};

