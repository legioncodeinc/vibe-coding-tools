# 03: State Management

The 5-layer model. Pick the right tool per layer. Mixing layers (e.g., storing server data in Zustand) is always a finding.

Source: `research/2026-04-24-bulletproof-react-state-management.md`, `research/2026-04-24-state-libraries-decision.md`.

## The decision tree

Ask *in this order*:

1. **Is it server-owned data?** (list of users, a post, search results) → **TanStack Query**. Not a global store.
2. **Is it in the URL?** (filters, page, sort, tab) → **nuqs**.
3. **Is it form state?** (fields, validation) → **React Hook Form + Zod**.
4. **Is it transient to one component or subtree?** → `useState` / `useReducer`.
5. **Is it shared across unrelated parts of the tree?** → **Zustand** (default) / **Jotai** (fine-grained atomic) / **Redux Toolkit** (large teams).

Never skip to step 5 without running 1-4 first. Most "global state" is actually server data, URL state, form state, or lift-able component state. Pushing everything to a store is the #1 state mistake.

## Layer-by-layer

### Layer 1: Component state

```tsx
const [isOpen, setIsOpen] = useState(false);
const [state, dispatch] = useReducer(reducer, initial);
```

Use `useReducer` when a single event updates multiple pieces or the transitions are non-trivial. Otherwise `useState`.

### Layer 2: Global UI state → Zustand (default)

```ts
// src/stores/theme-store.ts
import { create } from 'zustand';

export const useThemeStore = create<{
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

In Next.js App Router, use a per-request factory and a client provider to avoid cross-request state leakage. Cite: https://zustand.docs.pmnd.rs/guides/nextjs.

**Zustand vs. the alternatives:**

| | Zustand | Jotai | Redux Toolkit | Context |
|---|---|---|---|---|
| Default choice | ✓ | | | |
| Bundle size | ~1KB | ~3KB | ~12KB | 0 |
| Selectors built-in | ✓ | ✓ (atom is a selector) | ✓ | ✗ |
| Provider-free | ✓ | ✗ | ✗ | ✗ |
| Devtools | ✓ | ✓ | ✓ (best) | ✗ |
| Fine-grained re-renders | good | best | good | poor |
| Team size | any | small-medium | large | tiny |

**When to reach past Zustand:**

- **Jotai**: form builders, spreadsheets, dependency-graph UIs where hundreds of small atoms drive partial re-renders.
- **Redux Toolkit**: 15+ eng team that demands enforced patterns, time-travel debugging, or a Redux-ecosystem dependency (e.g., redux-saga for complex orchestration).

**Never use Context for high-velocity state.** Context re-renders every consumer on every update. Fine for theme/locale/auth-user; a trap for anything that updates more than a few times per minute.

### Layer 3: Server cache state → TanStack Query

See `guides/04-data-layer.md`. Never store in Zustand/Jotai/Redux; let TanStack Query own the cache.

### Layer 4: URL state → nuqs

```tsx
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';

const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));
```

See `research/2026-04-24-nuqs-url-state.md`. Use for filters, pagination, sort, tabs, search inputs: anything a user might bookmark.

### Layer 5: Form state → React Hook Form + Zod

See `guides/06-forms.md`. Do not put form state in Zustand.

## Common findings

> **[Must-fix]** `src/features/users/store.ts:8`: server-fetched user list stored in Zustand, manually refreshed on an interval. Replace with `useQuery({ queryKey: ['users'], queryFn: getUsers })` per `guides/04-data-layer.md`. Eliminates stale-data bugs and interval logic.

> **[Should-refactor]** `src/features/search/SearchPage.tsx:23`: filter state in `useState` lost on navigation. Move to `useQueryState` (nuqs) so URL is shareable. See `guides/03-state-management.md §layer-4`.

> **[Must-fix]** `src/contexts/AppContext.tsx:45`: high-velocity UI state in Context causes full-tree re-render on every update. Migrate to Zustand store. See `guides/03-state-management.md §layer-2`.

## ADR-worthy decisions

- Adopting a store lib for the first time: write an ADR per `templates/ADR.md`.
- Switching from Redux to Zustand: write a phased refactor per `examples/refactor-proposal-example.md`.

## Example in action

See `examples/adr-example-server-components-boundary.md` for the Zustand-vs-RSC boundary question in context.
