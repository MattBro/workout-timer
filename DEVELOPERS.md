# Developer Guide

This guide provides comprehensive information for developers working on the Workout Timer project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Documentation](#documentation)
- [Release Process](#release-process)
- [CI/CD Pipeline](#cicd-pipeline)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git
- VS Code (recommended)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/matthewbrooker/workout-timer.git
   cd workout-timer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build all packages**
   ```bash
   pnpm build
   ```

4. **Start development mode**
   ```bash
   pnpm dev
   ```

### VS Code Setup

Install recommended extensions:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
# Or open VS Code and accept the prompt to install recommended extensions
```

## Development Workflow

### Available Scripts

#### Root Level Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all packages in watch mode |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm lint` | Run ESLint on all files |
| `pnpm lint:fix` | Fix auto-fixable lint issues |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting without fixing |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm size` | Check bundle sizes |
| `pnpm changeset` | Create a changeset for version bumps |

#### Package-Specific Commands

Navigate to a specific package and run:
```bash
cd packages/core
pnpm dev    # Watch mode for this package
pnpm test   # Run tests for this package
pnpm build  # Build this package
```

### Development Flow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following our style guide
   - Add/update tests as needed
   - Update documentation

3. **Run quality checks**
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm format
   ```

4. **Create a changeset** (for changes that affect published packages)
   ```bash
   pnpm changeset
   ```
   Follow the prompts to describe your changes.

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(core): add new timer feature"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a PR on GitHub.

## Code Quality

### ESLint

Our ESLint configuration enforces:
- TypeScript best practices
- React hooks rules
- Import ordering
- Accessibility standards

Run linting:
```bash
pnpm lint        # Check for issues
pnpm lint:fix    # Auto-fix issues
```

### Prettier

Code formatting is handled by Prettier:
```bash
pnpm format       # Format all files
pnpm format:check # Check formatting
```

### TypeScript

We use strict TypeScript configuration:
```bash
pnpm typecheck    # Run type checking
```

### Bundle Size

Monitor bundle sizes:
```bash
pnpm size         # Check current sizes
```

Size limits are configured in `.size-limit.json`.

## Testing

### Running Tests

```bash
pnpm test                 # Run all tests
pnpm test:coverage        # With coverage report
pnpm test -- --watch      # Watch mode
```

### Writing Tests

Tests are written using Vitest. Place test files next to the code they test:
```
src/
  timers/
    AMRAPTimer.ts
    AMRAPTimer.test.ts
```

Example test:
```typescript
import { describe, it, expect } from 'vitest';
import { AMRAPTimer } from './AMRAPTimer';

describe('AMRAPTimer', () => {
  it('should initialize with correct state', () => {
    const timer = new AMRAPTimer({ duration: 300 });
    expect(timer.getSnapshot().state).toBe('idle');
  });
});
```

### Coverage Requirements

We aim for:
- 80% line coverage
- 80% branch coverage
- 80% function coverage

Check coverage:
```bash
pnpm test:coverage
open coverage/index.html  # View HTML report
```

## Documentation

### Code Documentation

Use JSDoc comments for public APIs:
```typescript
/**
 * Creates a new timer instance
 * @param config - Timer configuration
 * @returns Timer instance
 */
export function createTimer(config: TimerConfig): Timer {
  // ...
}
```

### README Updates

Update relevant README files when:
- Adding new features
- Changing APIs
- Adding new packages

### API Documentation

API documentation is auto-generated from TypeScript types and JSDoc comments.

## Release Process

We use Changesets for version management and releases.

### Creating a Release

1. **Create changesets during development**
   ```bash
   pnpm changeset
   ```

2. **Version packages** (usually done by maintainers)
   ```bash
   pnpm version
   ```

3. **Release** (automated via CI)
   ```bash
   pnpm release
   ```

### Versioning Strategy

We follow [Semantic Versioning](https://semver.org/):
- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features
- **Patch** (0.0.1): Bug fixes

## CI/CD Pipeline

### GitHub Actions Workflows

#### CI Workflow (`.github/workflows/ci.yml`)

Runs on every push and PR:
1. Linting
2. Type checking
3. Tests (Node 18, 20, 22)
4. Build verification
5. Bundle size check
6. Coverage reporting

#### Release Workflow (`.github/workflows/release.yml`)

Runs on push to main:
1. Creates release PR when changesets exist
2. Publishes to npm when release PR is merged
3. Creates GitHub releases

### Quality Gates

PRs must pass:
- ✅ All CI checks
- ✅ Code review
- ✅ No merge conflicts
- ✅ Changeset added (if needed)

## Troubleshooting

### Common Issues

#### Installation Issues

```bash
# Clear caches and reinstall
rm -rf node_modules
rm -rf packages/*/node_modules
rm pnpm-lock.yaml
pnpm install
```

#### Build Issues

```bash
# Clean build artifacts
rm -rf packages/*/dist
pnpm build
```

#### Type Checking Issues

```bash
# Restart TypeScript server in VS Code
Cmd+Shift+P > "TypeScript: Restart TS Server"
```

#### Test Issues

```bash
# Clear test cache
pnpm test -- --clearCache
```

### Getting Help

- Check existing [GitHub Issues](https://github.com/matthewbrooker/workout-timer/issues)
- Start a [Discussion](https://github.com/matthewbrooker/workout-timer/discussions)
- Review this guide and [CONTRIBUTING.md](CONTRIBUTING.md)

## Best Practices

### Git Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):
```bash
feat(core): add new timer type
fix(react): resolve memory leak in useTimer
docs: update API documentation
chore: update dependencies
```

### Code Review Checklist

Before requesting review:
- [ ] Tests pass locally
- [ ] Lint and format checks pass
- [ ] TypeScript has no errors
- [ ] Documentation is updated
- [ ] Changeset is created
- [ ] PR description is clear

### Performance Considerations

- Use `React.memo` for expensive components
- Implement proper cleanup in hooks
- Avoid unnecessary re-renders
- Monitor bundle size impact

## Resources

- [Project README](README.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [pnpm Documentation](https://pnpm.io/)
- [Vitest Documentation](https://vitest.dev/)

---

Happy coding! 🎉