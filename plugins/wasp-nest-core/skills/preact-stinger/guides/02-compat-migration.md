# Guide 02: preact/compat Migration

> Sources: `research/external/2026-05-20-preact-compat-compatibility.md`, `research/external/2026-05-20-preact11-breaking-changes.md`

`preact/compat` is the compatibility shim that maps React's API to Preact's implementation. This guide covers alias setup, known gaps, and a step-by-step migration checklist.

---

## What preact/compat does

It aliases React imports to Preact, enabling React code to run on Preact without source changes. The bundle size saving: ~37KB (40KB React+DOM → ~3KB Preact + ~5KB compat = ~8KB total).

---

## Alias configuration

### Vite

```js
// vite.config.js
export default {
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
};
```

### Rollup

```js
// rollup.config.js
import alias from "@rollup/plugin-alias";
export default {
  plugins: [
    alias({
      entries: {
        react: "preact/compat",
        "react-dom": "preact/compat",
      },
    }),
  ],
};
```

### Webpack

```js
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
  },
};
```

---

## Known compatibility gaps (stop conditions for migration)

| React API | compat status | Action |
|---|---|---|
| `React.use()` (React 19) | NOT SUPPORTED | Must refactor or keep in React |
| `useTransition` | NOT SUPPORTED (no Concurrent Mode) | Must refactor |
| `useDeferredValue` | pass-through no-op | Check if behavior is relied on |
| RSC / React Server Components | BLOCKED | Cannot migrate RSC to Preact |
| Next.js App Router | FOOTGUN: do not attempt | Use Pages Router or stay on React |
| `@types/react` | INCOMPATIBLE | Remove `@types/react`, use Preact types |

---

## CRITICAL: Never install `@types/react` with preact/compat

This is the #1 cause of hard-to-debug type errors in compat migrations. The types conflict. Remove `@types/react` and `@types/react-dom` from your project. Preact ships its own TypeScript types.

If a third-party package has `@types/react` as a direct peer dependency, you may need to create a type stub:

```json
// types/react-stub.d.ts
declare module "react" {
  export * from "preact/compat";
}
```

---

## Step-by-step migration checklist

Use `templates/migration-checklist.md` for a copy to fill in per project.

1. **Audit React API usage**
   - Search for `React.use(`, `useTransition(`, `useDeferredValue(`, `createRoot` (direct, not via compat)
   - Search for React Server Components (`"use server"`, `"use client"` without Next.js Pages Router)
   - Search for `@types/react` in `package.json`

2. **Flag blockers**
   - Any React 19 features → must refactor before migration
   - RSC pages → cannot migrate, stay on React
   - Next.js App Router → do not attempt; use Pages Router only

3. **Install preact + compat**
   ```bash
   npm install preact
   ```
   Remove `react` and `react-dom` after adding aliases.

4. **Add Vite/Rollup/Webpack aliases** (see above)

5. **Remove `@types/react` and `@types/react-dom`**

6. **Run the test suite**
   - Look for render mismatches, missing `defaultProps` (v11 only), broken `px` auto-suffixing (v11 only)
   - Run in browser: check for hydration warnings

7. **Check Preact 11 compatibility** (if targeting v11 beta)
   - `defaultProps`: move to explicit default parameters
   - Numeric style values: add `"px"` suffix explicitly where needed
   - `forwardRef`: can be removed from new code (optional)

---

## Testing compat compatibility

Run a quick smoke test before committing to migration:

```bash
npx preact-compat-test --dir src/
# Lists all React APIs used that are not covered by preact/compat
```

(Or manually grep for the gap APIs listed above.)

> See `examples/compat-migration-vite.md` for a worked end-to-end example.
