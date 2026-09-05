# Refactor Proposal: "Legacy App → 2026 Standards"

A phased refactor plan. Output shape when the invocation is "propose a refactor". The final artifact is handed to `library-worker-bee` for PRD authoring.

**Target:** `acme/dashboard-web` (React 17, CRA, Redux + redux-saga, Enzyme, moment.js, styled-components)
**Current pain:** 45s `start` boot, flaky tests (Enzyme + Redux), 22 must-fix anti-pattern findings from `scripts/scan-anti-patterns.ts`.
**Goal:** React 19 + Next.js App Router + TanStack Query + Zustand + Vitest + Tailwind, bulletproof-react folder structure, Compiler enabled.

## Guiding constraints

- **Ship-as-you-go.** No "big bang" cutover. Every phase must leave the app working and green in CI.
- **Phase gates are measurable.** Each phase exits when metrics hit targets.
- **ADRs per phase.** Architectural decisions recorded per `templates/ADR.md`.

## Phases

### Phase 1: Structural refactor (no behavior change), 2 weeks

Move from layer-based (`src/components`, `src/services`, `src/reducers`) to feature-based per `guides/01-project-structure.md`.

**Steps:**
1. Create `src/features/` folder.
2. For each Redux slice, move slice + component + service into `src/features/<name>/`.
3. Add `eslint-plugin-import/no-restricted-paths` with cross-feature guards (`templates/eslint.config.js`).
4. Delete barrel `index.ts` files (anti-pattern #3).

**Exit criteria:** All imports comply with unidirectional rules. CI green. No behavior change.

**ADR:** ADR-101: Feature-based architecture adoption.

### Phase 2: Component API cleanup, 2 weeks

Apply `guides/02-components-and-composition.md`.

**Steps:**
1. Wrap 3rd-party components (`react-datepicker`, `react-select`, etc.) in `src/components/ui/`.
2. Identify top 10 components with >8 props. Refactor to compound / children pattern.
3. Convert `default export` → named exports.
4. Remove all `any` in prop types; use Zod inferred types where data is external.

**Exit criteria:** All components ≤7 props, named exports only, 0 `any` in prop types.

### Phase 3: Data layer migration, 3 weeks

**`guides/04-data-layer.md`.**

**Steps:**
1. Install TanStack Query; add `<QueryClientProvider>` at app root.
2. For each redux-saga data flow, port to a feature-local `api/` file with the 3-part pattern.
3. Delete the Redux slice and its saga once all consumers moved.
4. Set bundle budget (`scripts/bundle-budget-check.ts`); gate CI.

**Exit criteria:** Zero `createSlice` for server data. `redux-saga` removed. Initial dashboard bundle ≤ 300 KB gz.

**ADR:** ADR-102: From Redux + sagas to TanStack Query for server state.

### Phase 4: React 19 upgrade + Compiler, 2 weeks

**`guides/10-react-19-idioms.md`, `guides/07-performance.md §react-compiler`.**

**Steps:**
1. Upgrade `react` / `react-dom` to 19. Fix breaking changes (`UNSAFE_` lifecycles, PropTypes removals).
2. Add `eslint-plugin-react-compiler`. Fix every violation. (This is the hardest step, expect real work.)
3. Enable Compiler in Vite config.
4. Migrate forms to React Hook Form + Zod (`guides/06-forms.md`).
5. Remove defensive `useMemo` / `useCallback` now-handled-by-Compiler (except effect-dependency stability).
6. Convert existing `forwardRef` → ref-as-prop.

**Exit criteria:** Compiler reports all files optimizable; INP < 200ms on primary flows.

### Phase 5: Testing + library swaps, 2 weeks

**`guides/08-testing.md`, `guides/13-ecosystem-catalog.md`.**

**Steps:**
1. Install Vitest, RTL, MSW, Playwright. Keep Jest running in parallel for existing tests.
2. Migrate test files feature-by-feature; delete Enzyme tests after porting.
3. Replace `moment.js` → `date-fns`.
4. Replace `styled-components` → Tailwind + CSS Modules (incremental, component-by-component).
5. Replace auth-scroll-your-own → Auth.js or Clerk (involves security-worker-bee; out of this ADR).

**Exit criteria:** 0 Enzyme tests remaining. `moment` not in `package.json`. Coverage ≥ 70%.

### Phase 6: SSR migration to Next.js App Router, 4 weeks

**`guides/11-server-components.md`.**

**Steps:**
1. Create new `app/` directory alongside CRA entry.
2. Port routes one at a time. Each route moves via its own ADR and PR.
3. Identify RSC-eligible subtrees; push `'use client'` to leaves.
4. Add Server Actions for mutations (guarded with Zod + auth; hand-off to `security-worker-bee` per action).
5. Retire CRA; delete `react-scripts`.

**Exit criteria:** `/` served by Next.js App Router in production. CRA removed. Bundle budgets met on all routes.

**ADR per route.** See `examples/adr-example-server-components-boundary.md`.

## Success metrics

| Metric | Before | Target |
|---|---|---|
| First-load JS (main route) | 520 KB gz | ≤ 300 KB gz |
| LCP (4G throttled) | 4.2s | ≤ 2.5s |
| INP (p75) | 380ms | ≤ 200ms |
| Test runtime | 6m 40s | ≤ 2m |
| `package.json` deprecated libs | 8 | 0 |
| Anti-pattern findings | 22 must-fix | 0 must-fix |

## Handoff

- **This plan → `library-worker-bee`** for PRD authoring. The PRD will expand Phase 3 and Phase 6 into user-visible milestones, acceptance criteria, risk register, rollback plan.
- **Per-phase ADRs → repo `library/knowledge/private/architecture/ADR-<n>-<topic>.md`.**
- **Post-phase QA → `quality-worker-bee`.**

## References

- `guides/00-principles.md` (severity rubric for "must-fix" gates)
- `guides/01-project-structure.md` (Phase 1)
- `guides/04-data-layer.md` (Phase 3)
- `guides/10-react-19-idioms.md` (Phase 4)
- `guides/11-server-components.md` (Phase 6)
- `research/2026-04-24-bulletproof-react-project-structure.md`
