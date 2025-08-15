import { Timer } from '../Timer';
import { IntervalsConfig, TimerSnapshot, Interval } from '../types';

export class IntervalsTimer extends Timer {
  private intervals: Interval[];
  private rounds: number;
  private currentRound: number = 1;
  private currentIntervalIndex: number = 0;
  private intervalStartTime: number = 0;
  private totalDuration: number;
  private singleRoundDuration: number;
  
  constructor(config: IntervalsConfig) {
    super(config);
    this.intervals = config.intervals;
    this.rounds = config.rounds || 1;
    
    // Calculate total duration
    this.singleRoundDuration = this.intervals.reduce((sum, interval) => 
      sum + (interval.duration * 1000), 0
    );
    this.totalDuration = this.singleRoundDuration * this.rounds;
  }
  
  isComplete(): boolean {
    return this.elapsed >= this.totalDuration;
  }
  
  protected tick(): void {
    super.tick();
    
    // Calculate position in current round
    const elapsedInRound = this.elapsed % this.singleRoundDuration;
    
    // Find current interval
    let accumulatedTime = 0;
    let newIntervalIndex = 0;
    
    for (let i = 0; i < this.intervals.length; i++) {
      const intervalDuration = this.intervals[i].duration * 1000;
      if (elapsedInRound < accumulatedTime + intervalDuration) {
        newIntervalIndex = i;
        this.intervalStartTime = accumulatedTime;
        break;
      }
      accumulatedTime += intervalDuration;
    }
    
    // Check if interval changed
    if (newIntervalIndex !== this.currentIntervalIndex) {
      this.currentIntervalIndex = newIntervalIndex;
      const interval = this.intervals[this.currentIntervalIndex];
      this.emit('intervalStart', interval.name, interval.type);
    }
    
    // Update round
    const newRound = Math.floor(this.elapsed / this.singleRoundDuration) + 1;
    if (newRound !== this.currentRound && newRound <= this.rounds) {
      this.currentRound = newRound;
      this.currentIntervalIndex = -1; // Reset so first interval triggers
      this.emit('roundStart', this.currentRound);
    }
  }
  
  getSnapshot(): TimerSnapshot {
    const remaining = Math.max(0, this.totalDuration - this.elapsed);
    const progress = Math.min(100, (this.elapsed / this.totalDuration) * 100);
    
    // Calculate time remaining in current interval
    const elapsedInRound = this.elapsed % this.singleRoundDuration;
    const elapsedInInterval = elapsedInRound - this.intervalStartTime;
    const currentInterval = this.intervals[this.currentIntervalIndex];
    const intervalRemaining = Math.max(0, 
      (currentInterval?.duration * 1000 || 0) - elapsedInInterval
    );
    
    return {
      state: this.state,
      elapsed: this.elapsed,
      remaining,
      progress,
      currentRound: this.currentRound,
      totalRounds: this.rounds,
      currentInterval: this.currentIntervalIndex + 1,
      intervalRemaining,
      // Additional info
      intervalName: currentInterval?.name,
      intervalType: currentInterval?.type,
      totalIntervals: this.intervals.length
    } as TimerSnapshot & { 
      intervalName: string; 
      intervalType: 'work' | 'rest' | 'prep';
      totalIntervals: number;
    };
  }
  
  getCurrentInterval(): Interval | null {
    return this.intervals[this.currentIntervalIndex] || null;
  }
  
  getIntervals(): Interval[] {
    return this.intervals;
  }
}