# Example 03 — Live Mode Session (opt-in, user-invoked)

Demonstrates: `guides/08-live-mode.md`, `guides/07-hooks.md`.

**Task:** "Show me the hero live — something's off but I can't name it."

1. **Opt-in.** The user asked; the Bee launches live mode. Never auto-launched.
2. **Setup.** Dev server confirmed running (localhost:3000). `/impeccable live` — picker injected into the app.
3. **Iterate.** User picks the hero headline, types "make it feel more editorial". Three variants hot-swapped via HMR. User accepts variant 2 → written to source (manual edits captured via `live-commit-manual-edits.mjs`).
4. **Gate.** `npx impeccable detect src/` on the accepted result → 0 findings. The per-edit hook stays quiet on clean edits (non-intrusive by design).
5. **Close-out.** Hand off to `security-worker-bee` → `quality-worker-bee`.

**Note:** during normal development the user gets live feedback from the **per-edit hook** (findings pushed back after each UI edit, quiet when clean) — that is the non-nuisance live feedback. Live mode is the on-demand visual iteration tool.
