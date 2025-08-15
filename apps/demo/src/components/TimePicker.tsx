import React from 'react';

interface TimePickerProps {
  value: number; // in seconds
  onChange: (seconds: number) => void;
  label?: string;
}

export function TimePicker({ value, onChange, label }: TimePickerProps) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  const handleMinutesChange = (newMinutes: number) => {
    const clampedMinutes = Math.max(0, Math.min(99, newMinutes));
    onChange(clampedMinutes * 60 + seconds);
  };

  const handleSecondsChange = (newSeconds: number) => {
    const clampedSeconds = Math.max(0, Math.min(59, newSeconds));
    onChange(minutes * 60 + clampedSeconds);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-3">{label}</label>}
      <div className="flex items-center justify-center gap-2">
        <div className="flex flex-col items-center">
          <button
            onClick={() => handleMinutesChange(minutes + 1)}
            className="p-2 text-2xl hover:bg-gray-700 rounded-lg active:scale-95"
          >
            ▲
          </button>
          <input
            type="number"
            value={minutes.toString().padStart(2, '0')}
            onChange={(e) => handleMinutesChange(parseInt(e.target.value) || 0)}
            className="w-16 h-16 text-3xl font-mono text-center bg-gray-700 rounded-lg"
            min="0"
            max="99"
          />
          <button
            onClick={() => handleMinutesChange(minutes - 1)}
            className="p-2 text-2xl hover:bg-gray-700 rounded-lg active:scale-95"
          >
            ▼
          </button>
          <span className="text-xs text-gray-400 mt-1">MIN</span>
        </div>
        
        <span className="text-3xl font-bold">:</span>
        
        <div className="flex flex-col items-center">
          <button
            onClick={() => handleSecondsChange(seconds + 1)}
            className="p-2 text-2xl hover:bg-gray-700 rounded-lg active:scale-95"
          >
            ▲
          </button>
          <input
            type="number"
            value={seconds.toString().padStart(2, '0')}
            onChange={(e) => handleSecondsChange(parseInt(e.target.value) || 0)}
            className="w-16 h-16 text-3xl font-mono text-center bg-gray-700 rounded-lg"
            min="0"
            max="59"
          />
          <button
            onClick={() => handleSecondsChange(seconds - 1)}
            className="p-2 text-2xl hover:bg-gray-700 rounded-lg active:scale-95"
          >
            ▼
          </button>
          <span className="text-xs text-gray-400 mt-1">SEC</span>
        </div>
      </div>
    </div>
  );
}

interface QuickTimeButtonsProps {
  onSelect: (seconds: number) => void;
  presets?: number[];
}

export function QuickTimeButtons({ onSelect, presets = [60, 180, 300, 600, 900] }: QuickTimeButtonsProps) {
  const formatPreset = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${mins}min`;
  };

  return (
    <div className="flex gap-2 justify-center flex-wrap mt-4">
      {presets.map((seconds) => (
        <button
          key={seconds}
          onClick={() => onSelect(seconds)}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
        >
          {formatPreset(seconds)}
        </button>
      ))}
    </div>
  );
}