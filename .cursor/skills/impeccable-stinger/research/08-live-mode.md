# 08 — Live Mode (browser iteration)

**Source:** `skill/reference/live.md`, `skill/reference/live-setup.md`, `skill/scripts/live/*`, `impeccable.style/docs/live` (reference)

## What it is

`/impeccable live` drops a picker onto the running dev server. The user points at any element, draws or types what they want, and gets **three production-quality variants** hot-swapped via HMR. Accepting one writes it back to source.

- Requires a running dev server (localhost).
- Status: **alpha** — "works end-to-end and is ready to try, but it still needs more testing against real-world repos and framework configs. Expect rough edges on uncommon setups" (`impeccable.style/docs/live`).
- Scripts: `skill/scripts/live/*` (live.mjs, live-accept.mjs, live-complete.mjs, live-poll.mjs, live-status.mjs, live-wrap.mjs, live-target.mjs, live-resume.mjs, live-browser.js, live-inject.mjs, live-insert.mjs, live-copy-edit-agent.mjs, live-commit-manual-edits.mjs, live-manual-edit-evidence.mjs, live-discard-manual-edits.mjs, live-browser-dom.js, live-browser-session.js, live/manual-edits-buffer.mjs, live/vocabulary.mjs, live/svelte-ast.mjs, live/event-validation.mjs, live/insert-ui.mjs, live/manual-apply.mjs, live/completion.mjs, live/poll-lanes.mjs, live/accept-css.mjs, live/roots.mjs).
- `live-browser.js` is ~500KB (bundled browser automation).

## When to reach for it

- Fix something "off" you can't name.
- Explore three directions side by side.
- Point-at-it iteration beats command-naming when the user doesn't know the design word.

## Evidence for the stinger

- Live Mode is an Iterate-phase tool, not the core loop. Given alpha status, the Bee should treat it as optional/experimental and prefer named commands for the default path.
- Accept writes to source; manual edits are captured and committed via `live-commit-manual-edits.mjs`.
