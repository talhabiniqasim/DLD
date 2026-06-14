import type { ComponentDefinition, ComponentCategory } from '../types/circuit';

// ─── Helper: create evaluation function ────────────────────────────────────────

function evalFn(
  fn: (inputs: Map<string, boolean>) => Map<string, boolean>
): (inputs: Map<string, boolean>) => Map<string, boolean> {
  return fn;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INPUT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const toggleSwitch: ComponentDefinition = {
  type: 'toggle-switch',
  category: 'inputs',
  label: 'Toggle Switch',
  description: 'A manual on/off switch. Click to toggle between Logic HIGH (1) and Logic LOW (0). Used to provide user-controlled input signals to a circuit.',
  formula: 'Output = Switch State',
  inputs: [],
  outputs: [{ id: 'OUT', label: 'OUT', position: 'right' }],
  truthTable: [
    { inputs: {}, outputs: { OUT: 0 } },
    { inputs: {}, outputs: { OUT: 1 } },
  ],
  evaluate: evalFn((_inputs) => {
    // Output is determined by the node's own state, not inputs
    return new Map([['OUT', false]]);
  }),
  defaultProps: { state: false },
  color: '#3b82f6',
};

const pushButton: ComponentDefinition = {
  type: 'push-button',
  category: 'inputs',
  label: 'Push Button',
  description: 'A momentary push button. Outputs HIGH (1) only while pressed, returns to LOW (0) when released. Useful for clock pulses and manual triggers.',
  formula: 'Output = Button Pressed',
  inputs: [],
  outputs: [{ id: 'OUT', label: 'OUT', position: 'right' }],
  truthTable: [
    { inputs: {}, outputs: { OUT: 0 } },
    { inputs: {}, outputs: { OUT: 1 } },
  ],
  evaluate: evalFn((_inputs) => {
    return new Map([['OUT', false]]);
  }),
  defaultProps: { state: false },
  color: '#8b5cf6',
};

const clockSource: ComponentDefinition = {
  type: 'clock-source',
  category: 'inputs',
  label: 'Clock Source',
  description: 'Generates a periodic square wave signal that alternates between HIGH and LOW at a configurable frequency. Essential for sequential circuit operation.',
  formula: 'Output = Clock(t)',
  inputs: [],
  outputs: [{ id: 'CLK', label: 'CLK', position: 'right' }],
  truthTable: [
    { inputs: {}, outputs: { CLK: 0 } },
    { inputs: {}, outputs: { CLK: 1 } },
  ],
  evaluate: evalFn((_inputs) => {
    return new Map([['CLK', false]]);
  }),
  defaultProps: { frequency: 1, state: false },
  color: '#f59e0b',
};

const constantHigh: ComponentDefinition = {
  type: 'constant-high',
  category: 'inputs',
  label: 'Logic 1',
  description: 'A constant source that always outputs Logic HIGH (1). Used to tie inputs to a fixed high level.',
  formula: 'Output = 1',
  inputs: [],
  outputs: [{ id: 'OUT', label: '1', position: 'right' }],
  truthTable: [{ inputs: {}, outputs: { OUT: 1 } }],
  evaluate: evalFn((_inputs) => {
    return new Map([['OUT', true]]);
  }),
  defaultProps: {},
  color: '#22c55e',
};

const constantLow: ComponentDefinition = {
  type: 'constant-low',
  category: 'inputs',
  label: 'Logic 0',
  description: 'A constant source that always outputs Logic LOW (0). Used to tie inputs to a fixed low level.',
  formula: 'Output = 0',
  inputs: [],
  outputs: [{ id: 'OUT', label: '0', position: 'right' }],
  truthTable: [{ inputs: {}, outputs: { OUT: 0 } }],
  evaluate: evalFn((_inputs) => {
    return new Map([['OUT', false]]);
  }),
  defaultProps: {},
  color: '#6b7280',
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIC GATES
// ═══════════════════════════════════════════════════════════════════════════════

const andGate: ComponentDefinition = {
  type: 'and-gate',
  category: 'gates',
  label: 'AND Gate',
  description: 'Outputs HIGH (1) only when ALL inputs are HIGH. If any input is LOW, the output is LOW. The fundamental building block of digital logic.',
  formula: 'Y = A · B',
  inputs: [
    { id: 'A', label: 'A', position: 'left' },
    { id: 'B', label: 'B', position: 'left' },
  ],
  outputs: [{ id: 'Y', label: 'Y', position: 'right' }],
  truthTable: [
    { inputs: { A: 0, B: 0 }, outputs: { Y: 0 } },
    { inputs: { A: 0, B: 1 }, outputs: { Y: 0 } },
    { inputs: { A: 1, B: 0 }, outputs: { Y: 0 } },
    { inputs: { A: 1, B: 1 }, outputs: { Y: 1 } },
  ],
  evaluate: evalFn((inputs) => {
    const a = inputs.get('A') ?? false;
    const b = inputs.get('B') ?? false;
    return new Map([['Y', a && b]]);
  }),
  defaultProps: {},
  color: '#3b82f6',
};

const orGate: ComponentDefinition = {
  type: 'or-gate',
  category: 'gates',
  label: 'OR Gate',
  description: 'Outputs HIGH (1) when ANY input is HIGH. Outputs LOW only when ALL inputs are LOW.',
  formula: 'Y = A + B',
  inputs: [
    { id: 'A', label: 'A', position: 'left' },
    { id: 'B', label: 'B', position: 'left' },
  ],
  outputs: [{ id: 'Y', label: 'Y', position: 'right' }],
  truthTable: [
    { inputs: { A: 0, B: 0 }, outputs: { Y: 0 } },
    { inputs: { A: 0, B: 1 }, outputs: { Y: 1 } },
    { inputs: { A: 1, B: 0 }, outputs: { Y: 1 } },
    { inputs: { A: 1, B: 1 }, outputs: { Y: 1 } },
  ],
  evaluate: evalFn((inputs) => {
    const a = inputs.get('A') ?? false;
    const b = inputs.get('B') ?? false;
    return new Map([['Y', a || b]]);
  }),
  defaultProps: {},
  color: '#8b5cf6',
};

const notGate: ComponentDefinition = {
  type: 'not-gate',
  category: 'gates',
  label: 'NOT Gate',
  description: 'Inverts the input signal. Outputs HIGH when input is LOW, and LOW when input is HIGH. Also known as an inverter.',
  formula: 'Y = Ā',
  inputs: [{ id: 'A', label: 'A', position: 'left' }],
  outputs: [{ id: 'Y', label: 'Y', position: 'right' }],
  truthTable: [
    { inputs: { A: 0 }, outputs: { Y: 1 } },
    { inputs: { A: 1 }, outputs: { Y: 0 } },
  ],
  evaluate: evalFn((inputs) => {
    const a = inputs.get('A') ?? false;
    return new Map([['Y', !a]]);
  }),
  defaultProps: {},
  color: '#ef4444',
};

const nandGate: ComponentDefinition = {
  type: 'nand-gate',
  category: 'gates',
  label: 'NAND Gate',
  description: 'Outputs LOW only when ALL inputs are HIGH. Otherwise outputs HIGH. Equivalent to AND followed by NOT. A universal gate — any logic circuit can be built using only NAND gates.',
  formula: 'Y = (A · B)\'',
  inputs: [
    { id: 'A', label: 'A', position: 'left' },
    { id: 'B', label: 'B', position: 'left' },
  ],
  outputs: [{ id: 'Y', label: 'Y', position: 'right' }],
  truthTable: [
    { inputs: { A: 0, B: 0 }, outputs: { Y: 1 } },
    { inputs: { A: 0, B: 1 }, outputs: { Y: 1 } },
    { inputs: { A: 1, B: 0 }, outputs: { Y: 1 } },
    { inputs: { A: 1, B: 1 }, outputs: { Y: 0 } },
  ],
  evaluate: evalFn((inputs) => {
    const a = inputs.get('A') ?? false;
    const b = inputs.get('B') ?? false;
    return new Map([['Y', !(a && b)]]);
  }),
  defaultProps: {},
  color: '#06b6d4',
};

const norGate: ComponentDefinition = {
  type: 'nor-gate',
  category: 'gates',
  label: 'NOR Gate',
  description: 'Outputs HIGH only when ALL inputs are LOW. Otherwise outputs LOW. Equivalent to OR followed by NOT. Another universal gate.',
  formula: 'Y = (A + B)\'',
  inputs: [
    { id: 'A', label: 'A', position: 'left' },
    { id: 'B', label: 'B', position: 'left' },
  ],
  outputs: [{ id: 'Y', label: 'Y', position: 'right' }],
  truthTable: [
    { inputs: { A: 0, B: 0 }, outputs: { Y: 1 } },
    { inputs: { A: 0, B: 1 }, outputs: { Y: 0 } },
    { inputs: { A: 1, B: 0 }, outputs: { Y: 0 } },
    { inputs: { A: 1, B: 1 }, outputs: { Y: 0 } },
  ],
  evaluate: evalFn((inputs) => {
    const a = inputs.get('A') ?? false;
    const b = inputs.get('B') ?? false;
    return new Map([['Y', !(a || b)]]);
  }),
  defaultProps: {},
  color: '#ec4899',
};

const xorGate: ComponentDefinition = {
  type: 'xor-gate',
  category: 'gates',
  label: 'XOR Gate',
  description: 'Outputs HIGH when inputs DIFFER. Outputs LOW when inputs are the SAME. Essential for arithmetic circuits like adders and parity checkers.',
  formula: 'Y = A ⊕ B',
  inputs: [
    { id: 'A', label: 'A', position: 'left' },
    { id: 'B', label: 'B', position: 'left' },
  ],
  outputs: [{ id: 'Y', label: 'Y', position: 'right' }],
  truthTable: [
    { inputs: { A: 0, B: 0 }, outputs: { Y: 0 } },
    { inputs: { A: 0, B: 1 }, outputs: { Y: 1 } },
    { inputs: { A: 1, B: 0 }, outputs: { Y: 1 } },
    { inputs: { A: 1, B: 1 }, outputs: { Y: 0 } },
  ],
  evaluate: evalFn((inputs) => {
    const a = inputs.get('A') ?? false;
    const b = inputs.get('B') ?? false;
    return new Map([['Y', a !== b]]);
  }),
  defaultProps: {},
  color: '#f97316',
};

const xnorGate: ComponentDefinition = {
  type: 'xnor-gate',
  category: 'gates',
  label: 'XNOR Gate',
  description: 'Outputs HIGH when inputs are the SAME. Outputs LOW when inputs DIFFER. The complement of XOR. Used in equality comparators.',
  formula: 'Y = (A ⊕ B)\'',
  inputs: [
    { id: 'A', label: 'A', position: 'left' },
    { id: 'B', label: 'B', position: 'left' },
  ],
  outputs: [{ id: 'Y', label: 'Y', position: 'right' }],
  truthTable: [
    { inputs: { A: 0, B: 0 }, outputs: { Y: 1 } },
    { inputs: { A: 0, B: 1 }, outputs: { Y: 0 } },
    { inputs: { A: 1, B: 0 }, outputs: { Y: 0 } },
    { inputs: { A: 1, B: 1 }, outputs: { Y: 1 } },
  ],
  evaluate: evalFn((inputs) => {
    const a = inputs.get('A') ?? false;
    const b = inputs.get('B') ?? false;
    return new Map([['Y', a === b]]);
  }),
  defaultProps: {},
  color: '#14b8a6',
};

// ═══════════════════════════════════════════════════════════════════════════════
// OUTPUT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const ledOutput: ComponentDefinition = {
  type: 'led-output',
  category: 'outputs',
  label: 'LED',
  description: 'A light-emitting diode indicator. Lights up when the input is HIGH (1) and turns off when LOW (0). Visual feedback for circuit outputs.',
  formula: 'Light = Input',
  inputs: [{ id: 'IN', label: 'IN', position: 'left' }],
  outputs: [],
  truthTable: [
    { inputs: { IN: 0 }, outputs: {} },
    { inputs: { IN: 1 }, outputs: {} },
  ],
  evaluate: evalFn((_inputs) => new Map()),
  defaultProps: { color: '#22c55e' },
  color: '#22c55e',
};

const sevenSegment: ComponentDefinition = {
  type: 'seven-segment',
  category: 'outputs',
  label: '7-Segment Display',
  description: 'A seven-segment display that shows hexadecimal digits (0-F). Takes 4 binary inputs (BCD) and displays the corresponding digit.',
  formula: 'Display = BCD(D, C, B, A)',
  inputs: [
    { id: 'A', label: 'A', position: 'left' },
    { id: 'B', label: 'B', position: 'left' },
    { id: 'C', label: 'C', position: 'left' },
    { id: 'D', label: 'D', position: 'left' },
  ],
  outputs: [],
  truthTable: [],
  evaluate: evalFn((_inputs) => new Map()),
  defaultProps: {},
  color: '#f59e0b',
};

const logicProbe: ComponentDefinition = {
  type: 'logic-probe',
  category: 'outputs',
  label: 'Logic Probe',
  description: 'Displays the logic level of the input signal as "1" or "0". A diagnostic tool for checking signal states at any point in the circuit.',
  formula: 'Display = Input Level',
  inputs: [{ id: 'IN', label: 'IN', position: 'left' }],
  outputs: [],
  truthTable: [],
  evaluate: evalFn((_inputs) => new Map()),
  defaultProps: {},
  color: '#06b6d4',
};

const binaryDisplay: ComponentDefinition = {
  type: 'binary-display',
  category: 'outputs',
  label: 'Binary Display',
  description: 'Displays a multi-bit binary value. Shows the binary representation and decimal equivalent of up to 8 input bits.',
  formula: 'Display = Binary(inputs)',
  inputs: [
    { id: 'B0', label: 'B0', position: 'left' },
    { id: 'B1', label: 'B1', position: 'left' },
    { id: 'B2', label: 'B2', position: 'left' },
    { id: 'B3', label: 'B3', position: 'left' },
  ],
  outputs: [],
  truthTable: [],
  evaluate: evalFn((_inputs) => new Map()),
  defaultProps: {},
  color: '#8b5cf6',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

export const componentLibrary: Record<string, ComponentDefinition> = {
  // Inputs
  'toggle-switch': toggleSwitch,
  'push-button': pushButton,
  'clock-source': clockSource,
  'constant-high': constantHigh,
  'constant-low': constantLow,
  // Gates
  'and-gate': andGate,
  'or-gate': orGate,
  'not-gate': notGate,
  'nand-gate': nandGate,
  'nor-gate': norGate,
  'xor-gate': xorGate,
  'xnor-gate': xnorGate,
  // Outputs
  'led-output': ledOutput,
  'seven-segment': sevenSegment,
  'logic-probe': logicProbe,
  'binary-display': binaryDisplay,
};

// ─── Category metadata ─────────────────────────────────────────────────────────

export interface CategoryInfo {
  id: ComponentCategory;
  label: string;
  icon: string;
  description: string;
}

export const categories: CategoryInfo[] = [
  { id: 'inputs', label: 'Inputs', icon: '⚡', description: 'Signal sources and controls' },
  { id: 'gates', label: 'Logic Gates', icon: '🔲', description: 'Basic logic operations' },
  { id: 'outputs', label: 'Outputs', icon: '💡', description: 'Display and indicator components' },
  { id: 'combinational', label: 'Combinational', icon: '🔀', description: 'Complex combinational circuits' },
  { id: 'sequential', label: 'Sequential', icon: '🔄', description: 'Clock-driven components' },
  { id: 'memory', label: 'Memory', icon: '💾', description: 'Data storage components' },
  { id: 'advanced', label: 'Advanced', icon: '⚙️', description: 'Microcontroller-style components' },
];

export function getComponentsByCategory(category: ComponentCategory): ComponentDefinition[] {
  return Object.values(componentLibrary).filter((c) => c.category === category);
}

export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return componentLibrary[type];
}
