# Workout Timer

A headless, customizable workout timer library for React applications.

## Packages

- `@workout-timer/core` - Core timer logic (framework agnostic)
- `@workout-timer/react` - React hooks and providers
- `@workout-timer/react-ui` - Pre-built React components

## Installation

```bash
npm install @workout-timer/react
# or
pnpm add @workout-timer/react
```

## Quick Start

```tsx
import { useTimer } from '@workout-timer/react';

function MyTimer() {
  const timer = useTimer({
    type: 'amrap',
    duration: 300 // 5 minutes
  });

  return (
    <div>
      <div>{timer.formattedTime}</div>
      <button onClick={timer.start}>Start</button>
      <button onClick={timer.pause}>Pause</button>
    </div>
  );
}
```

## Documentation

See [/docs](./docs) for full documentation.

## License

MIT
