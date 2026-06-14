import React, { useMemo, useCallback } from 'react';
import { Download, Copy } from 'lucide-react';
import { useCircuitStore } from '@/store/circuitStore';
import { getComponentDefinition } from '@/data/componentLibrary';
import { evaluateCircuit } from '@/simulator/SimulationEngine';

const TruthTablePanel: React.FC = () => {
  const { nodes, edges } = useCircuitStore();

  // Find all input and output nodes
  const { inputNodes, outputNodes } = useMemo(() => {
    const inputNodes = nodes.filter((n) => {
      const def = getComponentDefinition(n.data.componentType);
      return def?.category === 'inputs' && n.data.componentType !== 'clock-source';
    });
    const outputNodes = nodes.filter((n) => {
      const def = getComponentDefinition(n.data.componentType);
      return def?.category === 'outputs';
    });
    return { inputNodes, outputNodes };
  }, [nodes]);

  // Generate truth table
  const table = useMemo(() => {
    if (inputNodes.length === 0 || outputNodes.length === 0) return null;
    if (inputNodes.length > 10) return null; // Limit to prevent 2^10+ rows

    const numInputs = inputNodes.length;
    const numCombinations = Math.pow(2, numInputs);
    const rows: { inputs: boolean[]; outputs: boolean[] }[] = [];

    for (let i = 0; i < numCombinations; i++) {
      // Set input states
      const inputValues: boolean[] = [];
      const testNodes = nodes.map((n) => {
        const inputIdx = inputNodes.findIndex((inp) => inp.id === n.id);
        if (inputIdx !== -1) {
          const val = Boolean((i >> (numInputs - 1 - inputIdx)) & 1);
          inputValues.push(val);
          return {
            ...n,
            data: { ...n.data, properties: { ...n.data.properties, state: val } },
          };
        }
        return n;
      });

      // Evaluate
      const result = evaluateCircuit(testNodes, edges);

      // Read outputs
      const outputValues: boolean[] = outputNodes.map((outNode) => {
        const def = getComponentDefinition(outNode.data.componentType);
        if (!def) return false;
        // For outputs, check their input pin
        const firstInput = def.inputs[0];
        if (firstInput) {
          return result.signals.get(`${outNode.id}:${firstInput.id}`) ?? false;
        }
        return false;
      });

      rows.push({ inputs: inputValues, outputs: outputValues });
    }

    return rows;
  }, [inputNodes, outputNodes, nodes, edges]);

  // Export CSV
  const exportCSV = useCallback(() => {
    if (!table) return;
    const headers = [
      ...inputNodes.map((n) => n.data.label),
      ...outputNodes.map((n) => n.data.label),
    ];
    const csvRows = [
      headers.join(','),
      ...table.map((row) => [...row.inputs, ...row.outputs].map((v) => (v ? '1' : '0')).join(',')),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'truth_table.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [table, inputNodes, outputNodes]);

  // Copy to clipboard
  const copyTable = useCallback(() => {
    if (!table) return;
    const headers = [
      ...inputNodes.map((n) => n.data.label),
      '|',
      ...outputNodes.map((n) => n.data.label),
    ];
    const text = [
      headers.join('\t'),
      ...table.map((row) => [
        ...row.inputs.map((v) => (v ? '1' : '0')),
        '|',
        ...row.outputs.map((v) => (v ? '1' : '0')),
      ].join('\t')),
    ].join('\n');
    navigator.clipboard.writeText(text);
  }, [table, inputNodes, outputNodes]);

  if (inputNodes.length === 0 || outputNodes.length === 0) {
    return (
      <div className="empty-state" style={{ height: '100%' }}>
        <div className="empty-icon">📊</div>
        <div className="empty-title">No Truth Table Available</div>
        <div className="empty-hint">
          Add at least one input and one output component to generate a truth table.
        </div>
      </div>
    );
  }

  if (inputNodes.length > 10) {
    return (
      <div className="empty-state" style={{ height: '100%' }}>
        <div className="empty-icon">⚠️</div>
        <div className="empty-title">Too Many Inputs</div>
        <div className="empty-hint">
          Truth table generation is limited to 10 inputs ({Math.pow(2, inputNodes.length)} rows would be generated).
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', gap: 8, borderBottom: '1px solid var(--color-border-subtle)' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Truth Table ({table?.length ?? 0} rows)
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button className="toolbar-btn" onClick={copyTable} title="Copy table">
            <Copy size={13} />
          </button>
          <button className="toolbar-btn" onClick={exportCSV} title="Export CSV">
            <Download size={13} />
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {table && (
          <table className="truth-table">
            <thead>
              <tr>
                {inputNodes.map((n) => (
                  <th key={n.id} className="input-col">{n.data.label}</th>
                ))}
                <th className="separator-col" />
                {outputNodes.map((n) => (
                  <th key={n.id} className="output-col">{n.data.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((row, i) => (
                <tr key={i}>
                  {row.inputs.map((v, j) => (
                    <td key={`i${j}`} className={v ? 'val-1' : 'val-0'}>{v ? 1 : 0}</td>
                  ))}
                  <td className="separator-col" />
                  {row.outputs.map((v, j) => (
                    <td key={`o${j}`} className={v ? 'val-1' : 'val-0'}>{v ? 1 : 0}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TruthTablePanel;
