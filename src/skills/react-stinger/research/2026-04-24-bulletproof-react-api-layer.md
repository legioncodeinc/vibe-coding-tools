# Bulletproof-React: API Layer

**Source:** https://github.com/alan2207/bulletproof-react/blob/master/docs/api-layer.md
**Retrieved:** 2026-04-24

## Summary

The API layer is separated from components. One pre-configured client instance is reused throughout the app. Every request is declared as a triplet: types + validation schema, fetcher function, and hook.

## The three-part request declaration

Every API request consists of:

1. **Types and validation schema** (Zod) for request + response.
2. **Fetcher function** that calls the endpoint via the shared API client.
3. **Hook** (useQuery/useMutation) that wraps the fetcher and manages caching.

## Key rules

- Single `lib/api-client.ts` instance (fetch wrapper or axios).
- Declare requests in `features/<feature>/api/<verb>-<resource>.ts`: colocated to the feature.
- Parse responses with Zod to enforce the type at the boundary.
- Components consume hooks, not fetchers directly.

## Relevance to this stinger

Spine of `guides/04-data-layer.md`. The three-part request declaration is the canonical pattern. Also informs the Zod-at-boundary rule in `guides/09-typescript-patterns.md`.
