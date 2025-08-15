/**
 * Timer Progress Component - Shows progress bar
 * @module TimerProgress
 */

import React from 'react';
import { useTimerContext } from '@workout-timer/react';
import { useTimerDisplay } from '../../hooks/useTimerDisplay';

/**
 * Timer Progress Bar Component
 * Memoized for performance
 */
export const TimerProgress = React.memo(function TimerProgress() {
  const { snapshot, timerType, roundCount } = useTimerContext();
  const { progress } = useTimerDisplay(snapshot, timerType, roundCount);

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
});