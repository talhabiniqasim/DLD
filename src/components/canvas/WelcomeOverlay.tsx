import React from 'react';
import { Cpu, ArrowRight, Zap, MousePointerClick, Layout } from 'lucide-react';
import { useCircuitStore } from '@/store/circuitStore';

const WelcomeOverlay: React.FC = () => {
  const nodeCount = useCircuitStore((s) => s.nodes.length);

  if (nodeCount > 0) return null;

  return (
    <div className="welcome-overlay">
      <div className="welcome-card">
        <div className="welcome-logo">
          <Cpu size={32} />
        </div>
        <h2 className="welcome-title">Welcome to LogicLab</h2>
        <p className="welcome-subtitle">Build digital logic circuits visually</p>

        <div className="welcome-steps">
          <div className="welcome-step">
            <div className="welcome-step-icon">
              <ArrowRight size={14} />
            </div>
            <div className="welcome-step-text">
              <strong>Drag</strong> components from the sidebar onto the canvas
            </div>
          </div>
          <div className="welcome-step">
            <div className="welcome-step-icon">
              <Zap size={14} />
            </div>
            <div className="welcome-step-text">
              <strong>Connect</strong> pins by clicking output → input handles
            </div>
          </div>
          <div className="welcome-step">
            <div className="welcome-step-icon">
              <MousePointerClick size={14} />
            </div>
            <div className="welcome-step-text">
              <strong>Toggle</strong> switches to see signals flow in real-time
            </div>
          </div>
          <div className="welcome-step">
            <div className="welcome-step-icon">
              <Layout size={14} />
            </div>
            <div className="welcome-step-text">
              <strong>Explore</strong> templates from the toolbar to learn fast
            </div>
          </div>
        </div>

        <div className="welcome-shortcuts">
          <span className="welcome-kbd">Ctrl+Z</span> Undo
          <span className="welcome-kbd" style={{ marginLeft: 12 }}>Ctrl+Y</span> Redo
          <span className="welcome-kbd" style={{ marginLeft: 12 }}>Del</span> Delete
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
