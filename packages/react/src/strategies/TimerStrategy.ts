/**
 * Timer Strategy Pattern Implementation
 * Provides different strategies for handling timer types
 * @module TimerStrategy
 */

import { ExtendedTimerSnapshot } from '../types/timer.types';
import { PhaseInfo, RoundInfo } from '../types/timer.types';

/**
 * Base Timer Strategy Interface
 * All timer types must implement this interface
 * @interface ITimerStrategy
 */
export interface ITimerStrategy {
  /** Get formatted display time */
  getDisplayTime(snapshot: ExtendedTimerSnapshot): string;
  /** Get phase information */
  getPhaseInfo(snapshot: ExtendedTimerSnapshot): PhaseInfo;
  /** Get round information */
  getRoundInfo(snapshot: ExtendedTimerSnapshot, roundCount?: number): RoundInfo | null;
  /** Get control button configuration */
  getControlButtons(snapshot: ExtendedTimerSnapshot): ControlButton[];
  /** Get theme color for this timer type */
  getThemeColor(): string;
}

/**
 * Control button configuration
 */
export interface ControlButton {
  id: string;
  label: string;
  action: string;
  className: string;
  span?: number;
}

/**
 * Utility function to format time
 */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * AMRAP Timer Strategy
 */
export class AMRAPStrategy implements ITimerStrategy {
  getDisplayTime(snapshot: ExtendedTimerSnapshot): string {
    if (snapshot.isCountdown) {
      return Math.ceil((snapshot.countdownRemaining || 0) / 1000).toString();
    }
    return formatTime(snapshot.remaining);
  }

  getPhaseInfo(snapshot: ExtendedTimerSnapshot): PhaseInfo {
    if (snapshot.isCountdown) {
      return { text: 'GET READY!', color: 'yellow', icon: '🚀' };
    }
    return { text: '', color: 'blue' };
  }

  getRoundInfo(snapshot: ExtendedTimerSnapshot, roundCount: number = 0): RoundInfo {
    return { current: roundCount, total: null };
  }

  getControlButtons(snapshot: ExtendedTimerSnapshot): ControlButton[] {
    return [
      {
        id: 'lap',
        label: 'LAP',
        action: 'handleRoundComplete',
        className: 'bg-white text-black',
        span: 1
      }
    ];
  }

  getThemeColor(): string {
    return 'from-gray-700 to-gray-800';
  }
}

/**
 * EMOM Timer Strategy
 */
export class EMOMStrategy implements ITimerStrategy {
  getDisplayTime(snapshot: ExtendedTimerSnapshot): string {
    if (snapshot.isCountdown) {
      return Math.ceil((snapshot.countdownRemaining || 0) / 1000).toString();
    }
    return formatTime(snapshot.remaining);
  }

  getPhaseInfo(snapshot: ExtendedTimerSnapshot): PhaseInfo {
    if (snapshot.isCountdown) {
      return { text: 'GET READY!', color: 'yellow', icon: '🚀' };
    }
    return { text: 'EVERY MINUTE', color: 'blue' };
  }

  getRoundInfo(snapshot: ExtendedTimerSnapshot): RoundInfo | null {
    if (snapshot.currentRound && snapshot.totalRounds) {
      return { current: snapshot.currentRound, total: snapshot.totalRounds };
    }
    return null;
  }

  getControlButtons(snapshot: ExtendedTimerSnapshot): ControlButton[] {
    return [
      {
        id: 'stop',
        label: 'STOP',
        action: 'stop',
        className: 'bg-red-900/30',
        span: 1
      }
    ];
  }

  getThemeColor(): string {
    return 'from-gray-700 to-gray-800';
  }
}

/**
 * Tabata Timer Strategy
 */
export class TabataStrategy implements ITimerStrategy {
  getDisplayTime(snapshot: ExtendedTimerSnapshot): string {
    if (snapshot.isCountdown) {
      return Math.ceil((snapshot.countdownRemaining || 0) / 1000).toString();
    }
    return formatTime(snapshot.intervalRemaining || snapshot.remaining);
  }

  getPhaseInfo(snapshot: ExtendedTimerSnapshot): PhaseInfo {
    if (snapshot.isCountdown) {
      return { text: 'GET READY!', color: 'yellow', icon: '🚀' };
    }
    if (snapshot.isWorking !== undefined) {
      return snapshot.isWorking 
        ? { text: 'WORK', color: 'red', icon: '💪' }
        : { text: 'REST', color: 'green', icon: '😌' };
    }
    return { text: '', color: 'blue' };
  }

