import React, { useCallback, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { useCircuitStore } from '@/store/circuitStore';
import { useUIStore } from '@/store/uiStore';

const ImportModal: React.FC = () => {
  const { setShowImportModal } = useUIStore();
  const { importCircuit } = useCircuitStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target?.result as string;
      importCircuit(json);
      setShowImportModal(false);
    };
    reader.readAsText(file);
  }, [importCircuit, setShowImportModal]);

  return (
    <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>Import Circuit</h2>
          <button className="panel-close" onClick={() => setShowImportModal(false)}><X size={16} /></button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
          Import a previously exported LogicLab circuit file (.json).
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />

        <button
          className="modal-btn primary"
          onClick={() => fileInputRef.current?.click()}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', width: '100%', justifyContent: 'center' }}
        >
          <Upload size={18} /> Choose JSON File
        </button>
      </div>
    </div>
  );
};

export default ImportModal;
