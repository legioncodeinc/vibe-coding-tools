# Component anatomy

Full worked example in [references/component-anatomy-example.md](../references/component-anatomy-example.md). This guide is the pattern language you use to read or edit any copied-in component, generically, for any Svelte project.

## The four building blocks

Every copied-in component composes the same handful of primitives:

1. **`tv()` from tailwind-variants**: defines a `base` class string plus a `variants` map (e.g. `variant`, `size`) and `defaultVariants`. This is how a component exposes styling options without you writing conditional class logic by hand [research/raw/14-copy-in-philosophy-and-component-anatomy.md].
2. **`cn()` (clsx + tailwind-merge)**: merges the variant-computed classes with any `class` prop the consumer passed in, resolving Tailwind conflicts so the last class wins rather than both applying [research/distilled-shadcn-svelte.md section 13].
3. **`$props()` destructuring**: Svelte 5 runes idiom. Props are destructured with defaults inline (`variant = "default"`), a bindable ref (`ref = $bindable(null)`), and a rest spread (`...restProps`) for anything not explicitly named, so arbitrary HTML attributes pass through untouched [research/raw/14-copy-in-philosophy-and-component-anatomy.md].
4. **`{@render children?.()}`**: Svelte 5 snippet rendering, replacing the Svelte 4 `<slot />` model entirely [research/raw/14-copy-in-philosophy-and-component-anatomy.md].

## Why variant/type definitions live in a separate `.ts` file

`tsc --noEmit` cannot resolve types exported from a `<script module>` block inside a `*.svelte` file when that type is re-exported through a plain `index.ts` barrel; it fails with `TS2614: Module '"*.svelte"' has no exported member`. This only bites projects running `tsc` in CI (the Svelte LSP and dev server resolve it fine either way), but it's real enough that current-generation components split variants/types into their own `.ts` file [research/raw/14-copy-in-philosophy-and-component-anatomy.md]. If you're reviewing a hand-rolled component and see types exported from a `<script module>` block that's later re-exported, flag it: it will pass locally and fail in CI type-check.

## The `data-slot` convention

As of the Tailwind v4 generation of components, every primitive that renders a DOM element carries `data-slot="<name>"` (e.g. `data-slot="button"`) [research/raw/06-tailwind-v4-migration.md]. Use this for CSS or JS targeting of a specific sub-element instead of matching on class names, which are expected to change across variants.

## Reading an unfamiliar component

1. Find the variant/type file (or `<script module>` block): this tells you every prop and every style variant available, without reading the render logic.
2. Find the `$props()` destructuring in the component's instance `<script>`: this tells you defaults and what falls through via `...restProps`.
3. Find the render branches: conditional rendering (like Button's `{#if href}` split between `<a>` and `<button>`) usually signals the component adapts its rendered element based on props, not just its classes.
4. Check for `data-slot` and `aria-*` attributes wired to props (e.g. `aria-disabled={disabled}`): these are usually load-bearing for accessibility, not decoration. See [guides/07-accessibility-and-gaps-vs-react.md](07-accessibility-and-gaps-vs-react.md).

## Editing a component directly

Because the code is yours, you edit it in place: add a variant to the `tv()` call, add a prop to the destructuring, add a class to `base`. There is no wrapper-component workaround needed, and none of the "override styles from outside" fighting that a black-box npm package forces on you [research/raw/14-copy-in-philosophy-and-component-anatomy.md]. The cost of this freedom is that `add <component> --overwrite` will blow your edit away; see [guides/06-customizing-without-breaking-upgrades.md](06-customizing-without-breaking-upgrades.md) before you edit anything you plan to keep long-term.
