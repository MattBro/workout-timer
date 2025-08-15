# Refactored Timer App Architecture

## Clean Architecture Following SOLID Principles

### Core Design Principles
- **Single Responsibility**: Each component/hook does ONE thing well
- **Open/Closed**: Extensible for new timer types without modifying existing code
- **Liskov Substitution**: Timer strategies are interchangeable
- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Depend on abstractions, not concrete implementations

## File Structure

```
apps/demo/src/
├── components/
│   ├── Timer/
│   │   ├── TimerDisplay.tsx          # Only displays time
│   │   ├── TimerControls.tsx         # Only handles control buttons
│   │   ├── TimerProgress.tsx         # Only shows progress bar
│   │   └── TimerPhaseIndicator.tsx   # Only shows phase/round info
│   │
│   ├── Settings/
│   │   ├── SettingsPanel.tsx         # Settings container
│   │   ├── TimerTypeSelector.tsx     # Timer type selection
│   │   ├── AMRAPSettings.tsx         # AMRAP-specific settings
│   │   ├── EMOMSettings.tsx          # EMOM-specific settings
│   │   ├── TabataSettings.tsx        # Tabata-specific settings
│   │   ├── IntervalsSettings.tsx     # Intervals-specific settings
│   │   └── ForTimeSettings.tsx       # ForTime-specific settings
│   │
│   └── common/
│       ├── Modal.tsx
│       ├── Button.tsx
│       └── Input.tsx
│
├── hooks/
│   ├── timers/
│   │   ├── useTimer.ts               # Main timer hook (uses strategy pattern)
│   │   ├── useAMRAPTimer.ts          # AMRAP-specific logic
│   │   ├── useEMOMTimer.ts           # EMOM-specific logic
│   │   ├── useTabataTimer.ts         # Tabata-specific logic
│   │   ├── useIntervalsTimer.ts      # Intervals-specific logic
│   │   └── useForTimeTimer.ts        # ForTime-specific logic
│   │
│   ├── useTimerConfig.ts             # Manages timer configuration
│   ├── useTimerDisplay.ts            # Formats display values
│   ├── useTimerTheme.ts              # Manages visual theming
│   ├── useTimerSound.ts              # Audio feedback logic
│   └── useTimerPersistence.ts        # Save/load timer configs
│
├── contexts/
│   ├── TimerContext.tsx              # Timer state and controls
│   ├── SettingsContext.tsx           # Settings state
│   └── ThemeContext.tsx              # Theme/appearance state
│
├── services/
│   ├── timerStrategies/
│   │   ├── TimerStrategy.ts          # Strategy interface
│   │   ├── AMRAPStrategy.ts          # AMRAP implementation
│   │   ├── EMOMStrategy.ts           # EMOM implementation
│   │   ├── TabataStrategy.ts         # Tabata implementation
│   │   ├── IntervalsStrategy.ts      # Intervals implementation
│   │   └── ForTimeStrategy.ts        # ForTime implementation
│   │
│   ├── audioService.ts               # Sound effects service
│   └── storageService.ts             # LocalStorage service
│
├── types/
│   ├── timer.types.ts                # Timer-related types
│   ├── settings.types.ts             # Settings-related types
│   └── theme.types.ts                # Theme-related types
│
├── constants/
│   ├── timerTypes.ts                 # Timer type definitions
│   ├── presets.ts                    # Default presets
│   └── themes.ts                     # Theme configurations
│
├── utils/
│   ├── timeFormatters.ts             # Time formatting utilities
│   ├── validators.ts                 # Input validation
│   └── helpers.ts                    # General helpers
│
└── App.tsx                            # Clean app root

```

## Component Architecture

### 1. App Root (Clean & Simple)
```typescript
// App.tsx
function App() {
  return (
    <ThemeProvider>
      <TimerProvider>
        <SettingsProvider>
          <TimerScreen />
        </SettingsProvider>
      </TimerProvider>
    </ThemeProvider>
  );
}
```

