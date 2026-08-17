# 06 — Detector Gate (59 deterministic rules)

Derived from `research/06-detector-rules.md`.

## CLI usage

```bash
npx impeccable detect src/                 # scan a directory
npx impeccable detect src/components/Card.tsx   # one file
npx impeccable detect https://example.com  # rendered page (browser engine)
npx impeccable detect --json src/          # machine-readable
npx impeccable detect --scope type src/   # one design domain
npx impeccable detect --no-design-system src/  # raw scan
```

- **Exit codes:** 0 = no findings; 2 = findings detected; 1 = command failed. CI fails the job on 2.
- Engines: static-html (files + linked CSS), browser (URLs), regex/text (JSX/TSX/Vue/Svelte/Astro/CSS-in-JS). Server-side templates (Blade/ERB/Twig/Handlebars) need `detector.extensions` in `.impeccable/config.json`.
- Web only. Native projects route to `/impeccable audit` (native pass).

## The 59 rules (id | category | severity)

**slop (30):** side-tab, border-accent-on-rounded, overused-font, flat-type-hierarchy (error), gradient-text (error), ai-color-palette, cream-palette, nested-cards, monotonous-spacing, bounce-easing, pulsing-dot, blinking-cursor, shape-assembled-illustration, dark-glow, radial-halo, radial-spotlight-glow, marquee, icon-tile-stack, italic-serif-display, hero-eyebrow-chip, kicker-above-heading, numbered-section-labels, em-dash-overuse, marketing-buzzword, aphoristic-cadence, oversized-h1, extreme-negative-tracking, gpt-thin-border-wide-shadow, repeating-stripes-gradient, codex-grid-background, theater-slop-phrase, image-hover-transform.

**quality (29):** broken-image, script-error, content-hidden-at-rest, edge-flush-cards, text-occlusion, first-viewport-column-overflow, gray-on-color, low-contrast, layout-transition, line-length, cramped-padding, body-text-viewport-edge, tight-leading, skipped-heading, heading-rhythm, justified-text, tiny-text, undersized-ui-text, all-caps-body, wide-tracking, text-overflow, repeated-container-text, clipped-overflow-container, design-system-font, design-system-color, design-system-radius, design-system-font-size.

Severities: `error` (flat-type-hierarchy, gradient-text), `warning` (most), `advisory` (side-tab, overused-font, ai-color-palette, cream-palette, nested-cards, etc.).

## DESIGN.md awareness

With a local `DESIGN.md`, the detector enables the 4 design-system rules (font, color, radius, font-size outside the documented system) using `.impeccable/design.json` for richer token/ramp data. This is what makes product-token enforcement mechanical — it complements `design-system-stinger`/`ux-ui-stinger`.

## Ignores & waivers

- `npx impeccable ignores list|add-value|add-file|add-rule|remove-value`; `--local` for private; `--reason` for the why.
- Value ignores preferred for fonts/colors/radii/motion (keeps the rule useful elsewhere); wildcard value ignores only when scoped to a file.
- Inline comments travel with a file: `<!-- impeccable-disable overused-font: reason -->`, `impeccable-disable-line`, `impeccable-disable-next-line`.
- A waiver without a stated reason is a failure. The narrowest exception that matches the real reason is the only correct one.

## CI wiring

```bash
npx impeccable detect --json src/ > .impeccable/detect.json
# exit code 2 → fail the PR check; parse JSON for the findings list
```

Add to army projects' PR checks per the user decision (2026-08-06).
