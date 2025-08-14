import React, { useState, useEffect } from 'react';
import { createTimer, TimerSnapshot, TimerState } from '@workout-timer/core';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function App() {
  const [timerType, setTimerType] = useState<'amrap' | 'emom'>('amrap');
  const [duration, setDuration] = useState(300); // 5 minutes
  const [rounds, setRounds] = useState(10);
  const [timer, setTimer] = useState<any>(null);
  const [snapshot, setSnapshot] = useState<TimerSnapshot | null>(null);
  const [roundCount, setRoundCount] = useState(0);

  const createNewTimer = () => {
    if (timer) {
      timer.reset();
    }

    const config = timerType === 'amrap' 
      ? { type: 'amrap' as const, duration }
      : { type: 'emom' as const, rounds, interval: 60 };

    const newTimer = createTimer(config);
    
    newTimer.on('tick', (snap: TimerSnapshot) => {
      setSnapshot(snap);
    });
    
    newTimer.on('stateChange', () => {
      setSnapshot(newTimer.getSnapshot());
    });

    newTimer.on('finish', () => {
      alert('Timer finished!');
    });

    newTimer.on('roundStart', (round: number) => {
      console.log(`Round ${round} started!`);
    });

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
  }, [timerType, duration, rounds]);

  const handleRoundComplete = () => {
    if (timer && timerType === 'amrap') {
      timer.incrementRound();
      setRoundCount(roundCount + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Workout Timer Demo</h1>
      
      {/* Timer Config */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Timer Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setTimerType('amrap')}
            className={`p-3 rounded ${timerType === 'amrap' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            AMRAP
          </button>
          <button
            onClick={() => setTimerType('emom')}
            className={`p-3 rounded ${timerType === 'emom' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            EMOM
          </button>
        </div>
        
        {timerType === 'amrap' ? (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        ) : (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Rounds</label>
            <input
              type="number"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
      </div>

      {/* Timer Display */}
      <div className="bg-white rounded-lg shadow p-8 mb-6">
        <div className="text-center">
          <div className="text-6xl font-mono font-bold mb-4">
            {snapshot && formatTime(
              timerType === 'amrap' ? snapshot.remaining : snapshot.elapsed
            )}
          </div>
          
          {snapshot && (
            <>
              <div className="text-lg text-gray-600 mb-4">
                State: <span className="font-semibold">{snapshot.state}</span>
              </div>
              
              {timerType === 'amrap' && (
                <div className="text-lg mb-4">
                  Rounds: <span className="font-bold">{roundCount}</span>
                </div>
              )}
              
              {timerType === 'emom' && snapshot.currentRound && (
                <div className="text-lg mb-4">
                  Round: <span className="font-bold">{snapshot.currentRound} / {snapshot.totalRounds}</span>
                  <div className="text-sm text-gray-600">
                    Interval: {formatTime(snapshot.intervalRemaining || 0)}
                  </div>
                </div>
              )}
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${snapshot.progress}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4">
          {snapshot?.state === TimerState.IDLE && (
            <button
              onClick={() => timer?.start()}
              className="col-span-2 bg-green-500 text-white p-4 rounded font-semibold hover:bg-green-600"
            >
              Start
            </button>
          )}
          
          {snapshot?.state === TimerState.RUNNING && (
            <>
              <button
                onClick={() => timer?.pause()}
                className="bg-yellow-500 text-white p-4 rounded font-semibold hover:bg-yellow-600"
              >
                Pause
              </button>
              {timerType === 'amrap' && (
                <button
                  onClick={handleRoundComplete}
                  className="bg-blue-500 text-white p-4 rounded font-semibold hover:bg-blue-600"
                >
                  Round Complete
                </button>
              )}
              {timerType === 'emom' && (
                <button
                  onClick={() => timer?.stop()}
                  className="bg-red-500 text-white p-4 rounded font-semibold hover:bg-red-600"
                >
                  Stop
                </button>
              )}
            </>
          )}
          
          {snapshot?.state === TimerState.PAUSED && (
            <>
              <button
                onClick={() => timer?.resume()}
                className="bg-green-500 text-white p-4 rounded font-semibold hover:bg-green-600"
              >
                Resume
              </button>
              <button
                onClick={() => timer?.reset()}
                className="bg-gray-500 text-white p-4 rounded font-semibold hover:bg-gray-600"
              >
                Reset
              </button>
            </>
          )}
          
          {(snapshot?.state === TimerState.FINISHED || snapshot?.state === TimerState.CANCELLED) && (
            <button
              onClick={() => timer?.reset()}
              className="col-span-2 bg-gray-500 text-white p-4 rounded font-semibold hover:bg-gray-600"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;