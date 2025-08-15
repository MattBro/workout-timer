import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createTimer, TimerSnapshot, TimerState, CountdownWrapper } from '@workout-timer/core';
import { TimerConfig } from '../hooks/useTimerConfig';

export interface TimerContextValue {
  timer: any | null;
  snapshot: TimerSnapshot | null;
  timerType: string;
  roundCount: number;
  handleRoundComplete: () => void;
  resetRoundCount: () => void;
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
  const [timer, setTimer] = useState<any>(null);
  const [snapshot, setSnapshot] = useState<TimerSnapshot | null>(null);
  const [roundCount, setRoundCount] = useState(0);

  useEffect(() => {
    // Clean up previous timer
    if (timer) {
      timer.reset();
    }

    // Create new timer based on config
    let newTimer = createTimer(config as any);
    
    // Wrap with countdown if enabled
    if (countdownEnabled && countdownTime > 0) {
      newTimer = new CountdownWrapper(newTimer, countdownTime);
    }
    
    // Set up event listeners
    newTimer.on('tick', (snap: TimerSnapshot) => {
      setSnapshot(snap);
    });
    
    newTimer.on('stateChange', () => {
      setSnapshot(newTimer.getSnapshot());
    });

    newTimer.on('finish', () => {
      // Timer finished
    });

    newTimer.on('roundStart', (round: number) => {
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

    // Cleanup
    return () => {
      if (newTimer) {
        newTimer.reset();
      }
    };
  }, [config, countdownEnabled, countdownTime]);

  useEffect(() => {
    if (timer && timer.setSoundEnabled) {
      timer.setSoundEnabled(soundEnabled);
    }
  }, [soundEnabled, timer]);

  const handleRoundComplete = () => {
    if (!timer) return;
    
    if (config.type === 'amrap') {
      timer.incrementRound();
      setRoundCount(prev => prev + 1);
    } else if (config.type === 'forTime') {
      timer.completeRound();
    }
  };

  const resetRoundCount = () => {
    setRoundCount(0);
  };

  const value: TimerContextValue = {
    timer,
    snapshot,
    timerType: config.type,
    roundCount,
    handleRoundComplete,
    resetRoundCount,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}