# 14: Forms & Validation (extended)

Source: `research/2026-04-25-forms-and-validation.md`. Companion to `guides/06-forms.md`, which covers the canonical React Hook Form + Zod stack and React 19 Server Action forms. This guide covers the extended landscape: when to leave the default and what to leave it for.

## TL;DR pick

| Project shape | Form lib | Schema lib | Why |
|---|---|---|---|
| Anything React 18/19, default | **React Hook Form** | **Zod** | Performance, ergonomics, ecosystem |
| Bundle-sensitive (edge / mobile-web) | RHF | **Valibot** | ~10x smaller than Zod, similar API |
| Cross-framework (React + Solid + Vue) | **TanStack Form** | Zod or Valibot | Same form code across frameworks |
| Progressive enhancement (forms work without JS) | **Conform** + RHF or alone | Zod | Built for Server Actions; no-JS-friendly |
| You need a hosted survey/feedback product | **Formbricks** | n/a | OSS Typeform alt; embed not author |

The canonical pick remains **React Hook Form + Zod**. Everything below is a *justified* deviation.

---

## When to choose each

### React Hook Form (the default)
- React-only project, you want the largest ecosystem of resolvers / DevTools / examples.
- Uncontrolled inputs by default: keystroke renders only the touched field.
- Pairs with `@hookform/resolvers/zod` (or `/valibot`, `/yup`, `/joi`, `/arktype`).

### TanStack Form (when "framework-agnostic" matters)
- You ship the same form to a React app and a Solid/Vue surface (rare but real for component libraries).
- Type inference is sharper than RHF's because TanStack Form is built type-first.
- Trade-off: smaller ecosystem, fewer Stack Overflow answers, more code-by-hand.

### Conform (progressive enhancement is non-negotiable)
- The form must submit and show errors with JS disabled (government, healthcare, accessibility-mandated surfaces).
- Built around the platform `<form>`, FormData, and Server Actions.
- Layers cleanly with React 19 `useActionState`. Use it *with* Zod, not instead of it.

### Formbricks (don't author, embed)
- You want an in-app NPS / CSAT / feature-feedback survey, not a CRUD form.
- Self-hosted OSS alternative to Typeform + Hotjar surveys.
- Out of scope for the Form Layer: flag it and route to product.

---

## Schema library choice (Zod vs Valibot)

Zod and Valibot have near-identical mental models. The difference is bundle.

| | Zod | Valibot |
|---|---|---|
| Bundle (gzipped, typical schema) | ~12 KB | ~1.5 KB |
| API style | Method chaining (`z.string().email()`) | Functional pipes (`pipe(string(), email())`) |
| Type inference | Excellent | Excellent |
| Ecosystem | Massive (default everywhere) | Growing fast in 2026 |
| Standard Schema spec | Yes | Yes |

**Pick Zod by default.** Pick Valibot when bundle budget bites: usually edge-runtime endpoints, mobile web, or component libraries that ship a schema.

Both implement the [Standard Schema](https://standardschema.dev/) spec, so RHF / TanStack Form / Conform accept either with the right resolver. Migration is mechanical but tedious: don't migrate without a measured bundle win.

---

## React 19 Actions starter (Conform + Zod)

Conform shines in the Server Action world because it speaks FormData natively and degrades to no-JS gracefully.

```tsx
// app/contact/schema.ts
import { z } from 'zod';
export const ContactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});
```

```tsx
// app/contact/actions.ts
'use server';
import { parseWithZod } from '@conform-to/zod';
import { ContactSchema } from './schema';

export async function contactAction(_prev: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: ContactSchema });
  if (submission.status !== 'success') return submission.reply();
  // ... persist; send email; etc.
  return submission.reply({ resetForm: true });
}
```

```tsx
// app/contact/page.tsx
'use client';
import { useActionState } from 'react';
import { useForm, getFormProps, getInputProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ContactSchema } from './schema';
import { contactAction } from './actions';

export default function ContactPage() {
  const [lastResult, action] = useActionState(contactAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema: ContactSchema }),
    shouldValidate: 'onBlur',
  });

  return (
    <form {...getFormProps(form)} action={action}>
      <input {...getInputProps(fields.email, { type: 'email' })} />
      <p role="alert">{fields.email.errors}</p>
      <textarea {...getInputProps(fields.message, { type: 'text' })} />
      <p role="alert">{fields.message.errors}</p>
      <button>Send</button>
    </form>
  );
}
```

The same `ContactSchema` validates on the server (security) and on the client (UX): the canonical "validate at the boundary twice" pattern from `guides/06-forms.md`.

---

## Choice tree

1. **Are you on React 19 with Server Actions and care about no-JS?** → Conform + Zod.
2. **Cross-framework component library shipping forms?** → TanStack Form + Zod (or Valibot).
3. **Bundle budget is biting?** → RHF + Valibot (or TanStack Form + Valibot).
4. **Otherwise** → RHF + Zod. (See `guides/06-forms.md`.)

If you're authoring an in-app survey UX (NPS, CSAT, feature feedback), don't author it: embed Formbricks and move on.

---

## Common findings

> **[Should-refactor]** `package.json:31`: `yup` listed alongside `zod`. Converge on Zod. See `guides/06-forms.md §share-schemas`.

> **[Should-refactor]** `apps/edge-fn/src/validate.ts:1`: Zod schema imported into an edge function bundle. Measure bundle; if Zod is the dominant cost, swap to Valibot. See this guide §schema-library-choice.

> **[Must-fix]** `app/contact/actions.ts:5`: Server Action accepts FormData without parsing. Add `parseWithZod` (Conform) or `safeParse` (raw Zod). See `guides/11-server-components.md §server-actions`.

---

## Handoffs

- **Visual / token decisions on form fields** → `ux-ui-svelte-worker-bee`.
- **Server Action security review (auth, RBAC, CSRF posture)** → `security-worker-bee`.
- **Survey product strategy (Formbricks vs Typeform vs build)** → `library-worker-bee` PRD.
