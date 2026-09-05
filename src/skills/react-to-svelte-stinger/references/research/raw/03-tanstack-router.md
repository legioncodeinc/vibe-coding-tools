# TanStack Router (source side: routing/loads/search params)
- URL: https://tanstack.com/router/latest/docs/framework/react/overview
- Fetched: 2026-09-04
- Source type: official docs

## Key facts

- Type safety: "100% inferred TypeScript support" - the router tracks each route's path, path params, search params, and context; navigation calls are type-checked.
- Nested routing: nested routes, layout routes, grouped routes, pathless layouts. Inherited route context: context defined on a route is inherited by children, built synchronously or asynchronously (auth/authorization, theming, SSR/CSR preloading, shared singletons are the cited use cases).
- Loaders: built-in route loaders with SWR-style caching ("a lightweight internal cache loosely based on TanStack Query"); key APIs `context`, `beforeLoad`, `loaderDeps`, `loader`; designed to integrate external fetchers (TanStack Query, SWR, Apollo, Relay, custom); parallel loading and automatic prefetch.
- Search params: "Typesafe JSON-first Search Params state management APIs" - auto-parsed/serialized JSON, schema validation, custom parser/serializer, search param middleware and filters; params inherited from parents; read via `useSearch`, mutated via `Link`, `navigate`, `router.navigate`; fine-grained selectors limit re-renders.
- Routing styles: file-based and code-based simultaneously ("Mixed file-based and code-based routing"); the Vite plugin/CLI generates file-based config; developers keep control of the router instance.
- Also: error boundaries, async route elements, route masking, SSR, URL path params, route matching/loading middleware.
