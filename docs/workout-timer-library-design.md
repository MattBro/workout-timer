# Workout Timer Library Design

## Overview
Design document for a modular, headless workout timer library that can handle AMRAP, EMOM, Tabata, and other workout timer formats. This library will be published as an NPM package and integrated into the tri-coach app.

## Architecture Options

### Option 1: Headless Core with React Hooks (Recommended)
```typescript
// Core timer logic as vanilla TypeScript
@workout-timer/core - Pure TS timer logic, no UI dependencies

// React integration layer  
@workout-timer/react - React hooks and context providers

// Optional pre-built components
@workout-timer/react-ui - Ready-to-use components (optional)

// Sound/haptic feedback
@workout-timer/audio - Audio cues and beeps
```

**Pros:**
- Framework agnostic core
- Can support React, Vue, Svelte, etc.
- Clean separation of concerns
- Easy to test
- Smaller bundle sizes for users

**Cons:**
- More packages to maintain
- Need to coordinate versions

### Option 2: Monolithic React Component Library
```typescript
workout-timer-react - All-in-one React component library
```

**Pros:**
- Simpler to maintain
- Single package to install
- Easier documentation

**Cons:**
- Locked to React
- Harder to customize
- Larger bundle size

### Option 3: Web Components
```typescript
@workout-timer/elements - Custom elements that work everywhere
```

**Pros:**
- Framework agnostic
- Native browser support
- Encapsulated styles

**Cons:**
- Less familiar to React developers
- SSR can be tricky
- Browser compatibility considerations

## Recommended Architecture: Headless Core + React Hooks

### Package Structure
```
workout-timer/
├── packages/
│   ├── core/                 # Pure TypeScript timer logic
│   │   ├── src/
│   │   │   ├── timers/
│   │   │   │   ├── amrap.ts
│   │   │   │   ├── emom.ts
│   │   │   │   ├── tabata.ts
│   │   │   │   ├── forTime.ts
│   │   │   │   ├── intervals.ts
│   │   │   │   └── custom.ts
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── react/                # React hooks
│   │   ├── src/
│   │   │   ├── hooks/
│   │   │   │   ├── useTimer.ts
│   │   │   │   ├── useTimerState.ts
│   │   │   │   └── useTimerControls.ts
│   │   │   ├── providers/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── react-ui/            # Optional UI components
│       ├── src/
│       │   ├── components/
│       │   │   ├── TimerDisplay.tsx
│       │   │   ├── TimerControls.tsx
│       │   │   └── PresetButtons.tsx
│       │   └── themes/
│       └── package.json
```

## Timer Types & Configurations

### 1. AMRAP (As Many Rounds As Possible)
```typescript
interface AMRAPConfig {
  type: 'amrap';
  duration: number; // seconds
  movements?: Movement[]; // optional movement tracking
}
```

### 2. EMOM (Every Minute On the Minute)
```typescript
interface EMOMConfig {
  type: 'emom';
  rounds: number;
  interval: number; // seconds (usually 60)
  movements?: Movement[];
}
```

### 3. Tabata
```typescript
interface TabataConfig {
  type: 'tabata';
  workTime: number; // seconds (typically 20)
  restTime: number; // seconds (typically 10)
  rounds: number; // typically 8
  sets?: number; // multiple tabatas
  restBetweenSets?: number;
}
```

### 4. For Time
```typescript
interface ForTimeConfig {
  type: 'forTime';
  timeCapMinutes: number;
  rounds?: number;
  movements?: Movement[];
}
```

### 5. Intervals
```typescript
interface IntervalsConfig {
  type: 'intervals';
  intervals: Array<{
    name: string;
    duration: number;
    type: 'work' | 'rest' | 'prep';
  }>;
  rounds?: number;
}
```

### 6. Custom
```typescript
interface CustomConfig {
  type: 'custom';
  segments: TimerSegment[];
}
```

