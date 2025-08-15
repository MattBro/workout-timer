import { Timer } from '../Timer';
import { TimerState, TimerSnapshot } from '../types';

export class CountdownWrapper extends Timer {
  private countdownDuration: number;
  private isInCountdown: boolean = false;
  private wrappedTimer: Timer;
  private countdownElapsed: number = 0;
  
  constructor(timer: Timer, countdownSeconds: number = 10) {
    super({ type: 'countdown' as any });
    this.wrappedTimer = timer;
    this.countdownDuration = countdownSeconds * 1000;
  }
  
  start(): void {
    if (this.state !== TimerState.IDLE && this.state !== TimerState.READY) {
      return;
    }
    
    if (this.countdownDuration > 0) {
      this.isInCountdown = true;
      this.state = TimerState.RUNNING;
      this.startTime = Date.now();
      this.countdownElapsed = 0;
      this.startTicking();
      this.soundManager.playStartSound();
      this.emit('countdownStart');
      this.emit('stateChange', this.state);
    } else {
      this.wrappedTimer.start();
    }
  }
  
  protected tick(): void {
    if (this.isInCountdown) {
      this.countdownElapsed = Date.now() - (this.startTime || 0);
      const snapshot = this.getSnapshot();
      this.emit('tick', snapshot);
      
      // Play countdown beeps
      const remainingSeconds = Math.ceil((this.countdownDuration - this.countdownElapsed) / 1000);
      if (remainingSeconds <= 10 && remainingSeconds > 0 && remainingSeconds !== this.lastSecondAnnounced) {
        if (remainingSeconds <= 3) {
          this.soundManager.playCountdownBeep(remainingSeconds);
          this.soundManager.announceNumber(remainingSeconds);
        }
        this.lastSecondAnnounced = remainingSeconds;
      }
      
      // Play GO sound at 0
      if (remainingSeconds === 0 && this.lastSecondAnnounced !== 0) {
        this.soundManager.playCountdownBeep(0);
        this.lastSecondAnnounced = 0;
      }
      
      if (this.countdownElapsed >= this.countdownDuration) {
        this.isInCountdown = false;
        this.stopTicking();
        this.wrappedTimer.start();
        
        // Forward wrapped timer events
        this.forwardEvents();
      }
    } else {
      // Delegate to wrapped timer
      this.emit('tick', this.wrappedTimer.getSnapshot());
    }
  }
  
  private forwardEvents(): void {
    this.wrappedTimer.on('tick', (snapshot: TimerSnapshot) => {
      this.emit('tick', snapshot);
    });
    
    this.wrappedTimer.on('stateChange', (state: TimerState) => {
      this.state = state;
      this.emit('stateChange', state);
    });
    
    this.wrappedTimer.on('finish', () => {
      this.emit('finish');
    });
    
    this.wrappedTimer.on('roundStart', (round: number) => {
      this.emit('roundStart', round);
    });
    
    this.wrappedTimer.on('workStart', () => {
      this.emit('workStart');
    });
    
    this.wrappedTimer.on('restStart', () => {
      this.emit('restStart');
    });
  }
  
  pause(): void {
    if (this.isInCountdown) {
      super.pause();
    } else {
      this.wrappedTimer.pause();
    }
  }
  
  resume(): void {
    if (this.isInCountdown) {
      super.resume();
    } else {
      this.wrappedTimer.resume();
    }
  }
  
  reset(): void {
    this.isInCountdown = false;
    this.countdownElapsed = 0;
    super.reset();
    this.wrappedTimer.reset();
  }
  
  stop(): void {
    this.isInCountdown = false;
    super.stop();
    this.wrappedTimer.stop();
  }
  
  isComplete(): boolean {
    if (this.isInCountdown) {
      return false;
    }
    return this.wrappedTimer.isComplete();
  }
  
  getSnapshot(): TimerSnapshot {
    if (this.isInCountdown) {
      const remaining = Math.max(0, this.countdownDuration - this.countdownElapsed);
      const progress = (this.countdownElapsed / this.countdownDuration) * 100;
      
      return {
        state: this.state,
        elapsed: this.countdownElapsed,
        remaining,
        progress,
        currentRound: 0,
        isCountdown: true,
        countdownRemaining: remaining
      };
    }
    
    const snapshot = this.wrappedTimer.getSnapshot();
    return {
      ...snapshot,
      isCountdown: false
    };
  }
  
  // Delegate methods to wrapped timer
  incrementRound(): void {
    if ('incrementRound' in this.wrappedTimer) {
      (this.wrappedTimer as any).incrementRound();
    }
  }
  
  completeRound(): void {
    if ('completeRound' in this.wrappedTimer) {
      (this.wrappedTimer as any).completeRound();
    }
  }
  
  setSoundEnabled(enabled: boolean): void {
    super.setSoundEnabled(enabled);
    this.wrappedTimer.setSoundEnabled(enabled);
  }
}