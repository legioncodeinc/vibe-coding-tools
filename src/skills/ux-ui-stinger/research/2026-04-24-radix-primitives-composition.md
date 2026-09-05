# Radix UI — composition patterns and `asChild`

**Sources:**
- https://www.radix-ui.com/primitives/docs/guides/composition
- https://www.radix-ui.com/primitives/docs/overview/introduction
- https://www.radix-ui.com/primitives

**Retrieved:** 2026-04-24
**Queries used:** "Radix UI primitives customization patterns asChild composition 2026"

## Summary

Radix Primitives is the unstyled, accessible component library that shadcn/ui builds on. The key composition primitive is the `asChild` prop (backed by `@radix-ui/react-slot`), which lets a Radix part pass its event handlers, ARIA props, and ref onto a child component rather than rendering its own DOM element. This is the legitimate mechanism for attaching Radix behavior to a product's custom button / link / trigger components without losing accessibility.

## Key quotations

> "`asChild` allows you to compose Radix's functionality onto alternative element types or your own React components."

> "When Radix clones your component, it will pass its own props and event handlers to make it functional and accessible. If your component doesn't support those props, it will break."

> "Radix will sometimes need to attach a ref to your component (for example to measure its size). If your component doesn't accept a ref, then it will break."

## Integration pattern for this Stinger

- Product Buttons must `forwardRef` and spread `...props` onto their root element, so they work as Radix `Trigger asChild` children.
- When a shadcn/Radix primitive is adapted, the product wrapper renders Radix's part with `asChild`, passing the product's Button as the child. This keeps ARIA + keyboard behavior intact while honoring product styling.

## Relevance to this Stinger

- `guides/04-shadcn-ui-integration.md` — `asChild` composition section.
- `guides/08-wrapper-authoring.md` — "must accept ref + spread props" as a wrapper contract.
