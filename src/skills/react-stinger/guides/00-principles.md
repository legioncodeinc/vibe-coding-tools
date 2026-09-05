# 00: Principles

The non-negotiables. Read on every invocation.

## The ten principles

### 1. Check `package.json` first: always

React patterns differ dramatically between React 18 and React 19. Before you recommend *anything*, confirm:

- `react` and `react-dom` versions
- Bundler / framework (`next`, `vite`, `remix`, `react-router` v7)
- State libs (`zustand`, `jotai`, `@reduxjs/toolkit`, `@tanstack/react-query`, `swr`)
- Form lib (`react-hook-form`, `formik`)
- Test runner (`vitest`, `jest`)
- Linter (`eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-compiler`)

A recommendation for React 19 in a React 18 codebase is wrong advice, not bleeding-edge advice.

Source: `research/react-version-log.md` tracks current versions at forge time.

### 2. Bleeding-edge is not reckless

Prefer patterns from bulletproof-react, canonical framework docs, or large public codebases over blog-only patterns. When you recommend something novel, mark it **"experimental"** explicitly and cite the source. See `examples/adr-example-server-components-boundary.md` for how this looks in an ADR.

### 3. Colocate state with its consumer

State lives as close to where it's used as possible. Lifting is a specific decision, not a default. Global state is the last resort, not the first. Source: `research/2026-04-24-bulletproof-react-state-management.md`.

### 4. Separate the data layer from components

Components consume hooks, not fetchers. Fetchers live in `features/<feature>/api/`. Deep components never call `fetch` directly. Source: `research/2026-04-24-bulletproof-react-api-layer.md`.

### 5. Error boundaries and Suspense: together, at route level

Every route boundary gets both an `<ErrorBoundary>` and a `<Suspense>`. Global-only boundaries are a finding. See `guides/05-error-handling.md`.

### 6. TypeScript strict + Zod at the boundary

`tsconfig.json` must have `strict: true`. External data (API response, form input, URL param, localStorage read) is parsed by Zod before the type narrows. Unchecked `any`, `as unknown as X`, and `Partial<T>` abuse are findings. See `guides/09-typescript-patterns.md`.

### 7. Performance is measured

No "it feels fast". Cite:

- React Profiler flame graph
- Chrome DevTools Performance trace
- Lighthouse LCP / INP
- Bundle size from `rollup-plugin-visualizer` or `@next/bundle-analyzer`

See `guides/07-performance.md`.

### 8. Testing strategy is explicit

RTL for components, Vitest for units, Playwright for E2E, MSW for network mocking. What is *not* tested is documented. See `guides/08-testing.md`.

### 9. Cite every finding

Two citations per finding:

- **Where in the user's codebase**: `src/features/auth/AuthProvider.tsx:42`
- **Why it's a finding**: guide section (`guides/03-state-management.md §2`) or external URL

### 10. Severity discipline

Three levels only:

| Severity | Example | Blocks PR? |
|---|---|---|
| Must-fix | useState of server data, `any`-cast of API response, client-only code in a Server Component | Yes |
| Should-refactor | Barrel file, prop drilling 4+ levels, missing error boundary on new route | No, but open a follow-up |
| Style | Naming nit, import order | No, suggestion only |

Calling a style nit "must-fix" is a reviewer error. It erodes trust. Be disciplined.

---

## First-move checklist

Before writing findings, confirm:

- [ ] `package.json` read; version map captured.
- [ ] Invocation classified (review / ADR / refactor / code-review / audit / setup).
- [ ] Relevant guide(s) identified from the routing table in `SKILL.md`.
- [ ] Severity rubric in mind.

## Cross-Bee boundaries

Below is what you *do not own*. Hand off if the question is primarily:

| Question type | Owner |
|---|---|
| Visual design, tokens, spacing, color contrast, component visuals | `ux-ui-svelte-worker-bee` |
| Next.js metadata, sitemap, canonical URLs, structured data for SEO | `seo-aeo-worker-bee` |
| Security audit of Server Actions, auth cookies, RBAC correctness | `security-worker-bee` |
| PRD authoring for a big refactor | `library-worker-bee` (you provide rationale) |
| QA verification after a refactor ships | `quality-worker-bee` |

You *surface* concerns in these areas (e.g., "this Server Action needs auth, flagging to `security-worker-bee`"), but don't author the fix.

## Scope explicitly excluded (v1)

- **React Native.** Most state/data patterns port, but navigation/styling/testing differ enough that a dedicated Bee is better. If the user asks, say so and ask whether they want an RN-specific Bee briefed.
- **Pages Router → App Router migration guides.** Short pointer in `guides/11-server-components.md`; Next.js migration docs are authoritative.
- **Dedicated TanStack ecosystem Bee.** Open question for Hive. See Command Brief.

## Example in action

`examples/code-review-example-before-after.md` shows these principles applied to a real diff, with severity labels on every finding.
