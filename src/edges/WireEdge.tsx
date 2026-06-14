import React, { memo } from 'react';
import { BaseEdge, getSmoothStepPath, type EdgeProps, type Edge } from '@xyflow/react';
import type { CircuitEdgeData } from '@/types/circuit';

type WireEdgeType = Edge<CircuitEdgeData>;

const WireEdge: React.FC<EdgeProps<WireEdgeType>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  });

  const isHigh = data?.signalValue ?? false;
  const strokeColor = selected ? '#ef4444' : isHigh ? '#facc15' : '#333';
  const glowFilter = selected ? 'url(#wire-glow-red)' : isHigh ? 'url(#wire-glow-yellow)' : undefined;
  const strokeWidth = selected ? 3.5 : isHigh ? 2.5 : 2;

  return (
    <>
      {/* Glow filter definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="wire-glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="wire-glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth,
          filter: glowFilter,
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
        }}
        className={isHigh ? 'wire-animated' : ''}
      />
    </>
  );
};

export default memo(WireEdge);
