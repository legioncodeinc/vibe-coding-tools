# Guide 3: TanStack Query mutations, invalidation, and optimistic updates

Grounded in `references/research/distilled-tanstack.md` §2, `references/research/raw/tanstack--query--mutations-optimistic-updates.md`.

## When to walk this guide

Writing data through TanStack Query and needing the UI to reflect the write immediately or after confirmation.

## Basic mutation

```ts
const mutation = createMutation(() => ({
  mutationFn: (newTodo: string) => fetch('/api/todos', { method: 'POST', body: newTodo }),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
}));
```

Same "wrap options in a function" convention as `createQuery`. The Svelte adapter's `createMutation` is confirmed rune-native from its own source (a `$state`-backed result proxy updated via `$effect.pre`), not a stores-compatibility shim, so this is safe to build on without expecting legacy-mode quirks.

## Callback order and purpose

1. `onMutate(variables)` - fires before the mutation function. Cancel in-flight refetches first (`queryClient.cancelQueries({ queryKey })`) so they don't clobber an optimistic write. Return a rollback context value.
2. `onError(err, variables, onMutateResult)` - use the rollback context to restore prior cache state.
3. `onSuccess` - fires on success.
4. `onSettled` - fires either way; the conventional place to `return queryClient.invalidateQueries(...)` (returning the promise keeps the mutation in `pending` state until the refetch actually finishes, which matters for loading-state UI).

## Two optimistic-update strategies - pick per case

1. **Direct cache write.** In `onMutate`: snapshot via `queryClient.getQueryData(key)`, write the optimistic value via `queryClient.setQueryData(key, updater)`, roll back in `onError`. Use when multiple components on screen need to reflect the change automatically without each one knowing about the mutation.
2. **Read the mutation's own `variables` while pending.** Render optimistic UI directly from the mutation result object - no cache write. Simpler, but only works when the optimistic UI lives in the same component tree as the `mutate()` call. For cross-component visibility of in-flight mutations without lifting state, use `useMutationState` filtered by `mutationKey`.

## Invalidation

`queryClient.invalidateQueries({ queryKey: [...] })` marks matching cached data stale and triggers a refetch on next use. This is identical across every TanStack Query framework adapter since it lives in the shared `query-core` package - if a user already knows this from React Query, the semantics transfer directly to Svelte, only the call-site wrapping (`createMutation(() => ({...}))`) differs.

## Common mistakes

- Forgetting to cancel in-flight queries in `onMutate` before writing an optimistic value, letting a stale refetch clobber it.
- Not returning the `invalidateQueries` promise from `onSettled`, causing the mutation's `isPending` state to resolve before the refetch actually completes.
- Choosing the direct-cache-write strategy when the simpler variables-based approach would have sufficed for a single-component UI.
