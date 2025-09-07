export { Timer } from './Timer';
export { AMRAPTimer } from './timers/AMRAPTimer';
export { EMOMTimer } from './timers/EMOMTimer';
export { TabataTimer } from './timers/TabataTimer';
export { IntervalsTimer } from './timers/IntervalsTimer';
export { ForTimeTimer } from './timers/ForTimeTimer';
export { CountdownWrapper } from './timers/CountdownWrapper';
export { SoundManager } from './utils/SoundManager';

export * from './types';

// Utility function to create timers
import { AMRAPTimer } from './timers/AMRAPTimer';
import { EMOMTimer } from './timers/EMOMTimer';
import { ForTimeTimer } from './timers/ForTimeTimer';
import { IntervalsTimer } from './timers/IntervalsTimer';
import { TabataTimer } from './timers/TabataTimer';
import type { 
  TimerConfig, 
  AMRAPConfig, 
  EMOMConfig,
  TabataConfig,
  IntervalsConfig,
  ForTimeConfig
} from './types';

export function createTimer(config: TimerConfig) {
  switch (config.type) {
    case 'amrap':
      return new AMRAPTimer(config as AMRAPConfig);
    case 'emom':
      return new EMOMTimer(config as EMOMConfig);
    case 'tabata':
      return new TabataTimer(config as TabataConfig);
    case 'intervals':
      return new IntervalsTimer(config as IntervalsConfig);
    case 'forTime':
      return new ForTimeTimer(config as ForTimeConfig);
    default:
      throw new Error(`Unknown timer type: ${config.type}`);
  }
}