### 2. Timer Screen (Composition Pattern)
```typescript
// screens/TimerScreen.tsx
function TimerScreen() {
  const { showSettings } = useSettings();
  
  return (
    <div className="timer-screen">
      <TimerDisplay />
      <TimerPhaseIndicator />
      <TimerProgress />
      <TimerControls />
      {showSettings && <SettingsPanel />}
    </div>
  );
}
```

### 3. Smart Custom Hooks

#### useTimer Hook (Strategy Pattern)
```typescript
// hooks/timers/useTimer.ts
interface UseTimerOptions {
  type: TimerType;
  config: TimerConfig;
  onFinish?: () => void;
}

function useTimer({ type, config, onFinish }: UseTimerOptions) {
  const strategy = useTimerStrategy(type);
  const [state, dispatch] = useReducer(timerReducer, initialState);
  
  const start = useCallback(() => {
    strategy.start(state, dispatch);
  }, [strategy, state]);
  
  const pause = useCallback(() => {
    strategy.pause(state, dispatch);
  }, [strategy, state]);
  
  // ... other methods
  
  return {
    state,
    start,
    pause,
    resume,
    reset,
    stop,
    // Timer-specific methods
    ...strategy.getSpecificMethods(state, dispatch)
  };
}
```

#### useTimerConfig Hook (Settings Management)
```typescript
// hooks/useTimerConfig.ts
function useTimerConfig(timerType: TimerType) {
  const [config, setConfig] = useState(() => 
    getDefaultConfig(timerType)
  );
  
  const updateConfig = useCallback((updates: Partial<TimerConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates
    }));
  }, []);
  
  const resetConfig = useCallback(() => {
    setConfig(getDefaultConfig(timerType));
  }, [timerType]);
  
  const loadPreset = useCallback((preset: TimerPreset) => {
    setConfig(preset.config);
  }, []);
  
  return {
    config,
    updateConfig,
    resetConfig,
    loadPreset
  };
}
```

#### useTimerDisplay Hook (Presentation Logic)
```typescript
// hooks/useTimerDisplay.ts
function useTimerDisplay(snapshot: TimerSnapshot, timerType: TimerType) {
  const formattedTime = useMemo(() => 
    formatTime(getDisplayTime(snapshot, timerType)), 
    [snapshot, timerType]
  );
  
  const phaseText = useMemo(() => 
    getPhaseText(snapshot, timerType), 
    [snapshot, timerType]
  );
  
  const phaseColor = useMemo(() => 
    getPhaseColor(snapshot, timerType), 
    [snapshot, timerType]
  );
  
  return {
    formattedTime,
    phaseText,
    phaseColor,
    progress: snapshot.progress
  };
}
```

### 4. Timer Strategy Pattern

```typescript
// services/timerStrategies/TimerStrategy.ts
interface TimerStrategy {
  start(state: TimerState, dispatch: Dispatch): void;
  pause(state: TimerState, dispatch: Dispatch): void;
  resume(state: TimerState, dispatch: Dispatch): void;
  reset(state: TimerState, dispatch: Dispatch): void;
  stop(state: TimerState, dispatch: Dispatch): void;
  getSpecificMethods(state: TimerState, dispatch: Dispatch): Record<string, Function>;
  getDisplayTime(snapshot: TimerSnapshot): number;
  getPhaseInfo(snapshot: TimerSnapshot): PhaseInfo;
}

// services/timerStrategies/AMRAPStrategy.ts
class AMRAPStrategy implements TimerStrategy {
  start(state: TimerState, dispatch: Dispatch) {
    // AMRAP-specific start logic
  }
  
  getSpecificMethods(state: TimerState, dispatch: Dispatch) {
    return {
      incrementRound: () => {
        dispatch({ type: 'INCREMENT_ROUND' });
      }
    };
  }
  
  // ... other methods
}
```

