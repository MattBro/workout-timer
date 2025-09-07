import { Timer } from '../Timer';
import type { ForTimeConfig, TimerSnapshot } from '../types';
import { TimerState } from '../types';

export class ForTimeTimer extends Timer {
  private timeCap: number;
  private rounds: number;
  private currentRound: number = 1;
  private roundStartTimes: number[] = [];
  
  constructor(config: ForTimeConfig) {
    super(config);
    this.timeCap = config.timeCapMinutes * 60 * 1000; // Convert to ms
    this.rounds = config.rounds || 1;
  }
  
  isComplete(): boolean {
    // Complete when time cap is reached OR all rounds are done
    return this.elapsed >= this.timeCap || this.currentRound > this.rounds;
  }
  
  start(): void {
    super.start();
    if (this.roundStartTimes.length === 0) {
      this.roundStartTimes.push(0);
    }
  }
  
  completeRound(): void {
    if (this.state !== TimerState.RUNNING) return;
    
    if (this.currentRound < this.rounds) {
      this.currentRound++;
      this.roundStartTimes.push(this.elapsed);
      this.emit('roundComplete', this.currentRound - 1, this.elapsed);
      this.emit('roundStart', this.currentRound);
    } else {
      // All rounds complete - finish the timer
      this.finish();
    }
  }
  
  protected finish(): void {
    // Store final time before calling parent finish
    const finalTime = this.elapsed;
    super.finish();
    this.emit('timeRecorded', finalTime, this.rounds);
  }
  
  getSnapshot(): TimerSnapshot {
    // For Time counts UP, not down
    const remaining = Math.max(0, this.timeCap - this.elapsed);
    const progress = Math.min(100, (this.elapsed / this.timeCap) * 100);
    
    // Calculate current round time
    const currentRoundStartTime = this.roundStartTimes[this.currentRound - 1] || 0;
    const currentRoundTime = this.elapsed - currentRoundStartTime;
    
    return {
      state: this.state,
      elapsed: this.elapsed,
      remaining,
      progress,
      currentRound: this.currentRound,
      totalRounds: this.rounds,
      // For Time specific
      currentRoundTime,
      timeCap: this.timeCap,
      splitTimes: this.getSplitTimes()
    } as TimerSnapshot & { 
      currentRoundTime: number;
      timeCap: number;
      splitTimes: number[];
    };
  }
  
  getSplitTimes(): number[] {
    // Calculate split time for each completed round
    const splits: number[] = [];
    for (let i = 1; i < this.roundStartTimes.length; i++) {
      splits.push(this.roundStartTimes[i] - this.roundStartTimes[i - 1]);
    }
    return splits;
  }
  
  getCurrentRound(): number {
    return this.currentRound;
  }
  
  isTimeCapped(): boolean {
    return this.elapsed >= this.timeCap;
  }
}
