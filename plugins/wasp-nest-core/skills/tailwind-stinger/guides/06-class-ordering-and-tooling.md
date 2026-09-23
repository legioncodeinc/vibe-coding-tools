# Class ordering and tooling

## Install the official Prettier plugin, don't hand-order classes

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

```json
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

This is the single tool that solves "utility soup" readability complaints at the tooling level rather than the discipline level: a long class list is fine as long as it's consistently and automatically ordered. [raw/11-prettier-plugin-class-sorting.md]

## How the sort order works

Classes sort in the same order Tailwind emits them internally: base layer first, then components, then utilities. Within utilities, the order loosely follows the box model, high-impact layout properties first, decorative properties later, related utilities kept together, so that later classes in the list are the ones most likely to be overriding earlier ones. Modifiers (`hover:`, `focus:`) group together after plain utilities; responsive modifiers (`sm:`, `md:`) group together and sort smallest-to-largest. Non-Tailwind classes (from a third-party library) always sort to the front, making it obvious at a glance when an element depends on something outside Tailwind. [raw/11-prettier-plugin-class-sorting.md]

```html
<!-- Before -->
<button class="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800">Submit</button>
<!-- After (auto-sorted) -->
<button class="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3">Submit</button>
```

[raw/11-prettier-plugin-class-sorting.md]

## No customization, and that's deliberate

There is no config option to change the sort order. The stated rationale is that a non-negotiable order removes an entire class of team bikeshedding. Don't fight this by hand-ordering classes differently, in a project with the plugin installed, any manual ordering gets overwritten on save anyway. [raw/11-prettier-plugin-class-sorting.md]

## v4-specific config detail

The plugin's programmatic `createSorter` API takes a `stylesheetPath` option pointing at the project's Tailwind v4 CSS entry file (replacing the v3-era `configPath` pointing at `tailwind.config.js`). Most projects never touch this directly, Prettier resolves it automatically, but it matters if the plugin's sorter is being used outside Prettier (e.g. in a custom lint rule or CI check). [raw/11-prettier-plugin-class-sorting.md]

## Load order matters with other Prettier plugins

`prettier-plugin-tailwindcss` must be listed last in the `plugins` array relative to other Prettier plugins (e.g. plugins that reformat `.svelte` or `.astro` files), or class sorting can silently not apply. [raw/11-prettier-plugin-class-sorting.md]

## What it sorts beyond `class=`

By default: the `class` attribute, framework equivalents like `className`, `:class`, `[ngClass]`, and classes inside `@apply` directives in CSS. [raw/11-prettier-plugin-class-sorting.md]

## Svelte example

```svelte
<!-- .prettierrc -->
```

```json
{
  "plugins": ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"]
}
```

Tailwind's plugin last, per the load-order rule above. Then a component like:

```svelte
<script lang="ts">
  let { active = false }: { active?: boolean } = $props();
</script>

<button class={active ? 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800' : 'bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300'}>
  Toggle
</button>
```

`prettier-plugin-tailwindcss` sorts the class strings inside the ternary automatically on save.

## Editor integration

Because it's a standard Prettier plugin, it works in any Prettier-integrated editor, including Cursor, without anything Tailwind-specific beyond installing it. Pair it with the official Tailwind CSS IntelliSense VS Code extension for autocomplete and hover previews. [raw/11-prettier-plugin-class-sorting.md]
