# 06: Authoring Screen Briefs

Screen briefs (`04-screens/<screen>.md`) apply the component library to
full pages. Target: 5 to 10 briefs for a real product. 60 to 200 lines each.

> Template: `../templates/screen-spec.md`.

## What a screen brief is (and isn't)

- **Is:** the recipe for assembling components into a screen. Layout
  skeleton, component choice, responsive behavior, edge cases.
- **Isn't:** a component brief. New visuals belong in `03-components/`.
  A screen brief that introduces a new surface or button variant is a
  bug: the component brief should be updated first.

## The canonical doc shape

```markdown
# Screen Brief — <Screen Name>

> Section of the UX/UI masterplan. Anchors to [`../00-design-brief.md` §<N>](...).
> Feeds PRD **<code>** (if applicable).

## Layout skeleton

<ASCII art of the layout, mobile and desktop.>

## Components used

<Bullet list, each linking to its component brief.>

## Responsive behavior

<Breakpoint rules. Where mobile and desktop diverge.>

## States

<Empty state, loading, error, offline, populated.>

## Edge cases

<Long names, many items, zero items, very wide screens.>

## Accessibility

<Landmark regions, focus order, skip links if relevant.>

## Replaces (in current code)

<Path to existing screen file(s) this supersedes.>
```

## Layout skeleton (ASCII art)

Use the ASCII art convention. It forces the writer to think about
proportion and order.

```
┌─────────────────────────────────────┐ ← top nav (glass, pinned)
│ HERO CARD (depth-3 + brand hairline)│
│ Level 3: Power Partners · $0/$250k  │
│ [+ Add Sale]    progress-bar hero   │
├─────────────────────────────────────┤
│ Engagement blocks 3-col grid        │
│ [1 Sent] [0 Recv] [L3 Level]        │
├─────────────────────────────────────┤
│ Mission card                        │
├─────────────────────────────────────┤
│ Send DM | Send Referral (alt pair)  │
└─────────────────────────────────────┘ ← bottom nav (glass, pinned)
```

Include mobile and desktop separately when they diverge.

## Components used

Explicit bullet list, each linking to the matching component brief:

- `cards-and-surfaces.md`: hero card, engagement blocks, mission card.
- `buttons-and-ctas.md`: "Add Sale" primary, DM/Referral pair.
- `progress-bars.md`: hero-size bar.
- `nav-top-bottom-left.md`: glass top and bottom nav.

If a screen uses a visual NOT in `03-components/`, stop: add the
component brief first.

## Responsive behavior

Two patterns:

### Identical across breakpoints

"Desktop: identical to mobile, just with the left sidebar instead of the
hamburger and without the bottom nav." (A common pattern for
glass-on-beige products.)

### Diverging

When the layout genuinely changes, ASCII-art both. Mobile first.

## States

At minimum:
- **Empty / zero-state**: what shows when there's no data.
- **Loading**: skeleton, spinner, or placeholder cards.
- **Error**: fallback surface.
- **Populated**: the happy path (already covered in the skeleton).

Optional: offline, permission-denied, rate-limited, over-quota.

## Edge cases

The screen brief earns its keep here. Examples:
- A name that's 80 characters long: how does it wrap?
- 1000 list items: is virtualization required?
- A zero-state: is the CTA prominent?
- A screen at 3200px wide: does the layout cap?
- A tenant with extreme brand colors (neon pink primary): does
  contrast still hold?

## Accessibility

- Landmark regions: which `<nav>`, `<main>`, `<aside>` elements.
- Focus order: what the first Tab hits, the last Tab hits, how
  modals trap.
- Skip links: when one is needed (long nav, repeated sections).

## Replaces (in current code)

Same discipline as component briefs. Name the file(s) this supersedes:

```markdown
## Replaces (in current code)

- `app/src/app/(dashboard)/page.tsx` — the hero-card absent on `lg+`
  breakpoint is wrong; this spec mandates it present at all widths.
- `app/src/components/dashboard/MissionCard.tsx` — the navy-to-navy
  gradient drops; the kicker uses `--color-accent-ink`, not `--color-accent`.
```

## Density discipline

Screen briefs should rarely introduce new patterns. Most of the writing
is:
- Ordering components.
- Specifying responsive divergence.
- Naming the edge cases.

If you find yourself describing new visual treatments, it means the
component library is incomplete. Go back to `guides/05-authoring-components.md`
and add the missing brief first.
