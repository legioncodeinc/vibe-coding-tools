# CVA (class-variance-authority) — typed variant architecture

**Sources:**
- https://cva.style/docs
- https://cva.style/docs/getting-started/variants
- https://www.thedanielmark.com/blog/enterprise-component-architecture-type-safe-design-systems-with-class-variance-authority

**Retrieved:** 2026-04-24
**Queries used:** "component library wrapping architecture patterns CVA class-variance-authority"

## Summary

CVA (`class-variance-authority`) is the de facto tool for declaring typed variants on a Tailwind-styled component. A `cva()` factory takes a base class and an options object with `variants`, `compoundVariants`, and `defaultVariants`. The return value is a function `(props) => className` that also provides a TypeScript `VariantProps<typeof factory>` for prop typing. shadcn/ui's primitives are built on CVA, and the Stinger's wrappers should adopt the same shape so IDE autocomplete, invariants, and type-safety compound across the system.

## Key quotations

> "CVA's first-class variant API consists of variants (used to define style variants with no limit to how many you can add), compoundVariants (declares styles that should apply when multiple other variant conditions are met), and defaultVariants (defines default styles when none are provided)."

> "CVA's value proposition at scale includes new developers understanding the component API instantly, IDE autocomplete eliminating guesswork, and making it impossible to ship invalid states."

## Integration pattern for this Stinger

- Every product component that has variants uses a `cva()` factory exported as `<component>Variants` (matches shadcn convention).
- `defaultVariants` picks the canonical default (e.g., Button `variant: 'primary'`, Badge `tone: 'info'`).
- `compoundVariants` encodes the product's "four button variants" rule, the "three progress-bar heights" rule, etc. — so ungramatical combinations cannot be expressed.
- `VariantProps` exports the typed props — feature code gets autocomplete.

## Relevance to this Stinger

- `guides/08-wrapper-authoring.md` — the CVA factory shape is the canonical wrapper skeleton.
- `templates/component-wrapper.tsx` — Button wrapper with a filled-in CVA factory.
