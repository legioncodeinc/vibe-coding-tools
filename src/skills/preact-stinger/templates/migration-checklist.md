# Migration Checklist: React to Preact/compat

> Used by `preact-worker-bee` during migration reviews. Copy and fill in for each project.

## Project: _______________

## Date: _______________

---

## Phase 1: Blocker audit

- [ ] Searched for `React.use(`, found: ___
- [ ] Searched for `useTransition(`, found: ___
- [ ] Searched for `useDeferredValue(` (relied on), found: ___
- [ ] Searched for `"use server"` / React Server Components, found: ___
- [ ] Checked for Next.js App Router usage, found: ___
- [ ] Checked `@types/react` in `package.json`, found: ___

**Blockers requiring refactor before migration:**
- [ ] None: proceed
- [ ] List blockers: _______________

---

## Phase 2: Install

- [ ] `npm install preact`
- [ ] `npm uninstall react react-dom @types/react @types/react-dom`
- [ ] Vite/Rollup/Webpack alias added (see `guides/02-compat-migration.md`)
- [ ] `tsconfig.json` updated (`jsxImportSource: "preact"`)

---

## Phase 3: Test

- [ ] Dev server starts without errors
- [ ] No `defaultProps` warnings (move to default params if on Preact 11)
- [ ] No numeric style value warnings (add `"px"` suffix if on Preact 11)
- [ ] Component renders match expected output
- [ ] No hydration mismatches (if SSR)
- [ ] Type errors resolved (no `@types/react` conflicts)

---

## Phase 4: Bundle verification

- [ ] Bundle size measured: ___ KB gzipped (before: ___ KB)
- [ ] Tree-shaking confirmed (no unexpected large chunks)
- [ ] `preact/compat` only included where needed
- [ ] No `@types/react` re-introduced by transitive deps

---

## Notes

_______________