### 5. Clean Component Examples

#### TimerDisplay Component (Single Responsibility)
```typescript
// components/Timer/TimerDisplay.tsx
function TimerDisplay() {
  const { snapshot, type } = useTimerContext();
  const { formattedTime } = useTimerDisplay(snapshot, type);
  
  return (
    <div className="timer-display">
      <div className="timer-value">{formattedTime}</div>
    </div>
  );
}
```

#### TimerControls Component (Single Responsibility)
```typescript
// components/Timer/TimerControls.tsx
function TimerControls() {
  const { state, start, pause, resume, reset } = useTimerContext();
  
  if (state === TimerState.IDLE) {
    return <StartButton onClick={start} />;
  }
  
  if (state === TimerState.RUNNING) {
    return (
      <>
        <PauseButton onClick={pause} />
        <RoundButton />
      </>
    );
  }
  
  // ... other states
}
```

#### Settings Components (Composition)
```typescript
// components/Settings/SettingsPanel.tsx
function SettingsPanel() {
  const { timerType } = useSettings();
  
  return (
    <Panel>
      <TimerTypeSelector />
      <TimerSettings type={timerType} />
    </Panel>
  );
}

// components/Settings/TimerSettings.tsx
function TimerSettings({ type }: { type: TimerType }) {
  const settingsComponents = {
    amrap: AMRAPSettings,
    emom: EMOMSettings,
    tabata: TabataSettings,
    intervals: IntervalsSettings,
    forTime: ForTimeSettings
  };
  
  const SettingsComponent = settingsComponents[type];
  return <SettingsComponent />;
}
```

## State Management

### Context Pattern with Reducers
```typescript
// contexts/TimerContext.tsx
interface TimerContextValue {
  snapshot: TimerSnapshot;
  state: TimerState;
  type: TimerType;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  stop: () => void;
}

const TimerContext = createContext<TimerContextValue | null>(null);

function TimerProvider({ children }: { children: ReactNode }) {
  const { type, config } = useSettings();
  const timer = useTimer({ type, config });
  
  return (
    <TimerContext.Provider value={timer}>
      {children}
    </TimerContext.Provider>
  );
}
```

## Testing Strategy

### Unit Tests (Each hook/component in isolation)
```typescript
// hooks/__tests__/useTimer.test.ts
describe('useTimer', () => {
  it('should initialize with correct state', () => {
    const { result } = renderHook(() => 
      useTimer({ type: 'amrap', config: { duration: 300 } })
    );
    expect(result.current.state).toBe(TimerState.IDLE);
  });
});

// components/__tests__/TimerDisplay.test.tsx
describe('TimerDisplay', () => {
  it('should format time correctly', () => {
    const { getByText } = render(
      <TimerContext.Provider value={mockTimerValue}>
        <TimerDisplay />
      </TimerContext.Provider>
    );
    expect(getByText('05:00')).toBeInTheDocument();
  });
});
```

## Benefits of This Architecture

1. **Maintainability**: Each piece has a single, clear purpose
2. **Testability**: Every component/hook can be tested in isolation
3. **Extensibility**: Easy to add new timer types without touching existing code
4. **Reusability**: Hooks and components can be used in different contexts
5. **Performance**: Optimized with proper memoization and state management
6. **Developer Experience**: Clear file structure, predictable patterns
7. **Type Safety**: Full TypeScript support with proper interfaces

## Migration Path

1. Start by extracting hooks from the current component
2. Create the context providers
3. Break down the large component into smaller ones
4. Implement the strategy pattern for timer types
5. Add proper TypeScript types
6. Write tests for each new module
7. Gradually replace the old implementation

## Example Usage After Refactoring

```typescript
// Clean, readable, maintainable
function MyCustomTimer() {
  const { formattedTime, phaseText } = useTimerDisplay();
  const { start, pause } = useTimerControls();
  const theme = useTimerTheme();
  
  return (
    <div style={theme}>
      <h1>{formattedTime}</h1>
      <p>{phaseText}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
    </div>
  );
}
```

