import { Timer } from '../Timer';
import type { EMOMConfig, TimerSnapshot } from '../types';

export class EMOMTimer extends Timer {
  private rounds: number;
  private interval: number;
  private currentRound: number = 0;
  private totalDuration: number;
  
  constructor(config: EMOMConfig) {
    super(config);
    this.rounds = config.rounds;
    this.interval = config.interval * 1000; // Convert to ms
    this.totalDuration = this.rounds * this.interval;
  }
  
  isComplete(): boolean {
    return this.elapsed >= this.totalDuration;
  }
  
  protected tick(): void {
    super.tick();
    
    const newRound = Math.floor(this.elapsed / this.interval) + 1;
    if (newRound !== this.currentRound && newRound <= this.rounds) {
      this.currentRound = newRound;
      this.emit('roundStart', this.currentRound);
    }
  }
  
  getSnapshot(): TimerSnapshot {
    const roundElapsed = this.elapsed % this.interval;
    const intervalRemaining = this.interval - roundElapsed;
    const totalRemaining = this.totalDuration - this.elapsed;
    
    return {
      state: this.state,
      elapsed: this.elapsed,
      remaining: Math.max(0, totalRemaining),
      progress: (this.elapsed / this.totalDuration) * 100,
      currentRound: this.currentRound,
      totalRounds: this.rounds,
      intervalRemaining: Math.max(0, intervalRemaining)
    };
  }
  
  getCurrentRound(): number {
    return this.currentRound;
  }
}
