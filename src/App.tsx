import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';

import Toolbar from '@/components/layout/Toolbar';
import Sidebar from '@/components/layout/Sidebar';
import CircuitCanvas from '@/components/canvas/CircuitCanvas';
import PropertiesPanel from '@/components/panels/PropertiesPanel';
import TruthTablePanel from '@/components/panels/TruthTablePanel';
import ExportModal from '@/components/modals/ExportModal';
import ImportModal from '@/components/modals/ImportModal';
import AboutModal from '@/components/modals/AboutModal';

import { useUIStore } from '@/store/uiStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutoSave } from '@/hooks/useAutoSave';

const App: React.FC = () => {
  useKeyboardShortcuts();
  useAutoSave(5000);

  const {
    sidebarOpen,
    rightPanelOpen,
    bottomPanelOpen,
    showExportModal,
    showImportModal,
    showAboutModal,
  } = useUIStore();

  return (
    <ReactFlowProvider>
      <div className="app-layout">
        {/* Top Toolbar */}
        <Toolbar />

        {/* Main Area */}
        <div className="app-main">
          {/* Left Sidebar */}
          <div className={`app-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
            <Sidebar />
          </div>

          {/* Canvas + Bottom Panel */}
          <div className="app-canvas-container">
            <div className="app-canvas">
              <CircuitCanvas />
            </div>

            {/* Bottom Panel (Truth Table) */}
            <div className={`app-bottom-panel ${bottomPanelOpen ? '' : 'collapsed'}`}>
              <TruthTablePanel />
            </div>
          </div>

          {/* Right Panel (Properties) */}
          <div className={`app-right-panel ${rightPanelOpen ? '' : 'collapsed'}`}>
            <PropertiesPanel />
          </div>
        </div>

        {/* Modals */}
        {showExportModal && <ExportModal />}
        {showImportModal && <ImportModal />}
        {showAboutModal && <AboutModal />}
      </div>
    </ReactFlowProvider>
  );
};

export default App;
