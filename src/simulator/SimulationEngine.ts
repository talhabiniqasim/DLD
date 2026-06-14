import type { CircuitNode, CircuitEdge } from '../types/circuit';
import { getComponentDefinition } from '../data/componentLibrary';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface EvaluationResult {
  signals: Map<string, boolean>; // "nodeId:pinId" → value
  errors: string[];
}

// ─── Build adjacency from edges ────────────────────────────────────────────────

function buildGraph(nodes: CircuitNode[], edges: CircuitEdge[]) {
  const adjacency = new Map<string, Set<string>>();     // nodeId → set of downstream nodeIds
  const inDegree = new Map<string, number>();            // nodeId → number of incoming edges
  const edgeMap = new Map<string, { sourcePin: string; targetPin: string }[]>(); // targetNodeId → [{sourcePin, targetPin}]

  // Initialize all nodes
  for (const node of nodes) {
    adjacency.set(node.id, new Set());
    inDegree.set(node.id, 0);
    edgeMap.set(node.id, []);
  }

  // Build from edges
  for (const edge of edges) {
    if (!edge.source || !edge.target) continue;

    const sourceNodeId = edge.source;
    const targetNodeId = edge.target;
    const sourcePin = edge.sourceHandle || '';
    const targetPin = edge.targetHandle || '';

    // Add adjacency
    const neighbors = adjacency.get(sourceNodeId);
    if (neighbors) {
      neighbors.add(targetNodeId);
    }

    // Increment in-degree
    inDegree.set(targetNodeId, (inDegree.get(targetNodeId) || 0) + 1);

    // Track which pin connections exist for the target node
    const targetEdges = edgeMap.get(targetNodeId) || [];
    targetEdges.push({
      sourcePin: `${sourceNodeId}:${sourcePin}`,
      targetPin,
    });
    edgeMap.set(targetNodeId, targetEdges);
  }

  return { adjacency, inDegree, edgeMap };
}

// ─── Topological Sort (Kahn's Algorithm) ───────────────────────────────────────

function topologicalSort(
  adjacency: Map<string, Set<string>>,
  inDegree: Map<string, number>
): { sorted: string[]; hasCycle: boolean } {
  const sorted: string[] = [];
  const queue: string[] = [];

  // Find all nodes with in-degree 0
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  const visited = new Set<string>();
  let iterations = 0;
  const maxIterations = 10000; // Infinite loop protection

  while (queue.length > 0 && iterations < maxIterations) {
    iterations++;
    const current = queue.shift()!;

    if (visited.has(current)) continue;
    visited.add(current);
    sorted.push(current);

    const neighbors = adjacency.get(current) || new Set();
    for (const neighbor of neighbors) {
      const newDegree = (inDegree.get(neighbor) || 1) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0 && !visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  const hasCycle = sorted.length < adjacency.size;
  return { sorted, hasCycle };
}

// ─── Evaluate Circuit ──────────────────────────────────────────────────────────

export function evaluateCircuit(
  nodes: CircuitNode[],
  edges: CircuitEdge[]
): EvaluationResult {
  const signals = new Map<string, boolean>();
  const errors: string[] = [];

  if (nodes.length === 0) return { signals, errors };

  // Build graph
  const { adjacency, inDegree, edgeMap } = buildGraph(nodes, edges);

  // Topological sort
  const { sorted, hasCycle } = topologicalSort(adjacency, inDegree);

  if (hasCycle) {
    errors.push('Circuit contains a feedback loop. Sequential elements may not evaluate correctly.');
  }

  // Create a node lookup
  const nodeMap = new Map<string, CircuitNode>();
  for (const node of nodes) {
    nodeMap.set(node.id, node);
  }

  // Initialize signals from input components (their state is self-determined)
  for (const node of nodes) {
    const def = getComponentDefinition(node.data.componentType);
    if (!def) continue;

    if (def.category === 'inputs') {
      // Input components determine their own output from their properties
      const state = node.data.properties?.state as boolean ?? false;
      for (const output of def.outputs) {
        signals.set(`${node.id}:${output.id}`, state);
      }
    }
  }

  // Evaluate nodes in topological order
  for (const nodeId of sorted) {
    const node = nodeMap.get(nodeId);
    if (!node) continue;

    const def = getComponentDefinition(node.data.componentType);
    if (!def) continue;

    // Skip input components — already initialized
    if (def.category === 'inputs') continue;

    // Gather input values from connected wires
    const inputValues = new Map<string, boolean>();
    const connections = edgeMap.get(nodeId) || [];

    for (const conn of connections) {
      const sourceValue = signals.get(conn.sourcePin) ?? false;
      inputValues.set(conn.targetPin, sourceValue);
    }

    // Evaluate the component logic
    if (def.category !== 'outputs') {
      const outputValues = def.evaluate(inputValues);
      for (const [pinId, value] of outputValues) {
        signals.set(`${nodeId}:${pinId}`, value);
      }
    }

    // Store input pin values for output components too (for display)
    for (const conn of connections) {
      const sourceValue = signals.get(conn.sourcePin) ?? false;
      signals.set(`${nodeId}:${conn.targetPin}`, sourceValue);
    }
  }

  return { signals, errors };
}

// ─── Detect feedback loops ─────────────────────────────────────────────────────

export function detectCycles(nodes: CircuitNode[], edges: CircuitEdge[]): string[][] {
  const { adjacency } = buildGraph(nodes, edges);
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const path: string[] = [];

  function dfs(nodeId: string): void {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const neighbors = adjacency.get(nodeId) || new Set();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      } else if (recursionStack.has(neighbor)) {
        // Found a cycle
        const cycleStart = path.indexOf(neighbor);
        if (cycleStart !== -1) {
          cycles.push(path.slice(cycleStart));
        }
      }
    }

    path.pop();
    recursionStack.delete(nodeId);
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  }

  return cycles;
}
