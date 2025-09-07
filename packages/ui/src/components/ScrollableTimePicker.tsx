import { useRef, useEffect, useMemo } from 'react';

interface ScrollableTimePickerProps {
  value: number; // seconds
  onChange: (seconds: number) => void;
  label?: string;
}

export function ScrollableTimePicker({ value, onChange, label }: ScrollableTimePickerProps) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  //
  const itemHeight = 48;
  const debouncers = useRef<Record<string, any>>({});
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const handleScroll = (type: 'minutes' | 'seconds', el: HTMLDivElement) => {
    const index = Math.round(el.scrollTop / itemHeight);
    if (type === 'minutes') {
      const newMinutes = clamp(index, 0, 99);
      clearTimeout(debouncers.current['minutes']);
      debouncers.current['minutes'] = setTimeout(() => onChange(newMinutes * 60 + seconds), 50);
    } else {
      const newSeconds = clamp(index, 0, 59);
      clearTimeout(debouncers.current['seconds']);
      debouncers.current['seconds'] = setTimeout(() => onChange(minutes * 60 + newSeconds), 50);
    }
  };

  const scrollToValue = (el: HTMLDivElement | null, v: number) => {
    if (el) el.scrollTop = v * itemHeight;
  };
  useEffect(() => {
    scrollToValue(minuteRef.current, minutes);
    scrollToValue(secondRef.current, seconds);
  }, []);

  const scrollContainerClasses = useMemo(() => 'h-36 w-16 overflow-y-scroll scrollbar-hide touch-pan-y overscroll-contain', []);

  const renderNumbers = (max: number, current: number) => {
    const items = [];
    for (let i = 0; i <= max; i++) {
      items.push(
        <div key={i} className={`h-12 flex items-center justify-center text-2xl font-mono transition-all ${i === current ? 'text-white font-bold scale-110' : 'text-gray-500'}`} style={{ scrollSnapAlign: 'center' }}>
          {i.toString().padStart(2, '0')}
        </div>
      );
    }
    return items;
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-3 text-gray-300">{label}</label>}
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 shadow-inner">
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-gray-700/30 rounded-xl pointer-events-none z-10" />
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-gray-800 to-transparent pointer-events-none z-20" />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none z-20" />
            <div
              ref={minuteRef}
              className={scrollContainerClasses}
              onScroll={(e) => handleScroll('minutes', e.currentTarget)}
              
              style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'y mandatory' }}
            >
              <div className="py-12">{renderNumbers(99, minutes)}</div>
            </div>
            <span className="text-xs text-gray-400 text-center block mt-1">MIN</span>
          </div>

          <span className="text-3xl font-bold text-gray-400">:</span>

          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-gray-700/30 rounded-xl pointer-events-none z-10" />
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-gray-800 to-transparent pointer-events-none z-20" />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none z-20" />
            <div
              ref={secondRef}
              className={scrollContainerClasses}
              onScroll={(e) => handleScroll('seconds', e.currentTarget)}
              
              style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'y mandatory' }}
            >
              <div className="py-12">{renderNumbers(59, seconds)}</div>
            </div>
            <span className="text-xs text-gray-400 text-center block mt-1">SEC</span>
          </div>
        </div>
      </div>
      {/* styles intentionally omitted in library build to avoid styled-jsx */}
    </div>
  );
}

export function QuickTimeButtons({ onSelect, presets = [60, 180, 300, 600, 900] }: { onSelect: (seconds: number) => void; presets?: number[]; }) {
  const formatPreset = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${mins}min`;
  };
  return (
    <div className="flex gap-2 justify-center flex-wrap mt-4">
      {presets.map((seconds) => (
        <button key={seconds} onClick={() => onSelect(seconds)} className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95">
          {formatPreset(seconds)}
        </button>
      ))}
    </div>
  );
}
