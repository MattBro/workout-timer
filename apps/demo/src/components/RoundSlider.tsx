import React from 'react';

interface RoundSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export function RoundSlider({ value, onChange, min = 1, max = 30, label }: RoundSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-3 text-gray-300">{label}</label>}
      <div className="space-y-3">
        <div className="text-center bg-gray-600/30 rounded-xl py-2 shadow-inner">
          <span className="text-4xl font-bold">{value}</span>
          <span className="text-lg text-gray-400 ml-2">rounds</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer shadow-inner slider"
            style={{
              background: `linear-gradient(to right, #6b7280 0%, #6b7280 ${percentage}%, #4b5563 ${percentage}%, #4b5563 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>

        {/* Quick select buttons */}
        <div className="flex gap-2 justify-center flex-wrap">
          {[5, 10, 15, 20, 25].map((preset) => (
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