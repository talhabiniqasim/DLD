import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type ReactFlowInstance,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CircuitNode from '@/nodes/CircuitNode';
import WireEdge from '@/edges/WireEdge';
import { useCircuitStore } from '@/store/circuitStore';
import { useUIStore } from '@/store/uiStore';
import type { CircuitNodeData, CircuitEdgeData } from '@/types/circuit';

type AppNode = Node<CircuitNodeData>;
type AppEdge = Edge<CircuitEdgeData>;
import type { DragComponentData } from '@/types/circuit';

// IMPORTANT: Define outside component to prevent re-renders
const nodeTypes = { circuitNode: CircuitNode };
const edgeTypes = { wire: WireEdge };

const CircuitCanvas: React.FC = () => {
  const {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    addNode, pushHistory,
  } = useCircuitStore();

  const { setSelectedNodeId } = useUIStore();
  const reactFlowRef = useRef<ReactFlowInstance<AppNode, AppEdge> | null>(null);

  // Handle drop from sidebar
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const data = event.dataTransfer.getData('application/logiclab-component');
    if (!data) return;

    const { componentType } = JSON.parse(data) as DragComponentData;
    if (!reactFlowRef.current) return;

    const position = reactFlowRef.current.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addNode(componentType, position);
  }, [addNode]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: { id: string }) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const onNodeDragStop = useCallback(() => {
    pushHistory();
  }, [pushHistory]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectOnClick
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={{ type: 'wire' }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      onNodeDragStop={onNodeDragStop}
      onInit={(instance) => { reactFlowRef.current = instance; }}
      fitView
      snapToGrid
      snapGrid={[15, 15]}
      minZoom={0.1}
      maxZoom={4}
      deleteKeyCode={['Backspace', 'Delete']}
      multiSelectionKeyCode={['Shift', 'Control', 'Meta']}
      panOnDrag={[1, 2]}
      selectionOnDrag
      proOptions={{ hideAttribution: true }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={15}
        size={1}
        color="#333333" /* dark dots so the canvas is mostly black but readable */
      />
      <Controls
        showInteractive={false}
        position="bottom-left"
      />
      <MiniMap
        nodeColor="#facc15"
        maskColor="rgba(8, 8, 12, 0.85)"
        position="bottom-right"
        pannable
        zoomable
      />
    </ReactFlow>
  );
};

export default CircuitCanvas;
