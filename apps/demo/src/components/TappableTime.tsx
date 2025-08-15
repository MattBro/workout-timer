/**
 * Tappable Time Component
 * Displays MM:SS format where minutes and seconds are separately tappable
 * @module TappableTime
 */

import React, { useState, useEffect } from 'react';
import { NumberPickerModal } from './NumberPickerModal';

interface TappableTimeProps {
  value: number; // Total seconds
  onChange: (value: number) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  maxMinutes?: number;
  autoFocus?: boolean;
}

export function TappableTime({
  value,
  onChange,
  label,
  size = 'md',
  maxMinutes = 99,
  autoFocus = false
}: TappableTimeProps) {
  const [showMinutesModal, setShowMinutesModal] = useState(false);
  const [showSecondsModal, setShowSecondsModal] = useState(false);
  
  useEffect(() => {
    if (autoFocus) {
      // Auto-open minutes modal when autoFocus is true
      setShowMinutesModal(true);
    }
  }, [autoFocus]);
  
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  
  const sizeClasses = {
    sm: 'text-base sm:text-lg font-semibold',
    md: 'text-xl sm:text-2xl font-bold',
    lg: 'text-2xl sm:text-3xl font-bold',
    xl: 'text-3xl sm:text-4xl font-bold'
  };
  
  const handleMinutesChange = (newMinutes: number) => {
    onChange(newMinutes * 60 + seconds);
  };
  
  const handleSecondsChange = (newSeconds: number) => {
    onChange(minutes * 60 + newSeconds);
  };
  
  return (
    <>
      <div className="inline-block">
        {label && (
          <div className="text-sm text-gray-400 mb-1 text-center">{label}</div>
        )}
        <div className="inline-flex items-center gap-1">
          <button
            onClick={() => setShowMinutesModal(true)}
            className="px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all active:scale-95 shadow-md"
          >
            <span className={`tabular-nums ${sizeClasses[size]}`}>
              {minutes.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-gray-400 ml-1">m</span>
          </button>
          
          <span className={`${sizeClasses[size]} text-gray-400`}>:</span>
          
          <button
            onClick={() => setShowSecondsModal(true)}
            className="px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all active:scale-95 shadow-md"
          >
            <span className={`tabular-nums ${sizeClasses[size]}`}>
              {seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-gray-400 ml-1">s</span>
          </button>
        </div>
      </div>
      
      <NumberPickerModal
        isOpen={showMinutesModal}
        value={minutes}
        onChange={handleMinutesChange}
        onClose={() => setShowMinutesModal(false)}
        label="Minutes"
        min={0}
        max={maxMinutes}
        suffix="minutes"
      />
      
      <NumberPickerModal
        isOpen={showSecondsModal}
        value={seconds}
        onChange={handleSecondsChange}
        onClose={() => setShowSecondsModal(false)}
        label="Seconds"
        min={0}
        max={59}
        suffix="seconds"
      />
    </>
  );
}