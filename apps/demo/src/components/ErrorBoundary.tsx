/**
 * Error Boundary Component for graceful error handling
 * @module ErrorBoundary
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { TimerError, TimerErrorType } from '../types/timer.types';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * @class ErrorBoundary
 * @extends {Component}
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // You could also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
              <p className="text-gray-400 mb-6">
                {this.state.error.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={this.resetError}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-colors"
              >
                Try Again
              </button>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-900 p-4 rounded-lg overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Timer-specific Error Boundary
 * Provides timer-specific error handling and recovery
 */
export class TimerErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Check if it's a timer-specific error
    if (error instanceof TimerError) {
      console.error(`Timer error (${error.type}):`, error.message);
      
      // Handle specific timer errors
      switch (error.type) {
        case TimerErrorType.AUDIO_ERROR:
          // Audio errors are non-critical, could continue without sound
          console.warn('Audio system failed, continuing without sound');
          break;
        case TimerErrorType.STATE_ERROR:
          // State errors might require a reset
          console.error('Timer state corrupted, reset required');
          break;
        default:
          console.error('Unknown timer error', error);
      }
    } else {
      console.error('Unexpected error in timer:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const isTimerError = this.state.error instanceof TimerError;
      const isAudioError = isTimerError && 
        (this.state.error as TimerError).type === TimerErrorType.AUDIO_ERROR;

      // For non-critical errors like audio, show a notification but continue
      if (isAudioError) {
        return (
          <>
            <div className="fixed top-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
              ⚠️ Audio unavailable - timer will continue without sound
            </div>
            {this.props.children}
          </>
        );
      }

      // For critical errors, show error UI
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🛠️</div>
              <h1 className="text-2xl font-bold mb-2">Timer Error</h1>
              <p className="text-gray-400 mb-6">
                {this.state.error.message}
              </p>
              <div className="space-y-3">
                <button
                  onClick={this.resetError}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Reset Timer
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Reload App
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}