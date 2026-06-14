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
  const strokeColor = isHigh ? '#22c55e' : '#4b5563';
  const glowFilter = isHigh ? 'url(#wire-glow-green)' : undefined;
  const strokeWidth = selected ? 3 : 2.5;

  return (
    <>
      {/* Glow filter definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="wire-glow-green" x="-50%" y="-50%" width="200%" height="200%">
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
          transition: 'stroke 0.2s ease',
        }}
        className={isHigh ? 'wire-animated' : ''}
      />
    </>
  );
};

export default memo(WireEdge);
