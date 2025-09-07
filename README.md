# 🏋️ Workout Timer

<div align="center">

[![npm version](https://img.shields.io/npm/v/@workout-timer/core.svg)](https://www.npmjs.com/package/@workout-timer/core)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Tests](https://github.com/MattBro/workout-timer/actions/workflows/ci.yml/badge.svg)](https://github.com/MattBro/workout-timer/actions/workflows/ci.yml)

**A powerful, customizable, and headless workout timer library for React applications**

[Demo](https://mattbro.github.io/workout-timer) • [Documentation](#documentation) • [Examples](#examples) • [Contributing](CONTRIBUTING.md)

</div>

---

## ✨ Features

- 🎯 **5 Timer Types** - AMRAP, EMOM, Tabata, For Time, and Custom Intervals
- 🎨 **Fully Customizable** - Headless architecture allows complete UI control
- 🔊 **Sound Effects** - Built-in countdown sounds and interval announcements
- ⚡ **Performance Optimized** - Efficient state management and rendering
- 📱 **Mobile Friendly** - Touch-optimized controls and responsive design
- 🎭 **Theme Support** - 6 built-in themes with custom theme capabilities
- 🧩 **Framework Agnostic Core** - Use with React, Vue, or vanilla JavaScript
- 📦 **Tree Shakeable** - Import only what you need
- 🔧 **TypeScript First** - Full type safety and IntelliSense support
- 🎮 **Keyboard Controls** - Space to play/pause, R to reset, etc.

## 🚀 Quick Start

### Installation

```bash
# npm
npm install @workout-timer/react

# yarn
yarn add @workout-timer/react

# pnpm
pnpm add @workout-timer/react
```

This installs `@workout-timer/react` and pulls `@workout-timer/core` automatically.

### Basic Usage

```tsx
import { TimerProvider, useTimerContext, useTimerDisplay, useTimerConfig } from '@workout-timer/react';

function TimerView() {
  const { snapshot, timerType, roundCount } = useTimerContext();
  const { formattedTime, phaseInfo } = useTimerDisplay(snapshot, timerType, roundCount);
  return (
    <div>
      <h1>{formattedTime}</h1>
      <p>{phaseInfo.text}</p>
    </div>
  );
}

export default function MyTimer() {
  const { config } = useTimerConfig('amrap');
  return (
    <TimerProvider config={config} countdownEnabled countdownTime={10}>
      <TimerView />
    </TimerProvider>
  );
}
```

## 📚 Documentation

### Timer Types

#### AMRAP (As Many Rounds As Possible)
Complete as many rounds as possible in the given time.

```tsx
const timer = useTimer({
  type: 'amrap',
  duration: 1200, // 20 minutes
  countdown: 10
});
```

#### EMOM (Every Minute On the Minute)
Start a new round every minute.

```tsx
const timer = useTimer({
  type: 'emom',
  rounds: 10,
  interval: 60 // 1 minute per round
});
```

#### Tabata
High-intensity interval training with work/rest periods.

```tsx
const timer = useTimer({
  type: 'tabata',
  workTime: 20,
  restTime: 10,
  rounds: 8
});
```

#### For Time
Complete the workout as fast as possible with a time cap.

```tsx
const timer = useTimer({
  type: 'forTime',
  timeCapMinutes: 15,
  rounds: 5
});
```

#### Custom Intervals
Create your own interval patterns.

```tsx
const timer = useTimer({
  type: 'intervals',
  intervals: [
    { name: 'Warmup', duration: 120, type: 'prep' },
    { name: 'Work', duration: 45, type: 'work' },
    { name: 'Rest', duration: 15, type: 'rest' }
  ],
  rounds: 3
});
```

### Advanced Features

#### Sound Management

```tsx
import { useSoundManager } from '@workout-timer/react';

function MyTimer() {
  const soundManager = useSoundManager();
  
  // Control sound settings
  soundManager.setVolume(0.5);
  soundManager.toggleMute();
  soundManager.playCountdownSound(3);
}
```

#### Theme Support

```tsx
import { TimerProvider } from '@workout-timer/react';
import { themes } from '@workout-timer/themes';

function App() {
  return (
    <TimerProvider theme={themes.dark}>
      <MyTimer />
    </TimerProvider>
  );
}
```

#### Custom Hooks

```tsx
import { useTimerConfig, useTimerDisplay } from '@workout-timer/react';

function CustomTimer() {
  const config = useTimerConfig();
  const display = useTimerDisplay();
  
  return (
    <div>
      <h1>{display.mainTime}</h1>
      <p>{display.intervalName}</p>
      <progress value={display.progress} max={100} />
    </div>
  );
}
```

## 🎨 UI Components

While this is a headless library, we provide optional pre-built components:

```tsx
import { 
  TimerDisplay,
  TimerControls,
  TimerProgress,
  IntervalEditor 
} from '@workout-timer/react-ui';

function CompleteTimer() {
  return (
    <div>
      <TimerDisplay />
      <TimerProgress />
      <TimerControls />
      <IntervalEditor />
    </div>
  );
}
```

## 📦 Package Structure

This monorepo contains three packages:

| Package | Description | Size |
|---------|-------------|------|
| `@workout-timer/core` | Framework-agnostic timer logic | ~12kb |
| `@workout-timer/react` | React hooks and providers | ~8kb |
| `@workout-timer/react-ui` | Pre-built React components | ~25kb |

## 🛠️ Development

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Setup

```bash
# Clone the repository
git clone https://github.com/MattBro/workout-timer.git
cd workout-timer

# Install dependencies
pnpm install

# Run development mode
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Type checking
pnpm typecheck
```

### Using In Another Project

- Install from npm (recommended):
  - `pnpm add @workout-timer/react`
  - Requires `react` and `react-dom` in your app.
- Local development (fast iteration without publishing):
  - Link locally: `pnpm add link:../workout-timer/packages/react`
  - In this repo, run watchers: `pnpm --filter @workout-timer/core dev` and `pnpm --filter @workout-timer/react dev`
  - For deploys, prefer a published version or a packed tarball.
- Tarball (no registry):
  - `pnpm --filter @workout-timer/react build && pnpm --filter @workout-timer/react pack`
  - In your app: `pnpm add /path/to/@workout-timer-react-*.tgz`

### Release & Publishing

This repo uses Changesets. Scoped packages publish under the npm org `@workout-timer`.

1) Ensure npm org exists and you’re logged in with publish rights: `npm login`

2) Create a changeset (select package and version bump):
```bash
pnpm changeset
```

3) Version packages (updates versions and changelogs):
```bash
pnpm changeset version
```

