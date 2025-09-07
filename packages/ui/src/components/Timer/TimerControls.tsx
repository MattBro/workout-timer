import { useTimerContext, TimerState } from '@workout-timer/react';

export function TimerControls() {
  const { timer, snapshot, timerType, handleRoundComplete } = useTimerContext();
  if (!snapshot || !timer) return null;

  const renderIdleControls = () => (
    <button
      onClick={() => timer.start()}
      className="col-span-2 bg-white text-black py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all active:scale-95 transform"
    >
      START
    </button>
  );

  const renderRunningControls = () => (
    <>
      <button
        onClick={() => timer.pause()}
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
          onClick={() => timer.stop()}
          className="bg-red-900/30 backdrop-blur py-6 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all active:scale-95 transform"
        >
          STOP
        </button>
      )}
    </>
  );

  const renderPausedControls = () => (
    <>
      <button
        onClick={() => timer.resume()}
        className="bg-white text-black py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all active:scale-95 transform"
      >
        RESUME
      </button>
      <button
        onClick={() => timer.reset()}
        className="bg-black/20 backdrop-blur py-6 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all active:scale-95 transform"
      >
        RESET
      </button>
    </>
  );

  const renderFinishedControls = () => (
    <button
      onClick={() => timer.reset()}
      className="col-span-2 bg-white text-black py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all active:scale-95 transform"
    >
      RESET
    </button>
  );

  return (
    <div className="p-6 pb-safe">
      <div className="max-w-md mx-auto w-full grid grid-cols-2 gap-4">
        {snapshot.state === TimerState.IDLE && renderIdleControls()}
        {snapshot.state === TimerState.RUNNING && renderRunningControls()}
        {snapshot.state === TimerState.PAUSED && renderPausedControls()}
        {(snapshot.state === TimerState.FINISHED || snapshot.state === TimerState.CANCELLED) && renderFinishedControls()}
      </div>
    </div>
  );
}
