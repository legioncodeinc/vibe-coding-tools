# Research Summary — impeccable-stinger

- **Depth tier consumed:** deep (entire system)
- **Time window covered:** repo HEAD `aee6ce9` (2026-08-04); site sitemap lastmods 2026-04-10 → 2026-07-22. Repo-primary research, not a web sweep (user-directed; site robots.txt `ai-train=no`).
- **Files written:** 13 (research-plan + 11 topic files + index + this summary) under `.cursor/skills/impeccable-stinger/research/`.

## The 5 most influential sources (for stinger-forge)

1. **`skill/SKILL.src.md`** — the skill definition: setup, four modes, command routing, hooks, doctor, bounded-pass discipline. The stinger's SKILL.md should mirror its structure and voice.
2. **`skill/reference/craft-floor.md`** — the quality floor, absolute bans, and per-model (`<codex>`, `<gemini>`) sections. This is the anti-slop core the Bee enforces.
3. **`skill/reference/new-work.md` + `skill/scripts/concept-seed.mjs`** — job classification, five tests, direction contract, and the roll/dice variance machinery. This is what makes the system "whole" and is unique vs every existing army skill.
4. **`cli/engine/registry/antipatterns.mjs`** — the 59 deterministic rules (id/category/severity) that power the gate, hooks, CI, and slop catalog. The Bee's mandatory close-out gate.
5. **`skill/reference/hooks.md` + `skill/scripts/hook-admin.mjs`** — per-edit + deep-pass enforcement, harness manifests, Codex approval. The "every time" enforcement layer.

## Open questions (for the user, not stinger-forge)

1. Default router for all frontend UI/UX work, retiring overlapping prompt-only skills as fallbacks?
2. Upstream `npx impeccable install` per project as the enforcement layer (recommended), stinger as guidance + gate?
3. CI gate on army PR checks?
4. Live Mode now (alpha) or defer?
5. Native playbooks in first release, or web-only?

## Sources stinger-forge should re-fetch with deeper context

- `skill/reference/audit.md` + `audit.native.md` (5-dimension scoring rubric, P0-P3) — needed for the Polish-phase guide.
- `skill/reference/init.md` + `document.md` (interview flow, Stitch-format capture) — needed for the Start-phase guide.
- `skill/reference/live.md` + `live-setup.md` (alpha; decide inclusion).
- `docs/HARNESSES.md` (per-harness install/update details) — needed for the install/verify guide.
- `skill/scripts/context.mjs` (context loading + staleness directives) — needed for the context-contract guide.

## Decisions (user-resolved 2026-08-06)

1. Default router for all frontend UI/UX work — YES (retire overlapping prompt-only skills to fallbacks).
2. Install scope — HYBRID: global skill install + per-project context/hooks (hooks are project-local by harness design).
3. CI gate — YES (`npx impeccable detect src/` in PR checks).
4. Live Mode — include as opt-in, user-invoked, alpha; never auto-launched.
5. Native — include iOS/Android/adaptive playbooks.
