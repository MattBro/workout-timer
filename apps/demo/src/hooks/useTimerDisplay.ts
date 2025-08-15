import { useMemo } from 'react';
import { TimerSnapshot, TimerState } from '@workout-timer/core';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export interface PhaseInfo {
  text: string;
  color: string;
  icon?: string;
}

export function useTimerDisplay(
  snapshot: TimerSnapshot | null,
  timerType: string
) {
  const formattedTime = useMemo(() => {
    if (!snapshot) return '00:00';
    
    const snap: any = snapshot;
    
    // Handle countdown
    if (snap.isCountdown) {
      const seconds = Math.ceil(snap.countdownRemaining / 1000);
      return seconds.toString();
    }
    
    // Handle different timer types
    if (timerType === 'forTime') {
      return formatTime(snapshot.elapsed);
    } else if (timerType === 'tabata' || timerType === 'intervals') {
      return formatTime(snap.intervalRemaining || snapshot.remaining);
    }
    
    return formatTime(snapshot.remaining);
  }, [snapshot, timerType]);

  const phaseInfo = useMemo((): PhaseInfo => {
    if (!snapshot) {
      return { text: 'Ready', color: 'gray' };
    }
    
    const snap: any = snapshot;
    
    // Handle countdown
    if (snap.isCountdown) {
      return { 
        text: 'GET READY!', 
        color: 'yellow',
        icon: '🚀' 
      };
    }
    
    // Handle states
    if (snap.state === TimerState.FINISHED) {
      return { 
        text: 'Complete!', 
        color: 'green',
        icon: '🎉' 
      };
    }
    
    if (snap.state === TimerState.PAUSED) {
      return { 
        text: 'Paused', 
        color: 'yellow',
        icon: '⏸️' 
      };
    }
    
    if (snap.state === TimerState.IDLE) {
      return { 
        text: 'Ready', 
        color: 'gray' 
      };
    }
    
    // Handle timer-specific phases
    if (timerType === 'tabata' && snap.isWorking !== undefined) {
      return snap.isWorking 
        ? { text: 'WORK', color: 'red', icon: '💪' }
        : { text: 'REST', color: 'green', icon: '😌' };
    }
    
    if (timerType === 'intervals' && snap.intervalName) {
      const colors: Record<string, string> = {
        work: 'red',
        rest: 'green',
        prep: 'yellow',
      };
      return { 
        text: snap.intervalName.toUpperCase(), 
        color: colors[snap.intervalType] || 'blue' 
      };
    }
    
    return { text: '', color: 'blue' };
  }, [snapshot, timerType]);

  const progress = useMemo(() => {
    return snapshot?.progress || 0;
  }, [snapshot]);

  const roundInfo = useMemo(() => {
    if (!snapshot) return null;
    
    const snap: any = snapshot;
    
    if (timerType === 'amrap') {
      return { current: snap.rounds || 0, total: null };
    }
    
    if (timerType === 'emom' || timerType === 'tabata' || timerType === 'intervals') {
      return { 
        current: snap.currentRound || 0, 
        total: snap.totalRounds || 0 
      };
    }
    
    if (timerType === 'forTime') {
      return { 
        current: snap.currentRound || 0, 
        total: snap.totalRounds || 0 
      };
    }
    
    return null;
  }, [snapshot, timerType]);

  const isCountdown = useMemo(() => {
    return (snapshot as any)?.isCountdown || false;
  }, [snapshot]);

  const themeColor = useMemo(() => {
    const colors: Record<string, string> = {
      amrap: 'from-slate-600 to-slate-700',
      emom: 'from-indigo-600 to-indigo-700',
      tabata: 'from-rose-600 to-rose-700',
      intervals: 'from-emerald-600 to-emerald-700',
      forTime: 'from-amber-600 to-amber-700',
    };
    
    // Override for special states
    if (!snapshot) return colors[timerType] || 'from-gray-600 to-gray-700';
    
    if (snapshot.state === TimerState.FINISHED) {
      return 'from-gray-700 to-gray-800';
    }
    
    if (snapshot.state === TimerState.PAUSED) {
      return 'from-amber-700 to-amber-800';
    }
    
    // Phase-specific colors for certain timer types
    const snap: any = snapshot;
    if (timerType === 'tabata' && snap.isWorking !== undefined) {
      return snap.isWorking 
        ? 'from-rose-600 to-rose-700' 
        : 'from-emerald-600 to-emerald-700';
    }
    
    if (timerType === 'intervals' && snap.intervalType) {
      const intervalColors: Record<string, string> = {
        work: 'from-rose-600 to-rose-700',
        rest: 'from-emerald-600 to-emerald-700',
        prep: 'from-amber-600 to-amber-700',
      };
      return intervalColors[snap.intervalType] || colors[timerType];
    }
    
    return colors[timerType] || 'from-gray-600 to-gray-700';
  }, [snapshot, timerType]);

  return {
    formattedTime,
    phaseInfo,
    progress,
    roundInfo,
    isCountdown,
    themeColor,
  };
}