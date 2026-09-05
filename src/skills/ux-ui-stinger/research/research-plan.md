# Research Plan — ux-ui-stinger

**Date:** 2026-04-24

## Queries to run

From the Command Brief:

1. "shadcn/ui wrapping components for design system 2026"
2. "Mantine theme provider custom tokens integration"
3. "Lucide-react icon wrapper stroke width conventions"
4. "Framer Motion prefers-reduced-motion best practices"
5. "Radix UI primitives customization patterns"
6. "Tailwind CSS v4 @theme design tokens integration"
7. "design system enforcement linting custom ESLint rules"
8. "component library wrapping architecture patterns"
9. "token drift detection design system"

Authoritative library sources (fetch directly via WebFetch):

- https://ui.shadcn.com/
- https://ui.shadcn.com/docs
- https://mantine.dev/
- https://ui.mantine.dev/
- https://lucide.dev/guide/packages/lucide-react
- https://www.framer.com/motion/
- https://www.radix-ui.com/primitives
- https://tailwindcss.com/ (v4 `@theme` patterns)
- https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion (spec)
- https://www.w3.org/WAI/ARIA/apg/ (WAI-ARIA APG)

## Open questions

Scoped from the brief's IDEAS/QUESTIONS section:

- Product-specific non-negotiables — resolved: live inside the deploying product's `library/knowledge-base/<product>-ux-ui/` folder, not in this generic Stinger.
- TanStack Query / React Hook Form — out of scope for this Stinger; handled by `react-worker-bee`.
- Token drift scanner — noted as future enhancement in `guides/10-common-violations.md`; not built in this pass.
- System-specific starter kit — encoded inline as "open the folder first" principle; product-specific detail accrues in the design system folder, not this Stinger.

## Deliverables

- One dated research note per mandatory library/spec (target: 6–10 notes).
- `research/library-versions.md` pinning the version reviewed.
- `research/gaps.md` for any tool/source unavailable at forge time.

## Stop criterion

Research stops when each rule in every guide can point to a file in `research/` or a section of the Command Brief.
