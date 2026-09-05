# Lucide-react — icon wrapper conventions and stroke rules

**Sources:**
- https://lucide.dev/guide/packages/lucide-react
- https://lucide.dev/guide/react/basics/stroke-width
- https://lucide.dev/guide/react/basics/sizing
- https://lucide.dev/contribute/icon-design-guide

**Retrieved:** 2026-04-24
**Queries used:** "Lucide-react icon wrapper stroke width conventions best practices"

## Summary

Lucide is the maintained successor to Feather icons — stroke-based, consistent 24×24 viewBox, default `strokeWidth={2}`. Each icon is a tree-shakeable React component. Two sizing gotchas: (a) by default, stroke scales with the `size` prop (SVG default), so a 48px icon looks thicker; (b) pass `absoluteStrokeWidth` to keep stroke constant regardless of size. The product-level Icon wrapper is the enforcement seam: one place to pin `strokeWidth`, `absoluteStrokeWidth`, and stroke color per nav zone.

## Key quotations

> "All Lucide icons have a default stroke width of 2px."

> "When adjusting the size prop the size of the stroke width will be relative to the size of the icon, this is the default SVG behavior."

> "[`absoluteStrokeWidth`] is introduced to adjust this behavior to make the stroke width constant no matter the size of the icon."

## Integration pattern for this Stinger

- Expose an `<Icon name="Check" tone="left-nav" size="md" />` wrapper that maps `tone` → stroke color/weight rules and `size` → a pinned SVG size.
- Feature code imports `<Icon>` — never `import { Check } from 'lucide-react'` directly.
- Nav-zone stroke conventions are product-specific (e.g., a glass-on-beige product might use: left-nav muted, top-nav navy, bottom-nav light → accent on active, with a dedicated AI focus slot whose tone is identity-locked). These live in `guides/06-lucide-react-icons.md` and the deploying product's design brief at `library/knowledge-base/<product>-ux-ui/00-design-brief.md`.

## Relevance to this Stinger

- `guides/06-lucide-react-icons.md` — stroke rules by nav zone, size presets, `absoluteStrokeWidth` discipline.
- `templates/icon-wrapper.tsx` — the canonical wrapper.
