# 00: Principles

The load-bearing rules of design-system bootstrapping. Every guide and
example in this Stinger rests on these.

> Example applying every principle: `../examples/01-glass-on-beige-bootstrap.md`.

## Scope

This skill builds a complete design system from scratch. It produces the
seven-artifact folder described in the Command Brief. It does **not**:

- Modify shipped product code.
- Maintain or enforce the design system after bootstrap (that is
  `ux-ui-svelte-worker-bee`'s job, see `08-companion-agent-handoff.md`).
- Invent an aesthetic. The aesthetic always comes from the user interview
  or explicit references (see `01-interview-procedure.md`).

## The non-negotiable layering

```
token layer (01-master-tokens.css)
   ↓ consumed by
utility layer (02-<aesthetic>.css)
   ↓ consumed by
component briefs (03-components/*.md)
   ↓ assembled into
screen briefs (04-screens/*.md)
   ↓ made visible by
HTML examples (05-html-examples/*.html)
```

Tokens first, utilities second, components third, screens fourth. A
component brief that references a hex value instead of a token is a bug.
A screen brief that invents a new component is a bug. An HTML example
that uses colors or radii absent from `01-master-tokens.css` is a bug.

## Universal taste rules (from Refactoring UI)

These sit underneath every product-specific non-negotiable. See
`../research/2026-04-24-refactoring-ui-principles.md` for the full list.

1. **Visual hierarchy is everything.** Combine size, weight, and color:
   never one of those alone.
2. **De-emphasize to emphasize.** Reduce secondary elements, don't amplify
   primary ones.
3. **Don't use grey text on colored backgrounds.** Tinted-of-the-same-hue
   only.
4. **Establish a type scale and a spacing ladder.** Nine type sizes, nine
   spacing steps, no arbitrary values.
5. **You need more colors than you think.** 5 to 10 shades per palette color.
6. **Accessible is the floor, not the ceiling.** 4.5:1 body contrast.
7. **Use color sparingly.** Color is for emphasis; overuse flattens
   hierarchy.

## Universal CSS rules

1. **`oklch()` for new palettes.** Brand colors can be hex for tenant
   round-trip; derivations should use `oklch()` or `color-mix()` so the
   palette stays extensible. See `../research/2026-04-24-oklch-color-space.md`.
2. **`color-mix(in srgb, ...)` for shadow tints.** Never hardcode shadow
   rgba. Every shadow tints toward the brand primary.
3. **`@theme` for Tailwind v4 bridge.** If the product uses Tailwind v4,
   tokens live inside `@theme` so utilities auto-generate. See
   `../research/2026-04-24-tailwind-v4-theme.md`.
4. **`@layer utilities` for the utility layer.** Lets component styles win
   cleanly over utility defaults.
5. **`@supports` fallback for `backdrop-filter`.** Always. See
   `../research/2026-04-24-glassmorphism-production.md`.
6. **`@media (prefers-reduced-motion: reduce)`** at the bottom of every
   utility CSS file. See `../research/2026-04-24-accessibility-media-queries.md`.

## The aesthetic is not invented, it is extracted

- Never guess an aesthetic. Extract it from the interview
  (`01-interview-procedure.md`).
- Never accept "make it tasteful" as direction. Push back: ask for three
  products whose aesthetic the user admires, then synthesize.
- Once extracted, pick the closest starter kit (`../starter-kits/`) and
  customize; do not start from a blank file.

## Motion is systemic

- Named buckets: `--dur-instant`, `--dur-fast`, `--dur-default`,
  `--dur-slow`.
- Named curves: `--ease-out-subtle`, `--ease-in-out-ui`, `--ease-spring-soft`.
- Custom curves are a code smell. If a component needs one, add a token
  first.
- Under `prefers-reduced-motion: reduce`, all motion drops to 80ms and
  transforms are removed.

## Tenant theming, dark mode, RTL are designed in

- If the product supports tenant theming, every themable color is a CSS
  variable with a tenant fallback: `var(--tenant-primary, #...)`.
- If dark mode is in scope, the token layer duplicates surface/text tokens
  under `@media (prefers-color-scheme: dark)` or a `[data-theme="dark"]`
  selector. Component CSS never branches on dark mode.
- If RTL is in scope, component specs use logical properties
  (`padding-inline-start`, `margin-inline-end`) never physical ones.

## Every rule is justified

Each non-negotiable in the master brief names *why* it exists. "Three
progress-bar heights" is not a rule until `00-design-brief.md` explains
why (choice architecture, consistency cost). This is the test: the rule
should survive being asked "why" three times.

## Commit message convention

`<bee-name>: <section>: <change>`

Example: `design-system-worker-bee: cards-and-surfaces: add depth-1 hover lift`.

This convention is inherited by `ux-ui-svelte-worker-bee` after handoff.
