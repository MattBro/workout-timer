# @workout-timer/ui Package - Additional Recommendations

## API Design Enhancements

### 1. **Expanded WorkoutTimer Props**
```typescript
export interface WorkoutTimerProps {
  // Existing props from plan
  activityId?: string;
  initialConfig?: TimerConfig;
  onConfigChange?: (config: TimerConfig) => void;
  className?: string;
  theme?: 'dark' | 'light' | 'charcoal';
  
  // Additional recommended props
  soundEnabled?: boolean;
  showSettings?: boolean;
  onTimerStart?: () => void;
  onTimerPause?: () => void;
  onTimerComplete?: () => void;
  onRoundComplete?: (round: number) => void;
  hideControls?: boolean; // For embedding in other UIs
  compactMode?: boolean; // For smaller displays
}
```

### 2. **Headless Hook for Maximum Flexibility**
Expose a hook that provides all timer functionality without UI:
```typescript
export function useWorkoutTimer(options?: WorkoutTimerOptions) {
  // Returns all state and methods without rendering anything
  return {
    timer,
    snapshot,
    config,
    updateConfig,
    changeTimerType,
    start,
    pause,
    reset,
    // ... etc
  }
}
```

This allows consumers to build completely custom UIs while still using the timer logic.

## Export Strategy

### 1. **Granular Component Exports**
Export all individual components and their prop types for maximum composability:
```typescript
// Components
export { TimerDisplay } from './components/TimerDisplay'
export { TimerControls } from './components/TimerControls'
export { TimerPhaseIndicator } from './components/TimerPhaseIndicator'
export { TimerProgress } from './components/TimerProgress'
export { TimerSettings } from './components/TimerSettings'
// ... etc

// Types for extending
export type { 
  TimerDisplayProps,
  TimerControlsProps,
  TimerPhaseIndicatorProps,
  // ... etc
}
```

### 2. **Optional Styles Export**
```typescript
// Allow importing base styles separately
export { baseStyles } from './styles/base.css'
export { darkTheme, lightTheme, charcoalTheme } from './styles/themes'
```

## Styling Recommendations

### 1. **CSS Variables for Theming**
Use CSS custom properties for easy theming:
```css
.workout-timer {
  --timer-primary: var(--timer-primary, #3b82f6);
  --timer-background: var(--timer-background, #1f2937);
  --timer-text: var(--timer-text, #f3f4f6);
  /* ... etc */
}
```

### 2. **BEM or CSS Modules**
Consider using BEM naming or CSS Modules to avoid style conflicts:
```css
.workout-timer__display {}
.workout-timer__controls {}
.workout-timer__settings {}
```

## Component Architecture

### 1. **Settings as Separate Component**
Make TimerSettings a standalone component that can be rendered anywhere:
```typescript
<WorkoutTimer showSettings={false} />
<TimerSettings 
  config={config}
  onConfigChange={updateConfig}
  className="fixed bottom-0"
/>
```

### 2. **Preset Configurations**
Export common timer presets:
```typescript
export const TIMER_PRESETS = {
  tabataClassic: { type: 'tabata', workTime: 20, restTime: 10, rounds: 8 },
  emom10: { type: 'emom', rounds: 10, interval: 60 },
  amrap20: { type: 'amrap', duration: 1200 },
  // ... etc
}
```

## Integration Helpers

### 1. **React Native Support (Future)**
Design the API to be React Native compatible:
- Avoid direct DOM manipulation
- Use View/Text abstractions where possible
- Keep styles flexible

### 2. **SSR Support**
Ensure server-side rendering works:
```typescript
// Use dynamic imports for client-only features
const SoundManager = dynamic(() => import('./SoundManager'), { ssr: false })
```

## Testing & Documentation

### 1. **Storybook Stories**
Create stories for each component and the full timer:
```typescript
export default {
  title: 'Timer/WorkoutTimer',
  component: WorkoutTimer,
}

export const Default = {}
export const WithPreset = { args: { initialConfig: TIMER_PRESETS.tabataClassic }}
export const CompactMode = { args: { compactMode: true }}
```

### 2. **Integration Examples**
Include examples for common frameworks:
```typescript
// Next.js example
// Remix example  
// Vite example
// React Native example (future)
```

## Performance Considerations

### 1. **Optimize Re-renders**
- Use React.memo for display components
- Implement proper dependency arrays in useEffect
- Consider using useMemo for expensive calculations

### 2. **Code Splitting**
Make advanced features dynamically importable:
```typescript
const AdvancedIntervalEditor = lazy(() => import('./components/AdvancedIntervalEditor'))
```

## Migration Path for Consumers

### 1. **Backwards Compatibility**
If moving components from @workout-timer/react to @workout-timer/ui, provide a migration guide:
```typescript
// Old (if any UI was in react package)
import { SomeComponent } from '@workout-timer/react'

// New
import { SomeComponent } from '@workout-timer/ui'
```

### 2. **Codemod Script (Optional)**
Consider providing a codemod to automatically update imports.

## Package.json Considerations

```json
{
  "sideEffects": false, // For tree-shaking
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": {
      "import": "./dist/styles.css"
    }
  }
}
```

## TypeScript Enhancements

### 1. **Generic Config Type**
Make the timer config generic for custom timer types:
```typescript
export function WorkoutTimer<T extends TimerConfig = TimerConfig>(
  props: WorkoutTimerProps<T>
) { /* ... */ }
```

### 2. **Discriminated Unions**
Use discriminated unions for timer-specific props:
```typescript
type TimerProps = 
  | { type: 'amrap'; duration: number }
  | { type: 'emom'; rounds: number; interval: number }
  | { type: 'tabata'; workTime: number; restTime: number; rounds: number }
  // ... etc
```

## Accessibility

### 1. **ARIA Labels**
Ensure all interactive elements have proper ARIA labels:
```typescript
<button aria-label="Start timer" onClick={start}>
  Start
</button>
```

### 2. **Keyboard Navigation**
- Support keyboard shortcuts (Space to start/pause, R to reset)
- Ensure all controls are keyboard accessible
- Add focus management for modal/settings

### 3. **Screen Reader Support**
- Announce timer state changes
- Provide text alternatives for visual indicators

## Future Considerations

1. **Web Components Version** - Consider building a framework-agnostic web component
2. **Vue/Angular Wrappers** - Provide official wrappers for other frameworks
3. **Timer Sharing** - Add ability to share/export timer configurations
4. **Analytics Hooks** - Optional callbacks for tracking timer usage
5. **Persistence** - LocalStorage support for saving timer state/configs