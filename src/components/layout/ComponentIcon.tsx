import React from 'react';

interface ComponentIconProps {
  type: string;
  size?: number;
}

/**
 * Returns a tiny SVG symbol for each component type,
 * used in the sidebar component list.
 */
const ComponentIcon: React.FC<ComponentIconProps> = ({ type, size = 16 }) => {
  const s = size;
  const half = s / 2;

  const common = { width: s, height: s, viewBox: `0 0 ${s} ${s}`, fill: 'none' as const, xmlns: 'http://www.w3.org/2000/svg' };

  switch (type) {
    // ── INPUTS ──────────────────────────────────────────────────────
    case 'toggle-switch':
      return (
        <svg {...common}>
          <rect x="2" y="5" width="12" height="6" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="11" cy="8" r="2" fill="currentColor" />
        </svg>
      );
    case 'push-button':
      return (
        <svg {...common}>
          <circle cx={half} cy={half} r="5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx={half} cy={half} r="2.5" fill="currentColor" />
        </svg>
      );
    case 'clock-source':
      return (
        <svg {...common}>
          <polyline points="2,11 4,11 4,5 8,5 8,11 12,11 12,5 14,5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="miter" />
        </svg>
      );
    case 'constant-high':
      return (
        <svg {...common}>
          <text x={half} y="12" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="800" fontFamily="monospace">1</text>
        </svg>
      );
    case 'constant-low':
      return (
        <svg {...common}>
          <text x={half} y="12" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="800" fontFamily="monospace">0</text>
        </svg>
      );

    // ── GATES ───────────────────────────────────────────────────────
    case 'and-gate':
      return (
        <svg {...common}>
          <path d="M3 3 H8 Q14 3 14 8 Q14 13 8 13 H3 Z" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case 'or-gate':
      return (
        <svg {...common}>
          <path d="M3 3 Q7 8 3 13 Q9 13 14 8 Q9 3 3 3 Z" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case 'not-gate':
      return (
        <svg {...common}>
          <path d="M3 3 L12 8 L3 13 Z" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="13.5" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'nand-gate':
      return (
        <svg {...common}>
          <path d="M2 3 H7 Q12 3 12 8 Q12 13 7 13 H2 Z" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="13.5" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'nor-gate':
      return (
        <svg {...common}>
          <path d="M3 3 Q6 8 3 13 Q8 13 12 8 Q8 3 3 3 Z" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="13.5" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'xor-gate':
      return (
        <svg {...common}>
          <path d="M5 3 Q8 8 5 13 Q10 13 14 8 Q10 3 5 3 Z" stroke="currentColor" strokeWidth="1.3" />
          <path d="M3 3 Q6 8 3 13" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case 'xnor-gate':
      return (
        <svg {...common}>
          <path d="M4 3 Q7 8 4 13 Q8 13 11 8 Q8 3 4 3 Z" stroke="currentColor" strokeWidth="1.3" />
          <path d="M2 3 Q5 8 2 13" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="12.5" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );

    // ── COMBINATIONAL ──────────────────────────────────────────────
    case 'half-adder':
      return (
        <svg {...common}>
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
          <text x={half} y="11.5" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="700" fontFamily="monospace">HA</text>
        </svg>
      );
    case 'full-adder':
      return (
        <svg {...common}>
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
          <text x={half} y="11.5" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="700" fontFamily="monospace">FA</text>
        </svg>
      );
    case 'mux-2to1':
      return (
        <svg {...common}>
          <path d="M3 2 L13 5 L13 11 L3 14 Z" stroke="currentColor" strokeWidth="1.3" />
          <text x="7" y="10.5" textAnchor="middle" fill="currentColor" fontSize="5" fontWeight="700">MX</text>
        </svg>
      );

    // ── SEQUENTIAL ─────────────────────────────────────────────────
    case 'sr-latch':
      return (
        <svg {...common}>
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
          <text x={half} y="11.5" textAnchor="middle" fill="currentColor" fontSize="7" fontWeight="700" fontFamily="monospace">SR</text>
        </svg>
      );
    case 'd-flipflop':
      return (
        <svg {...common}>
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
          <text x={half} y="11" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="700" fontFamily="monospace">D</text>
          <polyline points="2,11 5,8 2,8" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      );
    case 't-flipflop':
      return (
        <svg {...common}>
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
          <text x={half} y="11" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="700" fontFamily="monospace">T</text>
          <polyline points="2,11 5,8 2,8" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      );

    // ── OUTPUTS ─────────────────────────────────────────────────────
    case 'led-output':
      return (
        <svg {...common}>
          <circle cx={half} cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
          <line x1="5" y1="12" x2="11" y2="12" stroke="currentColor" strokeWidth="1.3" />
          <line x1="6" y1="14" x2="10" y2="14" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    case 'fan-output':
      return (
        <svg {...common}>
          <circle cx={half} cy={half} r="6" stroke="currentColor" strokeWidth="1.2" />
          <g style={{ transformOrigin: `${half}px ${half}px` }}>
            <path d={`M${half} ${half} C${half} ${half-3}, ${half+3} ${half-4}, ${half} ${half-6} C${half-3} ${half-4}, ${half} ${half-3}, ${half} ${half}`} fill="currentColor" />
            <path d={`M${half} ${half} C${half+3} ${half}, ${half+4} ${half+3}, ${half+6} ${half} C${half+4} ${half-3}, ${half+3} ${half}, ${half} ${half}`} fill="currentColor" />
            <path d={`M${half} ${half} C${half} ${half+3}, ${half-3} ${half+4}, ${half} ${half+6} C${half+3} ${half+4}, ${half} ${half+3}, ${half} ${half}`} fill="currentColor" />
            <path d={`M${half} ${half} C${half-3} ${half}, ${half-4} ${half-3}, ${half-6} ${half} C${half-4} ${half+3}, ${half-3} ${half}, ${half} ${half}`} fill="currentColor" />
          </g>
          <circle cx={half} cy={half} r="1.5" fill="currentColor" />
        </svg>
      );
    case 'seven-segment':
      return (
        <svg {...common}>
          <rect x="3" y="2" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <text x={half} y="12" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="800" fontFamily="monospace">8</text>
        </svg>
      );
    case 'logic-probe':
      return (
        <svg {...common}>
          <path d="M2 8 H7 L10 3 L10 13 L7 8" stroke="currentColor" strokeWidth="1.3" fill="none" />
          <line x1="10" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case 'binary-display':
      return (
        <svg {...common}>
          <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <text x={half} y="11" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="700" fontFamily="monospace">1010</text>
        </svg>
      );

    // ── DEFAULT ──────────────────────────────────────────────────────
    default:
      return (
        <svg {...common}>
          <rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
  }
};

export default ComponentIcon;
