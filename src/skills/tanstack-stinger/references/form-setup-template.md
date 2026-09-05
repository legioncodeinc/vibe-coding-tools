# TanStack Form (Svelte 5 snippets) setup (copy-paste)

Grounded in `research/distilled-tanstack.md` §4, `research/raw/tanstack--form--svelte-quickstart-and-validation.md`.

## Basic form with field validation

```svelte
<script lang="ts">
  import { createForm } from '@tanstack/svelte-form';

  const form = createForm(() => ({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      await login(value);
    },
  }));
</script>

<form onsubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}>
  <form.Field
    name="email"
    validators={{
      onChange: ({ value }) => (!value.includes('@') ? 'Invalid email' : undefined),
    }}
  >
    {#snippet children(field)}
      <label for={field.name}>Email</label>
      <input
        id={field.name}
        value={field.state.value}
        onblur={field.handleBlur}
        oninput={(e) => field.handleChange((e.target as HTMLInputElement).value)}
      />
      {#if field.state.meta.errors.length}
        <span class="error">{field.state.meta.errors.join(', ')}</span>
      {/if}
    {/snippet}
  </form.Field>

  <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
    {#snippet children({ canSubmit, isSubmitting })}
      <button type="submit" disabled={!canSubmit}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    {/snippet}
  </form.Subscribe>
</form>
```

## When to reach for TanStack Form vs SvelteKit's native `form` remote function

Use TanStack Form when the form needs rich, client-side, per-keystroke field validation state (async debounced validators, cross-field dependencies rendered conditionally) with full client-side control. Use SvelteKit's native `form` remote function (see `references/research/raw/sveltekit--remote-functions--query-form-command.md`) when the form is a straightforward write that benefits from zero-JS progressive enhancement and doesn't need rich client-side validation UX beyond what Standard Schema (Zod/Valibot) submission-time validation provides. The two are not mutually exclusive with the rest of the app - pick per form based on its actual UX requirements, not as a blanket project-wide rule.

## Gap to flag

Standard Schema (Zod/Valibot) integration with `@tanstack/svelte-form`'s validator options was not independently confirmed in this skill's research pass. Verify the current API against live TanStack Form docs before wiring a schema library into `validators`.
