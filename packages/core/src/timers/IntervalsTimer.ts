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
  private hasStartedFirstInterval: boolean = false;
  private lastWarningSecond: number = -1;
  private hasPlayedHalfway: boolean = false;
  
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
    // Call parent tick but we'll handle our own countdown sounds
    this.elapsed = Date.now() - (this.startTime || 0) - this.totalPausedTime;
    const snapshot = this.getSnapshot();
    this.emit('tick', snapshot);
    
    // Check if complete
    if (this.isComplete()) {
      this.finish();
      return;
    }
    
    // Play sound for first interval on first tick
    if (!this.hasStartedFirstInterval && this.intervals.length > 0) {
      this.hasStartedFirstInterval = true;
      const firstInterval = this.intervals[0];
      
      // Announce the first interval immediately
      this.soundManager.speak(`Starting with ${firstInterval.name}`);
      this.emit('intervalStart', firstInterval.name, firstInterval.type);
      
      if (firstInterval.type === 'work') {
        this.soundManager.playWorkStartSound();
        this.emit('workStart');
      } else if (firstInterval.type === 'rest') {
        this.soundManager.playRestStartSound();
        this.emit('restStart');
      } else if (firstInterval.type === 'prep') {
        this.soundManager.playBeep(700, 150, 0.3);
        this.emit('prepStart');
      }
    }
    
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
    
    // Check for upcoming interval change (always do 3 seconds countdown)
    const currentInterval = this.intervals[this.currentIntervalIndex];
    if (currentInterval) {
      const elapsedInInterval = elapsedInRound - this.intervalStartTime;
      const intervalDurationMs = currentInterval.duration * 1000;
      const intervalRemaining = intervalDurationMs - elapsedInInterval;
      const remainingSeconds = Math.ceil(intervalRemaining / 1000);
      
      // Check for halfway point (only for intervals longer than 4 seconds)
      if (currentInterval.duration > 4 && !this.hasPlayedHalfway) {
        const halfwayPoint = intervalDurationMs / 2;
        if (elapsedInInterval >= halfwayPoint && elapsedInInterval < halfwayPoint + 200) {
          this.hasPlayedHalfway = true;
          this.soundManager.playBeep(600, 100, 0.3); // Medium-low pitch ding
          this.soundManager.speak('Halfway');
        }
      }
      
      // Determine countdown start point
      // For intervals <= 3 seconds, start countdown immediately
      // For longer intervals, start countdown at 3 seconds
      const countdownThreshold = Math.min(currentInterval.duration, 3);
      
      // For ALL intervals, do a countdown (up to 3 seconds)
      if (remainingSeconds <= countdownThreshold && remainingSeconds > 0 && remainingSeconds !== this.lastWarningSecond) {
        this.lastWarningSecond = remainingSeconds;
        
        // Check if this is the last interval of the entire workout
        const isLastInterval = this.currentRound === this.rounds && 
                              this.currentIntervalIndex === this.intervals.length - 1;
        
        // Always announce what's coming next (unless it's the last interval)
        if (!isLastInterval) {
          // Get next interval (check if we're at the end of this round)
          let nextInterval: Interval | null = null;
          if (this.currentIntervalIndex < this.intervals.length - 1) {
            // Next interval in same round
            nextInterval = this.intervals[this.currentIntervalIndex + 1];
          } else if (this.currentRound < this.rounds) {
            // First interval of next round
            nextInterval = this.intervals[0];
          }
          
          if (remainingSeconds === 3 && nextInterval) {
            // Announce what's coming next at 3 seconds
            this.soundManager.speak(`${nextInterval.name} coming up`);
          }
        } else if (remainingSeconds === 3) {
          // Last interval - announce finish
          this.soundManager.speak(`Almost done`);
        }
        
        // Always play countdown beeps for 3-2-1
        this.soundManager.playCountdownBeep(remainingSeconds);
        
        // Announce the countdown numbers (3, 2, 1)
        this.soundManager.announceCountdown(remainingSeconds);
      }
      
      // Play "GO" sound at the exact transition (for non-last intervals)
      if (intervalRemaining <= 100 && intervalRemaining > 0 && this.lastWarningSecond !== 0) {
        const isLastInterval = this.currentRound === this.rounds && 
                              this.currentIntervalIndex === this.intervals.length - 1;
        if (!isLastInterval) {
          this.lastWarningSecond = 0;
          this.soundManager.playCountdownBeep(0); // This plays the "GO" sound
        }
      }
    }
    
    // Check if interval changed
    if (newIntervalIndex !== this.currentIntervalIndex) {
      this.currentIntervalIndex = newIntervalIndex;
      this.lastWarningSecond = -1; // Reset warning counter for new interval
      this.hasPlayedHalfway = false; // Reset halfway flag for new interval
      const interval = this.intervals[this.currentIntervalIndex];
      this.emit('intervalStart', interval.name, interval.type);
      
      // Play appropriate sound for interval type
      if (interval.type === 'work') {
        this.soundManager.playWorkStartSound();
        this.emit('workStart');
      } else if (interval.type === 'rest') {
        this.soundManager.playRestStartSound();
        this.emit('restStart');
      } else if (interval.type === 'prep') {
        this.soundManager.playBeep(700, 150, 0.3); // Medium pitch for prep
        this.emit('prepStart');
      }
    }
    
    // Update round
    const newRound = Math.floor(this.elapsed / this.singleRoundDuration) + 1;
    if (newRound !== this.currentRound && newRound <= this.rounds) {
      this.currentRound = newRound;
      this.currentIntervalIndex = -1; // Reset so first interval triggers
      this.lastWarningSecond = -1; // Reset warning counter for new round
      this.hasPlayedHalfway = false; // Reset halfway flag for new round
      this.emit('roundStart', this.currentRound);
      this.soundManager.announceRound(this.currentRound);
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
  
  reset(): void {
    super.reset();
    this.currentRound = 1;
    this.currentIntervalIndex = 0;
    this.intervalStartTime = 0;
    this.hasStartedFirstInterval = false;
    this.lastWarningSecond = -1;
    this.hasPlayedHalfway = false;
  }
}