## Core API Design

### Timer State Machine
```typescript
enum TimerState {
  IDLE = 'idle',
  READY = 'ready',      // Countdown before start
  RUNNING = 'running',
  PAUSED = 'paused',
  FINISHED = 'finished',
  CANCELLED = 'cancelled'
}

interface TimerCore {
  state: TimerState;
  elapsed: number;
  remaining: number;
  currentRound?: number;
  currentInterval?: number;
  
  // Methods
  start(): void;
  pause(): void;
  resume(): void;
  reset(): void;
  stop(): void;
  
  // Events
  onTick?: (state: TimerSnapshot) => void;
  onStateChange?: (state: TimerState) => void;
  onIntervalChange?: (interval: number) => void;
  onRoundChange?: (round: number) => void;
  onFinish?: () => void;
}
```

### React Hook API
```typescript
// Basic usage
const timer = useTimer({
  type: 'amrap',
  duration: 300
});

// With all features
const {
  // State
  state,
  elapsed,
  remaining,
  currentRound,
  formattedTime,
  progress,
  
  // Controls
  start,
  pause,
  resume,
  reset,
  stop,
  
  // Settings
  updateConfig,
  
} = useTimer(config, {
  countdown: 3,
  sound: true,
  vibration: true,
  keepScreenOn: true,
  onFinish: () => console.log('Done!')
});
```

## Database Schema

```sql
-- Timer configurations linked to activities
CREATE TABLE activity_timers (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER REFERENCES activities(id),
  name VARCHAR(255),
  config JSONB NOT NULL, -- Timer configuration
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Timer execution history
CREATE TABLE timer_sessions (
  id SERIAL PRIMARY KEY,
  activity_timer_id INTEGER REFERENCES activity_timers(id),
  user_id INTEGER REFERENCES users(id),
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  paused_duration INTEGER DEFAULT 0, -- Total pause time in seconds
  rounds_completed INTEGER,
  notes TEXT,
  data JSONB -- Additional tracking data
);
```

## NPM Package Best Practices

### 1. Package.json Setup
```json
{
  "name": "@workout-timer/core",
  "version": "1.0.0",
  "description": "Headless workout timer library for AMRAP, EMOM, Tabata and more",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "sideEffects": false,
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/workout-timer"
  },
  "keywords": [
    "timer",
    "workout",
    "amrap",
    "emom",
    "tabata",
    "crossfit",
    "hiit",
    "interval"
  ],
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

### 2. TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node"
  }
}
```

### 3. Build Setup (using tsup)
```json
{
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --clean",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

### 4. Testing Strategy
```typescript
// Unit tests for core logic
describe('AMRAPTimer', () => {
  it('should count down from duration', () => {
    const timer = new AMRAPTimer({ duration: 300 });
    timer.start();
    expect(timer.remaining).toBe(300);
  });
});

// Integration tests for React hooks
describe('useTimer', () => {
  it('should handle state transitions', () => {
    const { result } = renderHook(() => 
      useTimer({ type: 'amrap', duration: 300 })
    );
    
    act(() => result.current.start());
    expect(result.current.state).toBe('running');
  });
});
```

### 5. Documentation
```markdown
# Workout Timer

A headless, customizable workout timer library for React applications.

## Installation
\`\`\`bash
npm install @workout-timer/react
\`\`\`

## Quick Start
\`\`\`tsx
import { useTimer } from '@workout-timer/react';

function MyTimer() {
  const timer = useTimer({
    type: 'amrap',
    duration: 300
  });

  return (
    <div>
      <div>{timer.formattedTime}</div>
      <button onClick={timer.start}>Start</button>
      <button onClick={timer.pause}>Pause</button>
    </div>
  );
}
\`\`\`
```

## Integration with Tri-Coach App

