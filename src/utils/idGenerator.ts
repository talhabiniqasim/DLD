import { v4 as uuidv4 } from 'uuid';

export function generateNodeId(prefix: string = 'node'): string {
  return `${prefix}_${uuidv4().slice(0, 8)}`;
}

export function generateEdgeId(source: string, target: string): string {
  return `edge_${source}_${target}_${uuidv4().slice(0, 4)}`;
}
