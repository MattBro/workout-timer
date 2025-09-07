import { memo } from 'react';
import { useTimerContext, useTimerDisplay } from '@workout-timer/react';
import type { ForTimeConfig, TabataConfig } from '@workout-timer/react';

export const TimerPhaseIndicator = memo(function TimerPhaseIndicator() {
  const { snapshot, timerType, roundCount, handleRoundComplete, config } = useTimerContext();
  const { phaseInfo } = useTimerDisplay(snapshot, timerType, roundCount);
  if (!snapshot) return null;

  return (
    <>
      <div className="text-2xl md:text-4xl font-bold mb-4 animate-pulse">
        {phaseInfo.icon && <span>{phaseInfo.icon} </span>}
        {phaseInfo.text}
      </div>
      <div className="text-xl md:text-2xl opacity-90">
        {timerType === 'amrap' && (<div>Rounds: {roundCount}</div>)}
        {(timerType === 'emom' || timerType === 'tabata') && snapshot.currentRound && (
          <div>Round {snapshot.currentRound} of {snapshot.totalRounds}</div>
        )}
        {timerType === 'intervals' && snapshot.currentRound && (
          <div>Round {snapshot.currentRound} of {snapshot.totalRounds || 1}</div>
        )}
        {timerType === 'forTime' && (
          <div>
            <div>Round {snapshot.currentRound} of {(config as ForTimeConfig).rounds || 3}</div>
            <button
              onClick={handleRoundComplete}
              className="mt-2 px-4 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-all"
            >
              Complete Round
            </button>
          </div>
        )}
        {timerType === 'tabata' && snapshot.currentSet && snapshot.currentSet > 1 && (
          <div className="text-sm mt-1">
            Set {snapshot.currentSet} of {(config as TabataConfig).sets || 1}
          </div>
        )}
      </div>
    </>
  );
});
