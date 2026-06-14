import { useEffect, useRef } from 'react';
import { useCircuitStore } from '@/store/circuitStore';

export function useAutoSave(intervalMs: number = 5000) {
  const saveToLocalStorage = useCircuitStore((s) => s.saveToLocalStorage);
  const nodes = useCircuitStore((s) => s.nodes);
  const edges = useCircuitStore((s) => s.edges);
  const prevRef = useRef({ nodeCount: 0, edgeCount: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      // Only save if something changed
      if (nodes.length !== prevRef.current.nodeCount || edges.length !== prevRef.current.edgeCount) {
        saveToLocalStorage();
        prevRef.current = { nodeCount: nodes.length, edgeCount: edges.length };
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [nodes.length, edges.length, saveToLocalStorage, intervalMs]);

  // Load on mount
  useEffect(() => {
    useCircuitStore.getState().loadFromLocalStorage();
  }, []);
}
