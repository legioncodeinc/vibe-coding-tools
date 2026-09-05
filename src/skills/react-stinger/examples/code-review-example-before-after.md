# Code Review Example: Before / After

A worked React code review. Illustrates severity labels (`guides/00-principles.md §severity`), citations (`guides/00-principles.md §9`), and anti-pattern detection (`guides/12-anti-patterns.md`).

**Invocation:** "Review the changes in `feat/user-search` branch for quality before merging."

**Stack (from `package.json`):** React 19.0.0, Next.js 15.1, TanStack Query 5.x, Zustand 5.x, React Hook Form 7.x, Zod 4.x, Vitest 3.x.

---

## The diff under review

`src/features/users/components/user-search.tsx` (new file, 87 lines):

```tsx
'use client';
import { useState, useEffect } from 'react';
import { useUsers } from '../store';

export default function UserSearch(props: any) {
  const { users, setUsers } = useUsers();
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFiltered(users.filter(u => u.name.includes(query)));
  }, [users, query]);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/users')
      .then(r => r.json())
      .then(data => { setUsers(data); setIsLoading(false); });
  }, []);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {isLoading ? 'Loading…' : null}
      <ul>
        {filtered.map((u, i) => <li key={i}>{u.name}</li>)}
      </ul>
    </div>
  );
}
```

`src/features/users/store.ts` (new file):

```ts
import { create } from 'zustand';
export const useUsers = create<{ users: any[]; setUsers: (u: any[]) => void }>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));
```

## Findings

---

### 1. [Must-fix] Server data stored in Zustand

**`src/features/users/store.ts:3`**: User list is server-owned data. Zustand is the wrong layer per the 5-layer model in `guides/03-state-management.md §decision-tree`.

**Fix:** Replace with TanStack Query.

```ts
// src/features/users/api/get-users.ts
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

const User = z.object({ id: z.string(), name: z.string(), email: z.string().email() });
export type User = z.infer<typeof User>;
const UserList = z.array(User);

export async function getUsers(): Promise<User[]> {
  return UserList.parse(await api.get('/users'));
}
export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: getUsers });
}
```

Delete the Zustand store. (Citation: `guides/04-data-layer.md §the-3-part-request-declaration`.)

---

### 2. [Must-fix] `any` for API response

**`src/features/users/store.ts:3`**, **`user-search.tsx:4`**: `users: any[]` and `props: any`. Violates `guides/09-typescript-patterns.md §zod-at-boundary`. Fixed by #1 via the Zod schema.

---

### 3. [Must-fix] `useEffect` for derived state

**`user-search.tsx:10-12`**: Anti-pattern #1 from `guides/12-anti-patterns.md`. `filtered` is derived from `users` + `query`. Compute during render.

**Fix:**

```tsx
const filtered = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));
```

Remove the `useState<any[]>([])` and `useEffect`. (Citation: https://react.dev/learn/you-might-not-need-an-effect.)

---

### 4. [Must-fix] `fetch` + useEffect instead of TanStack Query

**`user-search.tsx:14-18`**: fetch in component, manual `isLoading`. Replaced by `useUsers()` from #1. Query already tracks `isLoading` / `isError` / `data`.

---

### 5. [Must-fix] Index-as-key

**`user-search.tsx:27`**: `{filtered.map((u, i) => <li key={i}>...)}`. Anti-pattern #11 from `guides/12-anti-patterns.md`. Use `u.id`.

---

### 6. [Must-fix] `'use client'` at a potentially-RSC-eligible level

**`user-search.tsx:1`**: Component uses `useState` and form input, so `'use client'` is *correct*. **Not a finding by itself.** But look upstream: the page importing it should stay RSC. Spot check: `app/users/page.tsx` is currently `'use client'`; push down. See `guides/11-server-components.md §push-use-client-down`.

---

### 7. [Must-fix] Default export

**`user-search.tsx:4`**: `export default function UserSearch`. Codebase convention is named exports (`guides/02-components-and-composition.md §rule-5`). Change to `export function UserSearch`.

---

### 8. [Should-refactor] No URL state for search query

**`user-search.tsx:7`**: `query` in `useState` means the search is lost on navigation and not shareable. Move to `nuqs`:

```tsx
import { useQueryState, parseAsString } from 'nuqs';
const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''));
```

(Citation: `guides/03-state-management.md §layer-4`.) Non-blocking: can be a follow-up PR.

---

### 9. [Should-refactor] Case-sensitive search

**`user-search.tsx:11`**: `u.name.includes(query)` is case-sensitive. Users expect case-insensitive. Addressed in the fix in #3.

---

### 10. [Must-fix] No accessibility attributes

**`user-search.tsx:23`**: `<input>` has no associated label. Add `<label>Search users <input ... /></label>` with proper role. (Citation: `guides/06-forms.md §accessibility`.) Hand off to `ux-ui-svelte-worker-bee` if deeper a11y review is wanted.

---

### 11. [Style] Component file too long

**`user-search.tsx`**: 87 lines. Near threshold. Consider extracting the list row into `<UserRow user={u} />`. Optional; batch with future changes.

## After (target code)

```tsx
// src/features/users/components/user-search.tsx
'use client';
import { useQueryState, parseAsString } from 'nuqs';
import { useUsers } from '../api/get-users';
import { UserRow } from './user-row';

export function UserSearch() {
  const { data: users = [], isLoading } = useUsers();
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''));

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <label>
        Search users
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search users by name"
        />
      </label>
      {isLoading && <p role="status">Loading users…</p>}
      <ul>
        {filtered.map(u => <UserRow key={u.id} user={u} />)}
      </ul>
    </div>
  );
}
```

## Summary

| Severity | Count |
|---|---|
| Must-fix | 7 |
| Should-refactor | 2 |
| Style | 1 |

**Recommendation:** Block merge. Address must-fix items in this PR; should-refactor as follow-ups. Re-run `scripts/scan-anti-patterns.ts` after the fix to confirm.

**Cross-Bee handoff:** `ux-ui-svelte-worker-bee` for a11y deep-dive after the label fix lands.
