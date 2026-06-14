import { create } from 'zustand';

type ActivePanel = 'properties' | 'truthTable' | 'waveform' | 'education' | null;

interface UIStore {
  // Sidebar
  sidebarOpen: boolean;
  sidebarWidth: number;
  toggleSidebar: () => void;

  // Bottom panel
  bottomPanelOpen: boolean;
  bottomPanelHeight: number;
  activeBottomTab: 'truthTable' | 'waveform';
  toggleBottomPanel: () => void;
  setBottomTab: (tab: 'truthTable' | 'waveform') => void;

  // Right panel
  rightPanelOpen: boolean;
  activeRightPanel: ActivePanel;
  setActiveRightPanel: (panel: ActivePanel) => void;
  toggleRightPanel: () => void;

  // Selection
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  // Modals
  showExportModal: boolean;
  showImportModal: boolean;
  showTemplateModal: boolean;
  showAboutModal: boolean;
  setShowExportModal: (show: boolean) => void;
  setShowImportModal: (show: boolean) => void;
  setShowTemplateModal: (show: boolean) => void;
  setShowAboutModal: (show: boolean) => void;

  // Simulation controls
  isSimulationRunning: boolean;
  simulationSpeed: number;
  setSimulationRunning: (running: boolean) => void;
  setSimulationSpeed: (speed: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Sidebar
  sidebarOpen: true,
  sidebarWidth: 260,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // Bottom panel
  bottomPanelOpen: false,
  bottomPanelHeight: 250,
  activeBottomTab: 'truthTable',
  toggleBottomPanel: () => set((s) => ({ bottomPanelOpen: !s.bottomPanelOpen })),
  setBottomTab: (tab) => set({ activeBottomTab: tab, bottomPanelOpen: true }),

  // Right panel
  rightPanelOpen: true,
  activeRightPanel: 'properties',
  setActiveRightPanel: (panel) => set({ activeRightPanel: panel, rightPanelOpen: true }),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),

  // Selection
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  // Modals
  showExportModal: false,
  showImportModal: false,
  showTemplateModal: false,
  showAboutModal: false,
  setShowExportModal: (show) => set({ showExportModal: show }),
  setShowImportModal: (show) => set({ showImportModal: show }),
  setShowTemplateModal: (show) => set({ showTemplateModal: show }),
  setShowAboutModal: (show) => set({ showAboutModal: show }),

  // Simulation
  isSimulationRunning: true,
  simulationSpeed: 1,
  setSimulationRunning: (running) => set({ isSimulationRunning: running }),
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
}));
