# Melt UI

- URL: https://next.melt-ui.com/, https://melt-ui.com/, https://github.com/melt-ui/melt-ui/, https://www.npmjs.com/package/melt
- Fetched: 2026-08-14
- Source type: official docs
- Component: foundation

## Melt UI (classic, melt-ui.com)

An open-source Svelte library for building high-quality, accessible design systems and web apps. A collection of accessible & unstyled component builders for Svelte applications.

From the GitHub repo (melt-ui/melt-ui):

Melt UI is a set of headless, accessible component builders for Svelte. Melt UI is meant to be used as a base for your own styles and components. It offers:

- Uncoupled builders that can be attached to any element/component
- Typescript and SvelteKit support out-of-the-box
- Strict adherence to WAI-ARIA guidelines
- Easy to use examples and documentation
- A high emphasis on accessibility, extensibility, quality and consistency

Import the builders to your code and start using them:

```html
<script>
	import { createCollapsible, melt } from '@melt-ui/svelte'

	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible()
</script>
```

## Melt UI "next" (Svelte 5, package name `melt`)

"The next generation of Melt UI. Built for Svelte 5." Now with Runes.

Melt UI provides two ways to use components:

### Using Builders

Builders can be called from a Svelte component, or `svelte.js|ts` files. Uses getters and setters for reactive properties.

### Using Components

The component pattern provides a more traditional Svelte experience. It provides no elements or styling, and instead provides you with an instance from the builder. The difference lies in being able to use the `bind:` directive.

```svelte
<script lang="ts">
  import { Toggle } from "melt/components";
  let value = $state(false);
</script>

<Toggle bind:value>
  {#snippet children(toggle)}
    <button {...toggle.root}>
      {toggle.value ? "On" : "Off"}
    </button>
  {/snippet}
</Toggle>
```

### API pattern

Each Melt UI component exposes a consistent API pattern through both its builder and component implementations:

- Builder Creation: Instantiate with optional configuration
- Root Element: Access via `.root` for base attributes
- Value Management: Get/set via `.value` property
- Event Handlers: Prefixed with `on`, like `onValueChange`
- State Queries: Methods prefixed with `is`, like `isSelected`
- Actions: Methods for state manipulation, like `select`, `deselect`

### Installation requirements

- Node.js version 18 or higher
- A Svelte project using version 5.0.0 or higher

## Relationship to Bits UI

Per Bits UI's own "Acknowledgments" section (see raw/03-bits-ui-foundation.md), Melt UI "inspired the internal architecture" of Bits UI. shadcn-svelte's docs describe components as "built on Bits UI and Melt UI" (per agencybreda.com secondary source, see raw/10-forms-formsnap-superforms.md). Gap: the raw archive does not contain an explicit official shadcn-svelte statement of exactly which components use Melt UI directly versus Bits UI; the primary CLI-installed component set (button, dialog, select, etc.) resolves through Bits UI per its own docs and package.json dependencies observed in fetched component source (see raw/14-copy-in-philosophy-and-component-anatomy.md).
