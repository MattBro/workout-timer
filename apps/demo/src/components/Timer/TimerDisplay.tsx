/**
 * Timer Display Component - Shows the timer countdown/countup
 * @module TimerDisplay
 */

import React from 'react';
import { useTimerContext, useTimerDisplay } from '@workout-timer/react';

interface TimerDisplayProps {
  onClick?: () => void;
}

/**
 * Timer Display Component
 * Memoized for performance
 */
export const TimerDisplay = React.memo(function TimerDisplay({ onClick }: TimerDisplayProps) {
  const { snapshot, timerType, roundCount } = useTimerContext();
  const { formattedTime, isCountdown } = useTimerDisplay(snapshot, timerType, roundCount);

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`font-mono font-bold mb-8 tracking-wider transition-all ${
        onClick ? 'hover:scale-105 active:scale-95 cursor-pointer hover:opacity-90' : 'cursor-default'
      } ${
        isCountdown 
          ? 'text-9xl md:text-[12rem]' 
          : 'text-7xl md:text-9xl'
      }`}
      title={onClick ? "Click to edit timer settings" : undefined}
    >
      {formattedTime}
    </button>
  );
});