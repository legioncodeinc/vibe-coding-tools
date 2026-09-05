# Guide 5: TanStack Form validation

Grounded in `references/research/distilled-tanstack.md` §4, `references/form-setup-template.md`.

## When to walk this guide

Building a form that needs rich client-side validation state beyond what a plain HTML form or SvelteKit's native `form` remote function easily provides.

## Setup

```ts
const form = createForm(() => ({
  defaultValues: { email: '', password: '' },
  onSubmit: async ({ value }) => { /* ... */ },
}));
```

Same "wrap options in a function" convention as Query - consistent house style across TanStack's Svelte adapters.

## Field validation

```svelte
<form.Field
  name="email"
  validators={{
    onChange: ({ value }) => (!value.includes('@') ? 'Invalid email' : undefined),
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: async ({ value }) => { /* async check, e.g. availability */ },
  }}
>
  {#snippet children(field)}
    <input value={field.state.value} onblur={field.handleBlur} oninput={(e) => field.handleChange(e.target.value)} />
  {/snippet}
</form.Field>
```

Nested/conditional fields are first-class: a field's snippet can render another `<form.Field>` (e.g. only show `jobTitle` when `employed` is checked).

## Scoping reactivity for aggregate state

```svelte
<form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
  {#snippet children({ canSubmit, isSubmitting })}
    <button disabled={!canSubmit}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
  {/snippet}
</form.Subscribe>
```

Use `form.Subscribe` with a `selector` whenever a piece of UI only needs a derived slice of form state - it prevents that UI from re-rendering on every keystroke happening in unrelated fields.

## TanStack Form vs SvelteKit's native `form` remote function - pick per form

| Need | Use |
|---|---|
| Rich per-keystroke validation, async debounced checks, complex conditional field trees, full client-side control | TanStack Form |
| Straightforward write, zero-JS progressive enhancement matters, submission-time Standard Schema validation is enough | SvelteKit's native `form` remote function |

These aren't mutually exclusive project-wide - a settings form with three simple fields might use the native `form` remote function while a multi-step signup flow with async username-availability checks uses TanStack Form. Decide per form based on actual UX requirements.

## Gap to flag before wiring a schema library

Standard Schema (Zod/Valibot) integration with `@tanstack/svelte-form`'s `validators` option was not independently confirmed in this skill's research. Check current TanStack Form docs live before assuming the exact wiring pattern - don't guess the API shape.

## Common mistakes

- Reaching for TanStack Form on every form regardless of actual complexity, adding bundle weight for forms SvelteKit's native `form` would have handled with less code.
- Forgetting `onChangeAsyncDebounceMs` on an async validator, causing a network call on every keystroke.
- Not using `form.Subscribe` for aggregate state, causing every field to re-render on every other field's keystroke.
