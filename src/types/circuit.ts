import type { Node, Edge } from '@xyflow/react';

// ─── Pin Definitions ───────────────────────────────────────────────────────────

export interface PinDefinition {
  id: string;
  label: string;
  position: 'left' | 'right' | 'top' | 'bottom';
}

// ─── Signal States ─────────────────────────────────────────────────────────────

export type SignalValue = 0 | 1;
export type SignalState = 'high' | 'low' | 'error' | 'unknown';

// ─── Component Categories ──────────────────────────────────────────────────────

export type ComponentCategory =
  | 'inputs'
  | 'gates'
  | 'outputs'
  | 'combinational'
  | 'sequential'
  | 'memory'
  | 'advanced';

// ─── Component Definition ──────────────────────────────────────────────────────

export interface TruthTableRow {
  inputs: Record<string, SignalValue>;
  outputs: Record<string, SignalValue>;
}

export interface ComponentDefinition {
  type: string;
  category: ComponentCategory;
  label: string;
  description: string;
  formula: string;
  inputs: PinDefinition[];
  outputs: PinDefinition[];
  truthTable: TruthTableRow[];
  evaluate: (inputs: Map<string, boolean>) => Map<string, boolean>;
  defaultProps: Record<string, unknown>;
  color: string;
}

// ─── Circuit Node Data ─────────────────────────────────────────────────────────

export interface CircuitNodeData {
  componentType: string;
  label: string;
  inputs: PinDefinition[];
  outputs: PinDefinition[];
  signalValues: Record<string, boolean>;
  properties: Record<string, unknown>;
  [key: string]: unknown;
}

export type CircuitNode = Node<CircuitNodeData>;

// ─── Circuit Edge Data ─────────────────────────────────────────────────────────

export interface CircuitEdgeData {
  signalState: SignalState;
  signalValue: boolean;
  animated: boolean;
  [key: string]: unknown;
}

export type CircuitEdge = Edge<CircuitEdgeData>;

// ─── Circuit State ─────────────────────────────────────────────────────────────

export interface CircuitState {
  nodes: CircuitNode[];
  edges: CircuitEdge[];
}

// ─── History Entry ─────────────────────────────────────────────────────────────

export interface HistoryEntry {
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  timestamp: number;
}

// ─── Project File ──────────────────────────────────────────────────────────────

export interface ProjectFile {
  version: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  circuit: CircuitState;
}

// ─── Drag Event Type ───────────────────────────────────────────────────────────

export interface DragComponentData {
  componentType: string;
  label: string;
}
