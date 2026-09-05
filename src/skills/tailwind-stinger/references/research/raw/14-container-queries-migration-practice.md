# Tailwind CSS v4 Container Queries: Modern Responsive Design
- URL: https://www.sitepoint.com/tailwind-css-v4-container-queries-modern-layouts/
- Fetched: 2026-08-14
- Source type: blog (community)
- Component: container-queries

Published 2026-02-19.

"Tailwind CSS v4 ships native container query utilities that let components query their parent container's dimensions instead of the browser window ... Browser support? Container queries hit Baseline 2023. Chrome 105+, Firefox 110+, Safari 16+. You can ship this today."

## How container queries work (platform primer, non-Tailwind-specific)

1. A parent element declares itself a containment context via `container-type` (the `@container` utility sets `container-type: inline-size`).
2. A child element uses an `@container` CSS rule to conditionally style based on the parent's dimensions.

`container-type: inline-size` is recommended over `size` for most cases: "`size` also requires block-axis containment, which can mess with height calculations and cause unexpected layout behavior, particularly with auto-height content." This is native CSS from the CSS Containment Module Level 3 spec, not a Tailwind invention.

## Migration steps from viewport media queries to container queries (this source's checklist)

1. Audit the codebase for components that appear in multiple layout contexts (sidebars, modals, grids).
2. Add the `@container` utility to each component's direct layout parent element.
3. Swap viewport prefixes for container prefixes: `md:` becomes `@md:`, `lg:` becomes `@lg:`.
4. Adjust breakpoint sizes, container breakpoints (`@md` = 448px) are smaller than viewport breakpoints (`md` = 768px), so a 1:1 swap is not correct.
5. Name containers with `@container/card` syntax when nesting requires targeting a specific ancestor.
6. Test each component at three parent widths (roughly 250px, 450px, full-width) using devtools container-query debugging.
7. Keep viewport media queries for page-level layout decisions like grid columns and navigation visibility.

## The rule of thumb this source recommends

"page layout = media queries; component layout = container queries. If you're controlling how the page's major sections arrange themselves, reach for `md:` and `lg:`. If you're controlling how a reusable component adapts to its available space, reach for `@md:` and `@lg:`." Tailwind v4 allows mixing viewport and container variants on the same page without conflict since they compile to different conditional at-rules (`@media` vs `@container`).

## Nesting gotcha

"One gotcha to watch for: nested containers. If you have a container inside a container, an `@md:` query on a deeply nested child will target the nearest ancestor container, not necessarily the one you expect. This is where named containers ... become essential." This is consistent with the official named-container documentation in [06-container-queries.md].

Gap: the specific pixel-based container breakpoint recommendations here (`@sm` at 384px, `@md` at 448px "hit the sweet spot for most card-style components") are this source's opinion/experience report, not an official Tailwind Labs recommendation. The official docs [06-container-queries.md] state the default scale but do not prescribe which breakpoint suits which UI pattern.
