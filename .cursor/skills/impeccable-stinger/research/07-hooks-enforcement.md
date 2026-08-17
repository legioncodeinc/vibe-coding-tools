# 07 — Hooks & Enforcement (per-edit + deep pass)

**Source:** `skill/reference/hooks.md`, `skill/scripts/hook-admin.mjs`, `skill/scripts/hook-lib.mjs`, `impeccable.style/docs/hooks` (reference)

## What the hook does

- Scans direct edits to design-relevant files (`.tsx`, `.jsx`, `.html`, `.vue`, `.svelte`, `.astro`, `.css`, `.scss`, `.sass`, `.less`, `.ts`, `.js`).
- **Claude Code, GitHub Copilot, Codex:** post-tool-use hook pushes a short system reminder into the agent's context after the edit; findings get a correction prompt, pending issues get a re-nudge, clean UI-ish files get a short ack (unless `hook.quiet`).
- **Cursor:** `preToolUse` blocks bad proposed writes before they land; silent when it allows a clean write.
- Plain `.ts`/`.js` files are scanned but stay quiet unless the detector finds something.

## Two speeds

- **Per edit:** only what is objectively broken or compounds if ignored (broken images, overflow/clipped text, contrast failures, tiny text, gradient text, glow, DESIGN.md drift).
- **End of session (deep pass):** the full rule set across every UI file touched, minus what was already reported; a second stop is silent (findings remembered). Wired for Claude Code and Codex (native Stop hook); Cursor and Copilot keep the full detector per edit.
- Rationale: "Reporting every rule on every edit made models measurably more conservative rather than more careful" (one copy-level rule fired ~97x in a single session).
- `hook.perEditRules: "all"` restores full rules per edit.

## Harness manifests & approval

- Claude Code: `.claude/settings.local.json` (gitignored, machine-local).
- GitHub Copilot: `.github/hooks/impeccable.json` (committed, team-shared; activates on default branch).
- Codex: `.codex/hooks.json` — **requires one extra approval step**: open `/hooks` in Codex and approve the project hook; updates that change the hook definition can require approval again.
- Cursor: `.cursor/hooks.json`; confirm hooks enabled in Cursor Settings → Hooks.
- Installer/updater: `npx impeccable install|update`; `--no-hooks` skips hook setup; `--force` backs up malformed manifests as `.bak`.

## Config & env

- `hook.enabled`, `hook.quiet`, `hook.auditLog` (NDJSON) in `.impeccable/config.json`; per-developer consent in `.impeccable/config.local.json`.
- Env overrides: `IMPECCABLE_HOOK_DISABLED`, `IMPECCABLE_HOOK_QUIET`, `IMPECCABLE_HOOK_LOG`.
- Detector filters live under `detector` (shared by hook and CLI): `ignoreRules`, `ignoreFiles`, `ignoreValues`, `designSystem.enabled`.
- Server-side templates: declare under `detector.extensions` (e.g., `{ "ext": ".blade.php", "engine": "html" }`).

## Failure mode to watch

"A hook can look installed and scan nothing: if its script path stops resolving... the manifest still registers and no findings ever arrive. Silence reads as a clean codebase." `/impeccable doctor` checks for exactly this (`skill/reference/hooks.md`).

## Evidence for the stinger

- The Bee verifies hook health (`doctor`) and treats hook silence as suspicious, not as a clean pass.
- Hooks are the "every time" enforcement: they fire on every UI edit regardless of routing discipline.
