# 07 — Hooks (per-edit + deep pass)

Derived from `research/07-hooks-enforcement.md`.

## What the hook does

- Scans direct edits to design-relevant files (`.tsx`, `.jsx`, `.html`, `.vue`, `.svelte`, `.astro`, `.css`, `.scss`, `.sass`, `.less`, `.ts`, `.js`).
- **Claude Code / GitHub Copilot / Codex:** post-tool-use — pushes a short system reminder after the edit; findings get a correction prompt, pending issues get a re-nudge, clean files get a short ack (unless `hook.quiet`).
- **Cursor:** `preToolUse` — blocks bad proposed writes before they land; silent when clean.
- Plain `.ts`/`.js` files are scanned but stay quiet unless the detector finds something.

## Two speeds

- **Per edit:** only what is objectively broken or compounds if ignored (broken images, overflow/clipped text, contrast failures, tiny text, gradient text, glow, DESIGN.md drift).
- **End of session (deep pass):** the full rule set across every UI file touched, minus what was already reported; a second stop is silent. Wired for Claude Code and Codex (native Stop hook); Cursor and Copilot keep the full detector per edit.
- `hook.perEditRules: "all"` restores full rules per edit (not recommended — it makes models more conservative).

## Harness manifests & approval

| Harness | Manifest | Notes |
|---|---|---|
| Claude Code | `.claude/settings.local.json` | gitignored, machine-local |
| GitHub Copilot | `.github/hooks/impeccable.json` | committed, team-shared |
| Codex | `.codex/hooks.json` | **requires `/hooks` approval after install/update** |
| Cursor | `.cursor/hooks.json` | confirm enabled in Settings → Hooks |
| Grok Build | `.grok/hooks/impeccable.json` | requires `/hooks-trust` or `--trust` |

- Installer: `npx impeccable install|update`; `--no-hooks` skips; `--force` backs up malformed manifests as `.bak`.
- Config: `hook.enabled`, `hook.quiet`, `hook.auditLog` in `.impeccable/config.json`; consent in `.impeccable/config.local.json`. Env: `IMPECCABLE_HOOK_DISABLED`, `IMPECCABLE_HOOK_QUIET`, `IMPECCABLE_HOOK_LOG`.

## The failure mode to watch

"A hook can look installed and scan nothing: if its script path stops resolving... the manifest still registers and no findings ever arrive. Silence reads as a clean codebase." `/impeccable doctor` checks for exactly this. Treat hook silence as suspicious, not as a clean pass.

## Why this matters for the Bee

Hooks are the "every time" enforcement: they fire on every UI edit regardless of routing discipline. They are the non-intrusive live feedback during development — the user sees findings as code is written, without live mode being a nuisance.
