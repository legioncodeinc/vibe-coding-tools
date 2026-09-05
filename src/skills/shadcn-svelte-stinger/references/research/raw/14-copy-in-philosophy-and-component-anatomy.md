# Introduction - shadcn-svelte (copy-in philosophy)

- URL: https://www.shadcn-svelte.com/docs
- Fetched: 2026-08-14
- Source type: official docs
- Component: philosophy

Re-usable components built with Bits UI and Tailwind CSS.

An unofficial, community-led Svelte port of shadcn/ui. "We are not affiliated with shadcn, but we did get his blessing before creating a Svelte version of his work." Born out of the need for a similar project for the Svelte ecosystem.

"This is not a component library. It is how you build your component library."

Traditional component libraries: install a package from npm, import the components, use them in your app. This works until you need to customize a component to fit your design system or need one that isn't included. You end up wrapping library components, writing workarounds to override styles, or mixing components from incompatible libraries.

shadcn-svelte's five principles:

- **Open Code**: the top layer of your component code is open for modification.
- **Composition**: every component uses a common, composable interface, making them predictable.
- **Distribution**: a flat-file schema and command-line tool make it easy to distribute components.
- **Beautiful Defaults**: carefully chosen default styles, so you get great design out-of-the-box.
- **AI-Ready**: open code for LLMs to read, understand, and improve.

## Open Code

shadcn-svelte hands you the actual component code. You have full control to customize and extend the components to your needs: full transparency (you see exactly how each component is built), easy customization (modify any part to fit your design/functionality requirements), AI integration (access to the code makes it straightforward for LLMs to read, understand, and improve your components).

"In a typical library, if you need to change a button's behavior, you have to override styles or wrap the component. With shadcn-svelte, you simply edit the button code directly."

