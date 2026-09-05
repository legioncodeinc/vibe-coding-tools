# Anti-Pattern: useEffect for Derived State

**Sources:**
- https://react.dev/learn/you-might-not-need-an-effect (canonical)
- https://harishkrishnan1993.medium.com/antipattern-using-useeffect-for-derived-state-849863f40746
- WebSearch: "React useEffect anti-patterns derived state 2026"

**Retrieved:** 2026-04-24

## Summary

The most common React anti-pattern, still prevalent in 2026, is using `useEffect` to compute derived state or to sync props into state. React's official guide "You Might Not Need an Effect" names six scenarios where the effect is wrong:

1. Transforming data for rendering: do it during render.
2. Caching expensive computation: use `useMemo`.
3. Resetting state on prop change: use `key` prop.
4. Adjusting state on prop change: use a render-phase check or compute during render.
5. Chains of effects updating state: collapse into one handler.
6. Notifying parent: pass the event up, don't ripple through effects.

## Canonical fixes

### Bad
```tsx
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${first} ${last}`);
}, [first, last]);
```

### Good
```tsx
const fullName = `${first} ${last}`;
```

### Bad (resetting on prop change)
```tsx
useEffect(() => { setSelection(null); }, [listId]);
```

### Good
```tsx
<List key={listId} items={items} />
// State resets when key changes — no effect needed.
```

## Other common anti-patterns in 2026

1. **Barrel files (`index.ts` re-exports)**: kill tree-shaking, slow builds, hide circular deps. Import directly.
2. **Deep prop drilling**: 4+ levels; use composition (children) or a local context.
3. **Premature memoization**: `useMemo(() => x + 1, [x])`. Meaningless. Delete. Especially meaningless under React Compiler.
4. **`any` escape hatch**: `const x = data as any`. Use Zod or a discriminated union.
5. **Client component at the root**: `'use client'` on the page. Forces whole tree into client bundle.
6. **Fetch inside a deep leaf component**: waterfalls, no caching. Lift to a loader / Server Component / data hook.
7. **Ignoring React keys**: list items without stable keys lose state on reorder.
8. **Mutating state directly**: `state.push(x)` instead of `setState([...state, x])`. Breaks Compiler.

## Relevance to this stinger

Spine of `guides/12-anti-patterns.md`. Drives `scripts/scan-anti-patterns.ts`.
