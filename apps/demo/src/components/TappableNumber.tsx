/**
 * Tappable Number Component
 * Displays a number that opens a picker modal when tapped
 * @module TappableNumber
 */

import React, { useState, useEffect } from 'react';
import { NumberPickerModal } from './NumberPickerModal';

interface TappableNumberProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  suffix?: string;
  min?: number;
  max?: number;
  isTime?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  autoFocus?: boolean;
}

export function TappableNumber({
  value,
  onChange,
  label,
  suffix = '',
  min = 0,
  max = 999,
  isTime = false,
  size = 'md',
  autoFocus = false
}: TappableNumberProps) {
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    if (autoFocus) {
      setShowModal(true);
    }
  }, [autoFocus]);
  
  const sizeClasses = {
    sm: 'text-base sm:text-lg font-semibold',
    md: 'text-xl sm:text-2xl font-bold',
    lg: 'text-2xl sm:text-3xl font-bold',
    xl: 'text-3xl sm:text-4xl font-bold'
  };
  
  const formatDisplay = () => {
    if (isTime) {
      const minutes = Math.floor(value / 60);
      const seconds = value % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return value.toString();
  };
  
  return (
    <>
      <div className="inline-block">
        {label && (
          <div className="text-sm text-gray-400 mb-1">{label}</div>
        )}
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all active:scale-95 shadow-md"
        >
          <span className={`tabular-nums ${sizeClasses[size]}`}>
            {formatDisplay()}
          </span>
          {suffix && (
            <span className="text-gray-400 text-sm">
              {suffix}
            </span>
          )}
          <svg 
            className="w-4 h-4 text-gray-400 ml-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <NumberPickerModal
        isOpen={showModal}
        value={value}
        onChange={onChange}
        onClose={() => setShowModal(false)}
        label={label}
        min={min}
        max={max}
        suffix={suffix}
        isTime={isTime}
      />
    </>
  );
}