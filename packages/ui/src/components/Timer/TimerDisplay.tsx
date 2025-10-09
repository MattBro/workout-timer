/**
 * Timer Display Component - Shows the timer countdown/countup
 */
import { useTimerContext, useTimerDisplay } from '@workout-timer/react';
import { memo } from 'react';

export interface TimerDisplayProps { onClick?: () => void }

export const TimerDisplay = memo(function TimerDisplay({ onClick }: TimerDisplayProps) {
  const { snapshot, timerType, roundCount } = useTimerContext();
  const { formattedTime, isCountdown } = useTimerDisplay(snapshot, timerType, roundCount);

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`font-mono font-bold mb-4 sm:mb-8 tracking-wider transition-all ${
        onClick ? 'hover:scale-105 active:scale-95 cursor-pointer hover:opacity-90' : 'cursor-default'
      } ${
        isCountdown
          ? 'text-6xl sm:text-8xl md:text-9xl lg:text-[12rem]'
          : 'text-5xl sm:text-6xl md:text-7xl lg:text-9xl'
      }`}
      title={onClick ? 'Click to edit timer settings' : undefined}
    >
      {formattedTime}
    </button>
  );
});
