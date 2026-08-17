# 11 — Pre-Flight Sync Check (upstream always in sync)

Derived from `research/09-maintenance-doctor.md`, `research/11-license-provenance.md`, and the user decision (2026-08-06): "make sure the upstream is always in sync before a task is done. If it is current it is skipped."

## The mechanism

Before any design task starts, run the stinger's sync check:

```bash
node .claude/skills/impeccable-stinger/scripts/sync-check.mjs
```

**Exit codes:**
- `0` — current and in sync → **skip**, proceed with the task.
- `2` — behind upstream and/or content drift → update/refresh before the task (see below).
- `1` — not installed or check failed → install first.

## What it verifies

1. **Installed skill present** — searches the harness skill dirs (`~/.agents/skills/impeccable`, `~/.codex/skills/impeccable`, `~/.claude/skills/impeccable`, `~/.claude/skills/impeccable`, and project-local equivalents). Codex's primary skill dir is `.agents/skills/`.
2. **Version currency** — reads the installed `SKILL.md` frontmatter `version:` and compares it to the published version at `https://impeccable.style/api/version` (same endpoint the skill's own `context.mjs` uses). Behind → `npx impeccable update`.
3. **Content coverage** — compares the installed skill's `reference/` files and `scripts/command-metadata.json` commands against the stinger's `scripts/upstream-manifest.json` (forged against upstream 4.0.4 / commit `aee6ce9`). New commands or reference files upstream → the stinger needs a refresh (new guide/template), not just an update.

## When behind (exit 2)

1. Run `npx impeccable update` (or `node .../sync-check.mjs --update`). **Note:** Codex may require `/hooks` re-approval after an update — tell the user.
2. If content drift: add the missing guide/template for the new command or reference file, then update `scripts/upstream-manifest.json` to the new version/commit.
3. Re-run the check → exit 0 → proceed.

## When not installed (exit 1)

```bash
npx impeccable install --scope=global --providers=codex,claude,cursor
```

Then per project: `npx impeccable install` (hooks) + `/impeccable init` + `/impeccable document` (context). See `guides/10-install-and-verify.md`.

## Rules

- The check is a **pre-flight gate**: run it before Phase 1, skip when current, never skip when behind.
- Never fork or modify the engine; the check only compares versions and file coverage.
- A stale stinger manifest is a real finding: upstream added content the Bee does not know how to operate.
- Report the result in the close-out (see `templates/sync-report.md`).
