import React, { useCallback } from 'react';
import { X, FileJson, Image } from 'lucide-react';
import { useCircuitStore } from '@/store/circuitStore';
import { useUIStore } from '@/store/uiStore';
import { toPng } from 'html-to-image';

const ExportModal: React.FC = () => {
  const { setShowExportModal } = useUIStore();
  const { exportCircuit } = useCircuitStore();

  const handleExportJSON = useCallback(() => {
    const json = exportCircuit();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logiclab-circuit.json';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  }, [exportCircuit, setShowExportModal]);

  const handleExportPNG = useCallback(async () => {
    const el = document.querySelector('.react-flow') as HTMLElement;
    if (!el) return;
    try {
      const dataUrl = await toPng(el, {
        backgroundColor: '#08080c',
        quality: 1,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'logiclab-circuit.png';
      a.click();
      setShowExportModal(false);
    } catch (err) {
      console.error('PNG export failed:', err);
    }
  }, [setShowExportModal]);

  return (
    <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>Export Circuit</h2>
          <button className="panel-close" onClick={() => setShowExportModal(false)}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="modal-btn primary" onClick={handleExportJSON} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px' }}>
            <FileJson size={18} /> Export as JSON
          </button>
          <button className="modal-btn secondary" onClick={handleExportPNG} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px' }}>
            <Image size={18} /> Export as PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
