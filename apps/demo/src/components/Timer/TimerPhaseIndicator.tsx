import React from 'react';
import { useTimerContext } from '../../contexts/TimerContext';
import { useTimerDisplay } from '../../hooks/useTimerDisplay';

export function TimerPhaseIndicator() {
  const { snapshot, timerType, roundCount, handleRoundComplete, config } = useTimerContext();
  const { phaseInfo, roundInfo } = useTimerDisplay(snapshot, timerType);

  if (!snapshot) return null;

  return (
    <>
      {/* Phase Text */}
      <div className="text-2xl md:text-4xl font-bold mb-4 animate-pulse">
        {phaseInfo.icon && <span>{phaseInfo.icon} </span>}
        {phaseInfo.text}
      </div>

      {/* Round Info */}
      <div className="text-xl md:text-2xl opacity-90">
        {timerType === 'amrap' && (
          <div>Rounds: {roundCount}</div>
        )}
        
        {(timerType === 'emom' || timerType === 'tabata') && snapshot.currentRound && (
          <div>Round {snapshot.currentRound} of {snapshot.totalRounds}</div>
        )}
        
        {timerType === 'intervals' && snapshot.currentRound && (
          <div>Round {snapshot.currentRound} of {(snapshot as any).totalRounds || 1}</div>
        )}
        
        {timerType === 'forTime' && (
          <div>
            <div>Round {snapshot.currentRound} of {(config as any).rounds || 3}</div>
            <button
              onClick={handleRoundComplete}
              className="mt-2 px-4 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-all"
            >
              Complete Round
            </button>
          </div>
        )}
        
        {timerType === 'tabata' && (snapshot as any).currentSet > 1 && (
          <div className="text-sm mt-1">
            Set {(snapshot as any).currentSet} of {(config as any).sets || 1}
          </div>
        )}
      </div>
    </>
  );
}