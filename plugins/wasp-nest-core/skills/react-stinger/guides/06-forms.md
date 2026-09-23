# 06: Forms

Source: `research/2026-04-24-forms-rhf-zod.md`, `research/2026-04-24-react-19-actions-hooks.md`.

## The default stack

**React Hook Form + Zod** via `@hookform/resolvers/zod`. On React 19 + Server Actions, layer `useActionState` and `useOptimistic` on top.

## The canonical React 18 / client form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
});
type FormValues = z.infer<typeof Schema>;

export function LoginForm({ onSubmit }: { onSubmit: (v: FormValues) => Promise<void> }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(Schema), mode: 'onBlur' });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Email
        <input {...register('email')} />
        {errors.email && <p role="alert">{errors.email.message}</p>}
      </label>
      <label>
        Password
        <input type="password" {...register('password')} />
        {errors.password && <p role="alert">{errors.password.message}</p>}
      </label>
      <button disabled={isSubmitting}>Sign in</button>
    </form>
  );
}
```

## The React 19 + Server Action form

```tsx
// app/login/actions.ts
'use server';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(12) });

export async function loginAction(_prev: State, formData: FormData): Promise<State> {
  const parsed = LoginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  // ... authn; set cookie; etc.
  redirect('/dashboard');
}
```

```tsx
// app/login/page.tsx
'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction } from './actions';

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, { ok: true });

  return (
    <form action={formAction}>
      <input name="email" />
      {state?.errors?.email && <p role="alert">{state.errors.email[0]}</p>}
      <input name="password" type="password" />
      {state?.errors?.password && <p role="alert">{state.errors.password[0]}</p>}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>;
}
```

## Share schemas

The Zod schema is defined **once** and imported by both the client (React Hook Form resolver) and the server (Server Action validation). This is the canonical "validate at the boundary twice: client for UX, server for security" pattern.

## Optimistic UI on lists

```tsx
const [todos, setTodos] = useState<Todo[]>([]);
const [optimisticTodos, addOptimistic] = useOptimistic(todos, (cur, next: Todo) => [...cur, next]);

async function handleAdd(fd: FormData) {
  const draft = { id: 'temp-' + Date.now(), text: String(fd.get('text')), done: false };
  addOptimistic(draft);
  const saved = await createTodo(fd);
  setTodos((t) => [...t, saved]);
}
```

See `guides/10-react-19-idioms.md §useOptimistic` for full semantics.

## Field components

Wrap the library primitives in reusable field components:

```
src/components/ui/form/
  form.tsx          // <Form> context + handleSubmit passthrough
  text-field.tsx    // <TextField name="..." label="..." />
  select-field.tsx
  submit-button.tsx // uses useFormStatus
```

See `apps/react-vite/src/components/ui/form/` in bulletproof-react for a reference implementation.

## Accessibility requirements (non-negotiable)

- Every input has an associated `<label>` (not placeholder-as-label).
- Errors are announced via `role="alert"` or `aria-live="polite"`.
- Submit button is disabled during submission, not hidden.
- Error summary at top for long forms, linking to each field.

## Common findings

> **[Must-fix]** `src/features/signup/SignupForm.tsx:1`: controlled `useState` per field with manual `onChange`. Replace with React Hook Form. Re-render cost per keystroke is a performance regression under load. See `guides/06-forms.md §canonical-react-18`.

> **[Must-fix]** `app/login/actions.ts:3`: Server Action accepts `formData` without parsing. Add Zod `safeParse`. See `guides/11-server-components.md §server-actions`.

> **[Should-refactor]** `src/features/search/SearchForm.tsx:5`: Yup schema where the rest of the app uses Zod. Converge on Zod for consistency.

## Example in action

See `examples/code-review-example-before-after.md` for a form refactor.
