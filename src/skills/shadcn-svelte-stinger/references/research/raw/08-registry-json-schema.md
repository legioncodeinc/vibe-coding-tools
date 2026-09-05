# registry.json - shadcn-svelte

- URL: https://shadcn-svelte.com/docs/registry/registry-json
- Fetched: 2026-08-14
- Source type: official docs
- Component: registry

Schema for running your own component registry. The `registry.json` schema is used to define your custom component registry.

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "shadcn-svelte",
  "homepage": "https://shadcn-svelte.com",
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "files": [
        {
          "path": "src/lib/registry/blocks/hello-world/hello-world.svelte",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

## Definitions

### $schema

```json
{ "$schema": "https://shadcn-svelte.com/schema/registry.json" }
```

### name

The `name` property specifies the name of your registry, used for data attributes and other metadata.

```json
{ "name": "acme" }
```

### homepage

The homepage of your registry, used for data attributes and other metadata.

```json
{ "homepage": "https://acme.com" }
```

### items

The `items` in your registry. Each item must implement the registry-item schema specification (see raw/09-registry-item-json-schema.md).

### aliases

`aliases` define how your registry's internal import paths will be transformed when users install your components. These should match how you import components within your registry code.

For example, if your registry's component has:

```svelte
<script lang="ts">
  import { Button } from "@/lib/registry/ui/button/index.js";
  import { cn } from "@/lib/utils.js";
</script>
```

Then your `registry.json` should have matching aliases:

```json
{
  "aliases": {
    "lib": "@/lib",
    "ui": "@/lib/registry/ui",
    "components": "@/lib/registry/components",
    "utils": "@/lib/utils",
    "hooks": "@/lib/hooks"
  }
}
```

Default aliases (if unspecified):

```json
{
  "aliases": {
    "lib": "$lib/registry/lib",
    "ui": "$lib/registry/ui",
    "components": "$lib/registry/components",
    "utils": "$lib/utils",
    "hooks": "$lib/registry/hooks"
  }
}
```

### overrideDependencies

`overrideDependencies` lets you force specific version ranges for dependencies, overriding what `shadcn-svelte registry build` detects in your `package.json`.

Use cases:

- Latest pre-release versions: `"overrideDependencies": ["paneforge@next"]`
- Pinning to specific versions: `"overrideDependencies": ["dep@1.5.0"]`

Warning: overriding dependencies can lead to version conflicts if not carefully managed; use sparingly.

---

## Getting Started (custom registry)

- URL: https://www.shadcn-svelte.com/docs/registry/getting-started
- Fetched: 2026-08-14
- Source type: official docs
- Component: registry

The `registry.json` file is only required if you're using the `shadcn-svelte` CLI to build your registry. If you're using a different build system, you can skip this step as long as your build system produces valid JSON files that conform to the registry-item schema specification.

Create a `registry.json` file in the root of your project:

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": []
}
```

Add your component to the registry by defining it with `name`, `type`, `title`, `description`, and `files`. For every file, specify `path` and `type`. The `path` is the relative path to the file from the root of your project.

By default, `shadcn-svelte registry build` generates the registry JSON files in `static/r`, e.g. `static/r/hello-world.json`.

Registry dependencies: list all registry dependencies in `registryDependencies`; a registry dependency is the name of a component in the registry (e.g. `input`, `button`, `card`) or a URL to a registry item (e.g. `http://localhost:5173/r/editor.json`). Ideally place files within a registry item in `components`, `hooks`, `lib` directories.

Use the `add` command (pointed at the built JSON URL) to install a custom registry item into a consuming project.

## Registry overview

- URL: https://www.shadcn-svelte.com/docs/registry
- Fetched: 2026-08-14
- Source type: official docs
- Component: registry

You can use the `shadcn-svelte` CLI to create your own component registry. Creating your own registry allows you to distribute your own custom components, hooks, pages, and other files to any Svelte project. Registry items are automatically compatible with the `shadcn-svelte` CLI.

You are free to design and host your custom registry as you see fit. The only requirement is that your registry items must be valid JSON files that conform to the registry-item schema specification.

A template project is available as a starting point:

```
pnpm dlx degit huntabyte/shadcn-svelte/registry-template#next-tailwind-4
```
