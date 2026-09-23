# Guide 4: report assembly

## 1. Assemble the full report

1. Copy `references/templates/content-semantics-report-template.md` to
   `03-seo/content-semantics.md`.
2. Populate section 1 (quantified reading-level) from guide 1's
   `reading-level.py` run. Populate section 2 (subjective ICP-relevancy)
   from guide 2's rubric-driven scoring. Populate section 3
   (content-structure signals) from guide 3. Keep sections 1 and 2
   strictly separated per PRD-010 AC-2 and conduct rule 3; never let one
   section's numbers or language bleed into the other.
3. Fill section 4 (findings-register rows) last, once sections 1-3 are
   final. Two checkpoints, each 0-6 with evidence pointer and one-line
   justification: reading-level estimate `[quantified]`, and ICP-relevancy
   `[subjective]`. Follow the build plan's zero-to-six scale; this pair's
   checkpoints are graded (1-6 by severity), not boolean, since both
   readability and ICP-fit are matters of degree, not a binary pass/fail.
4. Fill section 5 (rejected/reframed candidates) honestly, per conduct
   rule 4. Example: a page that initially looked off-ICP but turned out to
   be an intentionally narrow landing page for a specific campaign segment
   named in `02-positioning/` should be logged here with that reasoning,
   not silently rescored without a trace.

## 2. Evidence and verification-log discipline

Every artifact this Drone writes (`03-seo/content-semantics.md`, the
`reading-level.py` JSON output if retained) gets appended to
`_shared/evidence-index.md` per the shared-workspace contract, with the
artifact path, what produced it, and when. This Drone does not overwrite an
existing evidence-index row; it appends.

## 3. Do not duplicate icp-positioning-stinger's output

This Stinger applies `02-positioning/`'s ICP and conversion-action
taxonomy to score individual pages; it does not restate or re-derive that
taxonomy. If `02-positioning/` is missing, incomplete, or the run hit the
focus-undeterminable hard gate upstream, that is a dependency gap on
`icp-positioning-wasp-drone`, not something to work around by inventing an
ICP here.
