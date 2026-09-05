# 08 — Live Mode (opt-in browser iteration, alpha)

Derived from `research/08-live-mode.md`.

## What it is

`/impeccable live` drops a picker onto the running dev server. The user points at any element, draws or types what they want, and gets **three production-quality variants** hot-swapped via HMR. Accepting one writes it back to source.

- Requires a running dev server (localhost).
- **Status: alpha** — works end-to-end, but needs more testing against real-world repos and framework configs. Expect rough edges on uncommon setups.

## When to use (user decision 2026-08-06)

- **Opt-in, user-invoked only.** Never auto-launch it. The Bee launches it only when the user asks to iterate visually ("show me live", "let me point at it", "I want to see it in the browser").
- Use it when: the user can't name what's off; they want to explore three directions side by side; they want to see the design live as code changes and point at issues before a PR.
- The default loop stays: named commands + bounded rounds + detector gate.

## Session flow

1. Confirm a dev server is running; start one if needed.
2. Launch `/impeccable live`; the picker is injected into the app.
3. User picks an element or steers the whole page; the Bee generates 3 variants.
4. User accepts one → it writes to source (manual edits are captured and committed via `live-commit-manual-edits.mjs`).
5. Run the detector gate on the accepted result before close-out.

## Companion: Chrome extension

The detector overlay runs on any live page (staging, competitor) — useful for review without touching the editor.
