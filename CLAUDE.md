# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Ant Design Pro project built with UmiJS Max (v4). It's a React enterprise application framework using React 19, Ant Design 5, and TypeScript.

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (with mock)
npm start

# Start development server without mock
npm run start:no-mock

# Start with specific environment (dev/test/pre)
npm run start:dev    # Connects to dev backend
npm run start:test   # Uses test environment proxy

# Build for production
npm run build

# Preview production build
npm run preview

# Linting (Biome + TypeScript check)
npm run lint

# Fix lint errors
npm run biome:lint

# TypeScript type check
npm run tsc

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Generate API services from OpenAPI
npm run openapi
```

## Architecture

### UmiJS Max Framework

The project uses UmiJS Max, which provides built-in plugins for:
- **request**: HTTP client based on axios with unified error handling
- **access**: Permission control based on user roles
- **initialState**: Global initial state management (user info, settings)
- **model**: Data flow plugin for state management
- **locale**: Internationalization (i18n)
- **layout**: ProLayout for admin UI

### Key Files

| File | Purpose |
|------|---------|
| `src/app.tsx` | Runtime configuration: `getInitialState()` for user auth, `layout` for ProLayout config, `request` for API base URL |
| `src/access.ts` | Permission definitions (e.g., `canAdmin`) based on `initialState.currentUser` |
| `src/requestErrorConfig.ts` | Request/response interceptors and error handling |
| `config/config.ts` | UmiJS configuration (routes, plugins, proxy, theme) |
| `config/routes.ts` | Route definitions with `access` property for permission control |
| `config/defaultSettings.ts` | ProLayout theme and layout settings |

### Directory Structure

```
src/
├── components/      # Shared components (Footer, HeaderDropdown, etc.)
├── locales/         # i18n translations (zh-CN, en-US, etc.)
├── pages/           # Route pages (each folder = route)
├── services/        # API service functions (auto-generated from OpenAPI)
│   ├── ant-design-pro/  # Main API services
│   └── swagger/         # Swagger-generated services
├── access.ts        # Permission definitions
├── app.tsx          # Runtime configuration entry
└── requestErrorConfig.ts  # HTTP error handling
config/
├── config.ts        # Main UmiJS config
├── routes.ts        # Route definitions
├── defaultSettings.ts  # Layout settings
├── proxy.ts         # Dev proxy config
└── oneapi.json      # OpenAPI schema for code generation
mock/                # Mock data for development
```

### Route Permissions

Routes use the `access` property for permission control. The `access` value matches a key returned from `src/access.ts`:

```typescript
// config/routes.ts
{ path: '/admin', access: 'canAdmin', ... }

// src/access.ts
return { canAdmin: currentUser?.access === 'admin' }
```

### API Layer

Services are defined in `src/services/`. Use OpenAPI generation:

```bash
npm run openapi  # Generates services from config/openapi.json
```

API requests use `@umijs/max` request with base URL configured in `src/app.tsx`:

```typescript
export const request = {
  baseURL: 'https://proapi.azurewebsites.net',
  ...errorConfig,
};
```

### Mock Development

Mock files are in `mock/` directory. They are automatically loaded when running `npm start` (without `MOCK=none`).

### Testing

Tests use Jest with `@testing-library/react`. Test setup is in `tests/setupTests.jsx`.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `REACT_APP_ENV` | Environment name: `dev`, `test`, `pre` (determines proxy config) |
| `MOCK` | Set to `none` to disable mock server |
| `UMI_ENV` | Umi environment (`dev`) |
| `ANALYZE` | Set to `1` to analyze bundle size |

## Code Style

- Uses Biome for linting (not ESLint)
- Single quotes for JavaScript/TypeScript
- Space indentation
- Lint excludes: `.umi`, `src/services`, `mock` directories

## Path Aliases

- `@/*` maps to `./src/*`
- `@@/*` maps to `./src/.umi/*`
