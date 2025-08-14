import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AMRAPTimer } from '../timers/AMRAPTimer';
import { TimerState } from '../types';

describe('AMRAPTimer', () => {
  let timer: AMRAPTimer;

  beforeEach(() => {
    timer = new AMRAPTimer({
      type: 'amrap',
      duration: 5 // 5 seconds for testing
    });
  });

  it('should initialize in idle state', () => {
    const snapshot = timer.getSnapshot();
    expect(snapshot.state).toBe(TimerState.IDLE);
    expect(snapshot.elapsed).toBe(0);
    expect(snapshot.remaining).toBe(5000);
    expect(snapshot.progress).toBe(0);
  });

  it('should start timer', () => {
    timer.start();
    expect(timer.getState()).toBe(TimerState.RUNNING);
  });

  it('should pause and resume', () => {
    timer.start();
    timer.pause();
    expect(timer.getState()).toBe(TimerState.PAUSED);
    
    timer.resume();
    expect(timer.getState()).toBe(TimerState.RUNNING);
  });

  it('should track rounds', () => {
    expect(timer.getRounds()).toBe(0);
    timer.incrementRound();
    expect(timer.getRounds()).toBe(1);
  });

  it('should emit events', () => {
    const startHandler = vi.fn();
    const tickHandler = vi.fn();
    
    timer.on('start', startHandler);
    timer.on('tick', tickHandler);
    
    timer.start();
    expect(startHandler).toHaveBeenCalled();
  });
});