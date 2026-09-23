# Forms: Superforms + Formsnap

This is the current officially documented and recommended form pattern for shadcn-svelte [research/raw/10-forms-formsnap-superforms.md]. All code below is Svelte 5 runes idiom, matching the official `/docs/forms` page, not the (Svelte-4-flavored) formsnap package README example: see the version note at the end of this guide.

## The stack

Zod (schema, source of truth for shape + generates TS types) → `superValidate(zod4(schema))` in a `+page.server.ts` `load` → `superForm(initialForm, { validators: zod4Client(schema) })` on the client → `Form.Field` / `Form.Control` / `Form.Label` / `Form.Description` / `Form.FieldErrors` composition [research/raw/10-forms-formsnap-superforms.md].

Install the form primitives: `pnpm dlx shadcn-svelte@latest add form` [research/raw/10-forms-formsnap-superforms.md].

## Step by step

### 1. Schema

```ts
// src/routes/settings/schema.ts
import { z } from "zod";
export const formSchema = z.object({
  username: z.string().min(2).max(50),
});
export type FormSchema = typeof formSchema;
```

### 2. Server load

```ts
// src/routes/settings/+page.server.ts
import type { PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async () => {
  return { form: await superValidate(zod4(formSchema)) };
};
```

### 3. Form component (Svelte 5 runes)

```svelte
<!-- src/routes/settings/settings-form.svelte -->
<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { formSchema, type FormSchema } from "./schema";
  import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";

  let { form: initialForm }: { form: SuperValidated<Infer<FormSchema>> } = $props();
  const form = superForm(initialForm, { validators: zod4Client(formSchema) });
  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

The `props` object spread onto `Input` carries `name`, `id`, and every accessibility attribute; `Form.Label` auto-associates via `for` [research/raw/10-forms-formsnap-superforms.md].

### 4. Page + action

```svelte
<!-- src/routes/settings/+page.svelte -->
<script lang="ts">
  import type { PageData } from "./$types.js";
  import SettingsForm from "./settings-form.svelte";
  let { data }: { data: PageData } = $props();
</script>

<SettingsForm form={data.form} />
```

```ts
// src/routes/settings/+page.server.ts (actions block)
export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(formSchema));
    if (!form.valid) return fail(400, { form });
    return { form };
  },
};
```

[research/raw/10-forms-formsnap-superforms.md]

## Select fields: control props go on the trigger

```svelte
<Form.Field {form} name="status">
	<Form.Control>
		{#snippet children({ props })}
			<Form.Label>Status</Form.Label>
			<Select.Root type="single" bind:value={$formData.status} name={props.name}>
				<Select.Trigger {...props} class="capitalize">{$formData.status}</Select.Trigger>
				<Select.Content>
					{#each ['active', 'paused', 'archived'] as status (status)}
						<Select.Item value={status} class="capitalize">{status}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
```

[research/raw/10-forms-formsnap-superforms.md]

## Why `zod4`/`zod4Client`

The adapter naming signals Superforms' current major depends on Zod v4's adapter API specifically; using the bare `zod`/`zodClient` adapters from older examples may target an earlier Superforms/Zod pairing. Match the adapter suffix to your installed Superforms version [research/raw/10-forms-formsnap-superforms.md].

## Version note: formsnap README is Svelte 4, don't copy it

The `formsnap` npm package's own README still demonstrates Svelte 4 syntax (`export let data`, `let:attrs` slot props) [research/raw/10-forms-formsnap-superforms.md]. Do not use it as a Svelte 5 reference. The shadcn-svelte `/docs/forms` page (this guide's primary source) is the authoritative Svelte-5-runes-idiom version and should be preferred whenever the two disagree on syntax [research/raw/10-forms-formsnap-superforms.md].

## Accessibility payoff

`Form.*` wrapper components apply correct `aria-*` attributes based on field validation state automatically, and wire label/input association via `for`/`id`, without you writing that logic by hand [research/raw/10-forms-formsnap-superforms.md]. See [guides/07-accessibility-and-gaps-vs-react.md](07-accessibility-and-gaps-vs-react.md).
