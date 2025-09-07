import { useState, useCallback, useMemo } from 'react';

export interface TimerConfigBase {
  type: string;
  soundEnabled?: boolean;
  countdownEnabled?: boolean;
  countdownTime?: number;
}

export interface AMRAPConfig extends TimerConfigBase {
  type: 'amrap';
  duration: number;
}

export interface EMOMConfig extends TimerConfigBase {
  type: 'emom';
  rounds: number;
  interval: number;
}

export interface TabataConfig extends TimerConfigBase {
  type: 'tabata';
  workTime: number;
  restTime: number;
  rounds: number;
  sets?: number;
}

export interface IntervalsConfig extends TimerConfigBase {
  type: 'intervals';
  intervals: Array<{
    name: string;
    duration: number;
    type: 'work' | 'rest' | 'prep';
  }>;
  rounds?: number;
  // Advanced mode with blocks
  useBlocks?: boolean;
  blocks?: Array<{
    id: string;
    name: string;
    intervals: Array<{
      name: string;
      duration: number;
      type: 'work' | 'rest' | 'prep';
    }>;
    rounds: number;
  }>;
}

export interface ForTimeConfig extends TimerConfigBase {
  type: 'forTime';
  timeCapMinutes: number;
  rounds?: number;
}

export type TimerConfig = 
  | AMRAPConfig 
  | EMOMConfig 
  | TabataConfig 
  | IntervalsConfig 
  | ForTimeConfig;

const DEFAULT_CONFIGS: Record<string, TimerConfig> = {
  amrap: {
    type: 'amrap',
    duration: 300,
  },
  emom: {
    type: 'emom',
    rounds: 10,
    interval: 60,
  },
  tabata: {
    type: 'tabata',
    workTime: 20,
    restTime: 10,
    rounds: 8,
    sets: 1,
  },
  intervals: {
    type: 'intervals',
    intervals: [
      { name: 'Prepare', duration: 10, type: 'prep' },
      { name: 'Work', duration: 45, type: 'work' },
      { name: 'Rest', duration: 15, type: 'rest' },
    ],
    rounds: 3,
  },
  forTime: {
    type: 'forTime',
    timeCapMinutes: 20,
    rounds: 3,
  },
};

export function useTimerConfig(initialType: string = 'amrap') {
  const [config, setConfig] = useState<TimerConfig>(() => ({
    ...DEFAULT_CONFIGS[initialType],
    soundEnabled: true,
    countdownEnabled: true,
    countdownTime: 10,
  }));

  const updateConfig = useCallback((updates: Partial<TimerConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates,
    }) as TimerConfig);
  }, []);

  const resetConfig = useCallback(() => {
    setConfig({
      ...DEFAULT_CONFIGS[config.type],
      soundEnabled: config.soundEnabled,
      countdownEnabled: config.countdownEnabled,
      countdownTime: config.countdownTime,
    });
  }, [config.type, config.soundEnabled, config.countdownEnabled, config.countdownTime]);

  const changeTimerType = useCallback((newType: string) => {
    setConfig(prev => ({
      ...DEFAULT_CONFIGS[newType],
      soundEnabled: prev.soundEnabled,
      countdownEnabled: prev.countdownEnabled,
      countdownTime: prev.countdownTime,
    }));
  }, []);

  const loadPreset = useCallback((preset: TimerConfig) => {
    setConfig(prev => ({
      ...preset,
      soundEnabled: prev.soundEnabled,
      countdownEnabled: prev.countdownEnabled,
      countdownTime: prev.countdownTime,
    }));
  }, []);

  const coreConfig = useMemo(() => {
    const { soundEnabled, countdownEnabled, countdownTime, ...core } = config;
    return core;
  }, [config]);

  return {
    config,
    coreConfig,
    updateConfig,
    resetConfig,
    changeTimerType,
    loadPreset,
  };
}