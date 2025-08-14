# Timer Implementation Example

## Core Timer Class Implementation

### Base Timer Class
```typescript
// packages/core/src/Timer.ts
export abstract class Timer {
  protected state: TimerState = TimerState.IDLE;
  protected elapsed: number = 0;
  protected intervalId?: NodeJS.Timeout;
  protected startTime?: number;
  protected pausedAt?: number;
  protected totalPausedTime: number = 0;
  
  // Event emitters
  private listeners: Map<string, Set<Function>> = new Map();
  
  constructor(protected config: TimerConfig) {}
  
  // Public API
  start(): void {
    if (this.state !== TimerState.IDLE && this.state !== TimerState.READY) {
      return;
    }
    
    this.state = TimerState.RUNNING;
    this.startTime = Date.now() - this.elapsed;
    this.startTicking();
    this.emit('start');
    this.emit('stateChange', this.state);
  }
  
  pause(): void {
    if (this.state !== TimerState.RUNNING) return;
    
    this.state = TimerState.PAUSED;
    this.pausedAt = Date.now();
    this.stopTicking();
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
    this.emit('reset');
    this.emit('stateChange', this.state);
  }
  
  // Protected methods for subclasses
  protected startTicking(): void {
    this.intervalId = setInterval(() => this.tick(), 100);
  }
  
  protected stopTicking(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
  
  protected tick(): void {
    if (!this.startTime) return;
    
    this.elapsed = Date.now() - this.startTime - this.totalPausedTime;
    this.emit('tick', this.getSnapshot());
    
    if (this.isComplete()) {
      this.finish();
    }
  }
  
  protected finish(): void {
    this.stopTicking();
    this.state = TimerState.FINISHED;
    this.emit('finish');
    this.emit('stateChange', this.state);
  }
  
  // Abstract methods for subclasses
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
}
```

### AMRAP Timer Implementation
```typescript
// packages/core/src/timers/AMRAPTimer.ts
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
  
  getSnapshot(): AMRAPSnapshot {
    return {
      state: this.state,
      elapsed: this.elapsed,
      remaining: Math.max(0, this.duration - this.elapsed),
      rounds: this.rounds,
      progress: Math.min(100, (this.elapsed / this.duration) * 100)
    };
  }
  
  incrementRound(): void {
    this.rounds++;
    this.emit('roundComplete', this.rounds);
  }
}
```

### EMOM Timer Implementation
```typescript
// packages/core/src/timers/EMOMTimer.ts
export class EMOMTimer extends Timer {
  private rounds: number;
  private interval: number;
  private currentRound: number = 0;
  
  constructor(config: EMOMConfig) {
    super(config);
    this.rounds = config.rounds;
    this.interval = config.interval * 1000;
  }
  
  isComplete(): boolean {
    return this.currentRound >= this.rounds;
  }
  
  protected tick(): void {
    super.tick();
    
    const newRound = Math.floor(this.elapsed / this.interval) + 1;
    if (newRound !== this.currentRound && newRound <= this.rounds) {
      this.currentRound = newRound;
      this.emit('roundStart', this.currentRound);
    }
  }
  
  getSnapshot(): EMOMSnapshot {
    const roundElapsed = this.elapsed % this.interval;
    const roundRemaining = this.interval - roundElapsed;
    
    return {
      state: this.state,
      elapsed: this.elapsed,
      currentRound: this.currentRound,
      totalRounds: this.rounds,
      roundElapsed,
      roundRemaining,
      progress: (this.currentRound / this.rounds) * 100
    };
  }
}
```

## React Hook Implementation

### useTimer Hook
```typescript
// packages/react/src/hooks/useTimer.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { Timer, TimerConfig, TimerSnapshot } from '@workout-timer/core';

export interface UseTimerOptions {
  countdown?: number;
  sound?: boolean;
  vibration?: boolean;
  onTick?: (snapshot: TimerSnapshot) => void;
  onFinish?: () => void;
  onRoundChange?: (round: number) => void;
}

export function useTimer(
  config: TimerConfig,
  options: UseTimerOptions = {}
) {
  const [snapshot, setSnapshot] = useState<TimerSnapshot | null>(null);
  const timerRef = useRef<Timer | null>(null);
  const optionsRef = useRef(options);
  
  // Update options ref
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);
  
  // Initialize timer
  useEffect(() => {
    const timer = createTimer(config);
    timerRef.current = timer;
    
    // Set up event listeners
    timer.on('tick', (snapshot: TimerSnapshot) => {
      setSnapshot(snapshot);
      optionsRef.current.onTick?.(snapshot);
    });
    
    timer.on('finish', () => {
      if (optionsRef.current.sound) {
        playSound('finish');
      }
      if (optionsRef.current.vibration) {
        vibrate('finish');
      }
      optionsRef.current.onFinish?.();
    });
    
    timer.on('roundStart', (round: number) => {
      if (optionsRef.current.sound) {
        playSound('round');
      }
      optionsRef.current.onRoundChange?.(round);
    });
    
    // Set initial snapshot
    setSnapshot(timer.getSnapshot());
    
    return () => {
      timer.reset();
    };
  }, [config]);
  
  // Control functions
  const start = useCallback(() => {
    if (options.countdown) {
      startCountdown(options.countdown, () => {
        timerRef.current?.start();
      });
    } else {
      timerRef.current?.start();
    }
  }, [options.countdown]);
  
  const pause = useCallback(() => {
    timerRef.current?.pause();
  }, []);
  
  const resume = useCallback(() => {
    timerRef.current?.resume();
  }, []);
  
  const reset = useCallback(() => {
    timerRef.current?.reset();
  }, []);
  
  // Format time helper
  const formattedTime = formatTime(
    config.type === 'forTime' 
      ? snapshot?.elapsed || 0
      : snapshot?.remaining || 0
  );
  
  return {
    // State
    state: snapshot?.state || TimerState.IDLE,
    elapsed: snapshot?.elapsed || 0,
    remaining: snapshot?.remaining || 0,
    rounds: snapshot?.rounds,
    currentRound: snapshot?.currentRound,
    progress: snapshot?.progress || 0,
    formattedTime,
    
    // Controls
    start,
    pause,
    resume,
    reset,
    
    // Raw timer access
    timer: timerRef.current
  };
}
```

