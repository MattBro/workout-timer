/**
 * Custom hook for managing timer sound effects
 * @module useTimerSound
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ExtendedTimerSnapshot } from '../types/timer.types';

/**
 * Sound configuration interface
 */
interface SoundConfig {
  enabled: boolean;
  volume: number;
  voiceEnabled: boolean;
  countdownBeeps: boolean;
  phaseAnnouncements: boolean;
}

/**
 * Custom hook for timer sound management
 * Provides centralized sound control and preferences
 * 
 * @param {ExtendedTimerSnapshot | null} snapshot - Current timer snapshot
 * @param {string} timerType - Type of timer
 * @returns {Object} Sound control methods and state
 * 
 * @example
 * ```tsx
 * const { soundConfig, toggleSound, setVolume } = useTimerSound(snapshot, 'amrap');
 * ```
 */
export function useTimerSound(
  snapshot: ExtendedTimerSnapshot | null,
  timerType: string
) {
  const [soundConfig, setSoundConfig] = useState<SoundConfig>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('timer-sound-config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse sound config:', e);
      }
    }
    
    return {
      enabled: true,
      volume: 0.5,
      voiceEnabled: true,
      countdownBeeps: true,
      phaseAnnouncements: true,
    };
  });

  const lastAnnouncedRef = useRef<string>('');
  const audioContextRef = useRef<AudioContext | null>(null);

  // Save config to localStorage
  useEffect(() => {
    localStorage.setItem('timer-sound-config', JSON.stringify(soundConfig));
  }, [soundConfig]);

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current && typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new AudioContext();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  /**
   * Play a beep sound
   */
  const playBeep = useCallback((frequency: number, duration: number) => {
    if (!soundConfig.enabled || !audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(
        soundConfig.volume, 
        audioContextRef.current.currentTime
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, 
        audioContextRef.current.currentTime + duration / 1000
      );
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Failed to play beep:', error);
    }
  }, [soundConfig.enabled, soundConfig.volume]);

  /**
   * Speak text using speech synthesis
   */
  const speak = useCallback((text: string, rate: number = 1.0) => {
    if (!soundConfig.enabled || !soundConfig.voiceEnabled) return;
    
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.volume = soundConfig.volume;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.warn('Failed to speak:', error);
    }
  }, [soundConfig.enabled, soundConfig.voiceEnabled, soundConfig.volume]);

  /**
   * Handle phase changes
   */
  useEffect(() => {
    if (!snapshot || !soundConfig.phaseAnnouncements) return;
    
    const phase = `${snapshot.state}-${(snapshot as any).intervalName || ''}`;
    
    if (phase !== lastAnnouncedRef.current) {
      lastAnnouncedRef.current = phase;
      
      // Announce phase changes
      if (timerType === 'tabata' && (snapshot as any).isWorking !== undefined) {
        speak((snapshot as any).isWorking ? 'Work' : 'Rest');
      } else if (timerType === 'intervals' && (snapshot as any).intervalName) {
        speak((snapshot as any).intervalName);
      }
    }
  }, [snapshot, timerType, soundConfig.phaseAnnouncements, speak]);

  /**
   * Toggle sound on/off
   */
  const toggleSound = useCallback(() => {
    setSoundConfig(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  /**
   * Set volume level
   */
  const setVolume = useCallback((volume: number) => {
    setSoundConfig(prev => ({ 
      ...prev, 
      volume: Math.max(0, Math.min(1, volume)) 
    }));
  }, []);

  /**
   * Toggle voice announcements
   */
  const toggleVoice = useCallback(() => {
    setSoundConfig(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
  }, []);

  /**
   * Update sound configuration
   */
  const updateSoundConfig = useCallback((updates: Partial<SoundConfig>) => {
    setSoundConfig(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Test sound output
   */
  const testSound = useCallback(() => {
    playBeep(800, 200);
    setTimeout(() => speak('Sound test'), 300);
  }, [playBeep, speak]);

  return {
    soundConfig,
    toggleSound,
    setVolume,
    toggleVoice,
    updateSoundConfig,
    testSound,
    playBeep,
    speak,
  };
}