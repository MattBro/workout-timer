import React from 'react';
import * as Slider from '@radix-ui/react-slider';

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
          <Slider.Root
            value={[value]}
            min={min}
            max={max}
            step={1}
            onValueChange={(vals) => onChange(vals[0])}
            className="relative flex items-center select-none touch-pan-x w-full h-8"
            aria-label={label || 'Rounds'}
          >
            <Slider.Track className="bg-gray-700 relative grow rounded-full h-2">
              <Slider.Range className="absolute h-full rounded-full bg-gray-400" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-6 h-6 bg-white rounded-full shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              style={{ touchAction: 'none' }}
            />
          </Slider.Root>
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
