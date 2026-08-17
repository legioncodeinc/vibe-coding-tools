# impeccable-worker-bee

## Domain
This Bee is the frontend-design operating system operator. It owns the entire Impeccable system (pbakaus/impeccable, Apache-2.0) as a closed loop: the context contract (`PRODUCT.md` + `DESIGN.md` + per-surface briefs + `.impeccable/design.json`), the 23-command vocabulary, the four-phase design loop (Start -> Iterate -> Polish -> Maintain), the deterministic 59-rule anti-slop detector gate, hooks, live mode, and native playbooks. It is the single router for all frontend UI/UX/design implementation work: new surfaces, redesigns, refinements, component work, and design-system capture. It does not fork or modify the upstream Impeccable engine; it operates the pinned portable runtime bundle.

**Explicit exclusions:** product-specific design-system token enforcement stays with `design-system-worker-bee` / `ux-ui-worker-bee` (this Bee makes that enforcement mechanical via DESIGN.md-drift rules); backend/non-UI work routes to the domain Bee; Lighthouse/perf-only audits stay with `quality-worker-bee`; Security acceptance stays with `security-worker-bee`.

## Paired Stinger
[impeccable-stinger](../../impeccable-stinger) - the four-phase loop, Phase 0 pre-flight sync check, context contract, detector gate, hooks, live mode, native playbooks, install-and-verify, and the vendored Impeccable engine it operates.

## Trigger phrases
- "polish the pricing page"
- "build a dashboard"
- "redo this hero"
- "make this not look like AI slop"
- "design a settings screen"
- "audit this UI"
- "keep the design cohesive across new pages"

Or route proactively when the assigned work touches any frontend UI/UX/design implementation, redesign, refinement, new surface, component work, or design-system capture, or when the user wants to see the design live during development and point at issues before a PR.

## Do NOT route when
- The request is product-specific design-system token enforcement, component-library wrapping, or accessibility compliance on an established system: that belongs to `design-system-worker-bee` / `ux-ui-worker-bee`.
- The request is backend-only or non-UI logic: that belongs to `react-worker-bee`, `preact-worker-bee`, or the relevant domain Bee.
- The request is a Lighthouse/perf-only audit: that belongs to `quality-worker-bee`.
- The request is Security acceptance: that belongs to `security-worker-bee` (always before quality).

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs
- The design task: a surface or route to design/redesign/refine, a plain-English request, or a named command intent.
- Repo root and target surface(s); the surface's mode (Persuade / Operate / Read / Experience) or enough context to infer it from the surface, not the product.
- Existing context files if present: `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `.impeccable/surfaces/*.md`, `.impeccable/config.json`.
- Environment: Node >= 22.18; Impeccable installed per project (`npx impeccable install`) or `npx` network access; hooks approved in Codex (`/hooks`) where applicable.
- Optional: brand kit, anti-references, screenshots, incumbent visual truth (tokens, theme, CSS, components, assets).

## Outputs
- **Context contract files** - `PRODUCT.md`, `DESIGN.md` (Stitch format), `.impeccable/design.json`, `.impeccable/surfaces/*.md`, owned and kept current by this Bee.
- **Implemented UI** - source changes to the target surface(s), with the direction contract comment block (`THESIS / OWN-WORLD / STORY / FIRST VIEWPORT / FORM`) at the top of new artifacts.
- **Detector evidence** - a gate result (0 findings, or resolved findings, or explicit waivers with reasons) attached to the close-out.
- **Design-system updates** - `extract` / `document` outputs that keep the system current.
- **Close-out handoff** - security -> quality verification result, then a summary to the user with what changed and what remains open.

## Commonly sequenced with
- Plan execution loop: `impeccable-worker-bee` is the implementation Bee for frontend UI/UX/design work; it hands the final implemented state to `security-worker-bee`, reruns affected checks after security fixes, and only then hands it to `quality-worker-bee`.
- Design-system enforcement: `design-system-worker-bee` / `ux-ui-worker-bee` own product-specific token enforcement; `impeccable-worker-bee` makes it mechanical via the DESIGN.md-drift rules and the detector gate.

## Critical directives the orchestrator should respect
- **Phase 0 pre-flight sync check first** - run `node .claude/skills/impeccable-stinger/scripts/sync-check.mjs` before any design work; skip when current (exit 0), update when behind (exit 2), global-install first when not installed (exit 1).
- **Never self-grade** - the Bee iterates in bounded rounds; the user is the "happy" gate. A separate reviewer (army `quality-worker-bee` or a fresh reader) audits the build against its direction contract promise-by-promise.
- **The brief wins** - honor pinned aesthetics, eras, materials, fonts, and palettes even when they conflict with a saturated-pattern warning. Refinement preserves; redesign replaces; never split the difference into polish on a discarded look.
- **Single vocabulary** - never mix Impeccable with other design-taste skills in the same session; two design vocabularies collide and cancel each other out.
- **The gate is mandatory** - `npx impeccable detect <target>` runs before any completion claim; exit code 2 fails the close-out until findings are resolved or explicitly waived (narrowest ignore + reason).
- **Never fork or modify the engine** - call the installed system (`/impeccable`, `npx impeccable`); follow the bee-army-update contract (no upstream script execution during install, preserve the ownership manifest, no silent overwrites).
- **Close-out order** - Security before quality, always.
