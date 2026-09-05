# TanStack Form Svelte adapter: createForm, field snippets, validators

- URL: https://tanstack.com/form/v1/docs/framework/svelte/quick-start ; https://tanstack.dev/form/latest/docs
- Fetched: 2026-08-14
- Source type: Official TanStack Form docs
- Component: TanStack Form / Svelte adapter

## Content

### Status: officially supported, Svelte 5 snippet-based API

`@tanstack/svelte-form` is a real, documented, official adapter. The current API is built on Svelte 5 **snippets** (`{#snippet children(field)}...{/snippet}`), not the older slot-prop pattern - confirming this is a Svelte-5-targeted rewrite, consistent with Query and Table's adapter generations.

### Minimal example

```svelte
<script>
  import { createForm } from '@tanstack/svelte-form';

  const form = createForm(() => ({
    defaultValues: { fullName: '' },
    onSubmit: async ({ value }) => { console.log(value); },
  }));
</script>

<form onsubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}>
  <form.Field name="fullName">
    {#snippet children(field)}
      <input
        name={field.name}
        value={field.state.value}
        onblur={field.handleBlur}
        oninput={(e) => field.handleChange(e.target.value)}
      />
    {/snippet}
  </form.Field>
  <button type="submit">Submit</button>
</form>
```

`createForm` takes a **function returning options** (same "wrap in a function to preserve reactivity" convention TanStack uses across the Svelte adapters for Query and this library - consistent enough across TanStack's Svelte ports to treat as a house style, not a one-off).

### Field-level validation (sync + async, with debounce)

```svelte
<form.Field
  name="firstName"
  validators={{
    onChange: ({ value }) => (value.length < 3 ? 'Not long enough' : undefined),
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 1000));
      return value.includes('error') && 'No "error" allowed in first name';
    },
  }}
>
  {#snippet children(field)}
    <!-- field.state.value, field.handleBlur, field.handleChange -->
  {/snippet}
</form.Field>
```

Conditional/nested fields work by nesting `<form.Field>` blocks inside a parent field's snippet (e.g. only rendering a `jobTitle` field when an `employed` checkbox field is true) - demonstrated directly in the official example, confirming dynamic form shapes are a supported first-class pattern, not a workaround.

### Reading aggregate form state without re-rendering on every keystroke

```svelte
<form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
  {#snippet children({ canSubmit, isSubmitting })}
    <button type="submit" disabled={!canSubmit}>{isSubmitting ? 'Submitting' : 'Submit'}</button>
  {/snippet}
</form.Subscribe>
```

`form.Subscribe` with a `selector` is the documented pattern for subscribing to a derived slice of form state (e.g. just `canSubmit`/`isSubmitting`) without every field re-rendering on every keystroke elsewhere in the form - the selector scopes the reactivity.

### Reset

`form.reset()` - resets all fields to `defaultValues`.

## Gap

No raw source archived in this pass for TanStack Form's Standard Schema (Zod/Valibot) integration specifically on the Svelte adapter - the pattern is documented for SvelteKit's own native remote-function `form` (see `sveltekit--remote-functions` raw file) but not independently confirmed for `@tanstack/svelte-form`'s validator options. Treat schema-library integration with TanStack Form on Svelte as needing a live-docs check before assuming the same Standard Schema pattern applies identically.
