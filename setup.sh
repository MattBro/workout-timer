#!/bin/bash

echo "🚀 Setting up workout-timer monorepo..."

# Initialize pnpm workspace
echo "Creating pnpm-workspace.yaml..."
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'packages/*'
EOF

# Create package directories
echo "Creating package structure..."
mkdir -p packages/core/src
mkdir -p packages/react/src
mkdir -p packages/react-ui/src

# Initialize root package.json
echo "Initializing root package.json..."
cat > package.json << 'EOF'
{
  "name": "workout-timer",
  "private": true,
  "version": "0.0.0",
  "description": "Monorepo for workout timer packages",
  "scripts": {
    "build": "pnpm -r build",
    "dev": "pnpm -r dev",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck"
  },
  "devDependencies": {
    "@changesets/cli": "^2.26.0",
    "@types/node": "^20.0.0",
    "tsup": "^7.0.0",
    "typescript": "^5.0.0",
    "vitest": "^0.34.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
EOF

# Create TypeScript config
echo "Creating TypeScript configuration..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "exclude": ["node_modules", "dist", "build"]
}
EOF

# Create .gitignore
echo "Creating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules
.pnp
.pnp.js

# Build outputs
dist
build
*.tsbuildinfo

# Testing
coverage
.nyc_output

# IDE
.vscode
.idea
*.sublime-*
.DS_Store

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Environment
.env
.env.local
.env.*.local

# Changesets
.changeset/*.md
!.changeset/README.md
EOF

# Create README
echo "Creating main README..."
cat > README.md << 'EOF'
# Workout Timer

A headless, customizable workout timer library for React applications.

## Packages

- `@workout-timer/core` - Core timer logic (framework agnostic)
- `@workout-timer/react` - React hooks and providers
- `@workout-timer/react-ui` - Pre-built React components

## Installation

```bash
npm install @workout-timer/react
# or
pnpm add @workout-timer/react
```

## Quick Start

```tsx
import { useTimer } from '@workout-timer/react';

function MyTimer() {
  const timer = useTimer({
    type: 'amrap',
    duration: 300 // 5 minutes
  });

  return (
    <div>
      <div>{timer.formattedTime}</div>
      <button onClick={timer.start}>Start</button>
      <button onClick={timer.pause}>Pause</button>
    </div>
  );
}
```

## Documentation

See [/docs](./docs) for full documentation.

## License

MIT
EOF

echo ""
echo "✅ Setup complete! Next steps:"
echo ""
echo "1. Install dependencies:"
echo "   pnpm install"
echo ""
echo "2. Create the core package:"
echo "   cd packages/core"
echo "   pnpm init"
echo ""
echo "3. Start developing!"
echo ""
echo "See /docs for full documentation and implementation examples."