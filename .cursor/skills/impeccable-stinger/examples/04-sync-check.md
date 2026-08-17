# Example 04 — Pre-Flight Sync Check

Demonstrates: `guides/11-sync-check.md`.

**Task:** "Polish the billing settings page."

1. **Pre-flight.** `node .../impeccable-stinger/scripts/sync-check.mjs` → `[sync-check] CURRENT: upstream in sync, stinger coverage matches. Skipping update.` (exit 0). Skipped; task proceeds.
2. **Later run (behind).** The check reports `BEHIND: installed 4.0.3 < published 4.0.4` and `NEW COMMANDS upstream: <none>` (exit 2). The Bee runs `npx impeccable update`, notes the Codex `/hooks` re-approval to the user, re-runs the check → exit 0 → proceeds.
3. **Content drift.** The check reports `NEW REFERENCE FILES upstream: typeset.native.md` (exit 2). The Bee adds a guide/template covering the new playbook, bumps `scripts/upstream-manifest.json`, re-runs → exit 0 → proceeds.
4. **Not installed.** The check reports `NOT INSTALLED` (exit 1). The Bee runs the global install, then per-project `install` + `init` + `document`, re-runs → exit 0 → proceeds.
