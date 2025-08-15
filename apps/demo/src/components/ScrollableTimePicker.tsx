import React, { useRef, useEffect, useState } from 'react';

interface ScrollableTimePickerProps {
  value: number; // in seconds
  onChange: (seconds: number) => void;
  label?: string;
}

export function ScrollableTimePicker({ value, onChange, label }: ScrollableTimePickerProps) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState<'minutes' | 'seconds' | null>(null);
  
  const handleScroll = (type: 'minutes' | 'seconds', element: HTMLDivElement) => {
    const itemHeight = 48;
    const scrollTop = element.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    
    // Snap to the nearest value after scrolling stops
    clearTimeout((element as any).scrollTimeout);
    (element as any).scrollTimeout = setTimeout(() => {
      element.scrollTop = index * itemHeight;
    }, 50);
    
    if (type === 'minutes') {
      const newMinutes = Math.max(0, Math.min(99, index));
      onChange(newMinutes * 60 + seconds);
    } else {
      const newSeconds = Math.max(0, Math.min(59, index));
      onChange(minutes * 60 + newSeconds);
    }
  };
  
  const scrollToValue = (element: HTMLDivElement | null, value: number) => {
    if (element) {
      const itemHeight = 48;
      element.scrollTop = value * itemHeight;
    }
  };
  
  useEffect(() => {
    scrollToValue(minuteRef.current, minutes);
    scrollToValue(secondRef.current, seconds);
  }, []);
  
  const renderNumbers = (max: number, current: number) => {
    const numbers = [];
    for (let i = 0; i <= max; i++) {
      numbers.push(
        <div
          key={i}
          className={`h-12 flex items-center justify-center text-2xl font-mono transition-all ${
            i === current
              ? 'text-white font-bold scale-110'
              : 'text-gray-500'
          }`}
        >
          {i.toString().padStart(2, '0')}
        </div>
      );
    }
    return numbers;
  };
  
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-3 text-gray-300">{label}</label>}
      
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 shadow-inner">
        <div className="flex items-center justify-center gap-4">
          {/* Minutes */}
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-gray-700/30 rounded-xl pointer-events-none z-10"></div>
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-gray-800 to-transparent pointer-events-none z-20"></div>
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none z-20"></div>
            
            <div
              ref={minuteRef}
              className="h-36 w-16 overflow-y-scroll scrollbar-hide"
              onScroll={(e) => handleScroll('minutes', e.currentTarget)}
              onTouchStart={() => setIsDragging('minutes')}
              onTouchEnd={() => setIsDragging(null)}
            >
              <div className="py-12">
                {renderNumbers(99, minutes)}
              </div>
            </div>
            <span className="text-xs text-gray-400 text-center block mt-1">MIN</span>
          </div>
          
          <span className="text-3xl font-bold text-gray-400">:</span>
          
          {/* Seconds */}
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-gray-700/30 rounded-xl pointer-events-none z-10"></div>
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-gray-800 to-transparent pointer-events-none z-20"></div>
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none z-20"></div>
            
            <div
              ref={secondRef}
              className="h-36 w-16 overflow-y-scroll scrollbar-hide"
              onScroll={(e) => handleScroll('seconds', e.currentTarget)}
              onTouchStart={() => setIsDragging('seconds')}
              onTouchEnd={() => setIsDragging(null)}
            >
              <div className="py-12">
                {renderNumbers(59, seconds)}
              </div>
            </div>
            <span className="text-xs text-gray-400 text-center block mt-1">SEC</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export function QuickTimeButtons({ onSelect, presets = [60, 180, 300, 600, 900] }: {
  onSelect: (seconds: number) => void;
  presets?: number[];
}) {
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
          className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          {formatPreset(seconds)}
        </button>
      ))}
    </div>
  );
}