### Timer Provider
```typescript
// packages/react/src/providers/TimerProvider.tsx
import React, { createContext, useContext, ReactNode } from 'react';

interface TimerContextValue {
  activeTimers: Map<string, Timer>;
  createTimer: (id: string, config: TimerConfig) => Timer;
  getTimer: (id: string) => Timer | undefined;
  removeTimer: (id: string) => void;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [activeTimers] = useState(() => new Map<string, Timer>());
  
  const createTimer = useCallback((id: string, config: TimerConfig) => {
    const timer = TimerFactory.create(config);
    activeTimers.set(id, timer);
    return timer;
  }, [activeTimers]);
  
  const getTimer = useCallback((id: string) => {
    return activeTimers.get(id);
  }, [activeTimers]);
  
  const removeTimer = useCallback((id: string) => {
    const timer = activeTimers.get(id);
    timer?.reset();
    activeTimers.delete(id);
  }, [activeTimers]);
  
  return (
    <TimerContext.Provider value={{ activeTimers, createTimer, getTimer, removeTimer }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within TimerProvider');
  }
  return context;
}
```

## UI Component Examples

### Timer Display Component
```typescript
// packages/react-ui/src/components/TimerDisplay.tsx
import React from 'react';
import { TimerState } from '@workout-timer/core';

interface TimerDisplayProps {
  time: string;
  state: TimerState;
  progress?: number;
  round?: number;
  totalRounds?: number;
  className?: string;
}

export function TimerDisplay({
  time,
  state,
  progress = 0,
  round,
  totalRounds,
  className = ''
}: TimerDisplayProps) {
  return (
    <div className={`timer-display ${className}`}>
      <div className="timer-main">
        <h1 className="timer-time" data-state={state}>
          {time}
        </h1>
        
        {round && totalRounds && (
          <div className="timer-rounds">
            Round {round} of {totalRounds}
          </div>
        )}
      </div>
      
      <div className="timer-progress">
        <div 
          className="timer-progress-bar"
          style={{ width: `${progress}%` }}
          data-state={state}
        />
      </div>
      
      <div className="timer-state">
        {state === TimerState.PAUSED && 'PAUSED'}
        {state === TimerState.FINISHED && 'COMPLETE!'}
      </div>
    </div>
  );
}
```

### Timer Controls Component
```typescript
// packages/react-ui/src/components/TimerControls.tsx
import React from 'react';
import { TimerState } from '@workout-timer/core';

interface TimerControlsProps {
  state: TimerState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  className?: string;
}

export function TimerControls({
  state,
  onStart,
  onPause,
  onResume,
  onReset,
  className = ''
}: TimerControlsProps) {
  return (
    <div className={`timer-controls ${className}`}>
      {state === TimerState.IDLE && (
        <button onClick={onStart} className="timer-btn timer-btn-start">
          Start
        </button>
      )}
      
      {state === TimerState.RUNNING && (
        <button onClick={onPause} className="timer-btn timer-btn-pause">
          Pause
        </button>
      )}
      
      {state === TimerState.PAUSED && (
        <>
          <button onClick={onResume} className="timer-btn timer-btn-resume">
            Resume
          </button>
          <button onClick={onReset} className="timer-btn timer-btn-reset">
            Reset
          </button>
        </>
      )}
      
      {state === TimerState.FINISHED && (
        <button onClick={onReset} className="timer-btn timer-btn-reset">
          Reset
        </button>
      )}
    </div>
  );
}
```

## Integration with Tri-Coach App

