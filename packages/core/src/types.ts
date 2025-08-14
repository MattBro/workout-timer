export enum TimerState {
  IDLE = 'idle',
  READY = 'ready',
  RUNNING = 'running',
  PAUSED = 'paused',
  FINISHED = 'finished',
  CANCELLED = 'cancelled'
}

export interface TimerSnapshot {
  state: TimerState;
  elapsed: number;
  remaining: number;
  progress: number;
  currentRound?: number;
  totalRounds?: number;
  currentInterval?: number;
  intervalRemaining?: number;
}

export interface TimerConfig {
  type: string;
  countdown?: number;
}

export interface AMRAPConfig extends TimerConfig {
  type: 'amrap';
  duration: number; // seconds
  movements?: Movement[];
}

export interface EMOMConfig extends TimerConfig {
  type: 'emom';
  rounds: number;
  interval: number; // seconds (usually 60)
  movements?: Movement[];
}

export interface TabataConfig extends TimerConfig {
  type: 'tabata';
  workTime: number; // seconds (typically 20)
  restTime: number; // seconds (typically 10)
  rounds: number; // typically 8
  sets?: number;
  restBetweenSets?: number;
}

export interface ForTimeConfig extends TimerConfig {
  type: 'forTime';
  timeCapMinutes: number;
  rounds?: number;
  movements?: Movement[];
}

export interface IntervalsConfig extends TimerConfig {
  type: 'intervals';
  intervals: Interval[];
  rounds?: number;
}

export interface Interval {
  name: string;
  duration: number; // seconds
  type: 'work' | 'rest' | 'prep';
}

export interface Movement {
  name: string;
  reps?: number;
  duration?: number;
  distance?: string;
}