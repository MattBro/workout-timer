# Quick Start Guide

## Setup

Run the setup script to initialize the monorepo:

```bash
./setup.sh
pnpm install
```

## Package Structure

```
workout-timer/
├── packages/
│   ├── core/          # Timer logic (no UI dependencies)
│   ├── react/         # React hooks
│   └── react-ui/      # React components
└── docs/              # Documentation
```

## Core Timer Types to Implement

1. **AMRAP** - As Many Rounds As Possible
2. **EMOM** - Every Minute On the Minute
3. **Tabata** - 20 sec work / 10 sec rest × 8
4. **For Time** - Complete work with time cap
5. **Intervals** - Custom work/rest periods

## Development Commands

```bash
# Build all packages
pnpm build

# Run tests
pnpm test

# Development mode
pnpm dev

# Type checking
pnpm typecheck
```

## Creating the Core Package

```bash
cd packages/core
pnpm init
pnpm add -D tsup typescript vitest

# Create package.json
{
  "name": "@workout-timer/core",
  "version": "0.0.1",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "test": "vitest"
  }
}
```

## First Timer Implementation

Create `packages/core/src/Timer.ts`:

```typescript
export enum TimerState {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  FINISHED = 'finished'
}

export abstract class Timer {
  protected state: TimerState = TimerState.IDLE;
  protected elapsed: number = 0;
  
  abstract start(): void;
  abstract pause(): void;
  abstract reset(): void;
  abstract getSnapshot(): TimerSnapshot;
}
```

## Publishing to NPM

1. Create NPM account if needed
2. Login: `npm login`
3. Configure packages with `publishConfig`
4. Use changesets: `pnpm changeset`
5. Publish: `pnpm changeset publish`

## Integration with Tri-Coach

The timer will be integrated into activities:
- Database tables for timer configs
- Modal UI for timer display
- Session tracking and history

See `/docs` for complete implementation examples!