
interface Interval {
  name: string;
  duration: number;
  type: 'work' | 'rest' | 'prep';
}

interface IntervalEditorProps {
  intervals: Interval[];
  onChange: (intervals: Interval[]) => void;
}

const INTERVAL_TYPES = [
  { id: 'work', label: 'Work', icon: '💪', color: 'bg-rose-600' },
  { id: 'rest', label: 'Rest', icon: '😌', color: 'bg-emerald-600' },
  { id: 'prep', label: 'Prep', icon: '🚀', color: 'bg-amber-600' }
];

const PRESET_WORKOUTS = [
  {
    name: 'Classic HIIT',
    intervals: [
      { name: 'High Intensity', duration: 30, type: 'work' as const },
      { name: 'Recovery', duration: 30, type: 'rest' as const }
    ]
  },
  {
    name: 'Tabata Style',
    intervals: [
      { name: 'Sprint', duration: 20, type: 'work' as const },
      { name: 'Rest', duration: 10, type: 'rest' as const }
    ]
  },
  {
    name: 'Strength Circuit',
    intervals: [
      { name: 'Exercise', duration: 45, type: 'work' as const },
      { name: 'Transition', duration: 15, type: 'rest' as const }
    ]
  },
  {
    name: 'Boxing Rounds',
    intervals: [
      { name: 'Round', duration: 180, type: 'work' as const },
      { name: 'Break', duration: 60, type: 'rest' as const }
    ]
  }
];

export function IntervalEditor({ intervals, onChange }: IntervalEditorProps) {
  const addInterval = () => {
    const lastInterval = intervals[intervals.length - 1];
    const nextType = !lastInterval || lastInterval.type === 'rest' ? 'work' : 'rest';
    const nextName = nextType === 'work' ? 'Work' : 'Rest';
    const nextDuration = nextType === 'work' ? 30 : 15;
    onChange([...intervals, { name: nextName, duration: nextDuration, type: nextType as 'work' | 'rest' | 'prep' }]);
  };

  const removeInterval = (index: number) => onChange(intervals.filter((_, i) => i !== index));
  const updateInterval = (index: number, field: keyof Interval, value: any) => { const next = [...intervals]; next[index] = { ...next[index], [field]: value }; onChange(next); };
  const moveInterval = (index: number, dir: 'up' | 'down') => { const next = [...intervals]; const ni = dir === 'up' ? index - 1 : index + 1; if (ni >= 0 && ni < intervals.length) { [next[index], next[ni]] = [next[ni], next[index]]; onChange(next); } };
  const applyPreset = (preset: typeof PRESET_WORKOUTS[0]) => onChange(preset.intervals);
  const getTotalDuration = () => intervals.reduce((s, i) => s + i.duration, 0);
  const formatDuration = (s: number) => { const m = Math.floor(s / 60); const sec = s % 60; return m > 0 ? `${m}:${sec.toString().padStart(2,'0')}` : `${sec}s`; };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">Quick Templates</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_WORKOUTS.map((preset) => (
            <button key={preset.name} onClick={() => applyPreset(preset)} className="p-2 sm:p-3 bg-gray-600/50 hover:bg-gray-500/50 rounded-lg text-xs sm:text-sm transition-all shadow-md hover:shadow-lg active:scale-95">
              <div className="font-semibold">{preset.name}</div>
              <div className="text-xs text-gray-400 mt-1">{preset.intervals.map(i => formatDuration(i.duration)).join(' → ')}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gray-700/30 rounded-xl p-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {intervals.map((interval, index) => {
            const type = INTERVAL_TYPES.find(t => t.id === interval.type)!;
            const widthPercent = (interval.duration / getTotalDuration()) * 100;
            return (
              <div key={index} className={`${type.color} rounded-lg px-2 py-1 text-xs font-medium text-white shadow-md`} style={{ minWidth: `${Math.max(widthPercent, 15)}%` }}>
                <div className="flex items-center gap-1"><span>{type.icon}</span><span>{formatDuration(interval.duration)}</span></div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-sm text-gray-400 mt-2">Total: {formatDuration(getTotalDuration())}</div>
      </div>
      <div className="space-y-2">
        {intervals.map((interval, index) => {
          const type = INTERVAL_TYPES.find(t => t.id === interval.type)!;
          return (
            <div key={index} className="bg-gray-600/50 rounded-xl p-3 sm:p-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xl sm:text-2xl">{type.icon}</span>
                  <input type="text" value={interval.name} onChange={(e) => updateInterval(index, 'name', e.target.value)} className="bg-gray-700 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium shadow-inner flex-1" placeholder="Interval name" />
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveInterval(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-500 rounded disabled:opacity-30 disabled:cursor-not-allowed">↑</button>
                  <button onClick={() => moveInterval(index, 'down')} disabled={index === intervals.length - 1} className="p-1 hover:bg-gray-500 rounded disabled:opacity-30 disabled:cursor-not-allowed">↓</button>
                  <button onClick={() => removeInterval(index)} className="p-1 text-red-400 hover:text-red-300 hover:bg-gray-500 rounded ml-2">✕</button>
                </div>
              </div>
              <div className="flex gap-1 sm:gap-2 mb-3">
                {INTERVAL_TYPES.map((t) => (
                  <button key={t.id} onClick={() => updateInterval(index, 'type', t.id as any)} className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all ${interval.type === t.id ? `${t.color} text-white shadow-lg` : 'bg-gray-700 hover:bg-gray-600'}`}>{t.label}</button>
                ))}
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <label className="text-xs sm:text-sm text-gray-400">Duration:</label>
                <button onClick={() => updateInterval(index, 'duration', Math.max(5, interval.duration - 5))} className="p-2 text-lg hover:bg-gray-500 rounded-lg shadow-md active:scale-95">-</button>
                <input type="number" value={interval.duration} onChange={(e) => { const val = parseInt(e.target.value) || 0; updateInterval(index, 'duration', Math.min(600, Math.max(1, val))); }} className="text-xl sm:text-2xl font-bold tabular-nums w-16 sm:w-20 text-center bg-gray-700 rounded-lg shadow-inner px-1 sm:px-2 py-1" />
                <span className="text-lg text-gray-400">s</span>
                <button onClick={() => updateInterval(index, 'duration', Math.min(600, interval.duration + 5))} className="p-2 text-lg hover:bg-gray-500 rounded-lg shadow-md active:scale-95">+</button>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={addInterval} className="w-full p-3 bg-gray-600/50 hover:bg-gray-500/50 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
        <span className="text-xl">+</span><span>Add Interval</span>
      </button>
      {intervals.length > 0 && (
        <div className="bg-gray-700/30 rounded-xl p-3 text-center"><div className="text-xs text-gray-400">{intervals.length} intervals × rounds = {formatDuration(getTotalDuration())} per round</div></div>
      )}
    </div>
  );
}