  getRoundInfo(snapshot: ExtendedTimerSnapshot): RoundInfo | null {
    if (snapshot.currentRound && snapshot.totalRounds) {
      return { current: snapshot.currentRound, total: snapshot.totalRounds };
    }
    return null;
  }

  getControlButtons(snapshot: ExtendedTimerSnapshot): ControlButton[] {
    return [
      {
        id: 'stop',
        label: 'STOP',
        action: 'stop',
        className: 'bg-red-900/30',
        span: 1
      }
    ];
  }

  getThemeColor(): string {
    return 'from-gray-700 to-gray-800';
  }
}

/**
 * For Time Timer Strategy
 */
export class ForTimeStrategy implements ITimerStrategy {
  getDisplayTime(snapshot: ExtendedTimerSnapshot): string {
    if (snapshot.isCountdown) {
      return Math.ceil((snapshot.countdownRemaining || 0) / 1000).toString();
    }
    return formatTime(snapshot.elapsed);
  }

  getPhaseInfo(snapshot: ExtendedTimerSnapshot): PhaseInfo {
    if (snapshot.isCountdown) {
      return { text: 'GET READY!', color: 'yellow', icon: '🚀' };
    }
    return { text: 'FOR TIME', color: 'blue' };
  }

  getRoundInfo(snapshot: ExtendedTimerSnapshot): RoundInfo | null {
    if (snapshot.currentRound && snapshot.totalRounds) {
      return { current: snapshot.currentRound, total: snapshot.totalRounds };
    }
    return null;
  }

  getControlButtons(snapshot: ExtendedTimerSnapshot): ControlButton[] {
    return [
      {
        id: 'next',
        label: 'NEXT',
        action: 'handleRoundComplete',
        className: 'bg-white text-black',
        span: 1
      }
    ];
  }

  getThemeColor(): string {
    return 'from-gray-700 to-gray-800';
  }
}

/**
 * Intervals Timer Strategy
 */
export class IntervalsStrategy implements ITimerStrategy {
  getDisplayTime(snapshot: ExtendedTimerSnapshot): string {
    if (snapshot.isCountdown) {
      return Math.ceil((snapshot.countdownRemaining || 0) / 1000).toString();
    }
    return formatTime(snapshot.intervalRemaining || snapshot.remaining);
  }

  getPhaseInfo(snapshot: ExtendedTimerSnapshot): PhaseInfo {
    if (snapshot.isCountdown) {
      return { text: 'GET READY!', color: 'yellow', icon: '🚀' };
    }
    if (snapshot.intervalName) {
      const colors: Record<string, 'red' | 'green' | 'yellow'> = {
        work: 'red',
        rest: 'green',
        prep: 'yellow',
      };
      return { 
        text: snapshot.intervalName.toUpperCase(), 
        color: colors[snapshot.intervalType || ''] || 'blue' 
      };
    }
    return { text: '', color: 'blue' };
  }

  getRoundInfo(snapshot: ExtendedTimerSnapshot): RoundInfo | null {
    if (snapshot.currentRound && snapshot.totalRounds) {
      return { current: snapshot.currentRound, total: snapshot.totalRounds };
    }
    return null;
  }

  getControlButtons(snapshot: ExtendedTimerSnapshot): ControlButton[] {
    return [
      {
        id: 'stop',
        label: 'STOP',
        action: 'stop',
        className: 'bg-red-900/30',
        span: 1
      }
    ];
  }

  getThemeColor(): string {
    return 'from-gray-700 to-gray-800';
  }
}

/**
 * Timer Strategy Factory
 * Creates the appropriate strategy based on timer type
 */
export class TimerStrategyFactory {
  private static strategies: Map<string, ITimerStrategy> = new Map([
    ['amrap', new AMRAPStrategy()],
    ['emom', new EMOMStrategy()],
    ['tabata', new TabataStrategy()],
    ['forTime', new ForTimeStrategy()],
    ['intervals', new IntervalsStrategy()],
  ]);

  /**
   * Get strategy for timer type
   * @param {string} timerType - Type of timer
   * @returns {ITimerStrategy} Timer strategy
   */
  static getStrategy(timerType: string): ITimerStrategy {
    return this.strategies.get(timerType) || new AMRAPStrategy();
  }

  /**
   * Register custom strategy
   * Allows extending with new timer types
   * @param {string} type - Timer type identifier
   * @param {ITimerStrategy} strategy - Strategy implementation
   */
  static registerStrategy(type: string, strategy: ITimerStrategy): void {
    this.strategies.set(type, strategy);
  }
}