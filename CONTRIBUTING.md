# Contributing to Workout Timer

First off, thank you for considering contributing to Workout Timer! It's people like you that make Workout Timer such a great tool. 🎉

## Code of Conduct

This project and everyone participating in it is governed by the [Workout Timer Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [matt@workoutimer.dev].

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check [existing issues](https://github.com/matthewbrooker/workout-timer/issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible.

**How to submit a good bug report:**

Bugs are tracked as [GitHub issues](https://github.com/matthewbrooker/workout-timer/issues). Create an issue and provide the following information:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs** if possible
- **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://github.com/matthewbrooker/workout-timer/issues). When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**
- **List some other applications where this enhancement exists** (if applicable)

### Your First Code Contribution

Unsure where to begin contributing? You can start by looking through these issues:

- [Good First Issues](https://github.com/matthewbrooker/workout-timer/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) - issues which should only require a few lines of code
- [Help Wanted](https://github.com/matthewbrooker/workout-timer/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) - issues which need extra attention

## Development Process

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/workout-timer.git
   cd workout-timer
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/matthewbrooker/workout-timer.git
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

### Development Workflow

1. **Start development mode**
   ```bash
   pnpm dev
   ```
   This will start the demo app and watch for changes in all packages.

2. **Make your changes**
   - Write your code
   - Add tests if applicable
   - Update documentation if needed

3. **Run tests**
   ```bash
   pnpm test
   ```

4. **Run type checking**
   ```bash
   pnpm typecheck
   ```

5. **Run linting**
   ```bash
   pnpm lint
   ```

6. **Build packages**
   ```bash
   pnpm build
   ```

### Project Structure

```
workout-timer/
├── apps/
│   └── demo/              # Demo application for testing
├── packages/
│   ├── core/              # Core timer logic (framework agnostic)
│   ├── react/             # React hooks and providers
│   └── react-ui/          # Pre-built React components
├── docs/                  # Documentation
└── scripts/               # Build and utility scripts
```

### Code Style Guidelines

#### TypeScript

- Use TypeScript for all new code
- Provide proper types (avoid `any`)
- Use interfaces over type aliases when possible
- Export types that might be useful for consumers

```typescript
// Good
export interface TimerConfig {
  duration: number;
  countdown?: number;
}

// Avoid
export type TimerConfig = {
  duration: any;
}
```

#### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Memoize expensive computations

```tsx
// Good
export const TimerDisplay: React.FC<TimerDisplayProps> = memo(({ time, state }) => {
  const formattedTime = useMemo(() => formatTime(time), [time]);
  
  return <div>{formattedTime}</div>;
});

// Avoid
export function TimerDisplay(props) {
  return <div>{formatTime(props.time)}</div>;
}
```

#### General

- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)
- Add JSDoc comments for public APIs
- Avoid magic numbers - use constants

```typescript
// Good
const DEFAULT_COUNTDOWN_SECONDS = 10;
const MINUTE_IN_SECONDS = 60;

/**
 * Formats seconds into MM:SS format
 * @param seconds - Total seconds to format
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / MINUTE_IN_SECONDS);
  const remainingSeconds = seconds % MINUTE_IN_SECONDS;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Avoid
export function fmt(s) {
  return `${Math.floor(s/60)}:${s%60}`;
}
```

### Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage
- Use descriptive test names

```typescript
// Good
describe('AMRAPTimer', () => {
  it('should start with idle state', () => {
    const timer = new AMRAPTimer({ duration: 300 });
    expect(timer.getSnapshot().state).toBe(TimerState.IDLE);
  });

  it('should count up when running', () => {
    // test implementation
  });
});

// Avoid
test('timer works', () => {
  // unclear test
});
```

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/). Each commit message should have the format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files

#### Examples

```bash
# Feature
git commit -m "feat(core): add countdown support to all timer types"

# Bug fix
git commit -m "fix(react): prevent memory leak in useTimer hook"

# Documentation
git commit -m "docs: update installation instructions for yarn users"

# Breaking change
git commit -m "feat(core): change Timer API to use milliseconds

BREAKING CHANGE: Timer.duration now expects milliseconds instead of seconds"
```

### Pull Request Process

1. **Update your branch with the latest changes from upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Ensure the base fork is `matthewbrooker/workout-timer` and base branch is `main`
   - Fill in the PR template with all relevant information

4. **PR Requirements**
   - All tests must pass
   - Code must be properly typed (no TypeScript errors)
   - Must follow code style guidelines
   - Must include tests for new features
   - Must update documentation if needed
   - Must have a clear description of changes

5. **Review Process**
   - A maintainer will review your PR
   - Address any feedback or requested changes
   - Once approved, a maintainer will merge your PR

### Release Process

We use [Changesets](https://github.com/changesets/changesets) for version management:

1. **Create a changeset**
   ```bash
   pnpm changeset
   ```
   Follow the prompts to describe your changes.

2. **Version updates and releases are handled by maintainers**

## Development Tips

### Working on Core Package

```bash
cd packages/core
pnpm dev  # Watch mode
pnpm test # Run tests
```

### Working on React Package

```bash
cd packages/react
pnpm dev  # Watch mode
pnpm test # Run tests
```

### Testing with Demo App

The demo app in `apps/demo` is the best place to test your changes:

```bash
cd apps/demo
pnpm dev  # Start development server
```

### Debugging

1. Use browser DevTools for client-side debugging
2. Add `console.log` statements (remove before committing)
3. Use VS Code debugger with the provided launch configuration

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion in [GitHub Discussions](https://github.com/matthewbrooker/workout-timer/discussions)
- Reach out to maintainers

## Recognition

Contributors will be recognized in:
- The README.md contributors section
- Release notes
- The project's CONTRIBUTORS.md file

Thank you for contributing to Workout Timer! 🏋️‍♀️🏋️‍♂️