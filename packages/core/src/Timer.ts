import { TimerState, TimerSnapshot, TimerConfig } from './types';
import { SoundManager } from './utils/SoundManager';

export abstract class Timer {
  protected state: TimerState = TimerState.IDLE;
  protected elapsed: number = 0;
  protected intervalId?: NodeJS.Timeout | number;
  protected startTime?: number;
  protected pausedAt?: number;
  protected totalPausedTime: number = 0;
  protected soundManager: SoundManager;
  protected lastSecondAnnounced: number = -1;
  
  // Event listeners
  private listeners: Map<string, Set<Function>> = new Map();
  
  constructor(protected config: TimerConfig) {
    this.soundManager = new SoundManager();
  }
  
  // Public API
  start(): void {
    if (this.state !== TimerState.IDLE && this.state !== TimerState.READY) {
      return;
    }
    
    this.state = TimerState.RUNNING;
    this.startTime = Date.now() - this.elapsed;
    this.startTicking();
    this.soundManager.playStartSound();
    this.emit('start');
    this.emit('stateChange', this.state);
  }
  
  pause(): void {
    if (this.state !== TimerState.RUNNING) return;
    
    this.state = TimerState.PAUSED;
    this.pausedAt = Date.now();
    this.stopTicking();
    this.soundManager.playPauseSound();
    this.emit('pause');
    this.emit('stateChange', this.state);
  }
  
  resume(): void {
    if (this.state !== TimerState.PAUSED) return;
    
    if (this.pausedAt) {
      this.totalPausedTime += Date.now() - this.pausedAt;
    }
    
    this.state = TimerState.RUNNING;
    this.startTicking();
    this.soundManager.playResumeSound();
    this.emit('resume');
    this.emit('stateChange', this.state);
  }
  
  reset(): void {
    this.stopTicking();
    this.state = TimerState.IDLE;
    this.elapsed = 0;
    this.totalPausedTime = 0;
    this.startTime = undefined;
    this.pausedAt = undefined;
    this.lastSecondAnnounced = -1;
    this.emit('reset');
    this.emit('stateChange', this.state);
  }
  
  stop(): void {
    this.stopTicking();
    this.state = TimerState.CANCELLED;
    this.emit('stop');
    this.emit('stateChange', this.state);
  }
  
  // Protected methods
  protected startTicking(): void {
    this.intervalId = setInterval(() => this.tick(), 100);
  }
  
  protected stopTicking(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId as number);
      this.intervalId = undefined;
    }
  }
  
  protected tick(): void {
    if (!this.startTime) return;
    
    this.elapsed = Date.now() - this.startTime - this.totalPausedTime;
    const snapshot = this.getSnapshot();
    this.emit('tick', snapshot);
    
    // Play countdown beeps for last 3 seconds
    const remainingSeconds = Math.floor(snapshot.remaining / 1000);
    if (remainingSeconds <= 3 && remainingSeconds > 0 && remainingSeconds !== this.lastSecondAnnounced) {
      this.soundManager.playCountdownBeep(remainingSeconds);
      this.lastSecondAnnounced = remainingSeconds;
    }
    
    if (this.isComplete()) {
      this.finish();
    }
  }
  
  protected finish(): void {
    this.stopTicking();
    this.state = TimerState.FINISHED;
    this.soundManager.playFinishSound();
    this.soundManager.announceFinish();
    this.emit('finish');
    this.emit('stateChange', this.state);
  }
  
  // Abstract methods
  abstract isComplete(): boolean;
  abstract getSnapshot(): TimerSnapshot;
  
  // Event system
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }
  
  off(event: string, callback: Function): void {
    this.listeners.get(event)?.delete(callback);
  }
  
  protected emit(event: string, ...args: any[]): void {
    this.listeners.get(event)?.forEach(callback => callback(...args));
  }
  
  // Getters
  getState(): TimerState {
    return this.state;
  }
  
  getElapsed(): number {
    return this.elapsed;
  }
  
  // Sound control
  setSoundEnabled(enabled: boolean): void {
    this.soundManager.setEnabled(enabled);
  }
  
  isSoundEnabled(): boolean {
    return this.soundManager.isEnabled();
  }
  
  getSoundManager(): SoundManager {
    return this.soundManager;
  }
}