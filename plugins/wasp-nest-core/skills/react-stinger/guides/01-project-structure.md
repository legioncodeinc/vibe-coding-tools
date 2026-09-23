# 01: Project Structure

The feature-based folder layout from bulletproof-react. Follow it. Deviations need justification.

Source: `research/2026-04-24-bulletproof-react-project-structure.md`

## The canonical tree

```
src/
  app/            routes, app.tsx, provider.tsx, router.tsx
  assets/         static images/fonts
  components/     SHARED components used across features
  config/         global config, env exports
  features/       FEATURE MODULES (the bulk of code)
  hooks/          shared hooks
  lib/            pre-configured libraries (e.g., lib/api-client.ts)
  stores/         global state stores
  testing/        test utilities, MSW handlers, mocks
  types/          shared types
  utils/          shared utilities
```

See `templates/project-structure.md` for a drop-in scaffold.

## Feature layout

```
src/features/awesome-feature/
  api/            request declarations + hooks
  assets/
  components/     components scoped to this feature
  hooks/
  stores/
  types/
  utils/
```

Include only the subfolders the feature needs. Empty folders are clutter.

## Three rules that matter

### Rule 1: No cross-feature imports

`src/features/comments` must not import from `src/features/discussions`. Features compose **at the `app/` layer**, not by reaching into each other.

Enforce with ESLint `import/no-restricted-paths`:

```js
{
  target: './src/features/comments',
  from: './src/features',
  except: ['./comments'],
}
```

See `templates/eslint.config.js` for the full zone list.

### Rule 2: Unidirectional flow

`shared → features → app`. Shared imports nothing. Features import only from shared. App imports from features and shared. Enforces a DAG with no back-edges.

```js
{ target: './src/features', from: './src/app' }
{ target: ['./src/components', './src/hooks', './src/lib', './src/types', './src/utils'],
  from: ['./src/features', './src/app'] }
```

### Rule 3: No barrel files

`index.ts` files that re-export everything from a folder break Vite tree-shaking, slow builds, and hide circular dependencies. Import files directly:

```ts
// bad
import { Button } from '@/components';

// good
import { Button } from '@/components/ui/button/button';
```

Exception: component libraries with an explicit public API (e.g., `src/components/ui/button/index.ts` that exports `Button` and its types): acceptable at the *leaf* level, never at aggregator level.

## Next.js App Router variant

Same layout under `src/`, but `app/` is the Next.js convention for routes and colocates route files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`). Keep `src/features/` / `src/components/` / `src/lib/` as above; let Next own `src/app/`.

## Anti-patterns (these are findings)

- Flat structure (all components in one folder).
- "Layer-based" (`components/`, `hooks/`, `services/` at root with no feature grouping) in any app >10 components.
- Cross-feature imports.
- Barrel files at aggregator levels.
- `types.ts` floating in the repo root: put them in `features/<feature>/types/` or `src/types/`.

## Worked example

See `examples/refactor-proposal-example.md`: phase 1 reorganizes a layer-based `src/` into this feature-based layout.

## Finding template

When flagging a project structure issue:

> **[Should-refactor]** `src/services/userService.ts:1`: user-specific logic sits in a global `services/` layer rather than `src/features/users/api/`. Move per `guides/01-project-structure.md §feature-layout`. Enables future cross-feature-import rules.
