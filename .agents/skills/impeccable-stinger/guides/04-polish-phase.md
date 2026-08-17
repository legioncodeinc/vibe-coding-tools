# 04 — Polish Phase (pre-ship gauntlet)

Derived from `research/03-command-vocabulary.md`, `research/06-detector-rules.md`.

## The three commands before anything ships

1. **`/impeccable audit <target>`** — 5 dimensions scored 0-4: accessibility, performance, theming, responsive, anti-patterns. Findings tagged P0-P3. Point at a narrow target: one section reviewed closely beats a whole page at a glance. Native projects route to the native pass (VoiceOver, TalkBack, touch targets, platform conformance).
2. **`/impeccable clarify <target>`** — rewrite the copy: labels, error messages, empty-state prose, microcopy, tuned to the audience from `PRODUCT.md`.
3. **`/impeccable harden <target>`** — stress-test reality: 60-character names, German product titles, prices in the billions, 500s, offline. Production data is messy.

## The deterministic gate (mandatory)

- `npx impeccable detect <target>` — file, dir, or URL. Plain output groups by file with rule id, snippet, explanation; `--json` for scripts/CI.
- **Exit codes:** 0 = no findings; 2 = findings; 1 = command failed. CI fails the job on 2.
- DESIGN.md-aware: with a local `DESIGN.md`, enables design-system checks (fonts, literal colors, radii, font sizes). `--no-design-system` disables; `--scope type|layout` narrows.
- **Waivers:** narrowest form only — `npx impeccable ignores add-value <id> <value> --reason "..."`, `add-file <glob>`, or inline `impeccable-disable` comments in the file. A waiver without a reason is a failure.
- See `guides/06-detector-gate.md` for the full rule list and CI wiring.

## Close-out

- Findings resolved or explicitly waived → hand off to `security-worker-bee` first, then `quality-worker-bee`. Never quality before security.
- The gate result travels with the close-out (see `templates/gate-report.md`).
