import React, { useState, useEffect } from 'react';
import { createTimer, TimerSnapshot, TimerState, CountdownWrapper } from '@workout-timer/core';
import { ScrollableTimePicker, QuickTimeButtons } from './components/ScrollableTimePicker';
import { RoundSlider } from './components/RoundSlider';
import { RoundPicker } from './components/RoundPicker';
import { IntervalEditor } from './components/IntervalEditor';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const TIMER_TYPES = [
  { id: 'amrap', name: 'AMRAP', icon: '🔄' },
  { id: 'emom', name: 'EMOM', icon: '⏱️' },
  { id: 'tabata', name: 'Tabata', icon: '💪' },
  { id: 'intervals', name: 'Intervals', icon: '📊' },
  { id: 'forTime', name: 'For Time', icon: '🏃' }
];

const DEFAULT_INTERVALS = [
  { name: 'Prepare', duration: 10, type: 'prep' as const },
  { name: 'Work', duration: 45, type: 'work' as const },
  { name: 'Rest', duration: 15, type: 'rest' as const }
];

const TABATA_PRESETS = [
  { name: 'Classic', workTime: 20, restTime: 10, rounds: 8 },
  { name: 'Beginner', workTime: 20, restTime: 20, rounds: 6 },
  { name: 'Advanced', workTime: 30, restTime: 10, rounds: 10 },
  { name: 'Endurance', workTime: 45, restTime: 15, rounds: 6 }
];

