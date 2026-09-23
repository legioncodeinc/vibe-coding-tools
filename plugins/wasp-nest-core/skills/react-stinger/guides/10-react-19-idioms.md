# 10: React 19 Idioms

Source: `research/2026-04-24-react-19-actions-hooks.md`, `research/2026-04-24-react-compiler-1.md`.

## Applicability

**Check `package.json` first.** These idioms apply to React 19.x. On React 18, use the React 18 equivalents (noted).

## The five new primitives

### 1. Actions

A sync or async function passed to `<form action={fn}>` or wrapped by `useActionState`.

```tsx
async function addTodo(formData: FormData) {
  'use server'; // server-side action
  await db.todos.insert({ text: String(formData.get('text')) });
}

<form action={addTodo}>
  <input name="text" />
  <button>Add</button>
</form>
```

Actions are automatically batched into React transitions. Pending state is observable via `useFormStatus()`.

### 2. `useActionState(action, initial)`

Centralizes pending + result state:

```tsx
const [state, formAction, isPending] = useActionState(loginAction, { ok: true });

<form action={formAction}>
  {/* ... */}
  <button disabled={isPending}>Submit</button>
</form>
```

**React 18 equivalent:** manual `useState` for `isLoading`, `error`, `data`. The hook replaces that boilerplate.

### 3. `useOptimistic(state, updateFn)`

Show the expected result immediately; revert on failure:

```tsx
const [todos, setTodos] = useState<Todo[]>(initial);
const [optimisticTodos, addOptimistic] = useOptimistic(todos, (cur, next: Todo) => [...cur, next]);

async function handleAdd(fd: FormData) {
  const draft: Todo = { id: crypto.randomUUID(), text: String(fd.get('text')), done: false };
  addOptimistic(draft);
  const saved = await createTodo(fd); // if this throws, optimistic reverts
  setTodos((t) => [...t, saved]);
}
```

**React 18 equivalent:** TanStack Query's `onMutate` with manual rollback.

### 4. `useFormStatus()`

Reads the *enclosing* form's state. Useful for deeply nested submit buttons:

```tsx
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>;
}
```

**React 18 equivalent:** Pass `isLoading` via prop or context.

### 5. The `use` hook

Reads a Promise or Context inline:

```tsx
function Post({ postPromise }: { postPromise: Promise<Post> }) {
  const post = use(postPromise); // suspends until resolved
  return <article>{post.title}</article>;
}
```

Replaces many `useEffect`-for-fetch patterns. Requires a `<Suspense>` upstream.

**React 18 equivalent:** `useEffect` + `useState` + loading flag, or TanStack Query.

## React Compiler

- Stable since October 2025.
- **Enable it.** See `guides/07-performance.md §react-compiler`.
- Run `eslint-plugin-react-compiler` first: fix all reports.
- Remove defensive `useMemo` / `useCallback` once enabled. Keep them only for effect-dependency stability.

## Ref as a prop

```tsx
// React 18
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => <input ref={ref} {...props} />);

// React 19
function Input({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}
```

**In new React 19 code, do not use `forwardRef`.** Existing `forwardRef` usages are acceptable; flag as Should-refactor.

## Document metadata

React 19 renders `<title>`, `<meta>`, `<link>` in components directly and hoists them to `<head>`:

```tsx
function Post({ post }: { post: Post }) {
  return (
    <>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <article>{post.body}</article>
    </>
  );
}
```

**Note:** In Next.js, prefer the Metadata API (`generateMetadata`). Document-metadata tags are the right primitive for Vite SPA / React Router.

## Context as provider

```tsx
// React 19
<ThemeContext value={theme}>...</ThemeContext>
// (instead of <ThemeContext.Provider value={...}>)
```

Small API cleanup. Either form works in 19; prefer the new syntax in new code.

## Common findings

> **[Should-refactor]** `src/components/button.tsx:1`: uses `forwardRef` in a React 19 codebase. Migrate to ref-as-prop. See `guides/10-react-19-idioms.md §ref-as-prop`.

> **[Must-fix]** `src/features/todos/TodoList.tsx:12`: manual `isSubmitting` state + submit handler in React 19. Use `useActionState`. See `guides/10-react-19-idioms.md §useActionState`.

> **[Should-refactor]** `src/App.tsx:3`: React Compiler available but not enabled; the codebase has 200+ defensive `useMemo` calls. Enable Compiler and remove.

## Example in action

See `examples/refactor-proposal-example.md §phase-4` for a React 18 → 19 migration plan.
