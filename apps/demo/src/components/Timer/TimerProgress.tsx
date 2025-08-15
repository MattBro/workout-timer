import React from 'react';
import { useTimerContext } from '../../contexts/TimerContext';
import { useTimerDisplay } from '../../hooks/useTimerDisplay';

export function TimerProgress() {
  const { snapshot, timerType } = useTimerContext();
  const { progress } = useTimerDisplay(snapshot, timerType);

  if (!snapshot) return null;

  return (
    <div className="w-full max-w-md mt-8">
      <div className="h-3 bg-black/20 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-white/90 rounded-full transition-all duration-100 shadow-sm"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}