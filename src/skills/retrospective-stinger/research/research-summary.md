# Research Summary: retrospective-stinger

- **Depth tier consumed:** normal
- **Time window covered:** 2025-07-04 to 2026-05-20 (~10 months; all substantive sources found within the 6-12 month window)
- **Research run date:** 2026-05-20
- **Total files written:** 10 (1 research-plan, 1 research-summary, 1 internal note, 7 external source files)
- **Queries executed:** 5 (all 5 from Command Brief)
- **External sources in `external/`:** 7 (two per query area, plus one for tooling)

---

## The 5 most influential sources

### 1. `external/2026-05-20-action-items-agile-coach-medium.md`
**Why it matters:** Published 2026-05-15: five days before this sweep. Survey-backed (419 professionals, 5 countries): only 50% of retro action items ever get completed. Introduces the "3-question filter" (who owns this? when does it close? what does done look like?) as a live facilitation check. Includes a case study: teams went from 40% to 85% closure rate in 3 sprints by simply tracking and reviewing the number. This is the empirical anchor for `guides/04-action-items.md` and the most credible argument for why follow-through is the primary lever of retro health.

### 2. `external/2026-05-20-action-items-follow-through-scrumtool.md`
**Why it matters:** Published 2026-04-11. ScrumTool's structural diagnosis of why action items die names five specific failure modes (no owner, no deadline, too large, invisible on backlog, no accountability). The four-component good action item (named owner, specific outcome, sprint deadline, backlog placement) is the template stinger-forge needs for `templates/action-items.md`. The "backlog placement" component is the key insight missing from most SMART frameworks.

### 3. `external/2026-05-20-format-selection-meetgeek.md`
**Why it matters:** Published 2026-05-07. Provides the only "when NOT to use" guidance for each format found in the sweep: making it more useful for format selection logic than the comprehensive 30+ format catalog. The commitment step framing ("most retros fail at the commitment step, not the format") is the philosophical foundation for `guides/00-principles.md`. Published within two weeks of this research run, making it the most current practitioner voice.

### 4. `external/2026-05-20-psychological-safety-retroflow.md`
**Why it matters:** Published 2025-09-22. Reproduces the Edmondson 7-item measurement scale verbatim. Provides the safety check gate logic (< 3/5 average = shift retro to safety-building). Cites Google Project Aristotle as empirical validation. The 42% introvert participation increase from anonymous feedback is the best argument for making anonymous input a default rather than an option. Primary source for `guides/02-psychological-safety.md`.

### 5. `external/2026-05-20-async-retro-retroflow.md`
**Why it matters:** Published 2025-07-08. The most complete step-by-step guide to async retrospective design found in the sweep. Provides the canonical 4-day async timeline, decision gate criteria, format recommendations for async (4Ls and Start/Stop/Continue), and facilitation patterns. The 42% introvert stat is cross-confirmed here. Primary source for `guides/05-async-retro.md`.

---

## Open questions for stinger-forge to resolve

1. **Postmortem.io scope:** The Command Brief query mentions "Retro Lab Postmortem.io tools 2026" but no 2026 results surfaced for Postmortem.io as a sprint retrospective tool: it appears to focus on incident postmortems. Should `guides/05-async-retro.md` reference it, or is it out of scope for team-process retros? Check whether the brief intended a different tool (e.g., RetroMat, Retrium, or another "Retro Lab" product).

2. **Async mode gap in mainstream tools:** Neither GoRetro nor EasyRetro have native async modes as of 2026. Parabol has partial async via its standup feature but not a dedicated async retro mode. Should `guides/05-async-retro.md` recommend purpose-built async tools (RetroFlow, Neatro) separately from the mainstream tools, or treat Parabol as the async-capable option?

3. **Format count in `guides/01-formats.md`:** The Command Brief requests at minimum: Start/Stop/Continue, 4Ls, Sailboat, Mad/Sad/Glad, DAKI, Learning Matrix, 5 Whys variant, Hot Air Balloon, Starfish. The research confirms all these exist and are well-documented. stinger-forge should decide whether to cover all 9+ formats with full entries or use a primary/secondary tier system (full entries for the top 6-7, abbreviated entries for the rest).

4. **Edmondson 4-stage model detail:** The Command Brief specifies "Edmondson's four-stage model" for `guides/02-psychological-safety.md`. The research sources cite Edmondson's work extensively but primarily reference the 7-item scale and the general safety concept, not the four-stage model (inclusion safety, learner safety, contributor safety, challenger safety) by name. stinger-forge may need a targeted fetch of Edmondson's "The Fearless Organization" or Timothy Clark's 4-stage elaboration before writing `guides/02-psychological-safety.md`.

5. **Learning Matrix format:** The Command Brief's format list includes "Learning Matrix": this format did not appear in the research sources by name. It may be known under a different name (possibly the "4Ls" or "Team Radar"). stinger-forge should confirm whether Learning Matrix is a distinct format or an alternate name for a covered format before including it in `guides/01-formats.md`.

---

## Contradictions identified

| Sources | Contradiction | Recommendation for stinger-forge |
|---|---|---|
| retroflow psych-safety vs. kollabe psych-safety | retroflow presents anonymous tools as primary safety solution; kollabe argues anonymity doesn't replace trust and can mask culture problems | Present anonymity as a bridge technique for low-trust teams, not a permanent solution; target progression toward attributed feedback |
| formats-comprehensive vs. meetgeek | formats-comprehensive recommends rotating every 3-4 sprints; meetgeek provides a quarterly (sprint-by-sprint) pattern | Both are valid at different cadences; present both in `guides/01-formats.md` with context guidance |
| scrumtool vs. medium agile coach | scrumtool frames action items via 4-component SMART-adjacent structure; medium post frames via 3-question filter | Both are compatible; SMART for planning, 3-question filter for live facilitation gate |

---

## Scope not covered at normal depth (available at deep/extreme)

- Retromat.org format library (300+ activities): only skimmed
- Academic research on retro effectiveness metrics
- Conference talks (Agile Alliance, ScrumGathering 2025-2026)
- Scrum Guide 2020 retrospective section (referenced in Command Brief, not fetched)
- Derby & Larsen "Agile Retrospectives" (referenced in Command Brief, book not fetched)
- Platform-specific tool documentation (Parabol GitHub, EasyRetro help center)
