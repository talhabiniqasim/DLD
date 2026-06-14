import type { SignalState } from '../types/circuit';

export const SIGNAL_COLORS: Record<SignalState, string> = {
  high:    '#22c55e',   // green-500
  low:     '#4b5563',   // gray-600
  error:   '#ef4444',   // red-500
  unknown: '#6b7280',   // gray-500
};

export const SIGNAL_GLOW: Record<SignalState, string> = {
  high:    '0 0 8px rgba(34, 197, 94, 0.6)',
  low:     'none',
  error:   '0 0 8px rgba(239, 68, 68, 0.6)',
  unknown: 'none',
};

export function getSignalColor(value: boolean | undefined): string {
  if (value === undefined) return SIGNAL_COLORS.unknown;
  return value ? SIGNAL_COLORS.high : SIGNAL_COLORS.low;
}

export function getSignalState(value: boolean | undefined): SignalState {
  if (value === undefined) return 'unknown';
  return value ? 'high' : 'low';
}
