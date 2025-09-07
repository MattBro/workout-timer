import { Timer } from '../Timer';
import type { TabataConfig, TimerSnapshot } from '../types';

export class TabataTimer extends Timer {
  private workTime: number;
  private restTime: number;
  private rounds: number;
  private sets: number;
  private restBetweenSets: number;
  
  private currentRound: number = 0;
  private currentSet: number = 1;
  private isWorking: boolean = true;
  private intervalDuration: number;
  private totalDuration: number;
  
  constructor(config: TabataConfig) {
    super(config);
    this.workTime = config.workTime * 1000; // Convert to ms
    this.restTime = config.restTime * 1000;
    this.rounds = config.rounds;
    this.sets = config.sets || 1;
    this.restBetweenSets = (config.restBetweenSets || 60) * 1000;
    
    // Calculate total duration
    this.intervalDuration = this.workTime + this.restTime;
    const singleSetDuration = this.intervalDuration * this.rounds;
    this.totalDuration = (singleSetDuration * this.sets) + 
                        (this.restBetweenSets * (this.sets - 1));
  }
  
  isComplete(): boolean {
    return this.elapsed >= this.totalDuration;
  }
  
  protected tick(): void {
    super.tick();
    
    // Calculate current position in workout
    const elapsedInCurrentSet = this.elapsed % (this.intervalDuration * this.rounds + this.restBetweenSets);
    const elapsedInCurrentInterval = elapsedInCurrentSet % this.intervalDuration;
    
    // Update round number (1-indexed for display)
    const newRound = Math.floor(elapsedInCurrentSet / this.intervalDuration) + 1;
    
    // Check if we're in a rest between sets
    if (this.sets > 1 && elapsedInCurrentSet >= this.intervalDuration * this.rounds) {
      // Rest between sets
      if (this.isWorking) {
        this.isWorking = false;
        this.emit('restBetweenSets', this.currentSet);
      }
    } else {
      // Normal interval
      if (newRound !== this.currentRound && newRound <= this.rounds) {
        this.currentRound = newRound;
        this.emit('roundStart', this.currentRound);
      }
      
      // Check if we switched between work and rest
      const wasWorking = this.isWorking;
      this.isWorking = elapsedInCurrentInterval < this.workTime;
      
      if (wasWorking !== this.isWorking) {
        if (this.isWorking) {
          this.soundManager.playWorkStartSound();
          this.soundManager.announceWorkPhase();
        } else {
          this.soundManager.playRestStartSound();
          this.soundManager.announceRestPhase();
        }
        this.emit(this.isWorking ? 'workStart' : 'restStart');
      }
    }
    
    // Update set number
    const newSet = Math.floor(this.elapsed / (this.intervalDuration * this.rounds + this.restBetweenSets)) + 1;
    if (newSet !== this.currentSet && newSet <= this.sets) {
      this.currentSet = newSet;
      this.currentRound = 0;
      this.emit('setStart', this.currentSet);
    }
  }
  
  getSnapshot(): TimerSnapshot {
    const remaining = Math.max(0, this.totalDuration - this.elapsed);
    const progress = Math.min(100, (this.elapsed / this.totalDuration) * 100);
    
    // Calculate interval remaining
    const elapsedInInterval = this.elapsed % this.intervalDuration;
    let intervalRemaining: number;
    
    if (this.isWorking) {
      intervalRemaining = Math.max(0, this.workTime - elapsedInInterval);
    } else {
      intervalRemaining = Math.max(0, this.restTime - (elapsedInInterval - this.workTime));
    }
    
    return {
      state: this.state,
      elapsed: this.elapsed,
      remaining,
      progress,
      currentRound: this.currentRound,
      totalRounds: this.rounds,
      currentInterval: this.currentSet,
      intervalRemaining,
      // Additional Tabata-specific info
      isWorking: this.isWorking,
      currentSet: this.currentSet,
      totalSets: this.sets
    } as TimerSnapshot & { isWorking: boolean; currentSet: number; totalSets: number };
  }
  
  getCurrentPhase(): 'work' | 'rest' | 'rest-between-sets' {
    const elapsedInCurrentSet = this.elapsed % (this.intervalDuration * this.rounds + this.restBetweenSets);
    
    if (this.sets > 1 && elapsedInCurrentSet >= this.intervalDuration * this.rounds) {
      return 'rest-between-sets';
    }
    
    return this.isWorking ? 'work' : 'rest';
  }
}
