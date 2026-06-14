import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';

import Toolbar from '@/components/layout/Toolbar';
import Sidebar from '@/components/layout/Sidebar';
import CircuitCanvas from '@/components/canvas/CircuitCanvas';
import WelcomeOverlay from '@/components/canvas/WelcomeOverlay';
import PropertiesPanel from '@/components/panels/PropertiesPanel';
import TruthTablePanel from '@/components/panels/TruthTablePanel';
import ExportModal from '@/components/modals/ExportModal';
import ImportModal from '@/components/modals/ImportModal';
import AboutModal from '@/components/modals/AboutModal';
import TemplateModal from '@/components/modals/TemplateModal';

import { useUIStore } from '@/store/uiStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useSimulationLoop } from '@/hooks/useSimulationLoop';

const App: React.FC = () => {
  useKeyboardShortcuts();
  useAutoSave(5000);
  useSimulationLoop();

  const {
    sidebarOpen,
    rightPanelOpen,
    bottomPanelOpen,
    showExportModal,
    showImportModal,
    showAboutModal,
    showTemplateModal,
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
              <WelcomeOverlay />
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

        {/* Footer */}
        <div className="app-footer">
          <div className="footer-left">LOGICLAB SIMULATOR • v1.0.0</div>
          <div className="footer-right">
            <a href="https://linkedin.com/in/talhabiniqasim" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
            <span className="footer-divider">•</span>
            <a href="mailto:talhabiniqasim@gmail.com" className="footer-link">Email</a>
          </div>
        </div>

        {/* Modals */}
        {showExportModal && <ExportModal />}
        {showImportModal && <ImportModal />}
        {showAboutModal && <AboutModal />}
        {showTemplateModal && <TemplateModal />}
      </div>
    </ReactFlowProvider>
  );
};

export default App;
