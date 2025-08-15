/**
 * Theme Context for the Workout Timer application
 * Provides theme management and switching capabilities
 * @module ThemeContext
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Available theme options
 * @interface Theme
 */
export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  accent: string;
  gradientFrom: string;
  gradientTo: string;
  buttonPrimary: string;
  buttonSecondary: string;
  success: string;
  warning: string;
  danger: string;
}

/**
 * Predefined themes - Minimal and matte
 */
export const themes: Record<string, Theme> = {
  charcoal: {
    name: 'Charcoal',
    primary: 'gray-700',
    secondary: 'gray-800',
    background: 'gray-900',
    surface: 'gray-800',
    text: 'gray-100',
    accent: 'gray-500',
    gradientFrom: 'from-gray-700',
    gradientTo: 'to-gray-800',
    buttonPrimary: 'bg-gray-100 text-gray-900 shadow-lg',
    buttonSecondary: 'bg-gray-800/50 shadow-md',
    success: 'gray-600',
    warning: 'gray-500',
    danger: 'gray-600',
  },
  slate: {
    name: 'Slate',
    primary: 'slate-600',
    secondary: 'slate-700',
    background: 'slate-800',
    surface: 'slate-700',
    text: 'slate-100',
    accent: 'slate-400',
    gradientFrom: 'from-slate-600',
    gradientTo: 'to-slate-700',
    buttonPrimary: 'bg-slate-200 text-slate-900 shadow-lg',
    buttonSecondary: 'bg-slate-700/50 shadow-md',
    success: 'slate-500',
    warning: 'slate-400',
    danger: 'slate-500',
  },
  stone: {
    name: 'Stone',
    primary: 'stone-600',
    secondary: 'stone-700',
    background: 'stone-800',
    surface: 'stone-700',
    text: 'stone-100',
    accent: 'stone-400',
    gradientFrom: 'from-stone-600',
    gradientTo: 'to-stone-700',
    buttonPrimary: 'bg-stone-200 text-stone-900 shadow-lg',
    buttonSecondary: 'bg-stone-700/50 shadow-md',
    success: 'stone-500',
    warning: 'stone-400',
    danger: 'stone-500',
  },
  zinc: {
    name: 'Zinc',
    primary: 'zinc-600',
    secondary: 'zinc-700',
    background: 'zinc-800',
    surface: 'zinc-700',
    text: 'zinc-100',
    accent: 'zinc-400',
    gradientFrom: 'from-zinc-600',
    gradientTo: 'to-zinc-700',
    buttonPrimary: 'bg-zinc-200 text-zinc-900 shadow-lg',
    buttonSecondary: 'bg-zinc-700/50 shadow-md',
    success: 'zinc-500',
    warning: 'zinc-400',
    danger: 'zinc-500',
  },
  neutral: {
    name: 'Neutral',
    primary: 'neutral-600',
    secondary: 'neutral-700',
    background: 'neutral-800',
    surface: 'neutral-700',
    text: 'neutral-100',
    accent: 'neutral-400',
    gradientFrom: 'from-neutral-600',
    gradientTo: 'to-neutral-700',
    buttonPrimary: 'bg-neutral-200 text-neutral-900 shadow-lg',
    buttonSecondary: 'bg-neutral-700/50 shadow-md',
    success: 'neutral-500',
    warning: 'neutral-400',
    danger: 'neutral-500',
  },
  minimal: {
    name: 'Minimal',
    primary: 'gray-600',
    secondary: 'gray-700',
    background: 'gray-800',
    surface: 'gray-700',
    text: 'gray-50',
    accent: 'gray-400',
    gradientFrom: 'from-gray-600',
    gradientTo: 'to-gray-700',
    buttonPrimary: 'bg-white text-gray-900 shadow-xl',
    buttonSecondary: 'bg-black/20 backdrop-blur shadow-lg',
    success: 'gray-500',
    warning: 'gray-400',
    danger: 'gray-500',
  },
};

/**
 * Theme context value interface
 */
interface ThemeContextValue {
  theme: Theme;
  themeName: string;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Hook to use theme context
 * @returns {ThemeContextValue} Theme context value
 * @throws {Error} If used outside of ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
}

/**
 * Theme Provider Component
 * Manages theme state and persistence
 */
export function ThemeProvider({ children, defaultTheme = 'charcoal' }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<string>(() => {
    // Load theme from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('workout-timer-theme');
      return saved && themes[saved] ? saved : defaultTheme;
    }
    return defaultTheme;
  });

  const theme = themes[themeName] || themes.charcoal;

  useEffect(() => {
    // Save theme to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('workout-timer-theme', themeName);
    }
  }, [themeName]);

  const value: ThemeContextValue = {
    theme,
    themeName,
    setTheme: setThemeName,
    availableThemes: Object.keys(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}