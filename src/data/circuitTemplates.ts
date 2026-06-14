import type { CircuitNode, CircuitEdge } from '../types/circuit';

export interface CircuitTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basics' | 'combinational' | 'sequential' | 'applications';
  icon: string;
  nodes: CircuitNode[];
  edges: CircuitEdge[];
}

// ─── Helper to build nodes/edges quickly ───────────────────────────────────────


function makeNode(
  id: string, componentType: string, label: string, x: number, y: number,
  props: Record<string, unknown> = {}
): CircuitNode {
  // We need to import component definitions at runtime
  const inputs: any[] = [];
  const outputs: any[] = [];
  return {
    id,
    type: 'circuitNode',
    position: { x, y },
    data: {
      componentType,
      label,
      inputs,
      outputs,
      signalValues: {},
      properties: props,
    },
  } as CircuitNode;
}

function makeEdge(
  source: string, sourceHandle: string,
  target: string, targetHandle: string
): CircuitEdge {
  return {
    id: `tpl-e-${source}-${target}-${sourceHandle}-${targetHandle}`,
    source,
    target,
    sourceHandle,
    targetHandle,
    type: 'wire',
    data: { signalState: 'low' as const, signalValue: false, animated: false },
  } as CircuitEdge;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC TEMPLATE GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

function buildPureGateDecadeCounter(): CircuitTemplate {
  const nodes: CircuitNode[] = [];
  const edges: CircuitEdge[] = [];

  const addNode = (id: string, type: string, label: string, x: number, y: number, props?: any) => {
    nodes.push(makeNode(id, type, label, x, y, props));
  };
  const addEdge = (src: string, srcH: string, tgt: string, tgtH: string) => {
    edges.push(makeEdge(src, srcH, tgt, tgtH));
  };

  // Clock
  addNode('dc-clk', 'push-button', 'Step Clock', 50, 200);
  addNode('dc-clk-inv', 'not-gate', 'CLK_INV', 150, 200);
  addEdge('dc-clk', 'OUT', 'dc-clk-inv', 'A');

  // Helper to build a Master-Slave Edge-Triggered D-FF from SR-Latches
  const buildDFF = (id: string, x: number, y: number, label: string) => {
    addNode(`${id}-d-inv`, 'not-gate', 'D\'', x, y + 80);
    addNode(`${id}-m-and-s`, 'and-gate', 'M_S', x + 100, y + 0);
    addNode(`${id}-m-and-r`, 'and-gate', 'M_R', x + 100, y + 150);
    addNode(`${id}-m-latch`, 'sr-latch', 'Master', x + 200, y + 70);
    addNode(`${id}-s-and-s`, 'and-gate', 'S_S', x + 300, y + 0);
    addNode(`${id}-s-and-r`, 'and-gate', 'S_R', x + 300, y + 150);
    addNode(`${id}-s-latch`, 'sr-latch', label, x + 400, y + 70);

    addEdge(`${id}-d-inv`, 'Y', `${id}-m-and-r`, 'A');
    addEdge('dc-clk-inv', 'Y', `${id}-m-and-s`, 'B');
    addEdge('dc-clk-inv', 'Y', `${id}-m-and-r`, 'B');
    addEdge(`${id}-m-and-s`, 'Y', `${id}-m-latch`, 'S');
    addEdge(`${id}-m-and-r`, 'Y', `${id}-m-latch`, 'R');

    addEdge(`${id}-m-latch`, 'Q', `${id}-s-and-s`, 'A');
    addEdge(`${id}-m-latch`, 'Q_NOT', `${id}-s-and-r`, 'A');
    addEdge('dc-clk', 'OUT', `${id}-s-and-s`, 'B');
    addEdge('dc-clk', 'OUT', `${id}-s-and-r`, 'B');
    addEdge(`${id}-s-and-s`, 'Y', `${id}-s-latch`, 'S');
    addEdge(`${id}-s-and-r`, 'Y', `${id}-s-latch`, 'R');

    return { Q_NODE: `${id}-s-latch` };
  };

  const wireD = (id: string, srcNode: string, srcPin: string) => {
    addEdge(srcNode, srcPin, `${id}-m-and-s`, 'A');
    addEdge(srcNode, srcPin, `${id}-d-inv`, 'A');
  };

  // Build the 4 Flip-Flops
  const ff0 = buildDFF('ff0', 300, 100, 'FF0 (LSB)');
  const ff1 = buildDFF('ff1', 900, 100, 'FF1');
  const ff2 = buildDFF('ff2', 1500, 100, 'FF2');
  const ff3 = buildDFF('ff3', 2100, 100, 'FF3 (MSB)');

  // Next State Logic
  wireD('ff0', ff0.Q_NODE, 'Q_NOT');

  addNode('d1-xor', 'xor-gate', 'Q1⊕Q0', 700, 300);
  addNode('d1-and', 'and-gate', 'AND', 800, 300);
  addEdge(ff1.Q_NODE, 'Q', 'd1-xor', 'A');
  addEdge(ff0.Q_NODE, 'Q', 'd1-xor', 'B');
  addEdge('d1-xor', 'Y', 'd1-and', 'A');
  addEdge(ff3.Q_NODE, 'Q_NOT', 'd1-and', 'B');
  wireD('ff1', 'd1-and', 'Y');

  addNode('d2-and1', 'and-gate', 'Q1·Q0', 1300, 300);
  addNode('d2-xor', 'xor-gate', 'XOR', 1400, 300);
  addEdge(ff1.Q_NODE, 'Q', 'd2-and1', 'A');
  addEdge(ff0.Q_NODE, 'Q', 'd2-and1', 'B');
  addEdge(ff2.Q_NODE, 'Q', 'd2-xor', 'A');
  addEdge('d2-and1', 'Y', 'd2-xor', 'B');
  wireD('ff2', 'd2-xor', 'Y');

  addNode('d3-and1', 'and-gate', 'Q3·Q0\'', 1900, 300);
  addNode('d3-and2', 'and-gate', 'Q2·(Q1Q0)', 1900, 400);
  addNode('d3-or', 'or-gate', 'OR', 2000, 350);
  addEdge(ff3.Q_NODE, 'Q', 'd3-and1', 'A');
  addEdge(ff0.Q_NODE, 'Q_NOT', 'd3-and1', 'B');
  addEdge(ff2.Q_NODE, 'Q', 'd3-and2', 'A');
  addEdge('d2-and1', 'Y', 'd3-and2', 'B');
  addEdge('d3-and1', 'Y', 'd3-or', 'A');
  addEdge('d3-and2', 'Y', 'd3-or', 'B');
  wireD('ff3', 'd3-or', 'Y');

  // Display
  addNode('dc-disp', 'seven-segment', 'Display', 2700, 100);
  addEdge(ff0.Q_NODE, 'Q', 'dc-disp', 'A');
  addEdge(ff1.Q_NODE, 'Q', 'dc-disp', 'B');
  addEdge(ff2.Q_NODE, 'Q', 'dc-disp', 'C');
  addEdge(ff3.Q_NODE, 'Q', 'dc-disp', 'D');

  return {
    id: 'seq-decade-counter',
    name: 'Gate-Based Decade Counter',
    description: 'A colossal, fully synchronous decade counter where every single Flip-Flop is broken down into primitive logic gates and SR-Latches using a Master-Slave architecture. Truly "entirely gate based"!',
    category: 'sequential',
    icon: '🔢',
    nodes,
    edges,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export const circuitTemplates: CircuitTemplate[] = [
  // ── BASICS ────────────────────────────────────────────────────────────────
  {
    id: 'basic-and',
    name: 'AND Gate Demo',
    description: 'Two toggle switches connected to an AND gate driving an LED. Toggle the switches to see that both must be ON for the LED to light up.',
    category: 'basics',
    icon: '🔲',
    nodes: [
      makeNode('ba-sw1', 'toggle-switch', 'Switch A', 50, 50, { state: false }),
      makeNode('ba-sw2', 'toggle-switch', 'Switch B', 50, 180, { state: false }),
      makeNode('ba-and', 'and-gate', 'AND Gate', 280, 100),
      makeNode('ba-led', 'led-output', 'LED', 500, 100),
    ],
    edges: [
      makeEdge('ba-sw1', 'OUT', 'ba-and', 'A'),
      makeEdge('ba-sw2', 'OUT', 'ba-and', 'B'),
      makeEdge('ba-and', 'Y', 'ba-led', 'IN'),
    ],
  },
  {
    id: 'basic-or',
    name: 'OR Gate Demo',
    description: 'Two switches driving an OR gate. The LED lights up if EITHER switch is ON.',
    category: 'basics',
    icon: '🔲',
    nodes: [
      makeNode('bo-sw1', 'toggle-switch', 'Switch A', 50, 50, { state: false }),
      makeNode('bo-sw2', 'toggle-switch', 'Switch B', 50, 180, { state: false }),
      makeNode('bo-or', 'or-gate', 'OR Gate', 280, 100),
      makeNode('bo-led', 'led-output', 'LED', 500, 100),
    ],
    edges: [
      makeEdge('bo-sw1', 'OUT', 'bo-or', 'A'),
      makeEdge('bo-sw2', 'OUT', 'bo-or', 'B'),
      makeEdge('bo-or', 'Y', 'bo-led', 'IN'),
    ],
  },
  {
    id: 'basic-not',
    name: 'NOT Gate (Inverter)',
    description: 'A single switch through a NOT gate. The LED is ON when the switch is OFF, and vice versa.',
    category: 'basics',
    icon: '🔲',
    nodes: [
      makeNode('bn-sw1', 'toggle-switch', 'Switch', 50, 80, { state: false }),
      makeNode('bn-not', 'not-gate', 'NOT Gate', 280, 80),
      makeNode('bn-led', 'led-output', 'LED', 500, 80),
    ],
    edges: [
      makeEdge('bn-sw1', 'OUT', 'bn-not', 'A'),
      makeEdge('bn-not', 'Y', 'bn-led', 'IN'),
    ],
  },
  {
    id: 'basic-nand',
    name: 'NAND Gate Demo',
    description: 'Two switches into a NAND gate. Output is LOW only when BOTH inputs are HIGH.',
    category: 'basics',
    icon: '🔲',
    nodes: [
      makeNode('bna-sw1', 'toggle-switch', 'Switch A', 50, 50, { state: false }),
      makeNode('bna-sw2', 'toggle-switch', 'Switch B', 50, 180, { state: false }),
      makeNode('bna-nand', 'nand-gate', 'NAND Gate', 280, 100),
      makeNode('bna-led', 'led-output', 'LED', 500, 100),
    ],
    edges: [
      makeEdge('bna-sw1', 'OUT', 'bna-nand', 'A'),
      makeEdge('bna-sw2', 'OUT', 'bna-nand', 'B'),
      makeEdge('bna-nand', 'Y', 'bna-led', 'IN'),
    ],
  },
  {
    id: 'basic-xor',
    name: 'XOR Gate Demo',
    description: 'Two switches into an XOR gate. Output is HIGH only when the inputs DIFFER.',
    category: 'basics',
    icon: '🔲',
    nodes: [
      makeNode('bx-sw1', 'toggle-switch', 'Switch A', 50, 50, { state: false }),
      makeNode('bx-sw2', 'toggle-switch', 'Switch B', 50, 180, { state: false }),
      makeNode('bx-xor', 'xor-gate', 'XOR Gate', 280, 100),
      makeNode('bx-led', 'led-output', 'LED', 500, 100),
    ],
    edges: [
      makeEdge('bx-sw1', 'OUT', 'bx-xor', 'A'),
      makeEdge('bx-sw2', 'OUT', 'bx-xor', 'B'),
      makeEdge('bx-xor', 'Y', 'bx-led', 'IN'),
    ],
  },
  {
    id: 'basic-fan',
    name: 'Switch → Fan',
    description: 'A simple switch controlling a fan. Toggle the switch to see the fan spin!',
    category: 'basics',
    icon: '🌀',
    nodes: [
      makeNode('bf-sw1', 'toggle-switch', 'Power Switch', 50, 80, { state: false }),
      makeNode('bf-fan', 'fan-output', 'Fan', 350, 80),
    ],
    edges: [
      makeEdge('bf-sw1', 'OUT', 'bf-fan', 'IN'),
    ],
  },
  {
    id: 'basic-7segment',
    name: '7-Segment Display Demo',
    description: 'Four toggle switches acting as a 4-bit binary input (BCD) connected to a 7-Segment Display. Toggle the switches to show numbers 0-F!',
    category: 'basics',
    icon: '🧮',
    nodes: [
      makeNode('b7-sw3', 'toggle-switch', 'Bit 3 (8s)', 50, 50, { state: false }),
      makeNode('b7-sw2', 'toggle-switch', 'Bit 2 (4s)', 50, 150, { state: false }),
      makeNode('b7-sw1', 'toggle-switch', 'Bit 1 (2s)', 50, 250, { state: false }),
      makeNode('b7-sw0', 'toggle-switch', 'Bit 0 (1s)', 50, 350, { state: false }),
      makeNode('b7-disp', 'seven-segment', 'Display', 350, 150),
    ],
    edges: [
      makeEdge('b7-sw0', 'OUT', 'b7-disp', 'A'),
      makeEdge('b7-sw1', 'OUT', 'b7-disp', 'B'),
      makeEdge('b7-sw2', 'OUT', 'b7-disp', 'C'),
      makeEdge('b7-sw3', 'OUT', 'b7-disp', 'D'),
    ],
  },

  // ── COMBINATIONAL ─────────────────────────────────────────────────────────
  {
    id: 'comb-half-adder',
    name: 'Half Adder',
    description: 'Two inputs (A, B) feeding a Half Adder. Outputs Sum and Carry, each driving an LED.',
    category: 'combinational',
    icon: '🔀',
    nodes: [
      makeNode('ha-sw1', 'toggle-switch', 'A', 50, 50, { state: false }),
      makeNode('ha-sw2', 'toggle-switch', 'B', 50, 200, { state: false }),
      makeNode('ha-add', 'half-adder', 'Half Adder', 280, 100),
      makeNode('ha-led-s', 'led-output', 'Sum LED', 520, 60),
      makeNode('ha-led-c', 'led-output', 'Carry LED', 520, 170),
    ],
    edges: [
      makeEdge('ha-sw1', 'OUT', 'ha-add', 'A'),
      makeEdge('ha-sw2', 'OUT', 'ha-add', 'B'),
      makeEdge('ha-add', 'SUM', 'ha-led-s', 'IN'),
      makeEdge('ha-add', 'CARRY', 'ha-led-c', 'IN'),
    ],
  },
  {
    id: 'comb-full-adder',
    name: 'Full Adder',
    description: 'Three inputs (A, B, Carry-In) feeding a Full Adder. Outputs Sum and Carry-Out.',
    category: 'combinational',
    icon: '🔀',
    nodes: [
      makeNode('fa-sw1', 'toggle-switch', 'A', 50, 30, { state: false }),
      makeNode('fa-sw2', 'toggle-switch', 'B', 50, 150, { state: false }),
      makeNode('fa-sw3', 'toggle-switch', 'Cin', 50, 270, { state: false }),
      makeNode('fa-add', 'full-adder', 'Full Adder', 280, 120),
      makeNode('fa-led-s', 'led-output', 'Sum LED', 520, 80),
      makeNode('fa-led-c', 'led-output', 'Cout LED', 520, 200),
    ],
    edges: [
      makeEdge('fa-sw1', 'OUT', 'fa-add', 'A'),
      makeEdge('fa-sw2', 'OUT', 'fa-add', 'B'),
      makeEdge('fa-sw3', 'OUT', 'fa-add', 'CIN'),
      makeEdge('fa-add', 'SUM', 'fa-led-s', 'IN'),
      makeEdge('fa-add', 'COUT', 'fa-led-c', 'IN'),
    ],
  },
  {
    id: 'comb-mux',
    name: '2-to-1 Multiplexer',
    description: 'Two data inputs and a select switch. Flip the select to route D0 or D1 to the output.',
    category: 'combinational',
    icon: '🔀',
    nodes: [
      makeNode('mx-d0', 'toggle-switch', 'D0', 50, 30, { state: true }),
      makeNode('mx-d1', 'toggle-switch', 'D1', 50, 150, { state: false }),
      makeNode('mx-sel', 'toggle-switch', 'Select', 50, 280, { state: false }),
      makeNode('mx-mux', 'mux-2to1', '2-to-1 MUX', 300, 120),
      makeNode('mx-led', 'led-output', 'Output LED', 540, 130),
    ],
    edges: [
      makeEdge('mx-d0', 'OUT', 'mx-mux', 'D0'),
      makeEdge('mx-d1', 'OUT', 'mx-mux', 'D1'),
      makeEdge('mx-sel', 'OUT', 'mx-mux', 'S'),
      makeEdge('mx-mux', 'Y', 'mx-led', 'IN'),
    ],
  },

  // ── SEQUENTIAL ────────────────────────────────────────────────────────────
  {
    id: 'seq-sr-latch',
    name: 'SR Latch',
    description: 'Set and Reset switches driving an SR Latch. Set to store 1, Reset to store 0.',
    category: 'sequential',
    icon: '🔄',
    nodes: [
      makeNode('sr-s', 'toggle-switch', 'Set', 50, 50, { state: false }),
      makeNode('sr-r', 'toggle-switch', 'Reset', 50, 200, { state: false }),
      makeNode('sr-latch', 'sr-latch', 'SR Latch', 280, 100),
      makeNode('sr-led-q', 'led-output', 'Q', 520, 60),
      makeNode('sr-led-qn', 'led-output', "Q'", 520, 170),
    ],
    edges: [
      makeEdge('sr-s', 'OUT', 'sr-latch', 'S'),
      makeEdge('sr-r', 'OUT', 'sr-latch', 'R'),
      makeEdge('sr-latch', 'Q', 'sr-led-q', 'IN'),
      makeEdge('sr-latch', 'Q_NOT', 'sr-led-qn', 'IN'),
    ],
  },
  {
    id: 'seq-d-flipflop',
    name: 'D Flip-Flop',
    description: 'A data switch and a clock source feeding a D Flip-Flop. The data is captured on every rising clock edge.',
    category: 'sequential',
    icon: '🔄',
    nodes: [
      makeNode('df-data', 'toggle-switch', 'Data', 50, 50, { state: true }),
      makeNode('df-clk', 'clock-source', 'Clock', 50, 200, { state: false, frequency: 1 }),
      makeNode('df-ff', 'd-flipflop', 'D Flip-Flop', 300, 100),
      makeNode('df-led-q', 'led-output', 'Q', 540, 60),
      makeNode('df-led-qn', 'led-output', "Q'", 540, 170),
    ],
    edges: [
      makeEdge('df-data', 'OUT', 'df-ff', 'D'),
      makeEdge('df-clk', 'CLK', 'df-ff', 'CLK'),
      makeEdge('df-ff', 'Q', 'df-led-q', 'IN'),
      makeEdge('df-ff', 'Q_NOT', 'df-led-qn', 'IN'),
    ],
  },
  {
    id: 'seq-t-counter',
    name: 'T Flip-Flop Counter',
    description: 'A clock source with a constant HIGH on T, making the flip-flop toggle on every clock tick — a 1-bit binary counter.',
    category: 'sequential',
    icon: '🔄',
    nodes: [
      makeNode('tc-hi', 'constant-high', 'Logic 1', 50, 50),
      makeNode('tc-clk', 'clock-source', 'Clock', 50, 200, { state: false, frequency: 1 }),
      makeNode('tc-ff', 't-flipflop', 'T Flip-Flop', 300, 100),
      makeNode('tc-led', 'led-output', 'Q', 540, 70),
      makeNode('tc-probe', 'logic-probe', 'Probe', 540, 170),
    ],
    edges: [
      makeEdge('tc-hi', 'OUT', 'tc-ff', 'T'),
      makeEdge('tc-clk', 'CLK', 'tc-ff', 'CLK'),
      makeEdge('tc-ff', 'Q', 'tc-led', 'IN'),
      makeEdge('tc-ff', 'Q_NOT', 'tc-probe', 'IN'),
    ],
  },
  buildPureGateDecadeCounter(),

  // ── APPLICATIONS ──────────────────────────────────────────────────────────
  {
    id: 'app-alarm',
    name: 'Security Alarm System',
    description: 'Two sensor switches (door + window) connected via OR gate to a fan (alarm). If EITHER sensor triggers, the alarm activates!',
    category: 'applications',
    icon: '⚙️',
    nodes: [
      makeNode('al-door', 'toggle-switch', 'Door Sensor', 50, 50, { state: false }),
      makeNode('al-win', 'toggle-switch', 'Window Sensor', 50, 200, { state: false }),
      makeNode('al-or', 'or-gate', 'OR Gate', 280, 100),
      makeNode('al-fan', 'fan-output', 'Alarm Fan', 500, 60),
      makeNode('al-led', 'led-output', 'Alarm LED', 500, 160),
    ],
    edges: [
      makeEdge('al-door', 'OUT', 'al-or', 'A'),
      makeEdge('al-win', 'OUT', 'al-or', 'B'),
      makeEdge('al-or', 'Y', 'al-fan', 'IN'),
      makeEdge('al-or', 'Y', 'al-led', 'IN'),
    ],
  },
  {
    id: 'app-smart-fan',
    name: 'Smart Fan Controller',
    description: 'An AND gate ensures the fan only runs when BOTH the power switch AND temperature sensor are HIGH.',
    category: 'applications',
    icon: '⚙️',
    nodes: [
      makeNode('sf-pwr', 'toggle-switch', 'Power Switch', 50, 50, { state: true }),
      makeNode('sf-temp', 'toggle-switch', 'Temp Sensor', 50, 200, { state: false }),
      makeNode('sf-and', 'and-gate', 'AND Gate', 280, 100),
      makeNode('sf-fan', 'fan-output', 'Fan', 500, 100),
    ],
    edges: [
      makeEdge('sf-pwr', 'OUT', 'sf-and', 'A'),
      makeEdge('sf-temp', 'OUT', 'sf-and', 'B'),
      makeEdge('sf-and', 'Y', 'sf-fan', 'IN'),
    ],
  },
];

export function getTemplatesByCategory(category: CircuitTemplate['category']): CircuitTemplate[] {
  return circuitTemplates.filter((t) => t.category === category);
}

export const templateCategories = [
  { id: 'basics' as const, label: 'Basic Gates', icon: '🔲', description: 'Fundamental gate demonstrations' },
  { id: 'combinational' as const, label: 'Combinational', icon: '🔀', description: 'Adders, MUX, and more' },
  { id: 'sequential' as const, label: 'Sequential', icon: '🔄', description: 'Flip-flops and counters' },
  { id: 'applications' as const, label: 'Applications', icon: '⚙️', description: 'Real-world circuit examples' },
];
