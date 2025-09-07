/**
 * Type definitions for the Workout Timer application
 * @module timer.types
 */

import { TimerSnapshot as BaseTimerSnapshot } from '@workout-timer/core';

/**
 * Extended timer snapshot with additional fields for UI display
 * @interface ExtendedTimerSnapshot
 * @extends {BaseTimerSnapshot}
 */
export interface ExtendedTimerSnapshot extends BaseTimerSnapshot {
  /** Whether the timer is in countdown phase */
  isCountdown?: boolean;
  /** Remaining time in countdown (ms) */
  countdownRemaining?: number;
  /** Name of current interval */
  intervalName?: string;
  /** Type of current interval */
  intervalType?: 'work' | 'rest' | 'prep';
  /** Whether in working phase (Tabata) */
  isWorking?: boolean;
  /** Current set number (Tabata) */
  currentSet?: number;
  /** User-completed rounds (AMRAP) */
  rounds?: number;
}

/**
 * Timer phase information for display
 * @interface PhaseInfo
 */
export interface PhaseInfo {
  /** Phase display text */
  text: string;
  /** Phase color theme */
  color: 'red' | 'green' | 'yellow' | 'blue' | 'gray';
  /** Optional phase icon */
  icon?: string;
}

/**
 * Round information for display
 * @interface RoundInfo
 */
export interface RoundInfo {
  /** Current round number */
  current: number;
  /** Total rounds (null for unlimited) */
  total: number | null;
}

/**
 * Timer error types
 * @enum {string}
 */
export enum TimerErrorType {
  INITIALIZATION_ERROR = 'INITIALIZATION_ERROR',
  AUDIO_ERROR = 'AUDIO_ERROR',
  STATE_ERROR = 'STATE_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR',
}

/**
 * Timer error class
 * @class TimerError
 * @extends {Error}
 */
export class TimerError extends Error {
  constructor(
    message: string,
    public type: TimerErrorType,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'TimerError';
  }
}