### 1. Activity Timer Component
```typescript
interface ActivityTimerProps {
  activityId: number;
  config?: TimerConfig;
}

export function ActivityTimer({ activityId, config }: ActivityTimerProps) {
  const timer = useTimer(config || { type: 'forTime', timeCapMinutes: 20 });
  
  // Save timer session on completion
  const handleFinish = async () => {
    await saveTimerSession({
      activityId,
      duration: timer.elapsed,
      rounds: timer.currentRound
    });
  };
  
  return (
    <TimerModal>
      <TimerDisplay {...timer} />
      <TimerControls {...timer} />
    </TimerModal>
  );
}
```

### 2. Timer Presets
```typescript
const TIMER_PRESETS = {
  'warmup': {
    type: 'intervals',
    intervals: [
      { name: 'Prep', duration: 10, type: 'prep' },
      { name: 'Easy', duration: 120, type: 'work' },
      { name: 'Moderate', duration: 90, type: 'work' },
      { name: 'Hard', duration: 60, type: 'work' }
    ]
  },
  'benchmark-cindy': {
    type: 'amrap',
    duration: 1200, // 20 minutes
    movements: [
      { name: 'Pull-ups', reps: 5 },
      { name: 'Push-ups', reps: 10 },
      { name: 'Squats', reps: 15 }
    ]
  }
};
```

## Advanced Features

### 1. Audio Cues
```typescript
interface AudioConfig {
  countdown: boolean;      // 3-2-1 countdown
  intervalBeep: boolean;   // Beep on interval change
  halfwayAlert: boolean;   // Alert at halfway point
  lastTenSeconds: boolean; // Count last 10 seconds
  customSounds?: {
    start?: string;
    pause?: string;
    interval?: string;
    finish?: string;
  };
}
```

### 2. Visual Themes
```typescript
interface TimerTheme {
  colors: {
    work: string;
    rest: string;
    prep: string;
    background: string;
    text: string;
    progress: string;
  };
  fonts: {
    timer: string;
    labels: string;
  };
}
```

### 3. Export/Import Configurations
```typescript
// Export timer config as shareable URL or JSON
const shareableUrl = timer.toShareableUrl();
const json = timer.toJSON();

// Import from URL or JSON
const timer = TimerConfig.fromUrl(url);
const timer = TimerConfig.fromJSON(json);
```

## Publishing Checklist

- [ ] Write comprehensive README
- [ ] Add LICENSE file (MIT)
- [ ] Create CHANGELOG.md
- [ ] Set up GitHub Actions for CI/CD
- [ ] Configure semantic versioning
- [ ] Add contributing guidelines
- [ ] Create examples repository
- [ ] Set up documentation site (Docusaurus/Storybook)
- [ ] Add badges (npm version, downloads, build status)
- [ ] Create demo site
- [ ] Set up issue templates
- [ ] Configure npm publishing workflow

## Development Workflow

1. **Monorepo Setup** (using pnpm workspaces or Lerna)
2. **Testing** (Vitest for unit tests, Playwright for E2E)
3. **Linting** (ESLint + Prettier)
4. **Type Checking** (TypeScript strict mode)
5. **Bundle Analysis** (size limits)
6. **Documentation** (TSDoc comments)
7. **Changelog** (Changesets)
8. **Release** (GitHub Actions + npm)

## Example Implementation Timeline

### Phase 1: Core Package (Week 1)
- Timer state machine
- Basic timer types (AMRAP, EMOM, Tabata)
- Unit tests

### Phase 2: React Integration (Week 2)
- useTimer hook
- Timer provider
- React tests

### Phase 3: UI Components (Week 3)
- Basic timer display
- Control buttons
- Progress indicators

### Phase 4: Advanced Features (Week 4)
- Audio cues
- Presets
- Import/export

### Phase 5: Integration (Week 5)
- Integrate with tri-coach app
- Database schema
- Activity linking

### Phase 6: Polish & Publish (Week 6)
- Documentation
- Examples
- NPM publishing
- Marketing