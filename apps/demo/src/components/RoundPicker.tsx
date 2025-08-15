import React from 'react';

interface RoundPickerProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
}

export function RoundPicker({ value, onChange, label, min = 1, max = 99 }: RoundPickerProps) {
  const handleIncrement = () => {
    onChange(Math.min(max, value + 1));
  };

  const handleDecrement = () => {
    onChange(Math.max(min, value - 1));
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-3 text-gray-300">{label}</label>}
      
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 shadow-inner">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handleDecrement}
            className="p-3 text-3xl hover:bg-gray-600 rounded-xl shadow-md active:scale-95 transition-all"
          >
            -
          </button>
          
          <div className="text-center">
            <div className="text-5xl font-bold tabular-nums min-w-[100px]">
              {value}
            </div>
            <span className="text-sm text-gray-400">rounds</span>
          </div>
          
          <button
            onClick={handleIncrement}
            className="p-3 text-3xl hover:bg-gray-600 rounded-xl shadow-md active:scale-95 transition-all"
          >
            +
          </button>
        </div>
        
        {/* Quick presets */}
        <div className="flex gap-2 justify-center flex-wrap mt-4">
          {[3, 5, 10, 15, 21, 30].map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95 ${
                value === preset
                  ? 'bg-gray-500 text-white shadow-lg'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}