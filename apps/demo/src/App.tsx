/** Demo app using the published UI wrapper */
import React from 'react';
import { TimerErrorBoundary } from './components/ErrorBoundary';
import { WorkoutTimer } from '@workout-timer/ui';

export default function App() {
  return (
    <TimerErrorBoundary>
      <WorkoutTimer />
    </TimerErrorBoundary>
  );
}