function App() {
  const [timerType, setTimerType] = useState<string>('amrap');
  const [timer, setTimer] = useState<any>(null);
  const [snapshot, setSnapshot] = useState<TimerSnapshot | null>(null);
  const [roundCount, setRoundCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Timer settings
  const [duration, setDuration] = useState(300); // 5 minutes for AMRAP
  const [rounds, setRounds] = useState(10); // For EMOM and others
  const [emomInterval, setEmomInterval] = useState(60); // EMOM interval duration
  const [timeCapMinutes, setTimeCapMinutes] = useState(20); // For Time
  const [forTimeRounds, setForTimeRounds] = useState(3); // Rounds for For Time
  const [intervals, setIntervals] = useState(DEFAULT_INTERVALS);
  const [intervalRounds, setIntervalRounds] = useState(3);
  const [countdownTime, setCountdownTime] = useState(10); // Countdown before start
  const [countdownEnabled, setCountdownEnabled] = useState(true);
  
  // Tabata settings
  const [tabataWorkTime, setTabataWorkTime] = useState(20);
  const [tabataRestTime, setTabataRestTime] = useState(10);
  const [tabataRounds, setTabataRounds] = useState(8);
  const [tabataSets, setTabataSets] = useState(1);

  const createNewTimer = () => {
    if (timer) {
      timer.reset();
    }

    let config: any;
    
    switch (timerType) {
      case 'amrap':
        config = { type: 'amrap' as const, duration };
        break;
      case 'emom':
        config = { type: 'emom' as const, rounds, interval: emomInterval };
        break;
      case 'tabata':
        config = { 
          type: 'tabata' as const, 
          workTime: tabataWorkTime, 
          restTime: tabataRestTime, 
          rounds: tabataRounds,
          sets: tabataSets
        };
        break;
      case 'intervals':
        config = { 
          type: 'intervals' as const, 
          intervals,
          rounds: intervalRounds
        };
        break;
      case 'forTime':
        config = { 
          type: 'forTime' as const, 
          timeCapMinutes,
          rounds: forTimeRounds
        };
        break;
      default:
        config = { type: 'amrap' as const, duration: 300 };
    }

    let newTimer = createTimer(config);
    
    // Wrap with countdown if enabled
    if (countdownEnabled && countdownTime > 0) {
      newTimer = new CountdownWrapper(newTimer, countdownTime);
    }
    
    newTimer.on('tick', (snap: TimerSnapshot) => {
      setSnapshot(snap);
    });
    
    newTimer.on('stateChange', () => {
      setSnapshot(newTimer.getSnapshot());
    });

    newTimer.on('finish', () => {
      // No alert, just let the UI show completion
    });

    newTimer.on('roundStart', (round: number) => {
      console.log(`Round ${round} started!`);
    });
    
    newTimer.on('workStart', () => {
      console.log('Work phase started!');
    });
    
    newTimer.on('restStart', () => {
      console.log('Rest phase started!');
    });

    newTimer.setSoundEnabled(soundEnabled);
    setTimer(newTimer);
    setSnapshot(newTimer.getSnapshot());
    setRoundCount(0);
  };

  useEffect(() => {
    createNewTimer();
    return () => {
      if (timer) {
        timer.reset();
      }
    };
  }, [
    timerType, duration, rounds, emomInterval, timeCapMinutes, forTimeRounds,
    intervals, intervalRounds, tabataWorkTime, tabataRestTime, tabataRounds, tabataSets,
    countdownEnabled, countdownTime
  ]);
  
  useEffect(() => {
    if (timer) {
      timer.setSoundEnabled(soundEnabled);
    }
  }, [soundEnabled, timer]);

  const handleRoundComplete = () => {
    if (timer) {
      if (timerType === 'amrap') {
        timer.incrementRound();
        setRoundCount(roundCount + 1);
      } else if (timerType === 'forTime') {
        timer.completeRound();
      }
    }
  };

  const getPhaseColor = () => {
    return 'from-gray-700 to-gray-800';
  };

  const getDisplayTime = () => {
    if (!snapshot) return '00:00';
    
    const snap: any = snapshot;
    if (snap.isCountdown) {
      const seconds = Math.ceil(snap.countdownRemaining / 1000);
      return seconds.toString();
    }
    
    if (timerType === 'forTime') {
      return formatTime(snapshot.elapsed);
    } else if (timerType === 'tabata' || timerType === 'intervals') {
      return formatTime(snapshot.intervalRemaining || snapshot.remaining);
    }
    
    return formatTime(snapshot.remaining);
  };

  const getPhaseText = () => {
    const snap: any = snapshot;
    if (!snap) return '';
    
    if (snap.isCountdown) return '🚀 GET READY!';
    if (snap.state === TimerState.FINISHED) return '🎉 Complete!';
    if (snap.state === TimerState.PAUSED) return '⏸️ Paused';
    if (snap.state === TimerState.IDLE) return 'Ready';
    
    if (timerType === 'tabata' && snap.isWorking !== undefined) {
      return snap.isWorking ? '💪 WORK' : '😌 REST';
    }
    
    if (timerType === 'intervals' && snap.intervalName) {
      return snap.intervalName.toUpperCase();
    }
    
    return '';
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Main Timer Display - Full Screen */}
      <div className={`flex-1 bg-gradient-to-br ${getPhaseColor()} transition-all duration-500 flex flex-col relative shadow-2xl`}>
        {/* Top Controls */}
        <div className="p-4 flex justify-between items-center">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 rounded-full bg-black/20 backdrop-blur shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 rounded-full bg-black/20 backdrop-blur shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <span className="text-2xl">{soundEnabled ? '🔊' : '🔇'}</span>
          </button>
        </div>

        {/* Center Timer Display */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Phase Text */}
          <div className="text-2xl md:text-4xl font-bold mb-4 animate-pulse">
            {getPhaseText()}
          </div>
          
          {/* Main Time */}
          <div className={`font-mono font-bold mb-8 tracking-wider ${
            (snapshot as any)?.isCountdown 
              ? 'text-9xl md:text-[12rem]' 
              : 'text-7xl md:text-9xl'
          }`}>
            {getDisplayTime()}
          </div>
          
          {/* Round Info */}
          {snapshot && (
            <div className="text-xl md:text-2xl opacity-90">
              {timerType === 'amrap' && (
                <div>Rounds: {roundCount}</div>
              )}
              
              {(timerType === 'emom' || timerType === 'tabata') && snapshot.currentRound && (
                <div>Round {snapshot.currentRound} of {snapshot.totalRounds}</div>
              )}
              
              {timerType === 'intervals' && snapshot.currentRound && (
                <div>Round {snapshot.currentRound} of {(snapshot as any).totalRounds || 1}</div>
              )}
              
              {timerType === 'forTime' && (
                <div>
                  <div>Round {snapshot.currentRound} of {forTimeRounds}</div>
                  <button
                    onClick={handleRoundComplete}
                    className="mt-2 px-4 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-all"
                  >
                    Complete Round
                  </button>
                </div>
              )}
              
              {timerType === 'tabata' && (snapshot as any).currentSet > 1 && (
                <div className="text-sm mt-1">Set {(snapshot as any).currentSet} of {tabataSets}</div>
              )}
            </div>
          )}
          
          {/* Progress Bar */}
          {snapshot && (
            <div className="w-full max-w-md mt-8">
              <div className="h-3 bg-black/20 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-white/90 rounded-full transition-all duration-100 shadow-sm"
                  style={{ width: `${snapshot.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Control Buttons */}
        <div className="p-6 pb-safe">
          <div className="max-w-md mx-auto w-full grid grid-cols-2 gap-4">
            {snapshot?.state === TimerState.IDLE && (
              <button
                onClick={() => timer?.start()}
                className="col-span-2 bg-white text-black py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all active:scale-95 transform"
              >
                START
              </button>
            )}
            
            {snapshot?.state === TimerState.RUNNING && (
              <>
                <button
                  onClick={() => timer?.pause()}
                  className="bg-black/20 backdrop-blur py-6 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all active:scale-95 transform"
                >
                  PAUSE
                </button>
                
                {(timerType === 'amrap' || timerType === 'forTime') ? (
                  <button
                    onClick={handleRoundComplete}
                    className="bg-white text-black py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all active:scale-95 transform"
                  >
                    {timerType === 'amrap' ? 'LAP' : 'NEXT'}
                  </button>
                ) : (
                  <button
                    onClick={() => timer?.stop()}
                    className="bg-red-900/30 backdrop-blur py-6 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all active:scale-95 transform"
                  >
                    STOP
                  </button>
                )}
              </>
            )}
            
            {snapshot?.state === TimerState.PAUSED && (
              <>
                <button
                  onClick={() => timer?.resume()}
                  className="bg-white text-black py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all active:scale-95 transform"
                >
                  RESUME
                </button>
                <button
                  onClick={() => timer?.reset()}
                  className="bg-black/20 backdrop-blur py-6 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all active:scale-95 transform"
                >
                  RESET
                </button>
              </>
            )}
            
            {(snapshot?.state === TimerState.FINISHED || snapshot?.state === TimerState.CANCELLED) && (
              <button
                onClick={() => timer?.reset()}
                className="col-span-2 bg-white text-black py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all active:scale-95 transform"
              >
                RESET
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for closing settings */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowSettings(false)}
        />
      )}
      
      {/* Settings Panel - Slides up from bottom */}
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
                  onClick={() => {
                    setTimerType(type.id);
                  }}
                  className={`p-4 rounded-xl flex flex-col items-center transition-all shadow-lg hover:shadow-xl ${
                    timerType === type.id 
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
                onClick={() => setCountdownEnabled(!countdownEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  countdownEnabled ? 'bg-gray-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    countdownEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {countdownEnabled && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Countdown Duration</label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setCountdownTime(Math.max(0, countdownTime - 5))}
                    className="p-2 text-xl hover:bg-gray-600 rounded-lg shadow-md active:scale-95"
                  >
                    -5
                  </button>
                  <div className="text-3xl font-bold w-20 text-center">{countdownTime}s</div>
                  <button
                    onClick={() => setCountdownTime(Math.min(60, countdownTime + 5))}
                    className="p-2 text-xl hover:bg-gray-600 rounded-lg shadow-md active:scale-95"
                  >
                    +5
                  </button>
                </div>
                <div className="flex gap-2 justify-center flex-wrap mt-3">
                  {[3, 5, 10, 15, 20].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setCountdownTime(preset)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95 ${
                        countdownTime === preset
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
            {timerType === 'amrap' && (
              <div>
                <ScrollableTimePicker 
                  value={duration} 
                  onChange={setDuration}
                  label="Timer Duration"
                />
                <QuickTimeButtons 
                  onSelect={setDuration}
                  presets={[180, 300, 600, 900, 1200]}
                />
              </div>
            )}
            
            {timerType === 'emom' && (
              <div className="space-y-6">
                <RoundPicker 
                  value={rounds}
                  onChange={setRounds}
                  label="Number of Rounds"
                  min={1}
                  max={99}
                />
                
                <div>
                  <ScrollableTimePicker 
                    value={emomInterval} 
                    onChange={setEmomInterval}
                    label="Interval Duration"
                  />
                  <QuickTimeButtons 
                    onSelect={setEmomInterval}
                    presets={[30, 45, 60, 90, 120]}
                  />
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Start new round every {emomInterval} seconds
                  </p>
                </div>
              </div>
            )}
            
            {timerType === 'forTime' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Time Cap</label>
                  <ScrollableTimePicker 
                    value={timeCapMinutes * 60} 
                    onChange={(seconds) => setTimeCapMinutes(Math.floor(seconds / 60))}
                  />
                  <QuickTimeButtons 
                    onSelect={(seconds) => setTimeCapMinutes(Math.floor(seconds / 60))}
                    presets={[600, 900, 1200, 1800, 2400]}
                  />
                </div>
                
                <RoundPicker 
                  value={forTimeRounds}
                  onChange={setForTimeRounds}
                  label="Number of Rounds to Complete"
                  min={1}
                  max={99}
                />
              </div>
            )}
            
            {timerType === 'tabata' && (
              <div className="space-y-6">
                {/* Preset buttons */}
                <div>
                  <label className="block text-sm font-medium mb-3">Quick Presets</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TABATA_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setTabataWorkTime(preset.workTime);
                          setTabataRestTime(preset.restTime);
                          setTabataRounds(preset.rounds);
                        }}
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
                        onClick={() => setTabataWorkTime(Math.max(5, tabataWorkTime - 5))}
                        className="p-2 text-xl hover:bg-gray-600 rounded-lg shadow-md active:scale-95"
                      >
                        -
                      </button>
                      <div className="text-3xl font-bold w-16 text-center">{tabataWorkTime}s</div>
                      <button
                        onClick={() => setTabataWorkTime(Math.min(60, tabataWorkTime + 5))}
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
                        onClick={() => setTabataRestTime(Math.max(5, tabataRestTime - 5))}
                        className="p-2 text-xl hover:bg-gray-600 rounded-lg shadow-md active:scale-95"
                      >
                        -
                      </button>
                      <div className="text-3xl font-bold w-16 text-center">{tabataRestTime}s</div>
                      <button
                        onClick={() => setTabataRestTime(Math.min(60, tabataRestTime + 5))}
                        className="p-2 text-xl hover:bg-gray-600 rounded-lg shadow-md active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                <RoundSlider 
                  value={tabataRounds}
                  onChange={setTabataRounds}
                  label="Rounds per Set"
                  min={1}
                  max={20}
                />
                
                <RoundSlider 
                  value={tabataSets}
                  onChange={setTabataSets}
                  label="Number of Sets"
                  min={1}
                  max={5}
                />
              </div>
            )}
            
            {timerType === 'intervals' && (
              <div className="space-y-6">
                <RoundSlider 
                  value={intervalRounds}
                  onChange={setIntervalRounds}
                  label="Number of Rounds"
                  min={1}
                  max={10}
                />
                
                <IntervalEditor 
                  intervals={intervals}
                  onChange={setIntervals}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;