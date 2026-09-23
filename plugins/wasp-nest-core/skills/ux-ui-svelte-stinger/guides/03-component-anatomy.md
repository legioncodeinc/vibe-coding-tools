# 03: Component anatomy: the copy-in source shape

> Every shadcn-svelte component follows the same structural pattern. Learn it
> once (via Button), recognize it everywhere. This guide is the model-training
> reference for what copy-in source looks like and how to read/edit it.

**Research:** `../research/shadcn-svelte-button-component.md` (the canonical
worked example), `../research/shadcn-svelte-tailwind-v4-migration.md` (the
v4 conventions).

## The four universal patterns

Every component under `$lib/components/ui/<name>/` exhibits these four patterns.
If a copy-in component does not match, either it is a newer pattern (check the
registry) or someone edited it incorrectly.

### Pattern 1: `tailwind-variants` (`tv`) is the variant engine

From `../research/shadcn-svelte-button-component.md`: shadcn-svelte uses
`tailwind-variants` where React shadcn uses `class-variance-authority` (CVA).
The variant factory lives in a `<script module>` block:

```svelte
<script lang="ts" module>
  import { type VariantProps, tv } from "tailwind-variants";

  export const buttonVariants = tv({
    base: "inline-flex items-center justify-center rounded-md ...",
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground ...",
        destructive: "bg-destructive ...",
        outline: "border border-input ...",
        // ...
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        // ...
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
  export type ButtonSize = VariantProps<typeof buttonVariants>["size"];
</script>
```

**Key facts:**

- The factory is exported (`export const buttonVariants`) so callers can use
  it for `class={buttonVariants({ variant: "link" })}` on a raw `<a>`.
- Every color is a TOKEN (`bg-primary`, `text-primary-foreground`,
  `border-input`), never a literal. This is why the token bridge re-skins
  everything.
- `VariantProps<typeof factory>` derives the union type from the factory, so
  adding a variant is a one-line edit (the type updates automatically).

### Pattern 2: Svelte 5 runes: `let { ... } = $props()`

Props are destructured from `$props()` with inline defaults, NOT declared via
`export let` (the Svelte 4 way):

```svelte
<script lang="ts">
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
```

**Key facts:**

- `class: className`: rename on destructure because `class` is reserved; the
  merged result is passed back as `class={cn(...)}`.
- Defaults via `=` in the destructure. Equivalent to React's `defaultProps`.
- `...restProps` collects everything else, spread onto the rendered element.
- For two-way binding (Input, Checkbox, Switch), use `$bindable`:
  `let { value = $bindable() }: Props = $props();`. Then the caller can
  `bind:value`.

### Pattern 3: the `child` snippet (Svelte's `asChild`)

Where React shadcn uses Radix `asChild` + `Slot`, Svelte shadcn uses a **child
snippet**. This is the Bits UI child-snippet pattern surfacing through
shadcn-svelte:

```svelte
<button class={cn(buttonVariants({ variant, size }), className)} {type} {disabled} {...restProps}>
  {@render child?.()}
</button>
```

- The component takes a `child` prop (a Svelte snippet).
- `{@render child?.()}` renders it inside the element, OR the caller can use
  the snippet to take over rendering entirely (the headless pattern).
- This is how you compose: pass a snippet that renders your own element while
  keeping the component's behavior (focus, ARIA, keyboard nav).

**When to use `child`:** when you need the component's BEHAVIOR (a Dialog's
focus trap, a Select's keyboard nav) but your own MARKUP. When you just want
the styled default, omit `child` and put children between the tags. Wait:
Svelte 5 components don't take children between tags by default; use the
snippet, or check whether the specific component supports a default `{@render
children?.()}`.

### Pattern 4: `cn()` merges variant classes with caller overrides

```svelte
class={cn(buttonVariants({ variant, size }), className)}
```

- `buttonVariants({ variant, size })` produces the base + variant classes.
- `className` is whatever the caller passed via `class=`.
- `cn()` (clsx + tailwind-merge) merges them, with **tailwind-merge resolving
  conflicts in favor of the caller**. So `<Button class="px-8" />` overrides
  the variant's `px-4`.

This is the escape hatch, and it is the disciplined one. A caller can tweak
spacing or add a class, but the variant system and tokens stay intact.

## The file layout per component

```
$lib/components/ui/<name>/
├── index.ts           # barrel: re-exports Root as <Name>, plus types
├── <name>.svelte      # the component itself
└── (sometimes) sub-components
```

For composite components (Dialog, Select, Card), the folder holds multiple
`.svelte` files plus an `index.ts` barrel:

```
$lib/components/ui/dialog/
├── index.ts
├── dialog.svelte          (the Root)
├── dialog-content.svelte
├── dialog-header.svelte
├── dialog-title.svelte
├── dialog-description.svelte
└── dialog-trigger.svelte
```

The barrel re-exports them as `Dialog.Content`, `Dialog.Title`, etc.

## How to read a copy-in component you have not seen

When you copy in a new component and need to understand it:

1. **Open `index.ts`**: see the public API (what is exported, what types exist).
2. **Open the root `<name>.svelte`**: find the `tv({ ... })` factory. That is
   the variant surface. Every prop in `variants: { ... }` is a caller-facing
   knob.
3. **Check `$props()`**: see what props are accepted, what defaults exist,
   what is `$bindable`.
4. **Check for `child`**: if present, the component supports the headless
   composition pattern.
5. **Grep for tokens**: every `bg-*`, `text-*`, `border-*` should resolve to
   a token via the bridge. A literal is a bug.

## How to edit a copy-in component for OSPRY

Because components are owned source, OSPRY-specific behavior is an in-place
edit. Two cases:

1. **Add a variant.** Edit the `tv({ variants: { ... } })` factory. The type
   updates automatically via `VariantProps`. Example: add a `"brand"` variant
   that uses `--brand-primary` (green) for a verified-state button:
   ```ts
   variant: {
     // ... existing ...
     brand: "bg-brand-primary text-brand-primary-on hover:bg-brand-primary-hover",
   },
   ```
   Note: `bg-brand-primary` works only if the token bridge (or the
   `@theme inline`) maps `--brand-primary` into a `--color-brand-primary`. Add
   it to the bridge if missing.

2. **Change default behavior.** Edit the `$props()` defaults or the rendered
   markup directly. Keep the `cn(buttonVariants(...), className)` merge intact
   so callers can still override.

**Document OSPRY-specific edits** in a comment at the top of the file:
`// OSPRY: added 'brand' variant for verified-state CTAs (PRD-071 green-scarce).`
This keeps the upstream-sync step (`06-surface-migration.md`) honest.

## The "do not" list for copy-in components

- **Do not hard-code a color.** `bg-blue-500` in a variant is a bug; use
  `bg-primary` (or add a token).
- **Do not remove the `child` snippet support** unless you are certain no caller
  uses it.
- **Do not change the public type signature** without grepping callers first.
- **Do not delete the `index.ts` barrel exports**: callers import from the
  barrel, not from the `.svelte` file directly.
