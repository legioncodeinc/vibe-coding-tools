# 06 — Detector Rules (59 deterministic rules)

**Source:** `cli/engine/registry/antipatterns.mjs` (authoritative), `impeccable.style/slop` (public catalog, reference)

## Engine facts

- 59 rules, each with `id`, `category` (`slop` | `quality`), `severity` (`error` | `warning` | `advisory`).
- Runs via `npx impeccable detect <file|dir|url>`; plain output groups by file with rule id, snippet, explanation; `--json` for scripts/CI.
- **Exit codes:** 0 = no findings; 2 = findings detected; 1 = command failed. CI fails the job on 2.
- Engines: static-html (`engines/static-html/detect-html.mjs`), browser/URL (`engines/browser/detect-url.mjs`), regex/text for CSS-in-JS and framework files (`engines/regex/detect-text.mjs`), plus `node/file-system.mjs` (walk, import graph, framework config detection).
- DESIGN.md-aware: when a local `DESIGN.md` exists, enables design-system checks (fonts, literal colors, radii, font sizes) using `.impeccable/design.json` for richer token/ramp data. `--no-design-system` disables; `--scope type|layout` narrows.
- Ignores: `npx impeccable ignores ...` (shared `config.json` / local `config.local.json`), inline `impeccable-disable` / `-line` / `-next-line` comments.
- Web only: native projects route to `/impeccable audit` (native pass).

## Full rule list (id | category | severity)

### slop (30)
side-tab | slop | advisory — thick colored border on one side of a card (most recognizable AI tell)
border-accent-on-rounded | slop | advisory — accent border clashes with radius
overused-font | slop | advisory — Inter, Geist, Space Grotesk, Instrument Serif, etc.
flat-type-hierarchy | slop | error — font sizes too close (aim >= 1.25 ratio)
gradient-text | slop | error — decorative gradient text
ai-color-palette | slop | advisory — purple/violet gradients, cyan-on-dark
cream-palette | slop | advisory — warm cream/beige default surface
nested-cards | slop | advisory — cards inside cards
monotonous-spacing | slop | advisory — same spacing everywhere
bounce-easing | slop | advisory — bounce/elastic easing on interface elements
pulsing-dot | slop | advisory — decorative pulse on static status
blinking-cursor | slop | advisory — fake caret on non-editable hero copy
shape-assembled-illustration | slop | advisory — sketch-style SVG scenes
dark-glow | slop | warning — dark bg with colored box-shadow glows
radial-halo | slop | warning — saturated radial glow on dark page
radial-spotlight-glow | slop | warning — accent haze behind a section
marquee | slop | warning — auto-scrolling marquee
icon-tile-stack | slop | warning — rounded-square icon tile above heading
italic-serif-display | slop | warning — oversized italic serif hero
hero-eyebrow-chip | slop | warning — tiny uppercase label above hero headline
kicker-above-heading | slop | warning — tracked uppercase label above heading
numbered-section-labels | slop | warning — tiny 01/02/03 labels
em-dash-overuse | slop | warning
marketing-buzzword | slop | warning
aphoristic-cadence | slop | warning
oversized-h1 | slop | warning — full-sentence headline at display size
extreme-negative-tracking | slop | warning — crushed letter spacing
gpt-thin-border-wide-shadow | slop | warning — hairline border + wide diffuse shadow (ghost card)
repeating-stripes-gradient | slop | warning — decorative stripe backgrounds
codex-grid-background | slop | warning — two-axis grid overlays without a real canvas
theater-slop-phrase | slop | warning — "x-theater" naming/irony
image-hover-transform | slop | warning — image animated on hover (Gemini-tuned rule)

### quality (29)
broken-image | quality | warning
script-error | quality | warning
content-hidden-at-rest | quality | warning
edge-flush-cards | quality | warning — scroller cards lose one edge
text-occlusion | quality | warning — opaque layer covers readable text
first-viewport-column-overflow | quality | warning
gray-on-color | quality | warning — gray text on colored background
low-contrast | quality | warning
layout-transition | quality | warning
line-length | quality | warning — > ~80ch
cramped-padding | quality | warning
body-text-viewport-edge | quality | warning
tight-leading | quality | warning
skipped-heading | quality | warning
heading-rhythm | quality | warning — heading closer to previous block than its content
justified-text | quality | warning
tiny-text | quality | warning
undersized-ui-text | quality | warning — functional text under 11px
all-caps-body | quality | warning
wide-tracking | quality | warning
text-overflow | quality | warning
repeated-container-text | quality | warning
clipped-overflow-container | quality | warning — positioned child clipped by overflow container
design-system-font | quality | warning — font outside DESIGN.md
design-system-color | quality | warning — literal color outside DESIGN.md palette
design-system-radius | quality | warning — radius outside documented shape scale
design-system-font-size | quality | warning — font size between documented steps

## Evidence for the stinger

- The gate is the Bee's mandatory close-out step: `npx impeccable detect <target>`; exit code 2 fails until resolved or explicitly waived (narrowest ignore + reason).
- The 4 design-system rules make product-token enforcement mechanical — they complement `design-system-stinger`/`ux-ui-stinger`.
- Verified live during research: `node cli/bin/cli.js detect tests/fixtures` returned line-numbered findings (side-tab, design-system-color, etc.) with remediation text.
