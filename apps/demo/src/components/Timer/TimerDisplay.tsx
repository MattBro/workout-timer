/**
 * Timer Display Component - Shows the timer countdown/countup
 * @module TimerDisplay
 */

import React from 'react';
import { useTimerContext } from '../../contexts/TimerContext';
import { useTimerDisplay } from '../../hooks/useTimerDisplay';

/**
 * Timer Display Component
 * Memoized for performance
 */
export const TimerDisplay = React.memo(function TimerDisplay() {
  const { snapshot, timerType, roundCount } = useTimerContext();
  const { formattedTime, isCountdown } = useTimerDisplay(snapshot, timerType, roundCount);

  return (
    <div className={`font-mono font-bold mb-8 tracking-wider ${
      isCountdown 
        ? 'text-9xl md:text-[12rem]' 
        : 'text-7xl md:text-9xl'
    }`}>
      {formattedTime}
    </div>
  );
});