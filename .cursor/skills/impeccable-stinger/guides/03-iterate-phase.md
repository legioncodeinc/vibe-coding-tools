# 03 — Iterate Phase (bounded rounds)

Derived from `research/03-command-vocabulary.md`, `research/08-live-mode.md`.

## Named commands (when the edit has a name)

- **Refine:** `polish` (final pass), `bolder` / `quieter` (voice), `distill` (subtraction), `typeset` (type hierarchy), `layout` (spacing/rhythm), `colorize` (strategic color), `animate` (purposeful motion), `delight` (personality), `overdrive` (past conventional limits).
- **Fix:** `clarify` (UX copy), `adapt` (devices/contexts), `optimize` (performance).
- **Harden:** `harden` (edge cases, i18n, errors, overflow), `onboard` (first-run, empty states).
- **Evaluate:** `critique` (design review with scoring, persona tests, automated detection).

## Bounded-round discipline

1. Build fully.
2. Inspect once in a batched round — desktop and mobile together, one render.
3. Fix everything the round shows in one batch.
4. Confirm with at most one more round.
5. Stop. Hand to the user for approval. The user is the "happy" gate.

## Live Mode (opt-in, user-invoked only)

- `/impeccable live` drops a picker on the running dev server: point at an element, type/draw a change, get 3 production-quality variants hot-swapped via HMR; accept one and it writes to source.
- **Never auto-launch it.** Launch only when the user asks to iterate visually ("show me live", "let me point at it").
- Status: **alpha** — expect rough edges on uncommon setups. Prefer named commands for the default path.
- The non-intrusive live feedback during development is the **per-edit hook** (see `guides/07-hooks.md`), not live mode.

## When to reach for which

- Fix something "off" you can't name → `live` (user-invoked) or `critique`.
- Apply a specific discipline → `typeset` / `layout` / `colorize` / `animate`.
- Explore three directions side by side → `live` (user-invoked).
- Ask "is this any good?" → `critique`.
- Bring a safe design to life / tone a shouting one down → `bolder` / `quieter`.
