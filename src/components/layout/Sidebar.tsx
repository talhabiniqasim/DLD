import React, { useState, useCallback, useMemo } from 'react';
import { ChevronRight, Search, X } from 'lucide-react';
import { categories, getComponentsByCategory, componentLibrary } from '@/data/componentLibrary';
import ComponentIcon from '@/components/layout/ComponentIcon';
import type { ComponentCategory } from '@/types/circuit';

const Sidebar: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<ComponentCategory>>(
    new Set(['inputs', 'gates', 'outputs', 'combinational', 'sequential'])
  );
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter components based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return null; // null = no search active
    const q = searchQuery.toLowerCase();
    return Object.values(componentLibrary).filter(
      (comp) =>
        comp.label.toLowerCase().includes(q) ||
        comp.type.toLowerCase().includes(q) ||
        comp.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <>
      <div className="sidebar-header">
        <span>Components</span>
        <span className="sidebar-badge">{Object.keys(componentLibrary).length}</span>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <Search size={13} className="sidebar-search-icon" />
        <input
          type="text"
          placeholder="Search components…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sidebar-search-input"
        />
        {searchQuery && (
          <button className="sidebar-search-clear" onClick={() => setSearchQuery('')}>
            <X size={12} />
          </button>
        )}
      </div>

      <div className="sidebar-content">
        {/* Search results mode */}
        {filteredCategories ? (
          filteredCategories.length === 0 ? (
            <div className="sidebar-empty">
              <span style={{ fontSize: 24, opacity: 0.4 }}>🔍</span>
              <span>No components match "{searchQuery}"</span>
            </div>
          ) : (
            <div className="component-list">
              {filteredCategories.map((comp) => (
                <div
                  key={comp.type}
                  className="component-item"
                  draggable
                  onDragStart={(e) => onDragStart(e, comp.type, comp.label)}
                  title={comp.description}
                >
                  <div className="comp-icon" style={{ background: comp.color }}>
                    <ComponentIcon type={comp.type} size={16} />
                  </div>
                  <div className="comp-info">
                    <span className="comp-name">{comp.label}</span>
                    <span className="comp-desc">{comp.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Normal category mode */
          categories.map((cat) => {
            const components = getComponentsByCategory(cat.id);
            if (components.length === 0) return null;
            const isOpen = expandedCategories.has(cat.id);

            return (
              <div key={cat.id} className="component-category">
                <div className="category-header" onClick={() => toggleCategory(cat.id)}>
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className="category-count">{components.length}</span>
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
                        <div className="comp-info">
                          <span className="comp-name">{comp.label}</span>
                          <span className="comp-desc">{comp.formula}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Sidebar;
