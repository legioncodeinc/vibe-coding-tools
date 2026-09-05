# 05 — Craft Floor (quality floor, bans, reflexes)

**Source:** `skill/reference/craft-floor.md` (verbatim structure)

Loaded immediately before editing UI (not for planning-only work). "A pinned brief or the committed visual world overrides anything here; your own habit does not."

## Verify (checks on the built result, run together in batched rounds)

- **Contrast:** body/placeholder >= 4.5:1, large text >= 3:1; on colored surfaces tint secondary text from that hue or the foreground; never gray.
- **Depth:** shadows carry an offset and a soft blur; a zero-offset colored halo is decoration.
- **Spacing:** tight groups, generous separation, more space above a heading than below it; read computed values.
- **Type:** body measure 65-75ch, display max 6rem, tracking floor -0.04em, balanced headings, obvious scale/weight steps; run real copy at every breakpoint.
- **Motion:** one authored moment, not scattered effects; exponential ease-out from an already-visible default; reach past transform/opacity (blur, backdrop-filter, clip-path, mask, shadow).
- **States:** hover, disabled, loading, error, empty; real content, working controls, responsive composition, keyboard focus.
- **Browser surfaces:** text selection, caret, custom scrollbars, focus rings, underline offset, tabular numerals — "the cheapest signal that a page was built rather than assembled, and the one models skip most reliably."
- **Copy:** the product's own language; controls name their action; errors name the problem and the recovery.
- **Coverage:** every brief requirement present and findable within seconds.

## Refuse (category defaults, not bans — the brief's own words can earn any of them)

Page scaffolds: same-size icon+heading+text card grids (cards are the lazy container; nested cards always wrong); hero-metric template; kicker/eyebrow above a heading (a ban, not a default); section numbers 01/02/03 unless the sequence carries information; modal for a task needing neither interruption nor protected focus.

Surface habits: gradient text; glass/blur as decoration; colored `border-left`/`border-right` above 1px; hard offset shadows outside a real neobrutalist world; sparklines/progress rings/soft-shadowed rounded rectangles standing in for content; monospace as a "technical" costume; system display faces as the display voice; unicode glyphs/emoji standing in for an icon system; light/dark picked by category instead of use scene.

## Per-model sections

- `<codex>`: tracking stops at -0.04em (-0.02 to -0.03 usually reads better); declare elevation once (border or shadow — 1px border under a wide soft shadow is the ghost card); card radii 12-16px, pills for small controls; real illustration or none (bans sketch-style SVG, `loose-sketch`/`doodle` class names, `feTurbulence` grain); backgrounds are surfaces (bans `repeating-linear-gradient` stripes and two-axis grid overlays without a real canvas/map/blueprint); claims come from supplied truth, label illustrative values honestly.
- `<gemini>`: never animate an image on hover, directly or through its parent; give the container the feedback.

## Closing principle

"The floor holds the mechanics; it never picks the direction. With every check green, spend the page on the committed world, and when torn between refined and committed, commit."
