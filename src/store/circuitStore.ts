import { create } from 'zustand';
import {
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type XYPosition,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import type { CircuitNodeData, CircuitEdgeData, HistoryEntry } from '../types/circuit';
import { getComponentDefinition } from '../data/componentLibrary';
import { generateNodeId, generateEdgeId } from '../utils/idGenerator';
import { evaluateCircuit } from '../simulator/SimulationEngine';

// ─── Types ─────────────────────────────────────────────────────────────────────

type AppNode = Node<CircuitNodeData>;
type AppEdge = Edge<CircuitEdgeData>;

interface CircuitStore {
  // State
  nodes: AppNode[];
  edges: AppEdge[];
  signals: Map<string, boolean>;
  simulationErrors: string[];

  // History
  past: HistoryEntry[];
  future: HistoryEntry[];
  maxHistory: number;

  // Actions — React Flow callbacks
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // Actions — Node operations
  addNode: (componentType: string, position: XYPosition) => void;
  removeNode: (id: string) => void;
  updateNodeProperty: (id: string, key: string, value: unknown) => void;
  toggleInputState: (id: string) => void;

  // Actions — Simulation
  runSimulation: () => void;

  // Actions — History
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Actions — Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  clearCircuit: () => void;

  // Actions — Import/Export
  exportCircuit: () => string;
  importCircuit: (json: string) => void;
}

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useCircuitStore = create<CircuitStore>((set, get) => ({
  // ── Initial State ──────────────────────────────────────────────
  nodes: [],
  edges: [],
  signals: new Map(),
  simulationErrors: [],
  past: [],
  future: [],
  maxHistory: 50,

  // ── React Flow Change Handlers ─────────────────────────────────
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as AppNode[],
    }));
    // Run simulation after node changes
    setTimeout(() => get().runSimulation(), 0);
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges) as AppEdge[],
    }));
    setTimeout(() => get().runSimulation(), 0);
  },

  onConnect: (connection) => {
    get().pushHistory();
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          id: generateEdgeId(connection.source, connection.target),
          type: 'wire',
          data: { signalState: 'low' as const, signalValue: false, animated: false },
        },
        state.edges
      ) as AppEdge[],
    }));
    setTimeout(() => get().runSimulation(), 0);
  },

  // ── Add Node ───────────────────────────────────────────────────
  addNode: (componentType, position) => {
    const def = getComponentDefinition(componentType);
    if (!def) return;

    get().pushHistory();

    const newNode: AppNode = {
      id: generateNodeId(componentType),
      type: 'circuitNode',
      position,
      data: {
        componentType,
        label: def.label,
        inputs: def.inputs,
        outputs: def.outputs,
        signalValues: {},
        properties: { ...def.defaultProps },
      },
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));

    setTimeout(() => get().runSimulation(), 0);
  },

  // ── Remove Node ────────────────────────────────────────────────
  removeNode: (id) => {
    get().pushHistory();
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
    }));
    setTimeout(() => get().runSimulation(), 0);
  },

  // ── Update Node Property ───────────────────────────────────────
  updateNodeProperty: (id, key, value) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                properties: { ...n.data.properties, [key]: value },
              },
            }
          : n
      ),
    }));
    setTimeout(() => get().runSimulation(), 0);
  },

  // ── Toggle Input State ─────────────────────────────────────────
  toggleInputState: (id) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                properties: {
                  ...n.data.properties,
                  state: !(n.data.properties?.state as boolean ?? false),
                },
              },
            }
          : n
      ),
    }));
    setTimeout(() => get().runSimulation(), 0);
  },

  // ── Run Simulation ─────────────────────────────────────────────
  runSimulation: () => {
    const { nodes, edges } = get();
    const result = evaluateCircuit(nodes, edges);

    // Update signal values on nodes
    const updatedNodes = nodes.map((node) => {
      const newSignalValues: Record<string, boolean> = {};
      const def = getComponentDefinition(node.data.componentType);
      if (def) {
        for (const pin of [...def.inputs, ...def.outputs]) {
          const key = `${node.id}:${pin.id}`;
          if (result.signals.has(key)) {
            newSignalValues[pin.id] = result.signals.get(key)!;
          }
        }
      }
      return {
        ...node,
        data: { ...node.data, signalValues: newSignalValues },
      };
    });

    // Update edge signal states
    const updatedEdges = edges.map((edge) => {
      const sourceKey = `${edge.source}:${edge.sourceHandle || ''}`;
      const value = result.signals.get(sourceKey) ?? false;
      return {
        ...edge,
        data: {
          ...edge.data,
          signalValue: value,
          signalState: value ? ('high' as const) : ('low' as const),
          animated: value,
        },
      };
    });

    set({
      nodes: updatedNodes as AppNode[],
      edges: updatedEdges as AppEdge[],
      signals: result.signals,
      simulationErrors: result.errors,
    });
  },

  // ── History: Push ──────────────────────────────────────────────
  pushHistory: () => {
    const { nodes, edges, past, maxHistory } = get();
    const entry: HistoryEntry = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      timestamp: Date.now(),
    };
    const newPast = [...past, entry].slice(-maxHistory);
    set({ past: newPast, future: [] });
  },

  // ── History: Undo ──────────────────────────────────────────────
  undo: () => {
    const { past, nodes, edges, future } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    set({
      past: newPast,
      future: [
        ...future,
        {
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
          timestamp: Date.now(),
        },
      ],
      nodes: previous.nodes,
      edges: previous.edges,
    });

    setTimeout(() => get().runSimulation(), 0);
  },

  // ── History: Redo ──────────────────────────────────────────────
  redo: () => {
    const { future, nodes, edges, past } = get();
    if (future.length === 0) return;

    const next = future[future.length - 1];
    const newFuture = future.slice(0, -1);

    set({
      future: newFuture,
      past: [
        ...past,
        {
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
          timestamp: Date.now(),
        },
      ],
      nodes: next.nodes,
      edges: next.edges,
    });

    setTimeout(() => get().runSimulation(), 0);
  },

  // ── Persistence ────────────────────────────────────────────────
  saveToLocalStorage: () => {
    const { nodes, edges } = get();
    const data = JSON.stringify({ nodes, edges, savedAt: new Date().toISOString() });
    localStorage.setItem('logiclab-circuit', data);
  },

  loadFromLocalStorage: () => {
    try {
      const raw = localStorage.getItem('logiclab-circuit');
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.nodes && data.edges) {
        set({ nodes: data.nodes, edges: data.edges });
        setTimeout(() => get().runSimulation(), 0);
      }
    } catch {
      console.warn('Failed to load circuit from localStorage');
    }
  },

  clearCircuit: () => {
    get().pushHistory();
    set({ nodes: [], edges: [], signals: new Map(), simulationErrors: [] });
    localStorage.removeItem('logiclab-circuit');
  },

  // ── Export/Import ──────────────────────────────────────────────
  exportCircuit: () => {
    const { nodes, edges } = get();
    return JSON.stringify(
      {
        version: '1.0.0',
        name: 'LogicLab Circuit',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        circuit: { nodes, edges },
      },
      null,
      2
    );
  },

  importCircuit: (json) => {
    try {
      const data = JSON.parse(json);
      if (data.circuit?.nodes && data.circuit?.edges) {
        get().pushHistory();
        set({ nodes: data.circuit.nodes, edges: data.circuit.edges });
        setTimeout(() => get().runSimulation(), 0);
      }
    } catch {
      console.error('Failed to import circuit');
    }
  },
}));
