import { useTimerContext, useTimerDisplay } from '@workout-timer/react';

import { TimerControls } from './Timer/TimerControls';
import { TimerDisplay } from './Timer/TimerDisplay';
import { TimerPhaseIndicator } from './Timer/TimerPhaseIndicator';
import { TimerProgress } from './Timer/TimerProgress';

export interface TimerScreenProps {
  onOpenSettings: () => void;
  onClickTime?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function TimerScreen({ onOpenSettings, onClickTime, soundEnabled, onToggleSound }: TimerScreenProps) {
  const { snapshot, timerType } = useTimerContext();
  const { themeColor } = useTimerDisplay(snapshot, timerType);

  return (
    <div className={`flex-1 bg-gradient-to-br ${themeColor} transition-all duration-500 flex flex-col relative shadow-2xl min-h-0`}>
      <div className="p-3 sm:p-4 flex justify-between items-center flex-shrink-0">
        <button onClick={onOpenSettings} className="p-2 sm:p-3 rounded-full bg-black/20 backdrop-blur shadow-lg hover:shadow-xl transition-all active:scale-95">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
        <button onClick={onToggleSound} className="p-2 sm:p-3 rounded-full bg-black/20 backdrop-blur shadow-lg hover:shadow-xl transition-all active:scale-95">
          <span className="text-xl sm:text-2xl">{soundEnabled ? '🔊' : '🔇'}</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 min-h-0 py-2 sm:py-4">
        <TimerPhaseIndicator />
        <TimerDisplay onClick={onClickTime} />
        <TimerProgress />
      </div>

      <div className="flex-shrink-0">
        <TimerControls />
      </div>
    </div>
  );
}
