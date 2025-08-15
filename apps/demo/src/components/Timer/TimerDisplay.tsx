import React from 'react';
import { useTimerContext } from '../../contexts/TimerContext';
import { useTimerDisplay } from '../../hooks/useTimerDisplay';

export function TimerDisplay() {
  const { snapshot, timerType } = useTimerContext();
  const { formattedTime, isCountdown } = useTimerDisplay(snapshot, timerType);

  return (
    <div className={`font-mono font-bold mb-8 tracking-wider ${
      isCountdown 
        ? 'text-9xl md:text-[12rem]' 
        : 'text-7xl md:text-9xl'
    }`}>
      {formattedTime}
    </div>
  );
}