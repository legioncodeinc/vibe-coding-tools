# 13: Ecosystem Catalog

Opinionated picks from awesome-react, filtered to one default per category. When you recommend a library to the user, pick from this table and cite it.

Source: `research/2026-04-24-awesome-react-ecosystem.md`.

## The catalog

| Category | Default pick | Alt (when) | Don't use |
|---|---|---|---|
| Framework (SSR) | **Next.js 15 App Router** | Remix for loader-centric teams | Gatsby (legacy) |
| Framework (SPA) | **Vite + React Router v7** | TanStack Start for type-first | CRA (retired) |
| Component library (headless) | **Radix UI** | react-aria for maximal a11y | N/A |
| Design-system starter | **shadcn/ui** | N/A | Material UI in new design-heavy apps |
| Styling | **Tailwind v4** | CSS Modules / vanilla-extract | styled-components, emotion in new code |
| Icons | **Lucide** | Tabler | react-icons (too heavy) |
| Global UI state | **Zustand** | Jotai (atomic), Redux Toolkit (large teams) | Raw Context for high-velocity |
| Server cache | **TanStack Query** | SWR (small apps) | Redux for server data |
| URL state | **nuqs** | N/A | Manual `URLSearchParams` |
| Forms | **React Hook Form** | N/A | Formik (in new code) |
| Validation | **Zod** | Valibot (bundle-sensitive) | Yup (in new code) |
| HTTP | **ky** or **axios** | `fetch` wrapper | raw `fetch` scattered |
| Dates | **date-fns** | Temporal polyfill | Moment.js |
| Charts | **Recharts** | visx (custom) | Chart.js (not React-native) |
| Tables | **TanStack Table** | N/A | rolling your own |
| Animation | **Framer Motion** | react-spring | N/A |
| Test runner | **Vitest** | Jest (legacy) | N/A |
| Component tests | **React Testing Library** | N/A | Enzyme (abandoned) |
| E2E | **Playwright** | Cypress (legacy) | Selenium |
| API mocking | **MSW** | N/A | `nock`, manual fetch stubs |
| Auth | **Clerk** / **Auth.js** / **WorkOS** | N/A | Rolling your own |
| Error tracking | **Sentry** | N/A | console.error only |
| Bundle analysis | `rollup-plugin-visualizer` (Vite), `@next/bundle-analyzer` | N/A | N/A |
| Internationalization | **react-i18next** | FormatJS for complex ICU | N/A |
| Markdown | **react-markdown** + rehype-sanitize | N/A | `dangerouslySetInnerHTML` |

## Why each default

- **Next.js 15 App Router**: RSC-native; largest ecosystem for production deployment.
- **Vite + React Router v7**: v7 is React Router's framework-mode release; loaders + actions ported from Remix.
- **Radix UI / shadcn/ui**: a11y first; shadcn gives you the component as code you own.
- **Tailwind v4**: zero runtime, RSC-safe, Oxide engine makes builds fast.
- **Zustand**: smallest API that covers the 90% case.
- **TanStack Query**: full mutation lifecycle, DevTools, invalidation by key pattern.
- **nuqs**: type-safe URL state; adopted by Sentry, Supabase, Vercel, Clerk.
- **React Hook Form + Zod**: performance (uncontrolled inputs) + shared schemas.
- **Vitest**: Vite-native, 5-10x faster than Jest.
- **Playwright**: multi-browser, superior test UI mode.
- **MSW**: service-worker-level mocking; one handler set works in dev, Storybook, tests.
- **Sentry**: React Profiler integration, RSC-aware, source-map upload.

## Deliberately not recommended (explain why)

- **Moment.js**: 70KB+, mutable, maintenance-mode. `date-fns` is ~2KB per function, immutable.
- **Enzyme**: abandoned; tests implementation details. RTL tests user behavior.
- **Recoil**: Meta deprecated. Jotai is the successor in philosophy.
- **styled-components / emotion (new code)**: runtime CSS-in-JS generation is a perf tax and breaks RSC.
- **Redux (without Toolkit)**: boilerplate. RTK is required on Redux.
- **react-scripts / CRA**: retired officially. Use Vite.
- **Material UI (in design-heavy products)**: hard to escape the MD aesthetic. Use Radix + Tailwind when custom branding matters.

## Open question

The Hive may want a dedicated **TanStack ecosystem Bee** later (Query + Router + Table + Form + Start). Flagged in `research/research-plan.md` for a future brief.

## Common findings

> **[Should-refactor]** `package.json:18`: `moment` listed; imported in 7 files. Migrate to date-fns. See `guides/13-ecosystem-catalog.md §deliberately-not-recommended`. Batched migration PR recommended.

> **[Should-refactor]** `package.json:23`: uses `enzyme`. Migrate tests to React Testing Library.

## Example in action

See `examples/refactor-proposal-example.md §phase-5`: legacy-library swap.
