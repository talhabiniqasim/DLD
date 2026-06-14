import { useEffect } from 'react';
import { useCircuitStore } from '@/store/circuitStore';

export function useKeyboardShortcuts() {
  const { undo, redo, saveToLocalStorage } = useCircuitStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      // Ctrl+Z — Undo
      if (isCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl+Y or Ctrl+Shift+Z — Redo
      if ((isCtrl && e.key === 'y') || (isCtrl && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
      }

      // Ctrl+S — Save
      if (isCtrl && e.key === 's') {
        e.preventDefault();
        saveToLocalStorage();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, saveToLocalStorage]);
}
