# TanStack Query mutations and optimistic updates: createMutation (Svelte source) + core semantics (React docs)

- URL: https://github.com/TanStack/query/blob/main/packages/svelte-query/src/createMutation.svelte.ts ; https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates ; https://tanstack.com/query/latest/docs/framework/react/reference/useMutation
- Fetched: 2026-08-14
- Source type: Official TanStack/query source code (Svelte package, primary/authoritative for the Svelte API shape) + official React docs (used here only for the framework-agnostic mutation lifecycle concepts, since TanStack's Svelte-specific mutations guide page was not separately archived in this pass)
- Component: TanStack Query / Mutations

## Content

### Svelte `createMutation` - confirmed real implementation, runes-based

Source-verified from `packages/svelte-query/src/createMutation.svelte.ts`: `createMutation` takes an **accessor function** returning mutation options (same "wrap in a function" pattern as `createQuery`, see the overview raw file), builds a `MutationObserver` under the hood, and exposes `mutate` / `mutateAsync` / result state through a Svelte `$state`-backed reactive proxy updated via `$effect.pre`. This confirms the Svelte adapter's mutation API is genuinely rune-native in v6, not a stores-compatibility shim.

```ts
// verified shape, Svelte adapter
const mutation = createMutation(() => ({
  mutationFn: (newTodo: string) => fetch('/api/todos', { method: 'POST', body: newTodo }),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
}));
// mutation.mutate(variables), mutation.mutateAsync(variables), mutation.data, mutation.isPending, etc.
```

### Mutation lifecycle (framework-agnostic core, same for every adapter since it's implemented in `@tanstack/query-core`)

Callback order and purpose:
- `onMutate(variables)` - fires before the mutation function; return value is passed to both `onError` and `onSettled` as a rollback context. Cancel in-flight refetches first (`queryClient.cancelQueries`) so they don't clobber the optimistic write.
- `onError(err, variables, onMutateResult)` - fires on failure; use the `onMutateResult` rollback value to restore prior cache state.
- `onSuccess` - fires on success.
- `onSettled` - fires on either outcome; the recommended place to `return queryClient.invalidateQueries(...)` (returning the promise keeps the mutation in `pending` state until the refetch actually finishes).

### Two optimistic-update strategies (both apply to the Svelte adapter's `createMutation`, mechanism is identical to React's `useMutation` since both wrap the same core `MutationObserver`)

1. **Update the cache directly in `onMutate`** via `queryClient.setQueryData(key, updater)`, snapshot the previous value first via `queryClient.getQueryData(key)`, roll back in `onError`. Best when multiple components on screen need to reflect the change automatically.
2. **Read the mutation's own `variables` while pending** and render optimistic UI directly from the mutation result object, no cache write needed. Simpler, but only works when the optimistic UI lives in the same component tree as the mutation call. `useMutationState` (Svelte: same-named export, per the overview raw file's function list) lets other components read in-flight mutation variables by `mutationKey` without lifting state.

### Invalidation pattern

`queryClient.invalidateQueries({ queryKey: [...] })` is the standard "mark this data stale, refetch on next use" call, most commonly fired from `onSettled`. This is identical across all TanStack Query framework adapters since invalidation lives in `query-core`.
