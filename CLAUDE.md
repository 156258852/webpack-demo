# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React 18 + Webpack 5 project with a modular webpack configuration architecture. The build config is split into focused modules under `config/` directory:

- `config/core/` - Entry, output, and resolve configurations
- `config/rules/` - Module loader rules (JavaScript/TypeScript, styles, assets)
- `config/plugins/` - Webpack plugins (base, CSS, development, production)
- `config/optimization/` - Code splitting and minimization
- `config/utils/` - Shared utilities (env detection, path helpers, port finder)

## Common Commands

### Development
```bash
npm run dev          # Start dev server with hot reload
npm run serve        # Serve production build from dist/ on port 3000
```

### Build
```bash
npm run build        # Production build to dist/
npm run build:analyze # Build with bundle analyzer
```

### Linting
```bash
npm run lint:js      # ESLint for JS/TS files
npm run lint:css     # Stylelint for CSS/SCSS/LESS (auto-fixes)
npm run lint:all     # Run both linters
npm run lint:staged  # Lint staged files (used by husky)
```

Note: No tests are currently configured. `npm test` will exit with an error.

## Architecture Details

### Webpack Configuration Structure

The webpack config uses a modular pattern:

1. **`config/webpack.common.js`** - Base configuration that composes:
   - Core configs (entry, output, resolve) from `config/core/`
   - All module rules from `config/rules/`
   - Common plugins from `config/plugins/`
   - Environment-aware optimization from `config/optimization/`

2. **`config/webpack.dev.js`** - Development overrides:
   - Merges with common config using `webpack-merge`
   - Adds dev server, hot reload, filesystem cache
   - Auto-finds available port if default is busy

3. **`config/webpack.prod.js`** - Production overrides:
   - Externals: React and ReactDOM are not bundled (loaded via CDN)
   - Terser minimizer, compressed cache
   - Performance hints for bundle size

### Module Resolution

- Path alias: `src/*` maps to `./src/*` (tsconfig.json)
- Resolves: `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.wasm`
- CSS preprocessors supported: CSS, SCSS, LESS

### Source Code Layout

```
src/
├── Component/      # Reusable components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── worker/         # Web Workers
├── App.jsx         # Root component
├── main.js         # Entry point
└── style.scss      # Global styles
```

## Code Style

- **ESLint**: React + React Hooks rules, 2-space indentation
  - Allows `.js`, `.jsx`, `.ts`, `.tsx` for JSX
  - Import order enforced: builtin → external → internal → parent → sibling → index
  - Key rules: no-console (warn), no-unused-vars (warn), eqeqeq (error)

- **Stylelint**: Standard config with order plugin
  - Property order: position → box model → typography → background → other
  - Class naming: lowercase with hyphens (`my-class-name`)

## Git Hooks

Husky is configured for pre-commit hooks via `npm run prepare`. Lint-staged runs ESLint and Stylelint on staged files automatically.

## Production Externals

React and ReactDOM are **not** bundled in production builds. The HTML template must load them via CDN before the main bundle:
```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

The HTML template is at `index.html` and is processed by html-webpack-plugin.
