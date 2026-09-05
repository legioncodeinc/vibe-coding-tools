# SvelteKit installation and components.json

- URL: https://shadcn-svelte.com/docs/installation/sveltekit
- Fetched: 2026-08-14
- Source type: official docs
- Component: cli

How to setup shadcn-svelte in a SvelteKit project.

### Create project

Use the SvelteKit CLI to create a new project with TailwindCSS

```
pnpm dlx sv create my-app --add tailwindcss
npx sv create my-app --add tailwindcss
bun x sv create my-app --add tailwindcss
```

### Setup path aliases

If you are not using the default alias `$lib`, you'll need to update your `svelte.config.js` file to include those aliases.

```js
// svelte.config.js
const config = {
  // ... other config
  kit: {
    // ... other config
    alias: {
      "@/*": "./path/to/lib/*",
    },
  },
};
```

### Run the CLI

```
pnpm dlx shadcn-svelte@latest init
npx shadcn-svelte@latest init
bun x shadcn-svelte@latest init
```

### Configure components.json

You will be asked a few questions to configure `components.json`:

```
Which base color would you like to use? › Slate
Where is your global CSS file? (this file will be overwritten) › src/routes/layout.css
Configure the import alias for lib: › $lib
Configure the import alias for components: › $lib/components
Configure the import alias for utils: › $lib/utils
Configure the import alias for hooks: › $lib/hooks
Configure the import alias for ui: › $lib/components/ui
```

### That's it

You can now start adding components to your project.

```
pnpm dlx shadcn-svelte@latest add button
```

The command above will add the `Button` component to your project. You can then import it like this:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<Button>Click me</Button>
```

---

# components.json

- URL: https://shadcn-svelte.com/docs/components-json
- Fetched: 2026-08-14
- Source type: official docs
- Component: cli

The `components.json` file holds configuration for your project. We use it to understand how your project is set up and how to generate components customized for your project.

Note: The `components.json` file is optional and only required if you're using the CLI to add components to your project. If you're using the copy and paste method, you don't need this file.

You can create a `components.json` file in your project by running:

```
pnpm dlx shadcn-svelte@latest init
```

## $schema

```json
{
  "$schema": "https://shadcn-svelte.com/schema.json"
}
```

## tailwind

Configuration to help the CLI understand how Tailwind CSS is set up in your project.

### tailwind.css

Path to the CSS file that imports Tailwind CSS into your project.

```json
{
  "tailwind": {
    "css": "src/app.{p,post}css"
  }
}
```

### tailwind.baseColor

This is used to generate the default color palette for your components. This cannot be changed after initialization.

```json
{
  "tailwind": {
    "baseColor": "gray" | "neutral" | "slate" | "stone" | "zinc"
  }
}
```

## aliases

The CLI uses these values and the `alias` config from your `svelte.config.js` file to place generated components in the correct location. Path aliases have to be set up in your `svelte.config.js` file.

### aliases.lib

Import alias for your library, which is typically where you store your components, utils, hooks, etc.

```json
{ "aliases": { "lib": "$lib" } }
```

### aliases.utils

Import alias for your utility functions.

```json
{ "aliases": { "utils": "$lib/utils" } }
```

### aliases.components

Import alias for your components.

```json
{ "aliases": { "components": "$lib/components" } }
```

### aliases.ui

Import alias for your UI components.

```json
{ "aliases": { "ui": "$lib/components/ui" } }
```

### aliases.hooks

Import alias for your hooks, which in Svelte 5 are reactive functions/classes whose files typically end in `.svelte.ts` or `.svelte.js`.

```json
{ "aliases": { "hooks": "$lib/hooks" } }
```

## Typescript

Typescript can be enabled or disabled.

```json
{ "typescript": true | false }
```

You can also specify a path to your own custom Typescript config file if it has a different name from `tsconfig.json` or `jsconfig.json`, or if it is located in a different directory:

```json
{
  "typescript": {
    "config": "path/to/tsconfig.custom.json"
  }
}
```

## Registry

The registry URL tells the CLI where to fetch the shadcn-svelte components/registry from. You can pin this to a specific preview release or your own fork of the registry.

```json
{
  "registry": "https://shadcn-svelte.com/registry"
}
```

## Note on component file structure

From https://shadcn-svelte.com/docs/installation (fetched via search highlights, official docs, huntabyte):

Unlike the original shadcn/ui for React, where the full components can exist in a single file, components in this port are split into multiple files. This is because Svelte doesn't support defining multiple components in a single file, so utilizing the CLI to add components will be the optimal approach.

The CLI will create a folder for each component, which will sometimes just contain a single Svelte file, and in other times, multiple files. Within each folder, there will be an `index.ts` file that exports the component(s), so you can import them from a single file.

There is also a VSCode extension by @selemondev and a JetBrains IDEs extension that can initialize the CLI, add components, navigate to a component's docs page, and provide import snippets.
