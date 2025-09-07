# @workout-timer/ui – Migration Plan

This document outlines how to extract all reusable React UI from the demo app into a new package: `@workout-timer/ui`. The goal is a clean separation between core logic (`@workout-timer/core`), hooks/contexts (`@workout-timer/react`), and reusable UI (`@workout-timer/ui`).

## Goals
- Provide a ready-to-use `<WorkoutTimer />` component for apps (tri-coach2 and others).
- Make all UI components reusable and style-agnostic.
- Keep `@workout-timer/react` focused on hooks, contexts, and types only.
- Keep the demo app as a thin showcase using `@workout-timer/ui`.

## Packages Overview
- `@workout-timer/core`: Timer engine and types (no React).
- `@workout-timer/react`: React hooks + contexts around core (no UI components).
- `@workout-timer/ui`: All reusable React UI components + `<WorkoutTimer />`.

## New Package Skeleton (packages/ui)
```
packages/ui/
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── src/
    ├── components/
    │   ├── TimerDisplay.tsx
    │   ├── TimerControls.tsx
    │   ├── TimerPhaseIndicator.tsx
    │   ├── TimerProgress.tsx
    │   ├── TimerScreen.tsx
    │   ├── TimerSettings.tsx
    │   ├── TappableNumber.tsx
    │   ├── TappableTime.tsx
    │   ├── NumberPickerModal.tsx (wheel)
    │   ├── ScrollableTimePicker.tsx
    │   ├── IntervalEditor.tsx
    │   └── AdvancedIntervalEditor.tsx
    ├── components/WorkoutTimer.tsx
    └── index.ts
```

## Ready-to-use Component
```
export interface WorkoutTimerProps {
  activityId?: string;
  initialConfig?: TimerConfig;
  onConfigChange?: (config: TimerConfig) => void;
  className?: string;
  theme?: 'dark' | 'light' | 'charcoal';
}

export function WorkoutTimer(props: WorkoutTimerProps) {
  // Composes providers from @workout-timer/react + TimerScreen + settings UI
}
```

## Styling Strategy
- Components accept `className` and minimal, themeable class hooks.
- No hard Tailwind dependency; document Tailwind usage in README.
- Keep visuals neutral and overridable.

## External UI Deps (ui package)
- `@radix-ui/react-slider` for sliders.
- `react-mobile-picker` for wheel pickers.
- Optional: `clsx` for class merging.

## Migration Steps
1) Scaffold `packages/ui` (package.json, tsconfig, tsup, index exports).
2) Move UI files from `apps/demo/src/components` to `packages/ui/src/components`.
   - Adjust imports to use `@workout-timer/react` hooks/contexts/types.
   - Keep component APIs unchanged where possible; add `className` props.
3) Implement `components/WorkoutTimer.tsx` that wires providers, screen, and settings.
4) Export from `packages/ui/src/index.ts`:
   - `WorkoutTimer` and all individual UI components for opt-in composition.
5) Update `@workout-timer/react` to remove any UI exports (hooks/contexts only).
6) Switch demo to consume `@workout-timer/ui`:
   - `import { WorkoutTimer } from '@workout-timer/ui'`
   - Keep demo styles; remove copied component code.
7) Build + Typecheck all packages.
8) Add Changesets and release:
   - `@workout-timer/ui@0.1.0` (new).
   - Patch `@workout-timer/react` (remove UI exports if any were added).
   - Publish packages. Deploy demo to GitHub Pages.

## Component Mapping (Demo → UI)
- TimerScreen, TimerSettings, TimerControls, TimerDisplay, TimerPhaseIndicator, TimerProgress
- TappableNumber, TappableTime, NumberPickerModal (wheel), ScrollableTimePicker
- IntervalEditor, AdvancedIntervalEditor

## Demo App After Migration
```
import { WorkoutTimer } from '@workout-timer/ui';

export default function App() {
  return <WorkoutTimer />;
}
```

## Release Checklist
- [ ] UI package builds CJS/ESM + d.ts with `tsup`.
- [ ] Public exports verified in `packages/ui/src/index.ts`.
- [ ] Demo runs against the built UI package (workspace link).
- [ ] Changesets added and versions bumped.
- [ ] `pnpm release` publishes new UI and bumps react if needed.
- [ ] Demo deployed.

## Incorporate Recommendations
See `docs/ui-package-recommendations.md` for API and design enhancements. We will incorporate the following in the UI package:

- API: Expand `WorkoutTimer` props (soundEnabled, callbacks, compactMode, hideControls, theme).
- Headless: Provide a `useWorkoutTimer` hook that composes `@workout-timer/react` for maximum flexibility.
- Exports: Re-export granular UI components and their prop types; consider optional styles export later.
- Styling: Use CSS variables for theming; keep className overrides; avoid Tailwind as a hard dependency.
- SSR/Native: Avoid direct DOM-only code; gate browser-only APIs; future RN-friendly abstractions.
- Performance: Memoize display components and use proper dependency arrays.
- Packaging: `sideEffects: false` for tree-shaking; stable ESM/CJS/Types exports.

## Risks / Mitigations
- Breaking imports: Provide clear migration notes; keep exports stable.
- Styling regressions: Keep neutral defaults; test dark/light/charcoal.
- Dependency bloat: Keep UI deps minimal and well-maintained.

## Follow-ups
- Add README with usage examples for `@workout-timer/ui`.
- Add storybook (optional) or docs page to showcase components.
- Add basic tests for key UI components (render + interaction).
