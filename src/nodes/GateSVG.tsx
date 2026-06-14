import React from 'react';

interface GateSVGProps {
  type: string;
}

export const GateSVG: React.FC<GateSVGProps> = ({ type }) => {
  const w = 48;
  const h = 36;

  switch (type) {
    case 'and-gate':
      return (
        <svg className="node-gate-svg" viewBox="0 0 48 36" fill="none">
          <path
            d="M6 4 H24 Q44 4 44 18 Q44 32 24 32 H6 Z"
            stroke="#3b82f6" strokeWidth="2" fill="rgba(59,130,246,0.08)"
          />
        </svg>
      );

    case 'or-gate':
      return (
        <svg className="node-gate-svg" viewBox="0 0 48 36" fill="none">
          <path
            d="M6 4 Q16 18 6 32 Q28 32 44 18 Q28 4 6 4 Z"
            stroke="#8b5cf6" strokeWidth="2" fill="rgba(139,92,246,0.08)"
          />
        </svg>
      );

    case 'not-gate':
      return (
        <svg className="node-gate-svg" viewBox="0 0 48 36" fill="none">
          <path
            d="M6 4 L38 18 L6 32 Z"
            stroke="#ef4444" strokeWidth="2" fill="rgba(239,68,68,0.08)"
          />
          <circle cx="41" cy="18" r="3" stroke="#ef4444" strokeWidth="2" fill="none" />
        </svg>
      );

    case 'nand-gate':
      return (
        <svg className="node-gate-svg" viewBox="0 0 52 36" fill="none">
          <path
            d="M6 4 H22 Q40 4 40 18 Q40 32 22 32 H6 Z"
            stroke="#06b6d4" strokeWidth="2" fill="rgba(6,182,212,0.08)"
          />
          <circle cx="44" cy="18" r="3" stroke="#06b6d4" strokeWidth="2" fill="none" />
        </svg>
      );

    case 'nor-gate':
      return (
        <svg className="node-gate-svg" viewBox="0 0 52 36" fill="none">
          <path
            d="M6 4 Q16 18 6 32 Q26 32 40 18 Q26 4 6 4 Z"
            stroke="#ec4899" strokeWidth="2" fill="rgba(236,72,153,0.08)"
          />
          <circle cx="44" cy="18" r="3" stroke="#ec4899" strokeWidth="2" fill="none" />
        </svg>
      );

    case 'xor-gate':
      return (
        <svg className="node-gate-svg" viewBox="0 0 48 36" fill="none">
          <path
            d="M10 4 Q20 18 10 32 Q32 32 44 18 Q32 4 10 4 Z"
            stroke="#f97316" strokeWidth="2" fill="rgba(249,115,22,0.08)"
          />
          <path
            d="M6 4 Q16 18 6 32"
            stroke="#f97316" strokeWidth="2" fill="none"
          />
        </svg>
      );

    case 'xnor-gate':
      return (
        <svg className="node-gate-svg" viewBox="0 0 52 36" fill="none">
          <path
            d="M10 4 Q20 18 10 32 Q30 32 40 18 Q30 4 10 4 Z"
            stroke="#14b8a6" strokeWidth="2" fill="rgba(20,184,166,0.08)"
          />
          <path
            d="M6 4 Q16 18 6 32"
            stroke="#14b8a6" strokeWidth="2" fill="none"
          />
          <circle cx="44" cy="18" r="3" stroke="#14b8a6" strokeWidth="2" fill="none" />
        </svg>
      );

    default:
      return (
        <svg className="node-gate-svg" viewBox={`0 0 ${w} ${h}`} fill="none">
          <rect x="4" y="4" width={w - 8} height={h - 8} rx="4"
            stroke="#6b7280" strokeWidth="2" fill="rgba(107,114,128,0.08)"
          />
        </svg>
      );
  }
};
