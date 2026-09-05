# React 19 Actions + New Hooks

**Sources:**
- https://react.dev/blog/2024/12/05/react-19
- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react/useOptimistic
- https://react.dev/reference/react-dom/hooks/useFormStatus

**Retrieved:** 2026-04-24

## Summary

React 19 (stable Dec 2024) introduces Actions: functions (sync or async) that can be passed to `<form action={...}>`, triggered as transitions, and composed with three new hooks.

## The four new APIs

### `useActionState(action, initialState)`
- Accepts an action function and initial state.
- Returns `[state, formAction, isPending]`.
- Centralizes pending/success/error lifecycle. Replaces `useState` + `isLoading` + `hasError` + `isSuccess` sprawl.

### `useOptimistic(state, updateFn)`
- Returns an optimistic state that applies `updateFn` immediately while the real action is pending.
- Reverts automatically if the action rejects.
- Pair with `useActionState` for instant UI feedback.

### `useFormStatus()`
- Read-only hook. Returns `{ pending, data, method, action }` for the *enclosing* form.
- Lets nested components (e.g., a submit button) react to form state without prop drilling.

### The `use` hook
- Unwraps a Promise or Context inline. Works with Suspense boundaries.

## Canonical pattern: form with Action + optimistic UI

```tsx
const [state, formAction, isPending] = useActionState(createTodo, initialState);
const [optimisticTodos, addOptimistic] = useOptimistic(todos, (cur, newTodo) => [...cur, newTodo]);

<form action={(fd) => { addOptimistic({ id: crypto.randomUUID(), ...fromFd(fd) }); formAction(fd); }}>
  <input name="text" />
  <SubmitButton />
</form>

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Save</button>;
}
```

## Relevance to this stinger

Spine of `guides/10-react-19-idioms.md` and a major section of `guides/06-forms.md`. Distinguishes React 18 (no Actions) from React 19 (Actions are idiomatic), which is why `guides/00-principles.md` rule #1 is "check package.json first".