This architecture follows the principles advocated by Kent Beck (simplicity, testability) and Kent C. Dodds (composition, custom hooks, proper abstraction levels).

## Open Source Library Design

### Package Structure for NPM Publishing

```
workout-timer/
├── packages/
│   ├── @workout-timer/core           # Framework-agnostic core
│   │   ├── src/
│   │   ├── README.md
│   │   └── package.json
│   │
│   ├── @workout-timer/react          # React hooks & utilities
│   │   ├── src/
│   │   ├── README.md
│   │   └── package.json
│   │
│   ├── @workout-timer/react-ui       # Pre-built React components
│   │   ├── src/
│   │   ├── README.md
│   │   └── package.json
│   │
│   └── @workout-timer/themes         # Theme presets
│       ├── src/
│       ├── README.md
│       └── package.json
```

### Developer Experience Features

#### 1. Multiple Consumption Patterns

```typescript
// Option 1: Headless (bring your own UI)
import { useTimer } from '@workout-timer/react';

function CustomTimer() {
  const timer = useTimer({ type: 'amrap', duration: 300 });
  // Build your own UI
}

// Option 2: Pre-built components (customizable)
import { Timer } from '@workout-timer/react-ui';

function App() {
  return (
    <Timer 
      type="amrap"
      duration={300}
      theme="dark"
      onFinish={() => console.log('Done!')}
    />
  );
}

// Option 3: Vanilla JavaScript
import { createTimer } from '@workout-timer/core';

const timer = createTimer({ type: 'amrap', duration: 300 });
timer.on('tick', (snapshot) => updateUI(snapshot));
```

#### 2. Extensive Customization

```typescript
// Custom timer type plugin
import { registerTimerType } from '@workout-timer/core';

registerTimerType({
  id: 'custom-hiit',
  name: 'Custom HIIT',
  createTimer: (config) => new CustomHIITTimer(config),
  settingsComponent: CustomHIITSettings,
  defaultConfig: { ... }
});

// Theme customization
import { Timer } from '@workout-timer/react-ui';

const customTheme = {
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    background: '#1A1A2E',
    text: '#FFFFFF'
  },
  fonts: {
    timer: 'Roboto Mono',
    ui: 'Inter'
  },
  animations: {
    transitions: 'smooth',
    pulseOnFinish: true
  }
};

<Timer theme={customTheme} />
```

#### 3. Render Props & Compound Components

```typescript
// Render props pattern for maximum flexibility
<Timer type="amrap" duration={300}>
  {({ time, state, controls }) => (
    <CustomLayout>
      <MyTimeDisplay time={time} />
      <MyControls {...controls} />
    </CustomLayout>
  )}
</Timer>

// Compound components pattern
<Timer.Provider config={config}>
  <Timer.Display format="mm:ss" />
  <Timer.Progress />
  <Timer.Controls>
    <Timer.StartButton />
    <Timer.PauseButton />
  </Timer.Controls>
</Timer.Provider>
```

### API Design for External Developers

#### Core Timer API
```typescript
interface WorkoutTimer {
  // Lifecycle
  start(): void;
  pause(): void;
  resume(): void;
  reset(): void;
  stop(): void;
  
  // State
  getSnapshot(): TimerSnapshot;
  getState(): TimerState;
  
  // Events
  on(event: TimerEvent, handler: Handler): Unsubscribe;
  off(event: TimerEvent, handler: Handler): void;
  
  // Configuration
  updateConfig(config: Partial<TimerConfig>): void;
  
  // Extensions
  use(plugin: TimerPlugin): void;
}

// Plugin system
interface TimerPlugin {
  name: string;
  version: string;
  install(timer: WorkoutTimer): void;
}
```

