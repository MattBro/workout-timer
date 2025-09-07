/**
 * Workout Timer App
 * Clean architecture with:
 * - Custom hooks for logic separation
 * - Context providers for state management
 * - Small, focused components following SOLID principles
 */

import React, { useState } from 'react';
import { TimerProvider, ThemeProvider } from '@workout-timer/react';
import { TimerErrorBoundary } from './components/ErrorBoundary';
import { useTimerConfig } from '@workout-timer/react';

// Import existing settings components (reuse from current implementation)
import { ScrollableTimePicker, QuickTimeButtons, RoundSlider, RoundPicker, IntervalEditor, AdvancedIntervalEditor, TappableNumber, TappableTime } from '@workout-timer/ui';
import type { IntervalBlock } from '@workout-timer/ui';
import { TimerScreen } from '@workout-timer/ui';

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

function AppContent() {
  const [showSettings, setShowSettings] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [focusField, setFocusField] = useState<string | null>(null);
  
  const {
    config,
    updateConfig,
    changeTimerType,
  } = useTimerConfig('amrap');
  
  const handleOpenSettingsWithFocus = (field?: string) => {
    setShowSettings(true);
    if (field) {
      setFocusField(field);
      // Clear focus field after a short delay to allow for re-focusing
      setTimeout(() => setFocusField(null), 100);
    }
  };

  const renderTimerSettings = () => {
    switch (config.type) {
      case 'amrap':
        return (
          <div className="space-y-4">
            {/* Duration Card */}
            <div className="bg-gray-700/50 rounded-xl p-3 sm:p-5 shadow-lg">
              <label className="text-sm font-medium text-gray-300 block mb-3 sm:mb-4">Duration</label>
              <div className="flex justify-center mb-4">
                <TappableTime
                  value={config.duration}
                  onChange={(duration) => updateConfig({ duration })}
                  size="xl"
                  maxMinutes={60}
                  autoFocus={focusField === 'main-time'}
                />
              </div>
              
              {/* Quick Presets */}
              <div className="grid grid-cols-5 gap-2">
                {[180, 300, 600, 900, 1200].map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => updateConfig({ duration: seconds })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md active:scale-95 ${
                      config.duration === seconds 
                        ? 'bg-gray-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {seconds >= 60 ? `${seconds / 60}m` : `${seconds}s`}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Info Card */}
            <div className="bg-gray-700/50/50 rounded-lg p-3 border border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                As Many Rounds As Possible in {Math.floor(config.duration / 60)}:{(config.duration % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        );
      
      case 'emom':
        return (
          <div className="space-y-4">
            {/* Main Settings Card */}
            <div className="bg-gray-700/50 rounded-xl p-3 sm:p-5 shadow-lg space-y-4">
              <label className="text-sm font-medium text-gray-300 block">Configuration</label>
              
              {/* Rounds and Interval */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <label className="text-xs text-gray-400 block mb-2">Rounds</label>
                  <TappableNumber
                    value={config.rounds}
                    onChange={(rounds) => updateConfig({ rounds })}
                    suffix=""
                    min={1}
                    max={100}
                    size="lg"
                    autoFocus={focusField === 'main-time' && config.type === 'emom'}
                  />
                </div>
                <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <label className="text-xs text-gray-400 block mb-2">Every</label>
                  <TappableTime
                    value={config.interval}
                    onChange={(interval) => updateConfig({ interval })}
                    size="md"
                    maxMinutes={5}
                  />
                </div>
              </div>
              
              {/* Quick Interval Presets */}
              <div className="pt-2">
                <label className="text-xs text-gray-400 block mb-2">Quick Intervals</label>
                <div className="grid grid-cols-5 gap-2">
                  {[30, 45, 60, 90, 120].map((seconds) => (
                    <button
                      key={seconds}
                      onClick={() => updateConfig({ interval: seconds })}
                      className={`p-2 rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md active:scale-95 ${
                        config.interval === seconds 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {seconds}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Info Card */}
            <div className="bg-gray-700/50/50 rounded-lg p-3 border border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                {config.rounds} rounds • New round every {config.interval} seconds
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                Total time: {Math.floor(config.rounds * config.interval / 60)}:{((config.rounds * config.interval) % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        );
      
      case 'tabata':
        return (
          <div className="space-y-4">
            {/* Quick Presets Card */}
            <div className="bg-gray-700/50 rounded-xl p-3 sm:p-5 shadow-lg">
              <label className="text-sm font-medium text-gray-300 block mb-3">Quick Presets</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {TABATA_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => updateConfig({
                      workTime: preset.workTime,
                      restTime: preset.restTime,
                      rounds: preset.rounds
                    })}
                    className={`p-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 ${
                      config.workTime === preset.workTime && 
                      config.restTime === preset.restTime && 
                      config.rounds === preset.rounds
                        ? 'bg-gray-600 text-white scale-105'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-semibold text-sm">{preset.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {preset.workTime}/{preset.restTime}s × {preset.rounds}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Custom Configuration Card */}
            <div className="bg-gray-700/50 rounded-xl p-5 shadow-lg space-y-4">
              <label className="text-sm font-medium text-gray-300 block">Custom Configuration</label>
              
              {/* Work/Rest Times */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <label className="text-xs text-gray-400 block mb-2">Work Time</label>
                  <TappableNumber
                    value={config.workTime}
                    onChange={(workTime) => updateConfig({ workTime })}
                    suffix="s"
                    min={5}
                    max={120}
                    size="lg"
                    autoFocus={focusField === 'main-time' && config.type === 'tabata'}
                  />
                </div>
                <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <label className="text-xs text-gray-400 block mb-2">Rest Time</label>
                  <TappableNumber
                    value={config.restTime}
                    onChange={(restTime) => updateConfig({ restTime })}
                    suffix="s"
                    min={5}
                    max={120}
                    size="lg"
                  />
                </div>
              </div>
              
              {/* Rounds/Sets */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <label className="text-xs text-gray-400 block mb-2">Rounds</label>
                  <TappableNumber
                    value={config.rounds}
                    onChange={(rounds) => updateConfig({ rounds })}
                    suffix=""
                    min={1}
                    max={30}
                    size="md"
                  />
                </div>
                <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <label className="text-xs text-gray-400 block mb-2">Sets</label>
                  <TappableNumber
                    value={config.sets || 1}
                    onChange={(sets) => updateConfig({ sets })}
                    suffix=""
                    min={1}
                    max={10}
                    size="md"
                  />
                </div>
              </div>
              
              {/* Rest Between Sets - Only show if more than 1 set */}
              {(config.sets || 1) > 1 && (
                <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <label className="text-xs text-gray-400 block mb-2">Rest Between Sets</label>
                  <TappableNumber
                    value={config.restBetweenSets || 60}
                    onChange={(restBetweenSets) => updateConfig({ restBetweenSets })}
                    suffix="s"
                    min={10}
                    max={300}
                    size="md"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Recovery time between each set
                  </p>
                </div>
              )}
            </div>
            
            {/* Info Card */}
            <div className="bg-gray-700/50/50 rounded-lg p-3 border border-gray-700">
              <div className="text-xs text-gray-400 text-center space-y-1">
                <p>{config.workTime}s work / {config.restTime}s rest × {config.rounds} rounds</p>
                {(config.sets || 1) > 1 && <p>{config.sets} sets total</p>}
                <p className="text-gray-500">
                  Total: {Math.floor(((config.workTime + config.restTime) * config.rounds * (config.sets || 1)) / 60)}:{(((config.workTime + config.restTime) * config.rounds * (config.sets || 1)) % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'forTime':
        return (
          <div className="space-y-4">
            {/* Configuration Card */}
            <div className="bg-gray-700/50 rounded-xl p-3 sm:p-5 shadow-lg space-y-4">
              <label className="text-sm font-medium text-gray-300 block">Configuration</label>
              
              {/* Time Cap */}
              <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                <label className="text-xs text-gray-400 block mb-3 text-center">Time Cap</label>
                <div className="flex justify-center mb-3">
                  <TappableTime
                    value={config.timeCapMinutes * 60}
                    onChange={(seconds) => updateConfig({ timeCapMinutes: Math.floor(seconds / 60) })}
                    size="xl"
                    maxMinutes={60}
                    autoFocus={focusField === 'main-time' && config.type === 'forTime'}
                  />
                </div>
                
                {/* Quick Time Cap Presets */}
                <div className="grid grid-cols-5 gap-2">
                  {[600, 900, 1200, 1800, 2400].map((seconds) => (
                    <button
                      key={seconds}
                      onClick={() => updateConfig({ timeCapMinutes: Math.floor(seconds / 60) })}
                      className={`p-2 rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md active:scale-95 ${
                        config.timeCapMinutes * 60 === seconds 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {seconds / 60}m
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Rounds */}
              <div className="bg-gray-800 rounded-xl p-3 sm:p-4">
                <label className="text-xs text-gray-400 block mb-2 text-center">Rounds to Complete</label>
                <div className="flex justify-center">
                  <TappableNumber
                    value={config.rounds || 3}
                    onChange={(rounds) => updateConfig({ rounds })}
                    suffix="rounds"
                    min={1}
                    max={100}
                    size="lg"
                  />
                </div>
              </div>
            </div>
            
            {/* Info Card */}
            <div className="bg-gray-700/50/50 rounded-lg p-3 border border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                Complete {config.rounds || 3} rounds as fast as possible
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                Time cap: {config.timeCapMinutes} minutes
              </p>
            </div>
          </div>
        );
      
      case 'intervals':
        return (
          <div className="space-y-4">
            <AdvancedIntervalEditor 
              blocks={config.blocks || [{
                id: Date.now().toString(),
                name: 'Workout',
                intervals: [
                  { name: 'Work', duration: 30, type: 'work' },
                  { name: 'Rest', duration: 30, type: 'rest' }
                ],
                rounds: 5
              }]}
              onChange={(blocks) => updateConfig({ blocks, useBlocks: true })}
            />
            
            {/* Info Card */}
            <div className="bg-gray-700/50/50 rounded-lg p-3 border border-gray-700">
              <p className="text-xs text-gray-500 text-center italic">
                💡 Tip: Use presets or create custom blocks for complex workouts
              </p>
            </div>
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
          onClickTime={() => setShowSettings(true)}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />

        {/* Animated Settings Modal */}
        <div className={`fixed inset-0 z-40 ${showSettings ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          {/* Backdrop with fade animation */}
          <div 
            className={`absolute inset-0 bg-black backdrop-blur-sm transition-opacity duration-500 ${
              showSettings ? 'opacity-60' : 'opacity-0'
            }`}
            onClick={() => setShowSettings(false)}
          />
          
          {/* Settings Panel - Smooth slide from bottom */}
          <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
            <div 
              className={`relative bg-gray-800 rounded-3xl shadow-2xl w-full max-w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto transform transition-transform ${
                showSettings 
                  ? 'translate-y-0 duration-300 ease-out' 
                  : 'translate-y-[100vh] duration-300 ease-in'
              }`}
            >
          <div className="p-4 sm:p-6">
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
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Timer Type</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {TIMER_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => changeTimerType(type.id)}
                    className={`p-3 sm:p-4 rounded-xl flex flex-col items-center transition-all shadow-lg hover:shadow-xl ${
                      config.type === type.id 
                        ? 'bg-gray-600 text-white scale-105 shadow-xl' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{type.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Advanced Settings Toggle - Very Subtle */}
            <div className="mb-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors flex items-center gap-1"
              >
                <svg 
                  className={`w-3 h-3 transition-transform ${
                    showAdvanced ? 'rotate-90' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Advanced
              </button>
              
              {/* Hidden Advanced Settings */}
              {showAdvanced && (
                <div className="mt-3 p-4 bg-gray-700/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Pre-timer countdown</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {config.countdownEnabled ? `${config.countdownTime || 10}s` : 'Off'}
                      </span>
                      <button
                        onClick={() => updateConfig({ 
                          countdownEnabled: !config.countdownEnabled 
                        })}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          config.countdownEnabled ? 'bg-gray-600' : 'bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-gray-400 transition-transform ${
                            config.countdownEnabled ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  {config.countdownEnabled && (
                    <div className="mt-3">
                      <input
                        type="number"
                        value={config.countdownTime || 10}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 10;
                          updateConfig({ countdownTime: Math.min(60, Math.max(3, val)) });
                        }}
                        className="w-16 text-center bg-gray-700 rounded px-2 py-1 text-sm"
                        min="3"
                        max="60"
                      />
                      <span className="ml-2 text-xs text-gray-400">seconds</span>
                    </div>
                  )}
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
        </div>
      </div>
    </TimerProvider>
  );
}

/**
 * Main App Component
 * Wrapped with providers and error boundaries
 */
function App() {
  return (
    <TimerErrorBoundary>
      <ThemeProvider defaultTheme="charcoal">
        <AppContent />
      </ThemeProvider>
    </TimerErrorBoundary>
  );
}

export default App;
