# nuqs: URL State

**Sources:**
- https://nuqs.dev/
- https://github.com/47ng/nuqs
- https://www.infoq.com/news/2025/12/nuqs-react-advanced/

**Retrieved:** 2026-04-24

## Summary

nuqs is the default for type-safe URL query-parameter state in React 2026. ~6KB gz. Used in production by Sentry, Supabase, Vercel, Clerk. Supports React, Next.js (>=14.2), Remix, React Router, TanStack Router.

## The API

```tsx
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';

const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
const [search, setSearch] = useQueryState('q', parseAsString);
```

## Why URL state matters

Two powers:
1. **Teleportation:** sharing a URL reproduces the exact UI state (filters, pagination, sort).
2. **Time travel:** browser back/forward restores prior state without manual state snapshots.

## When to use nuqs

- Filter panels, pagination, sort order, tabs.
- Search fields where "shareable link" is a feature.
- Any state that a user might bookmark or share.

## When *not* to use nuqs

- Transient UI state (modal open, hover). Use `useState`.
- Form draft state. Use React Hook Form.
- Server cache state. Use TanStack Query.
- Extremely rapid updates (e.g., drag-resize). The URL writes debounce but still costly.

## Relevance to this stinger

Section of `guides/03-state-management.md` (the URL layer) and `guides/13-ecosystem-catalog.md` (under URL state).
