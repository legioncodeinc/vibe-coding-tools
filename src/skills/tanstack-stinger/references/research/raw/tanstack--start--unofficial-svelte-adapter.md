# TanStack Start: no official Svelte support; one experimental third-party adapter exists (0 stars, explicitly incomplete)

- URL: https://github.com/jonask-028/tanstack-svelte-start-adapter ; https://tanstack.com/start/latest
- Fetched: 2026-08-14
- Source type: Third-party GitHub repository (unofficial, explicitly labeled experimental by its own author) + official TanStack Start landing page (for contrast)
- Component: TanStack Start / Svelte support status

## Content

### Official status: TanStack Start does not support Svelte

`tanstack.com/start/latest`, the official product page, describes Start as supporting "Vite and Rsbuild" for build tooling and multiple hosting providers/runtimes for deployment - it does not mention Svelte as a supported UI framework anywhere in the fetched content. Start's documented framework story (consistent with Router, which Start is built on) is React/Solid/Vue.

### The one thing that exists: an unofficial, individually-authored, experimental adapter

`jonask-028/tanstack-svelte-start-adapter` - **0 stars, 0 forks, 0 watchers, created 2026-02-11**, i.e. a very new, essentially unadopted personal project, not a community-vetted or TanStack-affiliated package. Its own README states plainly: **"This adapter is experimental. It mirrors the architecture of TanStack Start's official Solid and Vue adapters and targets feature parity with the React adapter."**

Packages it ships: `@tanstack/svelte-router` (Link/Outlet/RouterProvider, navigation hooks, SSR utilities) and `@tanstack/svelte-start` (Vite plugin, `createServerFn`, SSR handlers, client hydration) - note these package names shadow the `@tanstack/*` npm scope naming convention despite being unofficial third-party packages, which is a real risk of confusion for anyone skimming an import statement and assuming official provenance.

Self-reported completeness (from the README's own checklist):
- Working: SSR + client hydration, `createServerFn` server functions compiled to RPC, file-based routing via `.ts` route files with co-located `.svelte` components, nested/layout routes, function middleware, production SSR builds, route loaders/error boundaries/dynamic params.
- **Not yet implemented**: route-level code splitting for Svelte components (upstream code-splitter is JSX-only and disabled for the Svelte target), a Svelte-specific co-located route-config pattern, route-tree HMR.
- Explicitly relies on "runtime patches" to `@tanstack/router-generator` and `@tanstack/router-plugin` - i.e. it monkey-patches TanStack's own upstream packages to work around the lack of an official `svelte` framework target, which is inherently fragile against upstream version changes.

### What this means for this skill's guidance

Per the mission's own instruction to say so plainly rather than invent usage: **TanStack Start has no real, production-viable Svelte support.** The one adapter that exists is a brand-new, zero-adoption, self-described-experimental individual project that patches TanStack internals to function, with documented missing features. Do not recommend it for a production SvelteKit + Vercel app. SvelteKit's own SSR, routing, and remote functions (see the SvelteKit raw files) are the real, mature, officially-maintained equivalent of what Start provides for React - there is no functional gap that adopting this adapter would responsibly close for this stack.