### Activity Timer Modal
```typescript
// app/components/activity-timer/ActivityTimerModal.tsx
import { useState } from 'react';
import { useTimer } from '@workout-timer/react';
import { TimerDisplay, TimerControls } from '@workout-timer/react-ui';
import { saveTimerSession } from '@/lib/services/timer-service';

interface ActivityTimerModalProps {
  activityId: number;
  activityType: 'swim' | 'bike' | 'run' | 'strength';
  presetConfig?: TimerConfig;
  onClose: () => void;
}

export function ActivityTimerModal({
  activityId,
  activityType,
  presetConfig,
  onClose
}: ActivityTimerModalProps) {
  const [config] = useState<TimerConfig>(() => 
    presetConfig || getDefaultConfig(activityType)
  );
  
  const timer = useTimer(config, {
    sound: true,
    vibration: true,
    onFinish: async () => {
      await handleFinish();
    }
  });
  
  const handleFinish = async () => {
    // Save timer session to database
    await saveTimerSession({
      activityId,
      config,
      elapsed: timer.elapsed,
      rounds: timer.rounds
    });
    
    // Show completion modal
    showCompletionModal();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Workout Timer</h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>
        
        <TimerDisplay
          time={timer.formattedTime}
          state={timer.state}
          progress={timer.progress}
          round={timer.currentRound}
          totalRounds={timer.totalRounds}
        />
        
        <TimerControls
          state={timer.state}
          onStart={timer.start}
          onPause={timer.pause}
          onResume={timer.resume}
          onReset={timer.reset}
        />
      </div>
    </div>
  );
}
```

### Timer Service
```typescript
// lib/services/timer-service.ts
export async function saveTimerSession(data: {
  activityId: number;
  config: TimerConfig;
  elapsed: number;
  rounds?: number;
}) {
  const response = await fetch('/api/j/timers/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      activity_id: data.activityId,
      config: data.config,
      elapsed_time: Math.floor(data.elapsed / 1000),
      rounds_completed: data.rounds
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to save timer session');
  }
  
  return response.json();
}

export async function getTimerPresets(activityType?: string) {
  const params = activityType ? `?type=${activityType}` : '';
  const response = await fetch(`/api/j/timers/presets${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch timer presets');
  }
  
  return response.json();
}
```

## Testing Strategy

### Unit Tests
```typescript
// packages/core/src/__tests__/AMRAPTimer.test.ts
import { AMRAPTimer } from '../timers/AMRAPTimer';
import { TimerState } from '../types';

describe('AMRAPTimer', () => {
  let timer: AMRAPTimer;
  
  beforeEach(() => {
    timer = new AMRAPTimer({ 
      type: 'amrap', 
      duration: 300 // 5 minutes
    });
  });
  
  afterEach(() => {
    timer.reset();
  });
  
  test('should initialize in idle state', () => {
    const snapshot = timer.getSnapshot();
    expect(snapshot.state).toBe(TimerState.IDLE);
    expect(snapshot.elapsed).toBe(0);
    expect(snapshot.remaining).toBe(300000);
  });
  
  test('should start and update elapsed time', (done) => {
    timer.on('tick', (snapshot) => {
      if (snapshot.elapsed > 0) {
        expect(snapshot.state).toBe(TimerState.RUNNING);
        expect(snapshot.remaining).toBeLessThan(300000);
        done();
      }
    });
    
    timer.start();
  });
  
  test('should pause and resume correctly', (done) => {
    timer.start();
    
    setTimeout(() => {
      timer.pause();
      const pausedSnapshot = timer.getSnapshot();
      expect(pausedSnapshot.state).toBe(TimerState.PAUSED);
      
      const pausedElapsed = pausedSnapshot.elapsed;
      
      setTimeout(() => {
        timer.resume();
        
        setTimeout(() => {
          const resumedSnapshot = timer.getSnapshot();
          expect(resumedSnapshot.elapsed).toBeGreaterThan(pausedElapsed);
          done();
        }, 200);
      }, 200);
    }, 200);
  });
});
```

### React Hook Tests
```typescript
// packages/react/src/__tests__/useTimer.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useTimer } from '../hooks/useTimer';

describe('useTimer', () => {
  test('should handle AMRAP timer', () => {
    const { result } = renderHook(() => 
      useTimer({ type: 'amrap', duration: 300 })
    );
    
    expect(result.current.state).toBe('idle');
    expect(result.current.formattedTime).toBe('5:00');
    
    act(() => {
      result.current.start();
    });
    
    expect(result.current.state).toBe('running');
  });
});
```

## NPM Publishing Setup

### Package.json for Publishing
```json
{
  "name": "@workout-timer/core",
  "version": "0.1.0",
  "description": "Headless workout timer library for AMRAP, EMOM, Tabata and more",
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/workout-timer.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/workout-timer/issues"
  },
  "homepage": "https://github.com/yourusername/workout-timer#readme",
  "keywords": [
    "timer",
    "workout",
    "fitness",
    "crossfit",
    "hiit",
    "amrap",
    "emom",
    "tabata",
    "interval",
    "training"
  ],
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist",
    "src",
    "README.md",
    "LICENSE",
    "CHANGELOG.md"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "pnpm run build && pnpm run test",
    "release": "changeset publish"
  },
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": true
    },
    "react-dom": {
      "optional": true
    }
  },
  "devDependencies": {
    "@changesets/cli": "^2.26.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "eslint": "^8.0.0",
    "tsup": "^7.0.0",
    "typescript": "^5.0.0",
    "vitest": "^0.34.0"
  },
  "publishConfig": {
    "access": "public"
  }
}