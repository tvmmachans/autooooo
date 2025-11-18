import React from 'react';
import { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
interface WorkflowCanvasProps {
    initialNodes?: Node[];
    initialEdges?: Edge[];
    onNodesChange?: (nodes: Node[]) => void;
    onEdgesChange?: (edges: Edge[]) => void;
}
export declare const WorkflowCanvas: React.FC<WorkflowCanvasProps>;
export {};
//# sourceMappingURL=WorkflowCanvas.d.ts.map