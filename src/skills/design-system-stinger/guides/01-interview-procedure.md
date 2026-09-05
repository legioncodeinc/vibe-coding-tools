# 01: Interview Procedure

The interview is the most load-bearing step in the bootstrap. A good
interview makes the rest mechanical; a rushed interview produces a
design system that looks beige-and-rounded by default and pleases no one.

> Worked example of this procedure: `../examples/01-glass-on-beige-bootstrap.md`
> §1 (Interview).

## Principle

**You are not designing. You are extracting.** The user already has an
aesthetic in their head. Your job is to get it out of their head in
enough detail to write `00-design-brief.md`.

Refuse to proceed past the interview until every section below has an
answer. "Make it tasteful" or "you decide" is not an answer: push back.

## The 12-question bank

Work through these in order. Follow up on each answer until it is
concrete enough to render in CSS.

### 1. Product identity

> "What is this product, who uses it, and what is its one-sentence
> positioning?"

Record verbatim. This becomes the opening line of `00-design-brief.md`.

### 2. Three aesthetic anchors

> "Name three products whose aesthetic you admire. For each, tell me
> what specifically you like about it."

This is the most important question. Ask it even if the user offered a
reference upfront. Three anchors triangulate a point; one anchor is a
moodboard.

**Red flag:** user names three products with wildly different aesthetics
(e.g., Linear + Glossier + Dribbble shots). Stop and ask which ONE is
closest to what they want, then pick two more in the same direction.

### 3. Aesthetic vetoes

> "Name three products whose aesthetic you do NOT want this to feel
> like. Why not?"

Vetoes are as instructive as anchors. "Not Material" rules out
tonal-elevation depth; "not dashboard-SaaS" rules out table-heavy layouts.

### 4. Palette

> "What colors does the brand own? Hex values, or a logo I can sample
> from. What about a secondary accent?"

If there's no brand palette, the starter kit's default palette survives.
If there is, map brand colors to `--color-primary` and `--color-accent`
in the chosen starter kit.

### 5. Surface metaphor

> "When you picture a card or a panel in this product, what's it made
> of? Paper? Glass? A flat block of color? Something else?"

Surface metaphor drives the utility layer:
- **Paper** → `editorial-serif` starter (flat white, soft shadow).
- **Glass** → `glass-on-beige` starter (three-cue shadow + backdrop blur).
- **Flat block** → `flat-modern` starter (no shadow, crisp borders).
- **Something unusual** → custom starter; stop and describe it in detail
  before proceeding.

### 6. Depth language

> "When you imagine a modal or a dropdown, how does it look different
> from a card? Same surface, more shadow? A different tint? A dark
> backdrop?"

This distinguishes the product's depth tiers. Expect 2 to 4 tiers.

### 7. Typography

> "Is there a brand font? If not, do you want a serif, sans, or mono
> display face? What about body copy?"

Default: Inter (sans) + Playfair Display (serif headline, optional).
`editorial-serif` starter flips the default.

### 8. Motion vocabulary

> "When a button is pressed or a menu opens, how does that feel? Snappy
> and instant, or soft and bouncy, or slow and ambient?"

Maps to the motion buckets. Most answers land on two of: instant
(120ms), fast (180ms), default (240ms), slow (320ms). Record which two
the product favors.

### 9. Radius scale

> "Do the corners feel sharp (2-4px), friendly (8-12px), soft (14-20px),
> or fully rounded (pill)? Are buttons and cards the same radius or
> different?"

Record 4 to 6 radius tokens.

### 10. Iconography

> "Outlined icons, filled icons, or duotone? What line weight: thin
> (1px), regular (1.5px), or bold (2px)?"

Pin this down. Icon inconsistency is the #1 way a system looks
unfinished.

### 11. Rendering environments

> "Web only? PWA on iOS? Native apps? Tenant theming (the product is
> multi-tenant and each tenant picks its brand colors)? Dark mode in
> v1 or later? RTL languages?"

Each yes expands the token layer.

### 12. Non-negotiables

> "Is there anything about the UI you consider non-negotiable? A color
> that must never appear? A pattern that has to survive every redesign?"

Record these verbatim. They become §1 of `00-design-brief.md`.

## Red flags during the interview

- **"Let me think about that later."** Don't let them. Every undecided
  aesthetic question becomes a silent bug in the design system.
- **"Can you just pick?"** Always push back. The Bee never invents.
- **"Make it feel like [famous brand] but different."** Different how?
  Push until you have the specific departures.
- **Wildly mismatched anchors.** See Question 2.
- **"It should be minimal."** Minimal is not an aesthetic. What kind
  of minimal: editorial, technical, brutalist, soft?
- **"Accessibility is optional."** Not negotiable. Move on.

## Deliverable of the interview

Before writing any file, produce a one-page summary the user confirms:

```
Product:        <one-sentence positioning>
Anchors:        <A, B, C + what the user loves about each>
Vetoes:         <X, Y, Z + why>
Palette:        <primary, accent, any others>
Surface:        <paper | glass | flat block | custom>
Depth tiers:    <number + description per tier>
Typography:     <display face, body face>
Motion:         <bucket A + bucket B>
Radius:         <badge, input, button, card, card-lg, tile, pill>
Icons:          <outlined|filled|duotone, <weight>>
Rendering:      <web | PWA | native; tenant theming Y/N; dark mode Y/N; RTL Y/N>
Non-negotiables:<bullet list, verbatim from user>
→ Starter kit:  <name of closest kit from ../starter-kits/>
```

Get an explicit "yes, proceed" before moving to Step 2 (scaffold) of the
procedure in `SKILL.md`.
