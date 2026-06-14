import React, { useState, useCallback } from 'react';
import { X, ChevronRight, Layout } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useCircuitStore } from '@/store/circuitStore';
import { circuitTemplates, templateCategories, type CircuitTemplate } from '@/data/circuitTemplates';
import { getComponentDefinition } from '@/data/componentLibrary';

const TemplateModal: React.FC = () => {
  const { setShowTemplateModal } = useUIStore();
  const { pushHistory } = useCircuitStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('basics');

  const loadTemplate = useCallback((template: CircuitTemplate) => {
    pushHistory();

    const prefix = `ins-${Date.now()}-`;
    const idMap = new Map<string, string>();
    template.nodes.forEach(n => idMap.set(n.id, `${prefix}${n.id}`));

    // Determine an offset based on current nodes to prevent stacking perfectly
    const offset = useCircuitStore.getState().nodes.length * 10;

    // Re-hydrate node input/output definitions and update IDs/Positions
    const hydratedNodes = template.nodes.map((node) => {
      const def = getComponentDefinition(node.data.componentType);
      return {
        ...node,
        id: idMap.get(node.id)!,
        position: { x: node.position.x + 50 + offset, y: node.position.y + 50 + offset },
        data: {
          ...node.data,
          inputs: def?.inputs ?? [],
          outputs: def?.outputs ?? [],
        },
      };
    });

    const hydratedEdges = template.edges.map((edge) => ({
      ...edge,
      id: `${prefix}${edge.id}`,
      source: idMap.get(edge.source) ?? edge.source,
      target: idMap.get(edge.target) ?? edge.target,
    }));

    const nodes = JSON.parse(JSON.stringify(hydratedNodes));
    const edges = JSON.parse(JSON.stringify(hydratedEdges));

    useCircuitStore.setState((state) => ({
      nodes: [...state.nodes, ...nodes],
      edges: [...state.edges, ...edges]
    }));
    
    setTimeout(() => useCircuitStore.getState().runSimulation(), 0);
    setShowTemplateModal(false);
  }, [pushHistory, setShowTemplateModal]);

  const filtered = circuitTemplates.filter((t) => t.category === selectedCategory);

  return (
    <div className="modal-overlay" onClick={() => setShowTemplateModal(false)}>
      <div className="modal-content template-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="template-modal-header">
          <div className="template-modal-title">
            <Layout size={18} />
            <h2>Circuit Templates</h2>
          </div>
          <button className="panel-close" onClick={() => setShowTemplateModal(false)}>
            <X size={16} />
          </button>
        </div>

        <p className="template-modal-desc">
          Load a pre-built circuit to learn how components work. Toggle the switches to interact!
        </p>

        {/* Category tabs */}
        <div className="template-tabs">
          {templateCategories.map((cat) => (
            <button
              key={cat.id}
              className={`template-tab ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Template list */}
        <div className="template-list">
          {filtered.map((tpl) => (
            <div key={tpl.id} className="template-card" onClick={() => loadTemplate(tpl)}>
              <div className="template-card-header">
                <span className="template-card-icon">{tpl.icon}</span>
                <span className="template-card-name">{tpl.name}</span>
                <ChevronRight size={14} className="template-card-arrow" />
              </div>
              <p className="template-card-desc">{tpl.description}</p>
              <div className="template-card-meta">
                <span>{tpl.nodes.length} nodes</span>
                <span>•</span>
                <span>{tpl.edges.length} wires</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
