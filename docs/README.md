# Workout Timer Library Documentation

This directory contains comprehensive documentation for building a modular, open-source workout timer library that can be published as an NPM package and integrated into the tri-coach app.

## Documents

### 1. [Workout Timer Library Design](./workout-timer-library-design.md)
Complete architectural design and implementation strategy including:
- Architecture options (headless core, React hooks, web components)
- Package structure and monorepo setup
- Database schema for activity integration
- NPM publishing best practices
- Development workflow and timeline

### 2. [Timer Types Reference](./timer-types-reference.md)
Comprehensive reference of all timer types:
- Standard workout timers (AMRAP, EMOM, Tabata, etc.)
- Triathlon-specific timers (Brick, Swim Intervals, Track)
- Audio cue patterns
- Display modes and user preferences

### 3. [Implementation Example](./implementation-example.md)
Complete code examples including:
- Core timer class implementation
- React hooks and providers
- UI components
- Integration with tri-coach app
- Testing strategies
- NPM publishing configuration

## Quick Start Guide

### 1. Choose Architecture
**Recommended:** Headless Core + React Hooks
- `@workout-timer/core` - Framework-agnostic timer logic
- `@workout-timer/react` - React integration layer
- `@workout-timer/react-ui` - Optional pre-built components

### 2. Set Up Monorepo
```bash
# Initialize monorepo with pnpm workspaces
pnpm init
pnpm add -D tsup typescript vitest @changesets/cli

# Create package structure
mkdir -p packages/{core,react,react-ui}/src
```

### 3. Implement Core Timer
Start with the base `Timer` class and implement specific timer types (AMRAP, EMOM, etc.)

### 4. Create React Integration
Build `useTimer` hook and optional UI components

### 5. Integrate with Tri-Coach
- Add database tables for timer configurations
- Create activity timer modal component
- Link timers to activities

### 6. Publish to NPM
```bash
# Build all packages
pnpm build

# Run tests
pnpm test

# Publish
pnpm changeset publish
```

## Key Features

### Timer Types
- **AMRAP** - As Many Rounds As Possible
- **EMOM** - Every Minute On the Minute  
- **Tabata** - 20/10 intervals
- **For Time** - Complete work with time cap
- **Intervals** - Custom work/rest periods
- **Custom** - Fully configurable segments

### Core Capabilities
- State management (idle, ready, running, paused, finished)
- Event system for state changes and ticks
- Countdown before start
- Audio cues and alerts
- Progress tracking
- Round/interval management

### React Features
- `useTimer` hook for easy integration
- Timer provider for multiple timers
- Pre-built display components
- Customizable themes
- Mobile-friendly controls

## Integration with Tri-Coach

### Database Schema
```sql
-- Timer configurations
CREATE TABLE activity_timers (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER REFERENCES activities(id),
  name VARCHAR(255),
  config JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Timer session history
CREATE TABLE timer_sessions (
  id SERIAL PRIMARY KEY,
  activity_timer_id INTEGER REFERENCES activity_timers(id),
  user_id INTEGER REFERENCES users(id),
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  paused_duration INTEGER DEFAULT 0,
  rounds_completed INTEGER,
  data JSONB
);
```

### UI Integration
Activities will have a "Start Timer" button that opens a modal with:
- Timer display showing time, rounds, progress
- Start/pause/reset controls
- Audio and visual feedback
- Session tracking and history

## Development Priorities

### Phase 1: MVP (Week 1-2)
- [ ] Core timer logic (AMRAP, EMOM, Tabata)
- [ ] Basic React hook
- [ ] Simple display component
- [ ] Integration with activities

### Phase 2: Enhanced Features (Week 3-4)
- [ ] Additional timer types
- [ ] Audio cues
- [ ] Timer presets
- [ ] Session history

### Phase 3: Polish & Publish (Week 5-6)
- [ ] Documentation
- [ ] Examples and demos
- [ ] NPM publishing
- [ ] Marketing website

## Design Principles

1. **Headless First** - Core logic separated from UI
2. **Framework Agnostic** - Can work with any frontend framework
3. **Type Safe** - Full TypeScript support
4. **Accessible** - ARIA labels, keyboard navigation
5. **Mobile Friendly** - Touch controls, responsive design
6. **Performant** - Efficient state updates, minimal re-renders
7. **Extensible** - Easy to add new timer types
8. **Well Tested** - Comprehensive unit and integration tests

## License

MIT License - Open source and free to use

## Contributing

This will be an open-source project. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Submit a pull request

## Resources

- [SmartWOD](https://smartwodapp.com/) - Inspiration
- [React Hook Form](https://react-hook-form.com/) - Good example of headless library
- [Radix UI](https://www.radix-ui.com/) - Excellent headless component patterns
- [Changsets](https://github.com/changesets/changesets) - Version management
- [TSDX](https://tsdx.io/) - TypeScript library starter