# Curated Ecosystem Catalog (from awesome-react + opinionated picks)

**Sources:**
- https://github.com/enaqx/awesome-react
- Ecosystem notes compiled from prior research in this folder
- WebSearch: "awesome-react curated libraries ecosystem 2026"

**Retrieved:** 2026-04-24

## Summary

awesome-react is a meta-index of thousands of React projects. The value for this Stinger is filtering it to one opinionated pick per category. Below is the curated list.

## By category (2026 picks)

| Category | Pick | Why |
|---|---|---|
| Framework (SSR) | **Next.js 15 App Router** | Dominant, RSC-native |
| Framework (SPA) | **Vite + React Router v7** | Fastest DX, framework mode adds loaders |
| Global UI state | **Zustand** | Smallest API that covers 90% of cases |
| Atomic state | **Jotai** | Form builders / spreadsheets |
| Server cache | **TanStack Query** | Default. SWR only for small apps |
| URL state | **nuqs** | Type-safe, small, multi-framework |
| Forms | **React Hook Form** | Performance + ergonomics |
| Validation | **Zod** | TypeScript-first, infers types |
| HTTP | **ky** or **axios** or **fetch-wrapper** | Pick one, export single instance |
| Routing (SPA) | **React Router v7** | Now a framework; loaders + actions |
| Test runner | **Vitest** | Vite-native, 5-10x faster than Jest |
| Component tests | **React Testing Library** | User-centric assertions |
| E2E | **Playwright** | Multi-browser, great DX |
| API mocking | **MSW** | Service-worker-based, realistic |
| Component library (headless) | **Radix UI** or **react-aria** | A11y built-in |
| Design system starter | **shadcn/ui** | Copy-in code, owned by you |
| Styling | **Tailwind** (zero-runtime) | RSC-compatible |
| Dates | **date-fns** or **Temporal polyfill** | Tree-shakeable; Temporal for new projects |
| Charts | **Recharts** or **visx** | Recharts for common; visx for custom |
| Tables | **TanStack Table** | Headless, composable |
| Animation | **Framer Motion** | Declarative, springs |
| Error tracking | **Sentry** | React + RSC integrations |
| Bundle analysis | **rollup-plugin-visualizer** (Vite), **@next/bundle-analyzer** | Built-in per bundler |
| Icons | **Lucide** or **Tabler** | Tree-shakeable SVGs |
| Auth | Stack-dependent: Clerk / Auth.js / WorkOS | Don't roll your own |

## Deliberately *not* recommended

- **Redux (legacy, not Toolkit)**: use Redux Toolkit if you need Redux.
- **Moment.js**: frozen in maintenance mode. Use date-fns / Temporal.
- **Enzyme**: abandoned. Use RTL.
- **styled-components / emotion for new projects**: runtime cost, RSC-incompatible. Use Tailwind / CSS Modules / vanilla-extract.
- **Recoil**: Meta deprecated. Use Jotai.

## Relevance to this stinger

Spine of `guides/13-ecosystem-catalog.md`. The "deliberately not recommended" list is important: opinionation means saying no, too.
