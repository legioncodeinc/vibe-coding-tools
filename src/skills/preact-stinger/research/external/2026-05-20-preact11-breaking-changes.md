---
source_type: official-docs
authority: official
relevance: high
topic: preact11-breaking-changes
url: https://preactjs.com/guide/v11/upgrade-guide
---

# Preact 11 Breaking Changes

**Status at research time:** beta (11.0.0-beta.0, Aug 2025). Tracking PR merged Jun 2025.

> TODO: open question; check https://github.com/preactjs/preact/releases for stable release status before publishing the stinger.

## Breaking changes affecting preact/compat users

1. **`defaultProps` moved to `preact/compat`**: In Preact 10, `defaultProps` was supported in core. In v11, it is compat-only. Components using `defaultProps` without importing compat will silently lose defaults.

2. **Automatic `px` suffixing for numeric style values moved to compat**: In v11 core, numeric style values are passed through as-is. Compat re-adds the React behavior. Affects any component that passes numbers to `style` without `"px"`.

3. **Refs forward by default**: `forwardRef` wrapper is no longer needed in v11; refs automatically forward. Old `forwardRef` calls still work (compat), but new code should omit it.

4. **`.module.js` exports renamed to `.mjs`**: Import paths using `preact/src/xxx.module.js` need updating to `.mjs`. Affects custom bundler configs and deep imports.

5. **Hydration 2.0**: Server-rendered HTML hydration is rewritten. Stricter server/client matching; deviations that v10 silently tolerated will warn or error in v11.

## TypeScript changes

The `preact` namespace changed in v11. See https://preactjs.com/guide/v11/upgrade-guide for the full TypeScript migration guide (detailed mapping of old to new types).

## What did NOT change

- `h` / `createElement` API: unchanged
- `Component` class API: unchanged
- Hooks (`useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext`, `useReducer`): unchanged
- `Fragment`: unchanged
- `render` / `hydrate`: signature unchanged
