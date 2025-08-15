/**
 * Timer Display Hook - Handles timer display logic using strategy pattern
 * @module useTimerDisplay
 */

import { useMemo } from 'react';
import { TimerState } from '@workout-timer/core';
import { ExtendedTimerSnapshot, PhaseInfo, RoundInfo } from '../types/timer.types';
import { TimerStrategyFactory } from '../strategies/TimerStrategy';

/**
 * Custom hook for timer display logic
 * Uses strategy pattern for timer-specific behavior
 * 
 * @param {ExtendedTimerSnapshot | null} snapshot - Current timer snapshot
 * @param {string} timerType - Type of timer
 * @param {number} roundCount - Round count for AMRAP
 * @returns {Object} Display properties
 */
export function useTimerDisplay(
  snapshot: ExtendedTimerSnapshot | null,
  timerType: string,
  roundCount: number = 0
) {
  const strategy = useMemo(
    () => TimerStrategyFactory.getStrategy(timerType),
    [timerType]
  );

  const formattedTime = useMemo(() => {
    if (!snapshot) return '00:00';
    return strategy.getDisplayTime(snapshot);
  }, [snapshot, strategy]);

  const phaseInfo = useMemo((): PhaseInfo => {
    if (!snapshot) {
      return { text: 'Ready', color: 'gray' };
    }
    
    // Handle common states
    if (snapshot.state === TimerState.FINISHED) {
      return { 
        text: 'Complete!', 
        color: 'green',
        icon: '🎉' 
      };
    }
    
    if (snapshot.state === TimerState.PAUSED) {
      return { 
        text: 'Paused', 
        color: 'yellow',
        icon: '⏸️' 
      };
    }
    
    if (snapshot.state === TimerState.IDLE) {
      return { 
        text: 'Ready', 
        color: 'gray' 
      };
    }
    
    // Use strategy for timer-specific phase
    return strategy.getPhaseInfo(snapshot);
  }, [snapshot, strategy]);

  const progress = useMemo(() => {
    return snapshot?.progress || 0;
  }, [snapshot]);

  const roundInfo = useMemo((): RoundInfo | null => {
    if (!snapshot) return null;
    return strategy.getRoundInfo(snapshot, roundCount);
  }, [snapshot, strategy, roundCount]);

  const isCountdown = useMemo(() => {
    return snapshot?.isCountdown || false;
  }, [snapshot]);

  const themeColor = useMemo(() => {
    // Use strategy theme color or default
    return strategy.getThemeColor();
  }, [strategy]);

  const controlButtons = useMemo(() => {
    if (!snapshot) return [];
    return strategy.getControlButtons(snapshot);
  }, [snapshot, strategy]);

  return {
    formattedTime,
    phaseInfo,
    progress,
    roundInfo,
    isCountdown,
    themeColor,
    controlButtons,
    strategy,
  };
}