#### React Hooks API
```typescript
// Main hook with all features
const timer = useTimer(config, options);

// Granular hooks for specific needs
const display = useTimerDisplay(snapshot);
const controls = useTimerControls(timer);
const sound = useTimerSound(timer);
const persistence = useTimerPersistence(timer);
```

### Documentation Strategy

#### 1. Interactive Documentation Site
```markdown
- Live playground with all timer types
- Code examples with CodeSandbox embeds
- API reference with TypeScript definitions
- Theming playground
- Migration guides
```

#### 2. Comprehensive Examples
```
examples/
├── basic-usage/
├── custom-timer-type/
├── theme-customization/
├── vanilla-javascript/
├── next-js-integration/
├── react-native/
├── electron-app/
└── testing-setup/
```

#### 3. TypeScript-First with JSDoc
```typescript
/**
 * Creates a workout timer with the specified configuration
 * 
 * @param config - Timer configuration object
 * @param options - Optional timer options
 * @returns Timer instance with full control methods
 * 
 * @example
 * ```typescript
 * const timer = createTimer({
 *   type: 'amrap',
 *   duration: 300
 * });
 * 
 * timer.on('finish', () => console.log('Workout complete!'));
 * timer.start();
 * ```
 */
export function createTimer(
  config: TimerConfig,
  options?: TimerOptions
): WorkoutTimer {
  // Implementation
}
```

### Contributing Guidelines

#### 1. Plugin Development Guide
```typescript
// Template for creating custom timer types
export class CustomTimerType implements TimerStrategy {
  // Required methods to implement
  start() { }
  pause() { }
  getDisplayTime() { }
  // ... etc
}

// Registration
WorkoutTimer.registerType('custom', CustomTimerType);
```

#### 2. Component Contribution
```typescript
// Standard component interface for contributions
interface TimerComponentProps {
  timer: WorkoutTimer;
  theme?: Theme;
  className?: string;
  children?: React.ReactNode;
}
```

### Performance Considerations

```typescript
// Lazy loading timer types
const timerTypes = {
  amrap: () => import('./timers/AMRAPTimer'),
  emom: () => import('./timers/EMOMTimer'),
  tabata: () => import('./timers/TabataTimer'),
  // ... etc
};

// Optimized rendering with memo
export const TimerDisplay = memo(({ snapshot }: Props) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison for re-render optimization
  return prevProps.snapshot.elapsed === nextProps.snapshot.elapsed;
});
```

### Bundle Size Optimization

```json
// Package.json exports for tree-shaking
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./timers/amrap": {
      "import": "./dist/timers/amrap.mjs",
      "require": "./dist/timers/amrap.js"
    },
    "./hooks": {
      "import": "./dist/hooks/index.mjs",
      "require": "./dist/hooks/index.js"
    }
  },
  "sideEffects": false
}
```

### Accessibility Features

```typescript
// Built-in accessibility
<Timer
  announceInterval={60}  // Screen reader announcements
  keyboardShortcuts={{
    start: 'Space',
    pause: 'p',
    reset: 'r'
  }}
  aria-label="Workout timer"
  role="timer"
/>
```

### Testing Utilities

```typescript
// @workout-timer/test-utils
import { renderTimer, mockTimer } from '@workout-timer/test-utils';

test('timer completes after duration', async () => {
  const { timer, waitForFinish } = renderTimer({
    type: 'amrap',
    duration: 300
  });
  
  timer.start();
  await waitForFinish();
  
  expect(timer.getState()).toBe('finished');
});
```

### Version Strategy

- Semantic versioning with clear breaking change documentation
- LTS versions for production apps
- Beta channel for early adopters
- Automated changelog generation

This open source design ensures the library is:
- **Flexible** for different use cases
- **Extensible** through plugins
- **Well-documented** with examples
- **Performance-optimized** with tree-shaking
- **Accessible** by default
- **Easy to contribute to** with clear guidelines