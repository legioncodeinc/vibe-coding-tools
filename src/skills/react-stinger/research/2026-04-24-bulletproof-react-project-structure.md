# Bulletproof-React: Project Structure

**Source:** https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md
**Retrieved:** 2026-04-24
**Query used:** Direct WebFetch (raw.githubusercontent.com)

## Summary

Bulletproof-react prescribes a feature-based folder layout under `src/`. Most application code lives in `src/features/<feature-name>/`, each feature self-contained with its own `api/`, `components/`, `hooks/`, `stores/`, `types/`, `utils/`. Shared code sits at root-level `src/components`, `src/hooks`, `src/lib`, `src/utils`, `src/types`. App-level routing and global providers live in `src/app/`.

## Canonical folder layout

```
src/
  app/            routes, app.tsx, provider.tsx, router.tsx
  assets/         static images/fonts
  components/     SHARED components used across features
  config/         global configuration, env exports
  features/       FEATURE MODULES (the bulk of the app)
  hooks/          shared hooks
  lib/            pre-configured libraries (e.g., api-client.ts)
  stores/         global state stores
  testing/        test utilities, mocks, MSW handlers
  types/          shared types
  utils/          shared utilities
```

## Feature layout

```
src/features/awesome-feature/
  api/            request declarations + hooks
  assets/
  components/
  hooks/
  stores/
  types/
  utils/
```

Include only the folders the feature needs.

## Key rules

1. **Do not import across features.** `src/features/comments` cannot import from `src/features/discussions`. Compose features at the `app/` layer.
2. **Unidirectional architecture.** Flow is `shared -> features -> app`. App imports from features and shared; features import only from shared; shared imports from nothing else in src.
3. **Barrel files are discouraged.** Vite tree-shaking suffers. Import files directly.
4. **Enforce with ESLint** via `import/no-restricted-paths` with zones per feature.

## ESLint enforcement (quotation)

> "To forbid cross-feature imports, you can use ESLint: `'import/no-restricted-paths': [ 'error', { zones: [...] } ]`"

Used with zones like:

```js
{ target: './src/features/auth', from: './src/features', except: ['./auth'] }
```

And for unidirectional flow:

```js
{ target: './src/features', from: './src/app' }
{ target: ['./src/components', './src/hooks', './src/lib', './src/types', './src/utils'], from: ['./src/features', './src/app'] }
```

## Relevance to this stinger

This is the spine of `guides/01-project-structure.md`. Also informs `templates/project-structure.md` and `templates/eslint.config.js`. The barrel-file warning feeds `guides/12-anti-patterns.md`.
