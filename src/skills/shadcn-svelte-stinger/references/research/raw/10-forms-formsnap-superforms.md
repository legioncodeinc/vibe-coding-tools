# Formsnap - shadcn-svelte

- URL: https://shadcn-svelte.com/docs/forms
- Fetched: 2026-08-14
- Source type: official docs
- Component: forms

Building forms with Formsnap, Superforms, & Zod.

Forms are tricky. They are one of the most common things you'll build in a web application, but also one of the most complex. Well-designed HTML forms are: well-structured and semantically correct; easy to use and navigate (keyboard); accessible with ARIA attributes and proper labels; support client and server side validation; well-styled and consistent with the rest of the application.

## Features

The `Form` components offered by shadcn-svelte are wrappers around `formsnap` & `sveltekit-superforms` which provide: composable components for building forms; form field components for scoping form state; form validation using Zod or any other validation library supported by Superforms; correct `aria` attributes applied to form fields based on state; easy use of Select, RadioGroup, Switch, Checkbox and other form components with forms.

## Anatomy

```svelte
<form>
  <Form.Field>
    <Form.Control>
      <Form.Label />
    </Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>
</form>
```

## Installation

```bash
pnpm dlx shadcn-svelte@latest add form
```

## Usage

### 1. Create a form schema

```ts
// src/routes/settings/schema.ts
import { z } from "zod";
export const formSchema = z.object({
  username: z.string().min(2).max(50),
});
export type FormSchema = typeof formSchema;
```

### 2. Setup the load function

```ts
// src/routes/settings/+page.server.ts
import type { PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(formSchema)),
  };
};
```

### 3. Create form component

```svelte
<!-- src/routes/settings/settings-form.svelte -->
<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { formSchema, type FormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";

  let { form: initialForm }: { form: SuperValidated<Infer<FormSchema>> } = $props();
  const form = superForm(initialForm, {
    validators: zod4Client(formSchema),
  });
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

The `name`, `id`, and all accessibility attributes are applied to the input by spreading the `props` object from the `Form.Control` children snippet. `Form.Label` automatically associates itself with the input via the `for` attribute.

### 4. Use the component

```svelte
<!-- src/routes/settings/+page.svelte -->
<script lang="ts">
  import type { PageData } from "./$types.js";
  import SettingsForm from "./settings-form.svelte";
  let { data }: { data: PageData } = $props();
</script>

<SettingsForm form={data.form} />
```

### 5. Create an action

```ts
// src/routes/settings/+page.server.ts
import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";

export const load: PageServerLoad = async () => {
  return { form: await superValidate(zod4(formSchema)) };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    return { form };
  },
};
```

That's it: a fully accessible form that is type-safe with client & server side validation.

### SPA variant with toast feedback

```svelte
<script lang="ts" module>
  import { z } from "zod";
  const formSchema = z.object({ username: z.string().min(2).max(50) });
</script>
<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-2/3 space-y-6" use:enhance>
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

## Other field examples referenced by the docs

Checkbox, Date Picker, Input, Radio Group, Select, Switch, Textarea all follow the same `Form.Field` / `Form.Control` / snippet-props pattern. Select fields put the control props on the trigger:

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

(Source: fullstacksveltekit.com/blog/shadcn-svelte-sveltekit, published 2026-05-25, blog, community, cross-confirms the same pattern with a `newProjectSchema` example and `zod4`/`zod4Client` adapters.)

---

# formsnap (package)

- URL: https://www.npmjs.com/package/formsnap
- Fetched: 2026-08-14
- Source type: official docs
- Component: forms

The goal of formsnap is to make working with `sveltekit-superforms` even more pleasant by wrapping it with accessible form components.

Peer/dev dependency versions observed in the package's own devDependency table: `svelte ^5.11.0`, `sveltekit-superforms ^2.19.0`, `@sveltejs/kit ^2.5.28`. Peer dependencies: `svelte ^5.0.0`, `sveltekit-superforms ^2.19.0`.

```bash
npm i formsnap sveltekit-superforms <your-schema-library>
```

Setup: define a schema, return the form from the load function, then construct the form:

```svelte
<script lang="ts">
	import { Field, Label, FieldErrors, Control, Description, Fieldset, Legend } from "formsnap";
	import { settingsFormSchema } from "./schemas";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(settingsFormSchema),
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Field {form} name="email">
		<Control let:attrs>
			<Label>Email</Label>
			<input type="email" {...attrs} bind:value={$formData.email} />
		</Control>
		<Description>We'll provide critical updates about your account via email.</Description>
		<FieldErrors />
	</Field>

	<Fieldset {form} name="theme">
		<Legend>Select your theme</Legend>
		{#each ["light", "dark"] as theme}
			<Control let:attrs>
				<input {...attrs} type="radio" bind:group={$formData.theme} value={theme} />
				<Label>{theme}</Label>
			</Control>
		{/each}
		<FieldErrors />
	</Fieldset>

	<button type="submit">Submit</button>
</form>
```

Note: this npm README example uses Svelte 4 `export let data` / `let:attrs` syntax. Gap: the formsnap npm package README itself has not been fully updated to Svelte-5-runes idiom at the time of this fetch; the shadcn-svelte `docs/forms` page (above) is the authoritative Svelte-5-runes-idiom version (`$props()`, `{#snippet children({ props })}`) and should be preferred for any generated guide or reference code.

---

# Integrate Superforms with Formsnap

- URL: https://superforms.rocks/formsnap
- Fetched: 2026-08-14
- Source type: official docs
- Component: forms

Fortunately, the UI-component guru Hunter Johnston (huntabyte) has done the community a great service with his library Formsnap. It simplifies putting forms into components and adds accessibility with no effort, compared to manually putting attributes on individual form fields.
