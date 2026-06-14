import React from 'react';
import {
  Undo2, Redo2, Trash2, Download, Upload, LayoutTemplate, Info,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
  PanelBottomClose, PanelBottomOpen, Play, Pause, RotateCcw,
} from 'lucide-react';
import { useCircuitStore } from '@/store/circuitStore';
import { useUIStore } from '@/store/uiStore';

const Toolbar: React.FC = () => {
  const { undo, redo, clearCircuit, past, future, saveToLocalStorage } = useCircuitStore();
  const {
    sidebarOpen, toggleSidebar,
    rightPanelOpen, toggleRightPanel,
    bottomPanelOpen, toggleBottomPanel,
    isSimulationRunning, setSimulationRunning,
    setShowExportModal, setShowImportModal, setShowAboutModal,
    setBottomTab,
  } = useUIStore();

  return (
    <div className="app-toolbar">
      {/* Logo */}
      <div className="toolbar-logo">
        <div className="logo-icon">LL</div>
        <span>LogicLab</span>
      </div>

      {/* Sidebar toggle */}
      <button className="toolbar-btn" onClick={toggleSidebar} title="Toggle component library">
        {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
      </button>

      <div className="toolbar-divider" />

      {/* Edit actions */}
      <button className="toolbar-btn" onClick={undo} disabled={past.length === 0} title="Undo (Ctrl+Z)">
        <Undo2 size={15} /> <span>Undo</span>
      </button>
      <button className="toolbar-btn" onClick={redo} disabled={future.length === 0} title="Redo (Ctrl+Y)">
        <Redo2 size={15} /> <span>Redo</span>
      </button>

      <div className="toolbar-divider" />

      {/* File ops */}
      <button className="toolbar-btn" onClick={() => setShowImportModal(true)} title="Import circuit">
        <Upload size={15} /> <span>Import</span>
      </button>
      <button className="toolbar-btn" onClick={() => { saveToLocalStorage(); setShowExportModal(true); }} title="Export circuit">
        <Download size={15} /> <span>Export</span>
      </button>

      <div className="toolbar-divider" />

      {/* Panels */}
      <button className="toolbar-btn" onClick={() => setBottomTab('truthTable')} title="Truth table">
        <LayoutTemplate size={15} /> <span>Truth Table</span>
      </button>

      <button className="toolbar-btn" onClick={toggleRightPanel} title="Toggle properties panel">
        {rightPanelOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
      </button>

      <button className="toolbar-btn" onClick={toggleBottomPanel} title="Toggle bottom panel">
        {bottomPanelOpen ? <PanelBottomClose size={16} /> : <PanelBottomOpen size={16} />}
      </button>

      <div className="toolbar-divider" />

      <button className="toolbar-btn" onClick={clearCircuit} title="Clear circuit">
        <Trash2 size={15} />
      </button>

      <button className="toolbar-btn" onClick={() => setShowAboutModal(true)} title="About">
        <Info size={15} />
      </button>

      {/* Simulation controls */}
      <div className="toolbar-sim-controls">
        <button
          className={`sim-btn ${isSimulationRunning ? 'pause' : 'play'}`}
          onClick={() => setSimulationRunning(!isSimulationRunning)}
          title={isSimulationRunning ? 'Pause simulation' : 'Run simulation'}
        >
          {isSimulationRunning ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button className="sim-btn stop" onClick={() => { setSimulationRunning(false); }} title="Reset">
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
