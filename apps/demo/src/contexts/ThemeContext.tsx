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
 * Predefined themes
 */
export const themes: Record<string, Theme> = {
  dark: {
    name: 'Dark',
    primary: 'gray-700',
    secondary: 'gray-800',
    background: 'gray-900',
    surface: 'gray-800',
    text: 'white',
    accent: 'blue-500',
    gradientFrom: 'from-gray-700',
    gradientTo: 'to-gray-800',
    buttonPrimary: 'bg-white text-black',
    buttonSecondary: 'bg-black/20',
    success: 'emerald-600',
    warning: 'amber-600',
    danger: 'rose-600',
  },
  midnight: {
    name: 'Midnight',
    primary: 'slate-700',
    secondary: 'slate-800',
    background: 'slate-900',
    surface: 'slate-800',
    text: 'slate-100',
    accent: 'indigo-500',
    gradientFrom: 'from-slate-700',
    gradientTo: 'to-slate-900',
    buttonPrimary: 'bg-indigo-500 text-white',
    buttonSecondary: 'bg-slate-700',
    success: 'teal-500',
    warning: 'yellow-500',
    danger: 'red-500',
  },
  neon: {
    name: 'Neon',
    primary: 'purple-600',
    secondary: 'pink-600',
    background: 'gray-900',
    surface: 'gray-800',
    text: 'white',
    accent: 'cyan-400',
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-pink-600',
    buttonPrimary: 'bg-cyan-400 text-gray-900',
    buttonSecondary: 'bg-purple-600/30',
    success: 'green-400',
    warning: 'yellow-400',
    danger: 'red-400',
  },
  forest: {
    name: 'Forest',
    primary: 'green-700',
    secondary: 'green-800',
    background: 'gray-900',
    surface: 'green-900',
    text: 'green-50',
    accent: 'lime-400',
    gradientFrom: 'from-green-700',
    gradientTo: 'to-green-900',
    buttonPrimary: 'bg-lime-400 text-green-900',
    buttonSecondary: 'bg-green-800/50',
    success: 'lime-500',
    warning: 'orange-500',
    danger: 'red-600',
  },
  ocean: {
    name: 'Ocean',
    primary: 'blue-600',
    secondary: 'blue-700',
    background: 'slate-900',
    surface: 'blue-900',
    text: 'blue-50',
    accent: 'cyan-300',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-blue-800',
    buttonPrimary: 'bg-cyan-300 text-blue-900',
    buttonSecondary: 'bg-blue-700/50',
    success: 'teal-400',
    warning: 'amber-400',
    danger: 'pink-400',
  },
  sunrise: {
    name: 'Sunrise',
    primary: 'orange-500',
    secondary: 'red-500',
    background: 'gray-900',
    surface: 'gray-800',
    text: 'orange-50',
    accent: 'yellow-300',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-red-600',
    buttonPrimary: 'bg-yellow-300 text-gray-900',
    buttonSecondary: 'bg-orange-600/30',
    success: 'green-400',
    warning: 'yellow-300',
    danger: 'red-400',
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
export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<string>(() => {
    // Load theme from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('workout-timer-theme');
      return saved && themes[saved] ? saved : defaultTheme;
    }
    return defaultTheme;
  });

  const theme = themes[themeName] || themes.dark;

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