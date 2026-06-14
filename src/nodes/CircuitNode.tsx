import React, { memo, useCallback } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { CircuitNodeData } from '@/types/circuit';
import { getComponentDefinition } from '@/data/componentLibrary';
import { useCircuitStore } from '@/store/circuitStore';
import { GateSVG } from './GateSVG';

type CircuitNodeType = Node<CircuitNodeData>;

const CircuitNodeComponent: React.FC<NodeProps<CircuitNodeType>> = ({ id, data, selected }) => {
  const toggleInputState = useCircuitStore((s) => s.toggleInputState);
  const def = getComponentDefinition(data.componentType);

  const handleClick = useCallback(() => {
    if (def?.category === 'inputs' && data.componentType !== 'constant-high' && data.componentType !== 'constant-low') {
      toggleInputState(id);
    }
  }, [id, def, data.componentType, toggleInputState]);

  if (!def) return null;

  const isOn = (data.properties?.state as boolean) ?? false;

  // Determine what to render in the body
  const renderBody = () => {
    switch (def.category) {
      case 'inputs':
        return renderInput();
      case 'gates':
        return <GateSVG type={data.componentType} />;
      case 'outputs':
        return renderOutput();
      default:
        return <GateSVG type={data.componentType} />;
    }
  };

  const renderInput = () => {
    if (data.componentType === 'constant-high') {
      return <div className="node-input-display on">1</div>;
    }
    if (data.componentType === 'constant-low') {
      return <div className="node-input-display off">0</div>;
    }
    if (data.componentType === 'clock-source') {
      return (
        <div className={`node-input-display ${isOn ? 'on' : 'off'}`} onClick={handleClick}>
          CLK
        </div>
      );
    }
    return (
      <div className={`node-input-display ${isOn ? 'on' : 'off'}`} onClick={handleClick}>
        {isOn ? '1' : '0'}
      </div>
    );
  };

  const renderOutput = () => {
    switch (data.componentType) {
      case 'led-output': {
        const inValue = data.signalValues?.['IN'] ?? false;
        return <div className={`node-led ${inValue ? 'on' : 'off'}`} />;
      }
      case 'seven-segment': {
        const a = data.signalValues?.['A'] ?? false;
        const b = data.signalValues?.['B'] ?? false;
        const c = data.signalValues?.['C'] ?? false;
        const d = data.signalValues?.['D'] ?? false;
        const val = (d ? 8 : 0) + (c ? 4 : 0) + (b ? 2 : 0) + (a ? 1 : 0);
        return (
          <div className="seven-seg-display">
            <span className="seven-seg-digit">{val.toString(16).toUpperCase()}</span>
          </div>
        );
      }
      case 'logic-probe': {
        const inValue = data.signalValues?.['IN'] ?? false;
        return (
          <div className={`logic-probe-display ${inValue ? 'high' : 'low'}`}>
            {inValue ? '1' : '0'}
          </div>
        );
      }
      case 'binary-display': {
        const bits = [
          data.signalValues?.['B3'] ?? false,
          data.signalValues?.['B2'] ?? false,
          data.signalValues?.['B1'] ?? false,
          data.signalValues?.['B0'] ?? false,
        ];
        const binStr = bits.map((b) => (b ? '1' : '0')).join('');
        const dec = parseInt(binStr, 2);
        return (
          <div className="logic-probe-display low" style={{ fontSize: 14 }}>
            <div>{binStr}</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>={dec}</div>
          </div>
        );
      }
      case 'fan-output': {
        const inValue = data.signalValues?.['IN'] ?? false;
        return (
          <div className={`node-fan ${inValue ? 'spinning' : ''}`}>
            <svg viewBox="0 0 40 40" width="40" height="40">
              {/* Fan blades */}
              <g className="fan-blades">
                <path d="M20 20 C20 12, 28 8, 20 2 C12 8, 20 12, 20 20" fill={inValue ? '#60a5fa' : '#4b5563'} />
                <path d="M20 20 C28 20, 32 28, 38 20 C32 12, 28 20, 20 20" fill={inValue ? '#60a5fa' : '#4b5563'} />
                <path d="M20 20 C20 28, 12 32, 20 38 C28 32, 20 28, 20 20" fill={inValue ? '#60a5fa' : '#4b5563'} />
                <path d="M20 20 C12 20, 8 12, 2 20 C8 28, 12 20, 20 20" fill={inValue ? '#60a5fa' : '#4b5563'} />
              </g>
              {/* Center hub */}
              <circle cx="20" cy="20" r="4" fill={inValue ? '#93c5fd' : '#6b7280'} stroke={inValue ? '#60a5fa' : '#4b5563'} strokeWidth="1.5" />
            </svg>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className={`circuit-node ${selected ? 'selected' : ''}`}>
      {/* Header */}
      <div className="node-header">
        <span className="node-color-dot" style={{ background: def.color }} />
        <span>{def.label}</span>
      </div>

      {/* Body */}
      <div className="node-body">{renderBody()}</div>

      {/* Input Handles */}
      {def.inputs.map((pin, idx) => {
        const total = def.inputs.length;
        const spacing = 100 / (total + 1);
        const topPercent = spacing * (idx + 1);
        const signalHigh = data.signalValues?.[pin.id] ?? false;

        return (
          <React.Fragment key={pin.id}>
            <Handle
              type="target"
              position={Position.Left}
              id={pin.id}
              style={{ top: `${topPercent}%` }}
              className={signalHigh ? 'signal-high' : 'signal-low'}
              title={pin.label}
            />
            <span className="pin-label pin-label-left" style={{ top: `${topPercent}%` }}>
              {pin.label}
            </span>
          </React.Fragment>
        );
      })}

      {/* Output Handles */}
      {def.outputs.map((pin, idx) => {
        const total = def.outputs.length;
        const spacing = 100 / (total + 1);
        const topPercent = spacing * (idx + 1);
        const signalHigh = data.signalValues?.[pin.id] ?? false;

        return (
          <React.Fragment key={pin.id}>
            <Handle
              type="source"
              position={Position.Right}
              id={pin.id}
              style={{ top: `${topPercent}%` }}
              className={signalHigh ? 'signal-high' : 'signal-low'}
              title={pin.label}
            />
            <span className="pin-label pin-label-right" style={{ top: `${topPercent}%` }}>
              {pin.label}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default memo(CircuitNodeComponent);
