/**
 * Timer Context - Core state management for the timer application
 * @module TimerContext
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { createTimer, CountdownWrapper, Timer } from '@workout-timer/core';
import type { TimerConfig } from '../hooks/useTimerConfig';
import type { ExtendedTimerSnapshot } from '../types/timer.types';
import { TimerError, TimerErrorType } from '../types/timer.types';
import type { ReactNode } from 'react';

/**
 * Timer context value interface
 * @interface TimerContextValue
 */
export interface TimerContextValue {
  /** Timer instance */
  timer: Timer | null;
  /** Current timer snapshot */
  snapshot: ExtendedTimerSnapshot | null;
  /** Current timer type */
  timerType: string;
  /** Round counter for AMRAP */
  roundCount: number;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: TimerError | null;
  /** Handle round completion */
  handleRoundComplete: () => void;
  /** Reset round counter */
  resetRoundCount: () => void;
  /** Clear error state */
  clearError: () => void;
  /** Timer configuration */
  config: TimerConfig;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within TimerProvider');
  }
  return context;
}

interface TimerProviderProps {
  children: ReactNode;
  config: TimerConfig;
  soundEnabled?: boolean;
  countdownEnabled?: boolean;
  countdownTime?: number;
}

export function TimerProvider({ 
  children, 
  config,
  soundEnabled = true,
  countdownEnabled = true,
  countdownTime = 10
}: TimerProviderProps) {
  const [timer, setTimer] = useState<Timer | null>(null);
  const [snapshot, setSnapshot] = useState<ExtendedTimerSnapshot | null>(null);
  const [roundCount, setRoundCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TimerError | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Clean up previous timer
      if (timer) {
        timer.reset();
      }

      // Create new timer based on config
      let newTimer = createTimer(config as any) as Timer;
      
      // Wrap with countdown if enabled
      if (countdownEnabled && countdownTime > 0) {
        newTimer = new CountdownWrapper(newTimer, countdownTime) as Timer;
      }
      
      // Set up event listeners
      newTimer.on('tick', (...args: unknown[]) => {
        const snap = args[0] as ExtendedTimerSnapshot;
        setSnapshot(snap);
      });
      
      newTimer.on('stateChange', () => {
        setSnapshot(newTimer.getSnapshot());
      });

    newTimer.on('finish', () => {
      // Timer finished
    });

    newTimer.on('roundStart', (...args: unknown[]) => {
      const round = args[0] as number;
      console.log(`Round ${round} started!`);
    });
    
    newTimer.on('workStart', () => {
      console.log('Work phase started!');
    });
    
    newTimer.on('restStart', () => {
      console.log('Rest phase started!');
    });

    // Configure sound
    if (newTimer.setSoundEnabled) {
      newTimer.setSoundEnabled(soundEnabled);
    }

      setTimer(newTimer);
      setSnapshot(newTimer.getSnapshot());
      setRoundCount(0);
      setIsLoading(false);

      // Cleanup
      return () => {
        if (newTimer) {
          newTimer.reset();
        }
      };
    } catch (err) {
      const timerError = new TimerError(
        'Failed to initialize timer',
        TimerErrorType.INITIALIZATION_ERROR,
        err as Error
      );
      setError(timerError);
      setIsLoading(false);
      console.error('Timer initialization error:', err);
    }
    return undefined;
  }, [config, countdownEnabled, countdownTime]);

  useEffect(() => {
    if (timer && timer.setSoundEnabled) {
      timer.setSoundEnabled(soundEnabled);
    }
  }, [soundEnabled, timer]);

  const handleRoundComplete = () => {
    if (!timer) return;
    
    if (config.type === 'amrap' && 'incrementRound' in timer && typeof timer.incrementRound === 'function') {
      timer.incrementRound();
      setRoundCount(prev => prev + 1);
    } else if (config.type === 'forTime' && 'completeRound' in timer && typeof timer.completeRound === 'function') {
      timer.completeRound();
    }
  };

  const resetRoundCount = () => {
    setRoundCount(0);
  };

  const clearError = () => {
    setError(null);
  };

  const value: TimerContextValue = {
    timer,
    snapshot,
    timerType: config.type,
    roundCount,
    isLoading,
    error,
    handleRoundComplete,
    resetRoundCount,
    clearError,
    config,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}
