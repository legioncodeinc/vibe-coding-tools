---
description: Refresh one Stinger's research archive on the six-month window by re-running the forge pipeline's Research and Distillation stages, then flag which guides now rest on claims the refreshed research contradicts or no longer supports. Trigger with "re-research the payments stinger", "refresh research for X-stinger", "is Y-stinger's research stale", "update the research archive for Z", "the six-month window is up on this stinger".
argument-hint: [stinger-name]
---

# /re-research - Stinger Research Refresh

Research goes stale even when the skill built on it keeps working fine. This command does not touch what the Stinger tells a Bee to do; it only checks whether the evidence underneath is still true, and says so out loud when it no longer is.

## Mandatory process

1. Load `.cursor/skills/beekeeper-suit/SKILL.md` (the roster) and consult it before any routing decision. This is the first step, always, no exceptions. Confirm `$1`/`$ARGUMENTS` names a real, registered Stinger; if it does not, stop and ask which one the user means.
2. Load `.cursor/skills/queen-bee-stinger/SKILL.md` in full. This command re-runs two of its seven stages against an existing component; it does not invent a separate procedure for refreshes.
3. Confirm the target Stinger already has a research archive on disk at `.cursor/skills/<stinger-name>/references/research/`. A Stinger with nothing there has never been through stage 1 and 2; send the user to `/forge` instead. This command refreshes research, it does not originate it.
4. **Re-run Research (stage 2).** Sweep current primary sources for the Stinger's domain, scoped to the 6 months before today, official docs outranking vendor blogs outranking community posts. Archive every new source as its own file under `references/research/raw/`, headed with URL, fetch date, and source type, matching the header format the existing archive already uses. Leave prior raw files in place; this pass adds and marks outdated sources, it does not delete anything. Artifact: the updated raw archive.
5. **Re-run Distillation (stage 3).** Re-ingest the full raw archive fresh, including everything just added, and rewrite the distilled article in `references/research/`: dense, cited to raw files, conflicts stated as conflicts, thin coverage stated as thin coverage. Where a new source replaces an old one, say so and cite both. Artifact: the rewritten distillation.
6. **Check the guides against the refreshed distillation.** Read every file under the Stinger's `guides/` folder and every factual claim in its root `SKILL.md`, and compare each against the new distillation. Flag any claim the refreshed research contradicts outright, and any claim the refreshed research simply no longer supports because the citation it once rested on is gone or superseded.
7. Do not rewrite the guides or the skill file yourself. Report the flagged claims instead: which file, which claim, and why the research underneath it moved.
8. Report back: how many new raw sources were archived, what changed in the distillation, and the full flagged-claims list from step 6 for the user, or a follow-up forge pass, to act on.

## Arguments

`$1` (or `$ARGUMENTS`) is the target Stinger's name, for example `payments-stinger`. This argument is required; the command has no default target.

## Ship Gate

Ship Gate does not apply: this command is research-only and produces no code. It only refreshes a research archive and reports a flagged-claims list for a human or a later pass to act on.
