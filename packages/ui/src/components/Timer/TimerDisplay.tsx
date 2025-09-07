/**
 * Timer Display Component - Shows the timer countdown/countup
 */
import { memo } from 'react';
import { useTimerContext, useTimerDisplay } from '@workout-timer/react';

export interface TimerDisplayProps { onClick?: () => void }

export const TimerDisplay = memo(function TimerDisplay({ onClick }: TimerDisplayProps) {
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
      title={onClick ? 'Click to edit timer settings' : undefined}
    >
      {formattedTime}
    </button>
  );
});
