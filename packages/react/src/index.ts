/**
 * @workout-timer/react
 * React hooks and providers for workout timers
 */

// Export all hooks
export { useTimerConfig } from './hooks/useTimerConfig';
export { useTimerDisplay } from './hooks/useTimerDisplay';
export { useTimerSound } from './hooks/useTimerSound';

// Export contexts and providers
export { TimerProvider, useTimerContext } from './contexts/TimerContext';
export { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Export types
export type {
  TimerConfig,
  AMRAPConfig,
  EMOMConfig,
  TabataConfig,
  IntervalsConfig,
  ForTimeConfig,
  TimerConfigBase
} from './hooks/useTimerConfig';

export type {
  TimerContextValue
} from './contexts/TimerContext';

export type {
  Theme
} from './contexts/ThemeContext';

// Re-export commonly used types from core
export { TimerState } from '@workout-timer/core';
export type { TimerSnapshot } from '@workout-timer/core';

// Export timer types
export type {
  ExtendedTimerSnapshot
} from './types/timer.types';
export { TimerError, TimerErrorType } from './types/timer.types';