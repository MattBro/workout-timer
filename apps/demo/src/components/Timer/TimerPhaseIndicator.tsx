import React from 'react';
import { useTimerContext } from '../../contexts/TimerContext';
import { useTimerDisplay } from '../../hooks/useTimerDisplay';

export function TimerPhaseIndicator() {
  const { snapshot, timerType, roundCount } = useTimerContext();
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
        
        {roundInfo && roundInfo.total && (
          <div>
            Round {roundInfo.current} of {roundInfo.total}
          </div>
        )}
        
        {timerType === 'tabata' && (snapshot as any).currentSet > 1 && (
          <div className="text-sm mt-1">
            Set {(snapshot as any).currentSet} of {(snapshot as any).totalSets || 1}
          </div>
        )}
      </div>
    </>
  );
}