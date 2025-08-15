# Collaboration Guide

## Current Development Status

### Recent Major Refactor
- ✅ **Clean Architecture Implementation** - Completed major refactor with:
  - **Context-based state management** via `TimerContext`
  - **Custom hooks** for logic separation (`useTimerConfig`, `useTimerDisplay`)
  - **Component decomposition** following SOLID principles
  - **Centralized configuration** with type-safe interfaces
  - **Separation of concerns** between UI and business logic

### Active Work Areas

#### Developer 1 (Your Friend)
- ✅ Major architecture refactor to clean code patterns
- ✅ Adding countdown feature to core library
- ✅ Implementing countdown UI in settings panel
- ✅ Created TimerContext provider for state management
- ✅ Split components into focused, single-responsibility modules
- Working on: Core timer functionality enhancements

#### Developer 2 (Claude)
- ✅ Fixed black screen issue (missing export build)
- ✅ Added scrollable time picker with snap behavior
- ✅ Implemented matte/skeuomorphic design (stable colors)
- ✅ Added click-outside-to-close for settings panel
- ✅ Created better round picker for For Time mode
- ✅ Added CountdownWrapper with proper typing
- ✅ Redesigned intervals UI with visual timeline and presets
- ✅ Implemented Mario Kart-style countdown sounds
- ✅ Reviewed and understood clean architecture refactor
- 🚧 **CURRENTLY WORKING ON: Major improvements for open source release**
  - ✅ Created proper TypeScript types (timer.types.ts)
  - ✅ Added theme system with 6 themes (ThemeContext)
  - ✅ Fixed all type safety issues in TimerContext
  - ✅ Added error boundaries for graceful error handling
  - ✅ Extracted useTimerSound custom hook
  - 🚧 Adding timer strategy pattern
  - 🚧 Adding memoization for performance
  - 🚧 Adding JSDoc documentation for contributors

## File Ownership

### Core Files (Coordinate before editing)
- `apps/demo/src/App.tsx` - **ACTIVE EDITS** by both developers
- `packages/core/*` - Primary: Developer 1

### New Files Being Created (No conflicts)
- `apps/demo/src/hooks/*` - Claude creating
- `apps/demo/src/contexts/*` - Claude creating  
- `apps/demo/src/components/Timer/*` - Claude creating
- `apps/demo/src/components/Settings/*` - Claude creating

## Communication Protocol

### Before Making Changes
1. Check this document for file ownership
2. For shared files, communicate intent before editing
3. Pull latest changes frequently

### Conflict Resolution
- If editing same file: Coordinate via comments/messages
- Prefer creating new files over modifying existing ones
- Use feature branches if working on major changes

## Current Tasks

### Immediate Priority
1. ✅ Countdown feature implementation (Developer 1)
2. 🚧 Component refactoring (Claude)
3. 🚧 Hook extraction (Claude)

### Next Up
- [ ] Testing suite setup
- [ ] Documentation updates
- [ ] Performance optimizations

## Architecture Decisions

### Agreed Patterns
- Monorepo with pnpm workspaces
- TypeScript for all new code
- Framework-agnostic core with React adapters
- Custom hooks for logic separation
- Context providers for state management

### Package Structure
```
@workout-timer/core - Pure TS logic (Developer 1 primary)
@workout-timer/react - React hooks (Claude primary)
@workout-timer/react-ui - Components (Claude primary)
```

## Git Workflow

### Branch Strategy
- `main` - Production ready
- `feature/*` - New features
- `refactor/*` - Architecture improvements
- `fix/*` - Bug fixes

### Commit Messages
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`
- Reference issue numbers when applicable
- Keep commits atomic and focused

## Testing Requirements

Before merging:
1. Run `npm run typecheck`
2. Run `npm run lint`
3. Run `npm run test` (when available)
4. Ensure no console errors in demo app

## Notes

- Countdown feature added by Developer 1 - working great!
- Refactoring in progress to improve maintainability
- Goal: Clean, reusable, open-source friendly library

## Contact

- Leave notes here or in code comments for async collaboration
- Use `// TODO: [name]` for task assignments
- Use `// FIXME: [description]` for known issues

---
Last updated: [timestamp]