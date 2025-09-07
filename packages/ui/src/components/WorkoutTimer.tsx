import { useState } from 'react';
import { TimerProvider, ThemeProvider, useTimerConfig } from '@workout-timer/react';
import type { TimerConfig } from '@workout-timer/react';
import { TimerScreen } from './TimerScreen';
import { TappableNumber } from './TappableNumber';
import { TappableTime } from './TappableTime';
import { AdvancedIntervalEditor, IntervalBlock } from './AdvancedIntervalEditor';

export interface WorkoutTimerProps {
  activityId?: string;
  initialConfig?: TimerConfig;
  onConfigChange?: (config: TimerConfig) => void;
  className?: string;
  theme?: 'dark' | 'light' | 'charcoal';
  soundEnabled?: boolean;
}

export function WorkoutTimer({
  initialConfig,
  onConfigChange,
  className,
  theme = 'charcoal',
  soundEnabled: soundEnabledProp = true,
}: WorkoutTimerProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundEnabledProp);
  const [focusField] = useState<string | null>(null);

  const {
    config,
    updateConfig,
    changeTimerType,
  } = useTimerConfig(initialConfig?.type || 'amrap');

  // Apply external initialConfig on first render
  // and propagate changes up when requested
  if (initialConfig && config.type !== initialConfig.type) {
    // best-effort sync of type; detailed values adjusted via subsequent updates
    changeTimerType(initialConfig.type);
  }

  const handleUpdateConfig = (updates: Partial<TimerConfig>) => {
    // Narrow update based on discriminated union
    updateConfig(updates as any);
    if (onConfigChange) onConfigChange({ ...(config as any), ...updates } as TimerConfig);
  };

  // focus helper omitted in wrapper; modals open directly from screen

  const renderTimerSettings = () => {
    switch (config.type) {
      case 'amrap':
        return (
          <div className="space-y-4">
            <div className="bg-gray-700/50 rounded-xl p-3 sm:p-5 shadow-lg">
              <label className="text-sm font-medium text-gray-300 block mb-3 sm:mb-4">Duration</label>
              <div className="flex justify-center mb-4">
                <TappableTime
                  value={config.duration}
                  onChange={(duration) => handleUpdateConfig({ duration } as any)}
                  size="xl"
                  maxMinutes={60}
                  autoFocus={focusField === 'main-time'}
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[180, 300, 600, 900, 1200].map((seconds) => (
                  <button key={seconds} onClick={() => handleUpdateConfig({ duration: seconds } as any)} className={`p-2 rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md active:scale-95 ${config.duration === seconds ? 'bg-gray-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                    {seconds >= 60 ? `${seconds / 60}m` : `${seconds}s`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'emom':
        return (
          <div className="space-y-4">
            <div className="bg-gray-700/50 rounded-xl p-3 sm:p-5 shadow-lg space-y-4">
              <label className="text-sm font-medium text-gray-300 block">Configuration</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <label className="text-xs text-gray-400 block mb-2">Rounds</label>
                  <TappableNumber value={config.rounds} onChange={(rounds) => handleUpdateConfig({ rounds } as any)} min={1} max={100} size="lg" autoFocus={focusField === 'main-time' && config.type === 'emom'} />
                </div>
                <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <label className="text-xs text-gray-400 block mb-2">Every</label>
                  <TappableTime value={config.interval} onChange={(interval) => handleUpdateConfig({ interval } as any)} size="md" maxMinutes={5} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'tabata':
        return (
          <div className="space-y-4">
            <div className="bg-gray-700/50 rounded-xl p-5 shadow-lg space-y-4">
              <label className="text-sm font-medium text-gray-300 block">Custom Configuration</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <label className="text-xs text-gray-400 block mb-2">Work Time</label>
                  <TappableNumber value={config.workTime} onChange={(workTime) => handleUpdateConfig({ workTime } as any)} suffix="s" min={5} max={120} size="lg" autoFocus={focusField === 'main-time' && config.type === 'tabata'} />
                </div>
                <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <label className="text-xs text-gray-400 block mb-2">Rest Time</label>
                  <TappableNumber value={config.restTime} onChange={(restTime) => handleUpdateConfig({ restTime } as any)} suffix="s" min={5} max={120} size="lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <label className="text-xs text-gray-400 block mb-2">Rounds</label>
                  <TappableNumber value={config.rounds} onChange={(rounds) => handleUpdateConfig({ rounds } as any)} min={1} max={30} size="md" />
                </div>
                <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <label className="text-xs text-gray-400 block mb-2">Sets</label>
                  <TappableNumber value={config.sets || 1} onChange={(sets) => handleUpdateConfig({ sets } as any)} min={1} max={10} size="md" />
                </div>
              </div>
              {/* Optional: rest between sets can be supported in a future type extension */}
            </div>
          </div>
        );
      case 'intervals':
        return (
          <div className="space-y-4">
            <AdvancedIntervalEditor
              blocks={(config as any).blocks || [{ id: Date.now().toString(), name: 'Workout', intervals: [ { name: 'Work', duration: 30, type: 'work' }, { name: 'Rest', duration: 30, type: 'rest' } ], rounds: 5 }] as IntervalBlock[]}
              onChange={(blocks) => handleUpdateConfig({ blocks, useBlocks: true } as any)}
            />
            <div className="bg-gray-700/50/50 rounded-lg p-3 border border-gray-700">
              <p className="text-xs text-gray-500 text-center italic">💡 Tip: Use presets or create custom blocks for complex workouts</p>
            </div>
          </div>
        );
      case 'forTime':
        return (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
              <label className="text-xs text-gray-400 block mb-3 text-center">Time Cap</label>
              <div className="flex justify-center mb-3">
                <TappableTime value={(config as any).timeCapMinutes * 60} onChange={(seconds) => handleUpdateConfig({ timeCapMinutes: Math.floor(seconds / 60) } as any)} size="xl" maxMinutes={60} autoFocus={focusField === 'main-time' && config.type === 'forTime'} />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[600, 900, 1200, 1800, 2400].map((seconds) => (
                  <button key={seconds} onClick={() => handleUpdateConfig({ timeCapMinutes: Math.floor(seconds / 60) } as any)} className={`p-2 rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md active:scale-95 ${((config as any).timeCapMinutes * 60) === seconds ? 'bg-gray-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>{seconds / 60}m</button>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
              <label className="text-xs text-gray-400 block mb-2 text-center">Rounds to Complete</label>
              <div className="flex justify-center">
                <TappableNumber value={(config as any).rounds || 3} onChange={(rounds) => handleUpdateConfig({ rounds } as any)} suffix="rounds" min={1} max={100} size="lg" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider defaultTheme={theme}>
      <TimerProvider
        config={config}
        soundEnabled={soundEnabled}
        countdownEnabled={(config as any).countdownEnabled}
        countdownTime={(config as any).countdownTime}
      >
        <div className={`min-h-screen bg-gray-900 text-white flex flex-col ${className || ''}`}>
          <TimerScreen onOpenSettings={() => setShowSettings(true)} onClickTime={() => setShowSettings(true)} soundEnabled={soundEnabled} onToggleSound={() => setSoundEnabled(!soundEnabled)} />

          <div className={`fixed inset-0 z-40 ${showSettings ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-black backdrop-blur-sm transition-opacity duration-500 ${showSettings ? 'opacity-60' : 'opacity-0'}`} onClick={() => setShowSettings(false)} />
            <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
              <div className={`relative bg-gray-800 rounded-3xl shadow-2xl w-full max-w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto transform transition-transform ${showSettings ? 'translate-y-0 duration-300 ease-out' : 'translate-y-[100vh] duration-300 ease-in'}`}>
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Timer Settings</h2>
                    <button onClick={() => setShowSettings(false)} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Timer Type</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {[{ id: 'amrap', name: 'AMRAP', icon: '🔄' }, { id: 'emom', name: 'EMOM', icon: '⏱️' }, { id: 'tabata', name: 'Tabata', icon: '💪' }, { id: 'intervals', name: 'Intervals', icon: '📊' }, { id: 'forTime', name: 'For Time', icon: '🏃' }].map((type) => (
                        <button key={type.id} onClick={() => changeTimerType(type.id)} className={`p-3 sm:p-4 rounded-xl flex flex-col items-center transition-all shadow-lg hover:shadow-xl ${config.type === type.id ? 'bg-gray-600 text-white scale-105 shadow-xl' : 'bg-gray-700 hover:bg-gray-600'}`}>
                          <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{type.icon}</span><span className="text-xs sm:text-sm font-semibold">{type.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs text-gray-500 hover:text-gray-400 transition-colors flex items-center gap-1">
                      <svg className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      Advanced
                    </button>
                    {showAdvanced && (
                      <div className="mt-3 p-4 bg-gray-700/50 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Pre-timer countdown</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{(config as any).countdownEnabled ? `${(config as any).countdownTime || 10}s` : 'Off'}</span>
                            <button onClick={() => handleUpdateConfig({ countdownEnabled: !(config as any).countdownEnabled } as any)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${(config as any).countdownEnabled ? 'bg-gray-600' : 'bg-gray-700'}`}>
                              <span className={`inline-block h-3 w-3 transform rounded-full bg-gray-400 transition-transform ${(config as any).countdownEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                            </button>
                          </div>
                        </div>
                        {(config as any).countdownEnabled && (
                          <div className="mt-3">
                            <input type="number" value={(config as any).countdownTime || 10} onChange={(e) => { const val = parseInt(e.target.value) || 10; handleUpdateConfig({ countdownTime: Math.min(60, Math.max(3, val)) } as any); }} className="w-16 text-center bg-gray-700 rounded px-2 py-1 text-sm" min={3} max={60} />
                            <span className="ml-2 text-xs text-gray-400">seconds</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-700 rounded-xl p-6 space-y-6 shadow-inner">{renderTimerSettings()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TimerProvider>
    </ThemeProvider>
  );
}
