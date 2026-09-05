# Forms: React Hook Form + Zod

**Sources:**
- https://react-hook-form.com/
- https://zod.dev/
- https://github.com/react-hook-form/resolvers
- WebSearch: "React Hook Form Zod resolver 2026"

**Retrieved:** 2026-04-24

## Summary

React Hook Form is the default form library in 2026. It uses uncontrolled inputs (ref-based) for performance: minimal re-renders on typing. Zod is the default schema-validation layer; `@hookform/resolvers/zod` integrates them with a single `zodResolver(schema)` call.

## Canonical pattern

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const FormSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(18),
});
type FormValues = z.infer<typeof FormSchema>;

function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      ...
    </form>
  );
}
```

## Best practices

1. **Use Zod as the source of truth.** `z.infer<>` gives you the TypeScript type for free.
2. **Share the schema between client and server.** Validate on both sides: client for UX, server as the security layer.
3. **Abstract a `<Form>` and field components** (per bulletproof-react) so the library choice is swappable.
4. **Mode defaults:** `onBlur` for most forms; `onChange` only when instant feedback is required.
5. **Wire Zod + React Hook Form + React 19 Server Actions** via `formAction` on the `<form>`: RHF exposes the form data, Zod re-validates server-side, Server Action persists.

## Relevance to this stinger

Spine of `guides/06-forms.md`. The schema-shared-across-boundary pattern connects to `guides/09-typescript-patterns.md` (Zod at boundary) and `guides/11-server-components.md` (Server Action validation).
