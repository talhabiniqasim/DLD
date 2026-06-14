import React from 'react';
import { X, Linkedin, Mail } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

const AboutModal: React.FC = () => {
  const { setShowAboutModal } = useUIStore();

  return (
    <div className="modal-overlay" onClick={() => setShowAboutModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>About LogicLab</h2>
          <button className="panel-close" onClick={() => setShowAboutModal(false)}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: 'white',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
          }}>
            LL
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>LogicLab</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>v1.0.0 — Digital Logic Circuit Simulator</div>
          </div>
        </div>

        <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
          LogicLab is a browser-based digital logic circuit simulator designed for students and educators.
          Build, simulate, and learn digital circuits interactively — right in your browser. No installation required.
        </p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 10 }}>
            Features
          </div>
          <ul style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', lineHeight: 1.8, paddingLeft: 18 }}>
            <li>Drag-and-drop circuit building</li>
            <li>Real-time simulation engine</li>
            <li>7 logic gates + inputs/outputs</li>
            <li>Automatic truth table generation</li>
            <li>JSON export/import</li>
            <li>Educational descriptions & formulas</li>
          </ul>
        </div>

        <div className="about-links" style={{
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: 16,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 10 }}>
            Developer
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
            Talha Bin Qasim
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <a href="mailto:talhaqasim475@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <Mail size={14} /> talhaqasim475@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/talhabinqasim" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <Linkedin size={14} /> linkedin.com/in/talhabinqasim
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
