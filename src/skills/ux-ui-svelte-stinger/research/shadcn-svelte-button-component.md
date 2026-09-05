# shadcn-svelte: Button component (raw dump)

> **Source:** https://www.shadcn-svelte.com/docs/components/button
> **Fetched:** 2026-06-29
> **Method:** Firecrawl-scrape-equivalent web reader
> **Why kept:** Button is the canonical copy-in primitive and the first
> component ADR-007 Phase 1 migrates. This dump shows the exact source shape
> (the `tailwind-variants` factory, the Svelte 5 `$props()` runes pattern, the
> `cn()` merge) that every copy-in component follows.

---

# Button

Displays a button or a component that looks like a button.

## Install  **[OSPRY: the add command]**

```bash
npx shadcn-svelte@latest add button
```

## Usage

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<Button>Click me</Button>
```

## The copy-in source shape  **[OSPRY: every component follows this pattern]**

The `npx shadcn-svelte@latest add button` command writes three files into
`$lib/components/ui/button/`. The pattern is identical for every component, so
understanding Button teaches the shape for Card, Input, Dialog, etc.

### `$lib/components/ui/button/index.ts` (the barrel)

```ts
import Root, { type ButtonVariant, type ButtonSize, type ButtonProps } from "./button.svelte";

export {
  Root,
  type ButtonVariant,
  type ButtonSize,
  type ButtonProps,
  // convenience: export Root as Button
  Root as Button,
};
```

### `$lib/components/ui/button/button.svelte` (the component)

```svelte
<script lang="ts" module>
  import { type VariantProps, tv } from "tailwind-variants";

  // The variant factory: this is the Svelte equivalent of React's CVA.
  export const buttonVariants = tv({
    base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
  export type ButtonSize = VariantProps<typeof buttonVariants>["size"];
  export type ButtonProps = svelte.HTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils";
  import type { svelteHTML } from "svelte/elements";

  let {
    class: className,
    variant = "default",
    size = "default",
    href = undefined,
    type = "button",
    disabled,
    child,
    ...restProps
  }: ButtonProps = $props();
</script>

{#if href}
  <a
    class={cn(buttonVariants({ variant, size }), className)}
    {href}
    {...restProps}
    {...$$restProps}
  >
    {@render child?.()}
  </a>
{:else}
  <button
    class={cn(buttonVariants({ variant, size }), className)}
    {type}
    {disabled}
    {...restProps}
  >
    {@render child?.()}
  </button>
{/if}
```

## What to notice in the source (this pattern is universal)

1. **`tailwind-variants` (`tv`) is the variant engine.** This is the Svelte
   equivalent of React shadcn's `class-variance-authority` (CVA). Every copy-in
   component defines its variants here (`variant`, `size`), and the `base` string
   lists the default classes.

2. **Svelte 5 runes: `let { ... }: Props = $props()`.** Props are destructured
   from `$props()` (the runes way), not declared via `export let`. Defaults live
   inline (`variant = "default"`). `$bindable` is used for two-way-bound props
   (not shown on Button; appears on Input/Checkbox).

3. **`child` snippet, not `children` / `asChild`.** Svelte 5 snippets replace
   React's `children` prop. The `{#if child}` / `{@render child?.()}` pattern is
   the Svelte equivalent of React's `asChild`/Radix composition: it lets a
   caller render arbitrary content (or take over rendering entirely). This is
   the **Bits UI child-snippet pattern** surfacing through shadcn-svelte.

4. **`cn(buttonVariants({ variant, size }), className)`** merges the variant
   classes with any caller-supplied `class`, with tailwind-merge resolving
   conflicts (caller wins on conflicting utilities).

5. **Tokens, not literals.** Every color in the variant classes is a token:
   `bg-primary`, `text-primary-foreground`, `border-input`, `ring-ring`. No
   hex, no `bg-blue-500`. This is why re-pointing the tokens in `:root`
   re-skins the whole library.

## Variants (the API surface)

- `variant`: `default | destructive | outline | secondary | ghost | link`
- `size`: `default | sm | lg | icon`
- Renders as `<a>` if `href` is set, otherwise `<button>`.
- `type` defaults to `"button"` (NOT `"submit"`) to avoid accidental form
  submits: caller sets `type="submit"` explicitly.

## Why this component is the migration template  **[OSPRY: Phase 1 starter]**

The portal has dozens of bespoke button styles (ad-hoc `btn` / `button` classes
scattered across routes, each in its own `<style>` block per the
standardization pain). The Button component above replaces all of them: callers
specify `variant="secondary" size="sm"` and the tokens handle the rest. Migrating
the surface is mechanical: replace the bespoke class with `<Button variant=...>`,
delete the `<style>` block.

OSPRY-specific: the `variant="default"` resolves to `bg-primary`, which the
token bridge points at `--interactive` (OSPRY blue, not green). The
green-scarce rule is preserved automatically.
