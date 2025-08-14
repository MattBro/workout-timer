import { Timer } from '../Timer';
import { AMRAPConfig, TimerSnapshot } from '../types';

export class AMRAPTimer extends Timer {
  private duration: number;
  private rounds: number = 0;
  
  constructor(config: AMRAPConfig) {
    super(config);
    this.duration = config.duration * 1000; // Convert to ms
  }
  
  isComplete(): boolean {
    return this.elapsed >= this.duration;
  }
  
  getSnapshot(): TimerSnapshot {
    const remaining = Math.max(0, this.duration - this.elapsed);
    const progress = Math.min(100, (this.elapsed / this.duration) * 100);
    
    return {
      state: this.state,
      elapsed: this.elapsed,
      remaining,
      progress,
      currentRound: this.rounds
    };
  }
  
  incrementRound(): void {
    this.rounds++;
    this.emit('roundComplete', this.rounds);
  }
  
  getRounds(): number {
    return this.rounds;
  }
}