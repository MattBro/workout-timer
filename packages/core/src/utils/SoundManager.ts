export class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  
  constructor() {
    // Initialize AudioContext lazily (on first user interaction)
  }
  
  private initAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined' && window.AudioContext) {
      this.audioContext = new AudioContext();
    }
  }
  
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
  
  isEnabled(): boolean {
    return this.enabled;
  }
  
  playBeep(frequency: number = 800, duration: number = 100, volume: number = 0.3) {
    if (!this.enabled) return;
    
    try {
      this.initAudioContext();
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }
  
  // Different beep patterns for different events
  playStartSound() {
    this.playBeep(1000, 200, 0.4);
  }
  
  playPauseSound() {
    this.playBeep(600, 150, 0.3);
  }
  
  playResumeSound() {
    this.playBeep(800, 150, 0.3);
  }
  
  playFinishSound() {
    // Three ascending beeps
    setTimeout(() => this.playBeep(600, 150, 0.3), 0);
    setTimeout(() => this.playBeep(800, 150, 0.3), 200);
    setTimeout(() => this.playBeep(1000, 300, 0.4), 400);
  }
  
  playRoundStartSound() {
    this.playBeep(900, 100, 0.3);
  }
  
  playWorkStartSound() {
    // Higher pitch for work
    this.playBeep(1200, 150, 0.4);
  }
  
  playRestStartSound() {
    // Lower pitch for rest
    this.playBeep(500, 150, 0.3);
  }
  
  playCountdownBeep(secondsRemaining: number) {
    if (secondsRemaining <= 3 && secondsRemaining > 0) {
      // Mario Kart style: low tones for 3-2-1, high tone for GO
      const frequency = 400; // Low tone for countdown
      this.playBeep(frequency, 150, 0.4);
    } else if (secondsRemaining === 0) {
      // High tone for GO!
      this.playBeep(800, 200, 0.5);
    }
  }
  
  playTickSound() {
    // Subtle tick
    this.playBeep(400, 50, 0.1);
  }
  
  // Speech synthesis for announcements
  speak(text: string, rate: number = 1.0) {
    if (!this.enabled) return;
    
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.volume = 0.7;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.warn('Failed to speak:', error);
    }
  }
  
  announceWorkPhase() {
    this.speak('Work');
  }
  
  announceRestPhase() {
    this.speak('Rest');
  }
  
  announceRound(round: number) {
    this.speak(`Round ${round}`);
  }
  
  announceCountdown(seconds: number) {
    if (seconds <= 3 && seconds > 0) {
      this.speak(seconds.toString());
    } else if (seconds === 0) {
      this.speak('Go!');
    }
  }
  
  announceFinish() {
    this.speak('Workout complete!');
  }
  
  announceNumber(number: number) {
    this.speak(number.toString(), 1.2);
  }
}