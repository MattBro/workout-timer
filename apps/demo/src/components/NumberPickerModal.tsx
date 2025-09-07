/**
 * Number Picker Modal
 * Simple number input with typing and increment/decrement
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemHeight = 60;
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);
  const hasDragged = useRef(false);
  const animationFrame = useRef<number>();
  
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);
  
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Set initial scroll position
      setTimeout(() => {
        if (scrollRef.current) {
          const index = currentValue - min;
          const targetScroll = index * itemHeight;
          scrollRef.current.scrollTop = targetScroll;
        }
      }, 50);
      
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, currentValue, min]);
  
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isDragging.current) return;
    clearTimeout(scrollTimeout.current);

    const scrollTop = scrollRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const newValue = Math.min(max, Math.max(min, min + index));

    // Debounce state update slightly during momentum scrolling
    scrollTimeout.current = setTimeout(() => {
      setCurrentValue(newValue);
    }, 50);
  }, [min, max, itemHeight]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    startY.current = e.clientY;
    startScrollTop.current = scrollRef.current.scrollTop;
    e.preventDefault();
    
    // Add cursor style for dragging
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !scrollRef.current) return;
      e.preventDefault();
      
      const deltaY = startY.current - e.clientY;
      
      // Mark as dragged if moved more than 3 pixels
      if (Math.abs(deltaY) > 3) {
        hasDragged.current = true;
      }
      
      scrollRef.current.scrollTop = startScrollTop.current + deltaY;
      
      // Update value during drag with animation frame for smooth updates
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      
      animationFrame.current = requestAnimationFrame(() => {
        if (scrollRef.current) {
          const scrollTop = scrollRef.current.scrollTop;
          const index = Math.round(scrollTop / itemHeight);
          const newValue = Math.min(max, Math.max(min, min + index));
          
          if (newValue !== currentValue) {
            setCurrentValue(newValue);
          }
        }
      });
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Cancel any pending animation frame
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      
      // Update value and snap when drag ends
      if (hasDragged.current && scrollRef.current) {
        const scrollTop = scrollRef.current.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        const newValue = Math.min(max, Math.max(min, min + index));
        
        setCurrentValue(newValue);
        
        // Snap to the exact position
        const targetScroll = (newValue - min) * itemHeight;
        scrollRef.current.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
      
      // Reset drag flag after a short delay to allow click handler to check it
      setTimeout(() => {
        hasDragged.current = false;
      }, 50);
    };

    if (isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseleave', handleMouseUp);
      };
    }
  }, [isOpen, min, max, itemHeight, currentValue]);
  
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
  const options = [];
  for (let i = min; i <= max; i++) {
    options.push(i);
  }
  
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
        {/* Modal Content */}
        <div className="space-y-4">
          {/* Scrollable Options */}
          <div className="relative h-[40vh] max-h-[400px] overflow-hidden">
            {/* Center highlight line */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60px] border-t border-b border-gray-600 pointer-events-none z-10" />
            
            {/* Scroll container */}
            <div
              ref={scrollRef}
              className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                overscrollBehavior: 'contain',
                scrollSnapType: 'y mandatory',
              }}
            >
              
              {/* Top padding - calculated to center the selection */}
              <div style={{ height: 'calc(50% - 30px)' }} />
              
              {/* Options */}
              {options.map((num) => {
                const isSelected = num === currentValue;
                const distance = Math.abs(num - currentValue);
                
                // Calculate opacity based on distance from selected value
                let opacity = 1;
                if (distance === 0) {
                  opacity = 1;
                } else if (distance === 1) {
                  opacity = 0.6;
                } else if (distance === 2) {
                  opacity = 0.3;
                } else {
                  opacity = 0.2;
                }
                
                return (
                  <div
                    key={num}
                    className="flex items-center justify-center cursor-pointer"
                    style={{ 
                      height: itemHeight,
                      opacity,
                      transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                      transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
                      scrollSnapAlign: 'center',
                      scrollSnapStop: 'always',
                    }}
                    onClick={() => {
                      // Don't handle click if we were dragging
                      if (hasDragged.current) return;
                      
                      setCurrentValue(num);
                      if (scrollRef.current) {
                        const index = num - min;
                        scrollRef.current.scrollTo({
                          top: index * itemHeight,
                          behavior: 'smooth'
                        });
                      }
                    }}
                  >
                    <span className={`text-2xl font-medium tabular-nums ${
                      isSelected ? 'text-white' : 'text-gray-400'
                    }`}>
                      {formatValue(num)}
                    </span>
                    {suffix && isSelected && (
                      <span className="ml-2 text-lg text-gray-400">
                        {suffix}
                      </span>
                    )}
                  </div>
                );
              })}
              
              {/* Bottom padding - calculated to center the selection */}
              <div style={{ height: 'calc(50% - 30px)' }} />
            </div>
          </div>
          
          {/* OK Button */}
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