The docs pose their own rhetorical question: "How do I pull upstream updates in an Open Code approach?" (see raw/06-tailwind-v4-migration.md for the answer: `add --all --overwrite` after committing, then re-apply diffs; and the GitHub discussion below for the maintainer's recommended workflow).

## Composition

Every component shares a common, composable interface. If a component doesn't exist, the maintainers bring it in, make it composable, and adjust its style to match and work with the rest of the design system. A shared, composable interface is predictable for both your team and LLMs: you don't learn different APIs for every new component, even third-party ones.

## Distribution

shadcn-svelte is also a code distribution system: it defines a schema for components and a CLI to distribute them. Schema: a flat-file structure defining components, dependencies, and properties. CLI: a command-line tool to distribute and install components across projects with cross-framework support. The schema can also be used to have AI generate entirely new components based on existing schema.

## Beautiful Defaults

A large collection of components with carefully chosen default styles: good out-of-the-box (clean, minimal look without extra work), unified design (components naturally fit together), easily customizable (simple to override and extend defaults).

## AI-Ready

Open code and a consistent API let AI models read, understand, and even generate new components that integrate with your existing design.

---

## Recommended upstream-update workflow (maintainer guidance)

- URL: https://github.com/huntabyte/shadcn-svelte/discussions/1704
- Fetched: 2026-08-14
- Source type: official docs (maintainer discussion)
- Component: customization

"Extend buttonVariants in external file for persistence" discussion. A user asked how to externally extend `buttonVariants` so custom modifications (e.g. an added button size) survive a CLI update, since `add --overwrite` replaces the whole file.

huntabyte's guidance (maintainer): "We recommend approaching this by committing all your code before updating, updating one component at a time, and reviewing the diffs/reverting any changes that go against your modifications. This is how I handle it on all my projects, which I use shadcn-svelte on, and it works great. Sometimes you have to look a little closely but it is worth it to own the code."

This is the canonical, maintainer-endorsed customization-without-breaking-upgrades workflow: (1) commit before any `add --overwrite` / `update`, (2) update one component at a time rather than `--all` when you have made edits, (3) diff each updated file against your committed version, (4) manually re-apply your customizations into the new upstream version.

## Update command history and limitations

- URL: https://github.com/huntabyte/shadcn-svelte/issues/298
- Fetched: 2026-08-14
- Source type: community (GitHub issue)
- Component: customization

Historical feature request (2023) for an update mechanism; resolved over time by `add --overwrite` and later a dedicated `update utils` capability, and now the `apply`/`registry build` machinery documented in raw/01-cli-command-reference.md. One community reply's workflow, endorsed in the thread: "I usually use `npx shadcn-svelte@latest add button --overwrite`... If I previously edited button component somehow (eg changing background color), check with git diff and redo the changes on the new installed component... it's a price to pay for having the components installed directly in your code instead of having an npm package. Also on original shadcn library there is the same problem."

- URL: https://github.com/huntabyte/shadcn-svelte/issues/1532
- Fetched: 2026-08-14
- Source type: community (GitHub issue, resolved)
- Component: customization

Documents a real bug where the `update` command broke when `components.json` used non-default aliases (hardcoded `ui` directory path instead of the resolved alias). Resolved as of `shadcn-svelte@1.0.0-next.11` per a linked fix (`const componentDir = path.resolve(config.resolvedPaths.ui);`). Relevant caution for any project (like OSPRY's apps) that customizes `components.json` aliases: confirm the installed shadcn-svelte CLI version is at least `1.0.0-next.11` (well below the current `1.4.2`, so not a live concern, but documents that alias customization has historically been an update-command edge case worth testing after any CLI upgrade).

---

## Button component: worked source example (Svelte 5 runes, tailwind-variants, cn())

- URL: https://www.shadcn-svelte.com/docs/components/button
- Fetched: 2026-08-14
- Source type: official docs
- Component: anatomy

Displays a button or a component that looks like a button.

```svelte
<script lang="ts">
  import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<div class="flex flex-wrap items-center gap-2 md:flex-row">
  <Button variant="outline">Button</Button>
  <Button variant="outline" size="icon" aria-label="Submit">
    <ArrowUpIcon />
  </Button>
</div>
```

Link usage via the exported `buttonVariants` helper (for an `<a>` that should look like a button):

```svelte
<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button";
</script>

<a href="/dashboard" class={buttonVariants({ variant: "outline" })}>
  Dashboard
</a>
```

Sizes include `default`, `sm`, `lg`, and icon variants `icon`, `icon-sm`, `icon-lg` (the two `icon-sm`/`icon-lg` sizes were added in a documented update; to add them manually to an existing copied-in component, edit `button.svelte`'s `buttonVariants` call and add entries under `size`).

### Full component source (from a real consuming repo, mermaid-js/mermaid-live-editor, `src/lib/components/ui/button/button.svelte`)

- URL: https://github.com/mermaid-js/mermaid-live-editor/blob/629d9639/src/lib/components/ui/button/button.svelte
- Fetched: 2026-08-14
- Source type: community (real-world copied-in component, third-party repo)
- Component: anatomy

```svelte
<script lang="ts">
  import { cn, type WithElementRef } from '$lib/utils.js';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import { tv, type VariantProps } from 'tailwind-variants';

  export const buttonVariants = tv({
    base: 'focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0',
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline: 'border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
        accent: 'bg-accent text-accent-foreground hover:bg-accent/80 shadow-sm',
        ghost: 'hover:bg-primary hover:text-primary-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'size-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
  export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      variant?: ButtonVariant;
      size?: ButtonSize;
    };

  let {
    class: className,
    variant = 'default',
    size = 'default',
    ref = $bindable(null),
    href,
    type = 'button',
    children,
    ...restProps
  }: ButtonProps = $props();
</script>

{#if href}
  <a bind:this={ref} class={cn(buttonVariants({ variant, size }), className)} {href} {...restProps}>
    {@render children?.()}
  </a>
{:else}
  <button bind:this={ref} class={cn(buttonVariants({ variant, size }), className)} {type} {...restProps}>
    {@render children?.()}
  </button>
{/if}
```

### Current upstream shape (post Tailwind-v4-migration, with data-slot and aria-disabled) - from GitHub discussion #2292

- URL: https://github.com/huntabyte/shadcn-svelte/discussions/2292
- Fetched: 2026-08-14
- Source type: official docs (maintainer discussion, current-generation source)
- Component: anatomy

```ts
// ui/button/a.ts
import type { WithElementRef } from '$lib/utils';
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
import { tv, type VariantProps } from 'tailwind-variants';

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
	WithElementRef<HTMLAnchorAttributes> & {
		variant?: ButtonVariant;
		size?: ButtonSize;
	};

export const buttonVariants = tv({
	base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
			destructive: 'bg-destructive shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white',
			outline: 'bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border',
			secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
			ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
			link: 'text-primary underline-offset-4 hover:underline'
		},
		size: {
			default: 'h-9 px-4 py-2 has-[>svg]:px-3',
			sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
			lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
			icon: 'size-9'
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default'
	}
});
```

```svelte
<!-- ui/button/button.svelte -->
<script lang="ts" module>
	import { cn } from '$lib/utils.js';
	import { type ButtonProps, buttonVariants } from './a';
</script>

<script lang="ts">
	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? 'link' : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
```

```ts
// ui/button/index.ts
import type { ButtonProps, ButtonSize, ButtonVariant } from './a';
import { buttonVariants } from './a';
import Root from './button.svelte';

export {
	Root as Button,
	buttonVariants,
	Root,
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant,
	type ButtonProps as Props
};
```

Rationale given in the discussion for splitting variant/type definitions into a separate `a.ts` (or similarly named) file rather than a `<script module>` block inside the `.svelte` file: TypeScript's `tsc --noEmit` cannot resolve types exported from a `<script module>` block inside a `*.svelte` file when re-exported through `index.ts` (`error TS2614: Module '"*.svelte"' has no exported member 'ButtonProps'`), so moving variant/type definitions to a plain `.ts` file avoids `tsc` errors for consumers who run `tsc --noEmit` as part of CI, without affecting the Svelte LSP or dev server, which resolve fine either way.

Note the `data-slot="button"` attribute on both the `<a>` and `<button>` render branches: this is the Tailwind-v4-era convention (see raw/06-tailwind-v4-migration.md, "Every primitive that renders an element now has a `data-slot` attribute for styling") used for targeting/overriding a specific sub-element in CSS without relying on class-name matching.
