# shadcn/ui — wrapping components for a custom design system

**Sources:**
- https://ui.shadcn.com/
- https://ui.shadcn.com/docs
- https://vercel.com/academy/shadcn-ui/extending-shadcn-ui-with-custom-components
- https://dev.to/whoffagents/shadcn-ui-in-2026-why-i-stopped-installing-component-libraries-and-started-owning-my-components-2eel
- https://shadcnspace.com/blog/shadcn-ui-handbook

**Retrieved:** 2026-04-24
**Queries used:** "shadcn/ui wrapping components for design system 2026 variant mapping"

## Summary

shadcn/ui is not an npm component library — the CLI copies source files into your repo (`components/ui/`). You own the code, so "wrapping" in the traditional sense is unusual: you can edit the primitive directly. For a *design system*, though, discipline still matters: keep CLI-generated files in `components/ui/` pristine (so updates re-apply cleanly), and put product-variants / compound components in `components/shared/`. Variant mapping uses `class-variance-authority` (CVA) — `buttonVariants()` exports a CVA factory whose `variants`, `compoundVariants`, and `defaultVariants` are the canonical API shape for a shadcn-style component.

## Key quotations

> "Keep `components/ui/` exclusively for CLI-generated files. Put your custom wrappers and compound components in `components/shared/`. This separation makes code reviews and audits trivial, and keeps updates clean."

> "In a typical library, if you need to change a button's behavior, you have to override styles or wrap the component. With shadcn/ui, you simply edit the button code directly."

> "Many teams fall into the trap of creating generic layers like a 'BaseButton,' wrapping every component, or abstracting layout before patterns even exist. A better approach is to duplicate first, observe patterns, and abstract only when repetition is proven."

## Integration pattern for this Stinger

1. **`components/ui/*`** is shadcn's primitive (CLI-managed).
2. **`components/<product>/<Component>.tsx`** is the product wrapper. Exposes product variants (`primary` / `secondary` / `outline` / `ghost`) that map to Tailwind tokens (`--color-primary`, `--color-gold-ink`, etc.).
3. Feature code imports the product wrapper, never `components/ui/button` directly. A lint rule (or code review) enforces this.
4. When shadcn ships an updated primitive, re-run the CLI; the wrapper absorbs any breaking-change surface area.

## Relevance to this Stinger

- `guides/04-shadcn-ui-integration.md` — decision tree: "use shadcn primitive directly in `components/ui/`? wrap it for product variants? or build system-native?"
- `guides/08-wrapper-authoring.md` — the CVA factory shape with `variants` / `compoundVariants` / `defaultVariants`.
- `templates/component-wrapper.tsx` — Button wrapper demonstrating the pattern.
