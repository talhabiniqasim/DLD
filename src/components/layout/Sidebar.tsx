import React, { useState, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { categories, getComponentsByCategory } from '@/data/componentLibrary';
import type { ComponentCategory } from '@/types/circuit';

const Sidebar: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<ComponentCategory>>(
    new Set(['inputs', 'gates', 'outputs'])
  );

  const toggleCategory = useCallback((cat: ComponentCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const onDragStart = useCallback((event: React.DragEvent, componentType: string, label: string) => {
    event.dataTransfer.setData('application/logiclab-component', JSON.stringify({ componentType, label }));
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  return (
    <>
      <div className="sidebar-header">Components</div>
      <div className="sidebar-content">
        {categories.map((cat) => {
          const components = getComponentsByCategory(cat.id);
          if (components.length === 0) return null;
          const isOpen = expandedCategories.has(cat.id);

          return (
            <div key={cat.id} className="component-category">
              <div className="category-header" onClick={() => toggleCategory(cat.id)}>
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <ChevronRight size={12} className={`chevron ${isOpen ? 'open' : ''}`} />
              </div>

              {isOpen && (
                <div className="component-list">
                  {components.map((comp) => (
                    <div
                      key={comp.type}
                      className="component-item"
                      draggable
                      onDragStart={(e) => onDragStart(e, comp.type, comp.label)}
                      title={comp.description}
                    >
                      <div className="comp-icon" style={{ background: comp.color }}>
                        {comp.label.charAt(0)}
                      </div>
                      <span>{comp.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
