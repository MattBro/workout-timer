/**
 * Number Picker Modal
 * Wheel-style picker using react-mobile-picker for great touch UX
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Picker from 'react-mobile-picker';

interface NumberPickerModalProps {
  isOpen: boolean;
  value: number;
  onChange: (value: number) => void;
  onClose: () => void;
  label?: string;
  min?: number;
  max?: number;
  suffix?: string;
  isTime?: boolean;
}

export function NumberPickerModal({
  isOpen,
  value,
  onChange,
  onClose,
  label,
  min = 0,
  max = 999,
  suffix = '',
  isTime = false
}: NumberPickerModalProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const itemHeight = 60;

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onChange(currentValue);
    onClose();
  };

  const formatValue = (val: number) => {
    if (isTime) {
      const minutes = Math.floor(val / 60);
      const seconds = val % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return val.toString();
  };

  // Generate options
  const options: number[] = [];
  for (let i = min; i <= max; i++) options.push(i);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0
      }}
    >
      <div className="bg-gray-900 rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl border border-gray-800">
        <div className="space-y-4">
          {label && (
            <div className="text-center text-sm text-gray-400">{label}</div>
          )}
          <div className="relative h-[40vh] max-h-[400px]">
            {/* Center highlight */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60px] border-t border-b border-gray-600 pointer-events-none z-10" />
            <Picker
              value={{ value: currentValue }}
              onChange={(val: { value: number }) => setCurrentValue(val.value)}
              height={Math.min(400, typeof window !== 'undefined' ? window.innerHeight * 0.4 : 240)}
              itemHeight={itemHeight}
              wheelMode="normal"
              className="text-white"
            >
              <Picker.Column name="value">
                {options.map((num) => (
                  <Picker.Item key={num} value={num}>
                    <span className="text-2xl tabular-nums">{formatValue(num)}</span>
                    {suffix && <span className="ml-2 text-lg text-gray-400">{suffix}</span>}
                  </Picker.Item>
                ))}
              </Picker.Column>
            </Picker>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all active:scale-95"
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

