# Mantine — theme provider and custom token integration

**Sources:**
- https://mantine.dev/theming/theme-object/
- https://mantine.dev/theming/mantine-provider/
- https://github.com/orgs/mantinedev/discussions/6834
- https://github.com/orgs/mantinedev/discussions/4966
- https://v7.mantine.dev/overview/

**Retrieved:** 2026-04-24
**Queries used:** "Mantine 7 theme provider custom tokens integration 2026"

## Summary

Mantine 7.x (latest major as of forge date) ships a `MantineProvider` that injects CSS variables at the root. A `theme` object holds colors, fonts, spacing, radii, and component defaults. Arbitrary product tokens go under `theme.other` (only slot Mantine considers freely extensible). For the enforcement Angel, the single-source-of-truth rule is: the product's master token layer (`01-master-tokens.css`) stays canonical; `MantineProvider` is configured with `cssVariablesResolver` to *mirror* the product tokens into Mantine's expected CSS variable names, so Mantine components render with the product palette without a second token hierarchy.

## Key quotations

> "`MantineProvider` provides a theme object context value, manages color scheme changes, and injects CSS variables. It must be rendered at the root of your application and should be used only once."

> "You can add any amount of extra values to `theme.other`; other values of Mantine theme cannot be changed."

> "`cssVariablesResolver` [is] a function to generate CSS variables styles based on the theme object."

> "Most of Mantine components have associated CSS variables that can be customized in theme or inline with `vars` prop."

## Integration pattern for this Stinger

1. Author `theme = createTheme({ colors: {...}, primaryColor: 'brand', other: { ...productTokens } })`.
2. Use a `cssVariablesResolver` to emit `--mantine-color-*` aliases pointing at the product's `--color-*` variables.
3. Use Mantine for **high-value kit pieces that would be expensive to rebuild**: date pickers, notifications, complex tables, rich forms, `useHotkeys`, `useDisclosure`, `useDebouncedValue`, etc.
4. Do **not** use Mantine for Buttons / Cards / Badges / Navs — those are the product's primary surface and belong in the custom design system.
5. When a Mantine component is used in feature code, wrap it (e.g., `<ProductDatePicker>` around `<DatePicker>`) so the product's styling contract is enforceable.

## Relevance to this Stinger

- `guides/05-mantine-integration.md` — which Mantine parts to adopt vs. leave alone, and how the theme provider maps to product tokens.
- `templates/component-wrapper.tsx` — wrapper over a Mantine primitive follows the same CVA-like product-variants pattern.
