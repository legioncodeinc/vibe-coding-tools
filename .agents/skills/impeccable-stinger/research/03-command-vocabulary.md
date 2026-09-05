# 03 — Command Vocabulary (23 commands)

**Source:** `skill/scripts/command-metadata.json`, `skill/SKILL.src.md`, `impeccable.style/docs` (reference)

All commands run through `/impeccable <command> <target>`; `pin`/`unpin` creates standalone shortcuts (e.g., `/audit`). Commands grouped by intent (from `command-metadata.json`):

## Create
- `impeccable` — next-step recommendation or plain-English design work; inspects project state, recommends 2-3 commands, asks before running.
- `shape` — "Think before you build. Produce a design brief through discovery, not guesswork."
- `init` — one-time setup: discovery interview, writes `PRODUCT.md`, offers `DESIGN.md`, pre-configures live mode, recommends next commands.
- `document` — generate a spec-compliant `DESIGN.md` (Google Stitch format) from existing code.
- `extract` — pull reusable patterns, components, and tokens into the design system (drift consolidation).

## Evaluate
- `audit` — 5-dimension technical quality check (a11y, performance, theming, responsive, anti-patterns), scored 0-4, findings P0-P3. Native variant: `audit.native`.
- `critique` — design review with scoring, persona tests, and automated detection.

## Refine
- `polish` — "The meticulous final pass between good and great."
- `bolder` / `quieter` — amplify safe designs / tone down shouting designs (two halves of voice).
- `distill` — ruthless subtraction; strip to essence.
- `animate` — purposeful motion that conveys state, not decoration.
- `colorize` — strategic color for monochrome UIs.
- `typeset` — fix typography hierarchy and fonts.
- `layout` — fix layout, spacing, visual rhythm.
- `delight` — small moments of personality.
- `overdrive` — push past conventional limits (shaders, physics, 60fps, cinematic transitions).

## Simplify / Fix
- `adapt` — cross-device/context adaptation (breakpoints, fluid layouts, touch targets). Native variant: `adapt.native`.
- `clarify` — rewrite confusing UX copy.
- `optimize` — diagnose and fix UI performance (LCP to bundle size).

## Harden
- `harden` — production-ready: edge cases, i18n, error states, overflow.
- `onboard` — first-run flows, empty states, activation paths.

## System
- `live` — interactive live variant mode (browser picker, 3 variants, HMR, accept writes to source). Alpha.
- `hooks` — manage the design detector hook (`on|off|status|ignore-rule|ignore-file|ignore-value|reset`).
- `doctor` — report/repair drift between project artifacts and what this version reads.

## Routing rules (`skill/SKILL.src.md`)

- No argument → read `routing.md`, present context-aware menu; never auto-run a command.
- Explicit or clearly implied command → load its reference and follow it; ask once if two fit.
- Otherwise → treat as general design work; missing `PRODUCT.md` routes new surfaces through `init` then `new-work`; narrow refinement proceeds on the incumbent implementation.
- `teach` aliases `init`; `craft` is a deprecated alias for ordinary new-work.

## Evidence for the stinger

- The Bee's procedure maps the four phases to these commands: Start (`init`/`shape`/new-work), Iterate (refine commands + `live`), Polish (`audit`/`clarify`/`harden` + detector gate), Maintain (`extract`/`document`/`doctor`/`hooks`).
- Pin only 2-3 daily commands; pinning everything re-explodes the `/` menu (`impeccable.style/designing`).
