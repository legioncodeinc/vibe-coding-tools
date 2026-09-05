# shadcn/ui + Radix UI: Component Contract Patterns

**Sources:**
- https://ui.shadcn.com/
- https://www.radix-ui.com/primitives
- https://thecodeforge.io/javascript/build-design-system-shadcn-tailwind-radix/ (2026-04-12)
- https://www.pkgpulse.com/blog/shadcn-ui-vs-radix-ui-component-library (2026-03-08)
- https://thecodeforge.io/javascript/advanced-shadcn-ui-patterns/ (2026-04-11)

**Retrieved:** 2026-04-24

## Summary

**Radix UI** ships unstyled, accessible primitives (Dialog, Popover, Select,
etc.) with focus management, keyboard handling, and ARIA baked in.
**shadcn/ui** is not an npm library: it is a CLI that copies Radix-wrapped,
Tailwind-styled component source files INTO the consumer's repo.

Key architectural facts:

- Tokens live in CSS custom properties (`--primary`, `--background`,
  `--foreground`). shadcn/ui uses `@theme` in Tailwind v4.
- Components use `class-variance-authority` (cva) for variant APIs.
- `cn()` utility (from `lib/utils.ts`) merges Tailwind classes safely.
- Every shadcn/ui component is editable in place: there is no upstream to
  fight.

## Canonical component contract shape

```tsx
// button.tsx (shadcn pattern)
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground ...",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);
```

The contract is **variant + size + state + tokens**. No hardcoded colors;
every color reaches for a CSS custom property.

## Relevance to this stinger

- `guides/05-authoring-components.md` adopts the shadcn/ui contract shape as
  the default for component briefs: **variants → sizes → states → example**.
- The "Replaces (in current code)" section in each component brief is the
  Stinger's extension: shadcn/ui doesn't have it because it's the greenfield
  source; our Bee operates on existing products and must make migration
  explicit.
- When a product already uses shadcn/ui, the Bee's component briefs should
  feel like native extensions: same variant API, same cva shape, same CSS
  custom property references.
- `starter-kits/flat-modern/` approximates the shadcn/ui default look
  (Inter, cool greys, tight radii, subtle shadow).
