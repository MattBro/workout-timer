import React, { useState } from 'react';

interface RoundPickerProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
}

export function RoundPicker({ value, onChange, label, min = 1, max = 999 }: RoundPickerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleDecrement = () => {
    onChange(Math.max(min, value - 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // Only allow digits
    setInputValue(val);
  };

  const handleInputBlur = () => {
    const num = parseInt(inputValue) || min;
    onChange(Math.max(min, num));
    setIsEditing(false);
    setInputValue(value.toString());
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setInputValue(value.toString());
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
            {isEditing ? (
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                className="text-5xl font-bold tabular-nums w-[120px] text-center bg-gray-700 rounded-lg px-2 outline-none focus:ring-2 focus:ring-gray-500"
                autoFocus
              />
            ) : (
              <div 
                className="text-5xl font-bold tabular-nums min-w-[100px] cursor-text hover:bg-gray-700/50 rounded-lg px-2 transition-colors"
                onClick={handleEditStart}
              >
                {value}
              </div>
            )}
            <span className="text-sm text-gray-400">rounds</span>
          </div>
          
          <button
            onClick={handleIncrement}
            className="p-3 text-3xl hover:bg-gray-600 rounded-xl shadow-md active:scale-95 transition-all"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}