4) Commit and publish:
```bash
git add -A && git commit -m "chore(release): version packages"
pnpm release   # runs build and changeset publish
git push --follow-tags origin main
```

Notes:
- For pre-releases: `changeset publish --tag next` and install `@workout-timer/react@next`.
- Inside the monorepo we use `workspace:*` to link packages; external consumers install from npm.

### UX Note: Countdown Display

- Remaining time shows the starting value for one full second, then decrements each second (e.g., 05:00 → 04:59 …).
- At 0, the UI immediately shows “Complete!” without lingering on 00:00.

### Project Structure

```
workout-timer/
├── apps/
│   └── demo/              # Demo application
├── packages/
│   ├── core/              # Core timer logic
│   ├── react/             # React integration
│   └── react-ui/          # React components
└── docs/                  # Documentation
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🗺️ Roadmap

- [ ] Vue.js integration package
- [ ] React Native support
- [ ] Audio customization API
- [ ] Workout templates library
- [ ] Analytics and tracking
- [ ] Offline support with PWA
- [ ] Integration with fitness apps
- [ ] Voice announcements
- [ ] Video workout sync
- [ ] Apple Watch companion app

## 📄 License

MIT © [Matt Brooker](https://github.com/MattBro)

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Bundled with [tsup](https://tsup.egoist.dev/)
- Tested with [Vitest](https://vitest.dev/)
- Managed with [pnpm](https://pnpm.io/)

## 💬 Community

- [GitHub Discussions](https://github.com/MattBro/workout-timer/discussions)
- [Report Issues](https://github.com/MattBro/workout-timer/issues)
- [Request Features](https://github.com/MattBro/workout-timer/issues/new?template=feature_request.md)

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/MattBro/workout-timer?style=social)
![GitHub forks](https://img.shields.io/github/forks/MattBro/workout-timer?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/MattBro/workout-timer?style=social)

---

<div align="center">
Made with ❤️ by the fitness and coding community
</div>
