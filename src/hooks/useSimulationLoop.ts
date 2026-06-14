import { useEffect } from 'react';
import { useCircuitStore } from '@/store/circuitStore';
import { useUIStore } from '@/store/uiStore';

export function useSimulationLoop() {
  const tickSimulation = useCircuitStore((s) => s.tickSimulation);
  const isSimulationRunning = useUIStore((s) => s.isSimulationRunning);
  const simulationSpeed = useUIStore((s) => s.simulationSpeed);

  useEffect(() => {
    if (!isSimulationRunning) return;

    // Base tick is 500ms. Adjusted by speed modifier.
    const interval = 500 / simulationSpeed;
    
    const timer = setInterval(() => {
      tickSimulation();
    }, interval);

    return () => clearInterval(timer);
  }, [isSimulationRunning, simulationSpeed, tickSimulation]);
}
