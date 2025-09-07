import { useState, useEffect } from 'react';
import { NumberPickerModal } from './NumberPickerModal';

interface TappableNumberProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  suffix?: string;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  autoFocus?: boolean;
}

export function TappableNumber({
  value,
  onChange,
  label,
  suffix = '',
  min = 0,
  max = 999,
  size = 'md',
  autoFocus = false
}: TappableNumberProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (autoFocus) setShowModal(true);
  }, [autoFocus]);

  const sizeClasses = {
    sm: 'text-xl sm:text-2xl font-bold',
    md: 'text-3xl sm:text-4xl font-bold',
    lg: 'text-4xl sm:text-5xl font-bold'
  };

  return (
    <div className="inline-block text-center">
      {label && <div className="text-sm text-gray-400 mb-1">{label}</div>}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all active:scale-95 shadow-md"
      >
        <span className={`tabular-nums ${sizeClasses[size]}`}>{value}</span>
        {suffix && <span className="text-sm text-gray-400 ml-1">{suffix}</span>}
      </button>
      <NumberPickerModal
        isOpen={showModal}
        value={value}
        onChange={(v) => onChange(Math.max(min, Math.min(max, v)))}
        onClose={() => setShowModal(false)}
        min={min}
        max={max}
        suffix={suffix}
        label={label}
      />
    </div>
  );
}
