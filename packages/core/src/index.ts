export { Timer } from './Timer';
export { AMRAPTimer } from './timers/AMRAPTimer';
export { EMOMTimer } from './timers/EMOMTimer';

export * from './types';

// Utility function to create timers
import { TimerConfig, AMRAPConfig, EMOMConfig } from './types';
import { AMRAPTimer } from './timers/AMRAPTimer';
import { EMOMTimer } from './timers/EMOMTimer';

export function createTimer(config: TimerConfig) {
  switch (config.type) {
    case 'amrap':
      return new AMRAPTimer(config as AMRAPConfig);
    case 'emom':
      return new EMOMTimer(config as EMOMConfig);
    default:
      throw new Error(`Unknown timer type: ${config.type}`);
  }
}