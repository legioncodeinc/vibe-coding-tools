# 01 — System Overview

**Source:** `README.md`, `PRODUCT.md`, `skill/SKILL.src.md`, `package.json`, `impeccable.style/designing` (reference)

## What it is

Impeccable is a design-guidance skill + toolchain for AI coding agents: "1 skill, 23 commands, live browser iteration, and 59 deterministic detector rules for AI-generated frontend design" (`README.md`). It started from Anthropic's `frontend-design` skill and adds a setup flow, a shared command vocabulary, and deterministic enforcement.

- **License:** Apache-2.0 (`LICENSE`, `package.json` `"license": "Apache-2.0"`).
- **Runtime:** Node >= 22.18 (`package.json` `"engines"`).
- **Distribution:** npm package `impeccable` (bin `impeccable` → `cli/bin/cli.js`), installed per project via `npx impeccable install`, which writes harness-tailored builds (`.claude/`, `.cursor/`, `.codex/`, `.gemini/`, `.grok/`, `.trae/`, `.opencode/`, `.qoder/`, `.rovodev/` folders exist in the repo).
- **Per-model builds:** "builds for models with known tells carry extra slop rules banning that model's habits. The Gemini build kills its image-on-hover motion; the Codex build refuses ghost-cards and over-rounding" (`README.md`; `<codex>`/`<gemini>` sections in `skill/reference/craft-floor.md`).

## The seven layers (whole system)

1. **Context contract** — `PRODUCT.md` (strategy) + `DESIGN.md` (visual system, Google Stitch format) + `.impeccable/surfaces/*.md` (per-surface mode/job/proof) + `.impeccable/design.json` (structured sidecar). Loaded by `skill/scripts/context.mjs` on every command.
2. **One vocabulary** — 23 commands under `/impeccable` (`skill/scripts/command-metadata.json`). v3.0 consolidated 18 standalone skills into one.
3. **Direction machinery** — new-work flow: job classification, five tests, direction contract, worlds deck + roll (`skill/scripts/concept-seed.mjs`, `skill/scripts/lib/concept-catalog.mjs`).
4. **Craft floor** — `skill/reference/craft-floor.md`: quality floor, absolute bans, reflexes, per-model sections.
5. **Deterministic enforcement** — 59 rules (`cli/engine/registry/antipatterns.mjs`), CLI `npx impeccable detect` (JSON, exit codes 0/2/1), hooks, Chrome extension, slop catalog.
6. **Live iteration** — `/impeccable live` (`skill/scripts/live/*`): browser picker, 3 variants per element, HMR, accept writes to source. Status: alpha.
7. **Maintenance** — `doctor` (tool/schema/truth drift), config/ignores, `update`/`check`, `extract`/`document`.

## The four-phase loop (the Bee's core procedure)

From `impeccable.style/designing` (reference; same content as the skill's routing):

- **Start** — `init` (context) → `shape`/new-work (brief, direction, visualize, build).
- **Iterate** — named commands (`polish`, `bolder`, `typeset`, `layout`, `colorize`, `animate`, ...) or `live`; bounded rounds.
- **Polish** — pre-ship gauntlet: `audit` (5 dims, P0-P3), `clarify` (copy), `harden` (edge cases); detector gate in CI (`npx impeccable detect src/`, exit code fails the build).
- **Maintain** — `extract` (consolidate drift into tokens/primitives) + `document` (re-capture `DESIGN.md`) before debt solidifies.

## Key evidence

- "Verify in bounded passes, not a loop... Build fully, inspect once with a batched round (desktop and mobile together), fix everything it shows in one batch, confirm with at most one more round, and stop polishing. Open-ended self-QA burns the user's money" (`skill/SKILL.src.md`).
- "The brief wins. Honor pinned aesthetics, eras, materials, fonts, and palettes even when they conflict with a saturated-pattern warning" (`skill/SKILL.src.md`).
- "Refinement preserves; redesign replaces... Never split the difference into polish on the discarded look" (`skill/SKILL.src.md`).
- "Visual authority is evidence, not a filename. Missing DESIGN.md alone does not make a project greenfield" (`skill/SKILL.src.md`).
- "Running both Impeccable and Anthropic's frontend-design skill... Two skills with different design vocabularies collide and cancel each other out. Pick one" (`impeccable.style/designing`).
