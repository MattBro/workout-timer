/**
 * Workout Timer App
 * Clean architecture with:
 * - Custom hooks for logic separation
 * - Context providers for state management
 * - Small, focused components following SOLID principles
 */

import React, { useState } from 'react';
import { TimerProvider } from './contexts/TimerContext';
import { TimerScreen } from './components/TimerScreen';
import { useTimerConfig } from './hooks/useTimerConfig';

// Import existing settings components (reuse from current implementation)
import { ScrollableTimePicker, QuickTimeButtons } from './components/ScrollableTimePicker';
import { RoundSlider } from './components/RoundSlider';
import { RoundPicker } from './components/RoundPicker';
import { IntervalEditor } from './components/IntervalEditor';

const TIMER_TYPES = [
  { id: 'amrap', name: 'AMRAP', icon: '🔄' },
  { id: 'emom', name: 'EMOM', icon: '⏱️' },
  { id: 'tabata', name: 'Tabata', icon: '💪' },
  { id: 'intervals', name: 'Intervals', icon: '📊' },
  { id: 'forTime', name: 'For Time', icon: '🏃' }
];

const TABATA_PRESETS = [
  { name: 'Classic', workTime: 20, restTime: 10, rounds: 8 },
  { name: 'Beginner', workTime: 20, restTime: 20, rounds: 6 },
  { name: 'Advanced', workTime: 30, restTime: 10, rounds: 10 },
  { name: 'Endurance', workTime: 45, restTime: 15, rounds: 6 }
];

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const {
    config,
    updateConfig,
    changeTimerType,
  } = useTimerConfig('amrap');

  const renderTimerSettings = () => {
    switch (config.type) {
      case 'amrap':
        return (
          <div>
            <ScrollableTimePicker 
              value={config.duration} 
              onChange={(duration) => updateConfig({ duration })}
              label="Timer Duration"
            />
            <QuickTimeButtons 
              onSelect={(duration) => updateConfig({ duration })}
              presets={[180, 300, 600, 900, 1200]}
            />
          </div>
        );
      
      case 'emom':
        return (
          <div className="space-y-6">
            <RoundPicker 
              value={config.rounds}
              onChange={(rounds) => updateConfig({ rounds })}
              label="Number of Rounds"
              min={1}
              max={99}
            />
            
            <div>
              <ScrollableTimePicker 
                value={config.interval} 
                onChange={(interval) => updateConfig({ interval })}
                label="Interval Duration"
              />
              <QuickTimeButtons 
                onSelect={(interval) => updateConfig({ interval })}
                presets={[30, 45, 60, 90, 120]}
              />
              <p className="text-xs text-gray-400 text-center mt-2">
                Start new round every {config.interval} seconds
              </p>
            </div>
          </div>
        );
      
      case 'tabata':
        return (
          <div className="space-y-6">
            {/* Preset buttons */}
            <div>
              <label className="block text-sm font-medium mb-3">Quick Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {TABATA_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => updateConfig({
                      workTime: preset.workTime,
                      restTime: preset.restTime,
                      rounds: preset.rounds
                    })}
                    className="p-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    <div className="font-semibold">{preset.name}</div>
                    <div className="text-xs text-gray-300">
                      {preset.workTime}/{preset.restTime}s × {preset.rounds}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-center">Work Time</label>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateConfig({ workTime: Math.max(5, config.workTime - 5) })}
                    className="p-2 text-xl hover:bg-gray-600 rounded-lg shadow-md active:scale-95"
                  >
                    -
                  </button>
                  <div className="text-3xl font-bold w-16 text-center">{config.workTime}s</div>
                  <button
                    onClick={() => updateConfig({ workTime: Math.min(60, config.workTime + 5) })}
                    className="p-2 text-xl hover:bg-gray-600 rounded-lg shadow-md active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-center">Rest Time</label>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateConfig({ restTime: Math.max(5, config.restTime - 5) })}
                    className="p-2 text-xl hover:bg-gray-600 rounded-lg shadow-md active:scale-95"
                  >
                    -
                  </button>
                  <div className="text-3xl font-bold w-16 text-center">{config.restTime}s</div>
                  <button
                    onClick={() => updateConfig({ restTime: Math.min(60, config.restTime + 5) })}
                    className="p-2 text-xl hover:bg-gray-600 rounded-lg shadow-md active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <RoundSlider 
              value={config.rounds}
              onChange={(rounds) => updateConfig({ rounds })}
              label="Rounds per Set"
              min={1}
              max={20}
            />
            
            <RoundSlider 
              value={config.sets || 1}
              onChange={(sets) => updateConfig({ sets })}
              label="Number of Sets"
              min={1}
              max={5}
            />
          </div>
        );
      
      case 'forTime':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Time Cap</label>
              <ScrollableTimePicker 
                value={config.timeCapMinutes * 60} 
                onChange={(seconds) => updateConfig({ timeCapMinutes: Math.floor(seconds / 60) })}
              />
              <QuickTimeButtons 
                onSelect={(seconds) => updateConfig({ timeCapMinutes: Math.floor(seconds / 60) })}
                presets={[600, 900, 1200, 1800, 2400]}
              />
            </div>
            
            <RoundPicker 
              value={config.rounds || 3}
              onChange={(rounds) => updateConfig({ rounds })}
              label="Number of Rounds to Complete"
              min={1}
              max={99}
            />
          </div>
        );
      
      case 'intervals':
        return (
          <div className="space-y-6">
            <RoundSlider 
              value={config.rounds || 3}
              onChange={(rounds) => updateConfig({ rounds })}
              label="Number of Rounds"
              min={1}
              max={10}
            />
            
            <IntervalEditor 
              intervals={config.intervals}
              onChange={(intervals) => updateConfig({ intervals })}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <TimerProvider 
      config={config}
      soundEnabled={soundEnabled}
      countdownEnabled={config.countdownEnabled}
      countdownTime={config.countdownTime}
    >
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <TimerScreen 
          onOpenSettings={() => setShowSettings(true)}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />

        {/* Overlay for closing settings */}
        {showSettings && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSettings(false)}
          />
        )}
        
        {/* Settings Panel */}
        <div className={`fixed inset-x-0 bottom-0 bg-gray-800 rounded-t-3xl shadow-2xl transition-transform duration-300 transform ${
          showSettings ? 'translate-y-0' : 'translate-y-full'
        } max-h-[80vh] overflow-y-auto z-50`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Timer Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Timer Type Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Timer Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TIMER_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => changeTimerType(type.id)}
                    className={`p-4 rounded-xl flex flex-col items-center transition-all shadow-lg hover:shadow-xl ${
                      config.type === type.id 
                        ? 'bg-gray-600 text-white scale-105 shadow-xl' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-3xl mb-2">{type.icon}</span>
                    <span className="font-semibold">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Countdown Settings */}
            <div className="mb-6 bg-gray-700 rounded-xl p-6 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Pre-Timer Countdown</h3>
                <button
                  onClick={() => updateConfig({ 
                    countdownEnabled: !config.countdownEnabled 
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.countdownEnabled ? 'bg-gray-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.countdownEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {config.countdownEnabled && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Countdown Duration</label>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => updateConfig({ 
                        countdownTime: Math.max(0, (config.countdownTime || 10) - 5) 
                      })}
                      className="p-2 text-xl hover:bg-gray-600 rounded-lg shadow-md active:scale-95"
                    >
                      -5
                    </button>
                    <div className="text-3xl font-bold w-20 text-center">{config.countdownTime || 10}s</div>
                    <button
                      onClick={() => updateConfig({ 
                        countdownTime: Math.min(60, (config.countdownTime || 10) + 5) 
                      })}
                      className="p-2 text-xl hover:bg-gray-600 rounded-lg shadow-md active:scale-95"
                    >
                      +5
                    </button>
                  </div>
                  <div className="flex gap-2 justify-center flex-wrap mt-3">
                    {[3, 5, 10, 15, 20].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => updateConfig({ countdownTime: preset })}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95 ${
                          config.countdownTime === preset
                            ? 'bg-gray-500 text-white shadow-lg'
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      >
                        {preset}s
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Timer-specific settings */}
            <div className="bg-gray-700 rounded-xl p-6 space-y-6 shadow-inner">
              {renderTimerSettings()}
            </div>
          </div>
        </div>
      </div>
    </TimerProvider>
  );
}

export default App;