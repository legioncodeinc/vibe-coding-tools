# Component anatomy example (worked)

A worked example of a copied-in component's structure, grounded in [distilled-shadcn-svelte.md](research/distilled-shadcn-svelte.md) section 13, citing [raw/14-copy-in-philosophy-and-component-anatomy.md](research/raw/14-copy-in-philosophy-and-component-anatomy.md). All code below is Svelte 5 runes idiom: `$props()`, `$bindable()`, `{@render ...}` snippets, `onclick` handlers, never Svelte 4 store syntax and never `on:` directives.

## Folder shape

The CLI installs each component into its own folder under your `ui` alias (default `$lib/components/ui/<component>/`), split across a few files, with an `index.ts` barrel export [raw/02-installation-sveltekit-and-components-json.md via distillation section 5]:

```
src/lib/components/ui/button/
  button.svelte
  index.ts
  (variants/types, commonly kept in a separate .ts file)
```

Why variants and types live in their own `.ts` file rather than a `<script module>` block inside the `.svelte` file: `tsc --noEmit` cannot resolve types re-exported from a `<script module>` block inside a `*.svelte` file when barrel-exported through `index.ts` (fails with `TS2614: Module '"*.svelte"' has no exported member`). Moving them out avoids CI type-check failures without affecting the Svelte LSP or dev server [raw/14-copy-in-philosophy-and-component-anatomy.md].

## Variant/type file

```ts
// src/lib/components/ui/button/variants.ts
import type { WithElementRef } from "$lib/utils.js";
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import { tv, type VariantProps } from "tailwind-variants";

export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
	WithElementRef<HTMLAnchorAttributes> & {
		variant?: ButtonVariant;
		size?: ButtonSize;
	};

export const buttonVariants = tv({
	base: "focus-visible:border-ring focus-visible:ring-ring/50 inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
			destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90",
			outline: "bg-background border shadow-xs hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2 has-[>svg]:px-3",
			sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
			lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
			icon: "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
```

## Component file (Svelte 5 runes)

```svelte
<!-- src/lib/components/ui/button/button.svelte -->
<script lang="ts" module>
	import { cn } from "$lib/utils.js";
	import { type ButtonProps, buttonVariants } from "./variants.js";
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
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
		role={disabled ? "link" : undefined}
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

Notable Svelte 5 idioms here: `$props()` destructuring (never `export let`), `ref = $bindable(null)` for a bindable DOM ref, `{@render children?.()}` for slot content (never `<slot />`), plain `onclick`-style event props flow through `...restProps` (never `on:click`), and `data-slot="button"` for CSS/JS targeting without relying on class names [raw/06-tailwind-v4-migration.md], [raw/14-copy-in-philosophy-and-component-anatomy.md].

## Barrel export

```ts
// src/lib/components/ui/button/index.ts
import type { ButtonProps, ButtonSize, ButtonVariant } from "./variants.js";
import { buttonVariants } from "./variants.js";
import Root from "./button.svelte";

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

## Consuming it

```svelte
<script lang="ts">
  import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
</script>

<div class="flex flex-wrap items-center gap-2">
  <Button variant="outline">Button</Button>
  <Button variant="outline" size="icon" aria-label="Submit">
    <ArrowUpIcon />
  </Button>
</div>

<!-- link that looks like a button -->
<a href="/dashboard" class={buttonVariants({ variant: "outline" })}>
  Dashboard
</a>
```

[raw/14-copy-in-philosophy-and-component-anatomy.md]

## The `cn()` helper

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
```

`cn()` merges conditional class strings (clsx) and resolves Tailwind class conflicts so the last-applied utility wins (tailwind-merge) [raw/06-tailwind-v4-migration.md].

## Why this matters for the copy-in model

Every file above lands in your repo, not `node_modules`. You can edit `buttonVariants` to add a size, change a hover state, or add a new variant, directly, with no wrapper component and no CSS override fight. The cost: re-running `add button --overwrite` replaces this file wholesale, so any local edit must be re-applied by diff afterward. See [guides/06-customizing-without-breaking-upgrades.md](../guides/06-customizing-without-breaking-upgrades.md).
