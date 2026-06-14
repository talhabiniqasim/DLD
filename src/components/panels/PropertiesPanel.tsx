import React from 'react';
import { X } from 'lucide-react';
import { useCircuitStore } from '@/store/circuitStore';
import { useUIStore } from '@/store/uiStore';
import { getComponentDefinition } from '@/data/componentLibrary';

const PropertiesPanel: React.FC = () => {
  const { selectedNodeId, toggleRightPanel } = useUIStore();
  const nodes = useCircuitStore((s) => s.nodes);

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;
  const def = selectedNode ? getComponentDefinition(selectedNode.data.componentType) : null;

  if (!selectedNode || !def) {
    return (
      <>
        <div className="panel-header">
          <span>Properties</span>
          <button className="panel-close" onClick={toggleRightPanel}><X size={14} /></button>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No Component Selected</div>
          <div className="empty-hint">Click a component on the canvas to view its properties and educational info.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="panel-header">
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: def.color }} />
        <span>{def.label}</span>
        <button className="panel-close" onClick={toggleRightPanel}><X size={14} /></button>
      </div>
      <div className="panel-content">
        {/* Component Info */}
        <div className="prop-group">
          <div className="prop-group-title">Component Info</div>
          <div className="prop-row">
            <span className="prop-label">Type</span>
            <span className="prop-value">{def.type}</span>
          </div>
          <div className="prop-row">
            <span className="prop-label">Category</span>
            <span className="prop-value">{def.category}</span>
          </div>
          <div className="prop-row">
            <span className="prop-label">ID</span>
            <span className="prop-value" style={{ fontSize: 10 }}>{selectedNode.id}</span>
          </div>
        </div>

        {/* Formula */}
        {def.formula && (
          <div className="prop-group">
            <div className="prop-group-title">Formula</div>
            <div className="prop-formula">{def.formula}</div>
          </div>
        )}

        {/* Signals */}
        <div className="prop-group">
          <div className="prop-group-title">Current Signals</div>
          {def.inputs.map((pin) => {
            const val = selectedNode.data.signalValues?.[pin.id];
            return (
              <div key={pin.id} className="prop-row">
                <span className="prop-label">Input {pin.label}</span>
                <span className="prop-value" style={{ color: val ? '#22c55e' : '#6b7280' }}>
                  {val ? '1 (HIGH)' : '0 (LOW)'}
                </span>
              </div>
            );
          })}
          {def.outputs.map((pin) => {
            const val = selectedNode.data.signalValues?.[pin.id];
            return (
              <div key={pin.id} className="prop-row">
                <span className="prop-label">Output {pin.label}</span>
                <span className="prop-value" style={{ color: val ? '#22c55e' : '#6b7280', fontWeight: 600 }}>
                  {val ? '1 (HIGH)' : '0 (LOW)'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Education */}
        <div className="prop-group">
          <div className="prop-group-title">Description</div>
          <p className="edu-description">{def.description}</p>
        </div>

        {/* Mini truth table */}
        {def.truthTable.length > 0 && (
          <div className="prop-group">
            <div className="prop-group-title">Truth Table</div>
            <table className="truth-table" style={{ fontSize: 11 }}>
              <thead>
                <tr>
                  {def.inputs.map((pin) => (
                    <th key={pin.id} className="input-col">{pin.label}</th>
                  ))}
                  {def.inputs.length > 0 && def.outputs.length > 0 && <th className="separator-col" />}
                  {def.outputs.map((pin) => (
                    <th key={pin.id} className="output-col">{pin.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {def.truthTable.map((row, i) => (
                  <tr key={i}>
                    {def.inputs.map((pin) => (
                      <td key={pin.id} className={row.inputs[pin.id] ? 'val-1' : 'val-0'}>
                        {row.inputs[pin.id] ?? '-'}
                      </td>
                    ))}
                    {def.inputs.length > 0 && def.outputs.length > 0 && <td className="separator-col" />}
                    {def.outputs.map((pin) => (
                      <td key={pin.id} className={row.outputs[pin.id] ? 'val-1' : 'val-0'}>
                        {row.outputs[pin.id] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default PropertiesPanel;
