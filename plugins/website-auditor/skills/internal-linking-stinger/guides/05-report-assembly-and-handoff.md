# Guide 5: report assembly and handoff to technical-seo-wasp-drone

## 1. Assemble the full report

1. Copy `references/templates/internal-linking-report-template.md` to
   `03-seo/internal-linking.md`.
2. Populate every section using the findings produced by guides 1 through
   4, each already tied to `link-graph.py`'s JSON output field for field.
   Do not hand-recompute a number the script already produced; if a number
   looks wrong, fix the script's inputs (site-data completeness,
   entry-point set, url-map) and re-run it, rather than overriding its
   output by hand without a re-run.
3. Fill section 8 (findings-register rows) last, once every prior section
   is final, so the 0-6 scores reflect the complete picture. Follow the
   build plan's zero-to-six scale: boolean-shaped checkpoints (e.g. "are
   there any confirmed orphans") resolve only to 6 or 1, nothing between;
   graded checkpoints (e.g. anchor-text quality composite) can land
   anywhere 1 through 6 based on severity. Every score needs its evidence
   pointer and one-line justification, per conduct rule 2. A leaf scored
   without both is not done; do not submit it to
   `audit-scoring-wasp-drone` incomplete.
4. Fill section 9 (rejected/reframed candidates) honestly. If a candidate
   orphan turned out to be an intentional redirect target, or an apparent
   anchor cannibalization turned out to be two genuinely distinct pages
   that happen to share a phrase, log it there with the reason, per
   conduct rule 4. Do not just delete the candidate silently.

## 2. Produce the deep-linking handoff summary

Per PRD-011's non-goal ("does not duplicate the full graph analysis" for
`technical-seo-wasp-drone`'s deep-linking sub-check) and this pair's Goals
("feeds a summary back for prd-008's deep-linking sub-check"):

1. Copy `references/templates/deep-linking-handoff-summary-template.md`
   and populate it from the same `link-graph.py` run's output.
2. Place it where `technical-seo-wasp-drone` can find it without
   re-deriving the graph: at the top of `03-seo/internal-linking.md` (this
   Drone's own output file, which `technical-seo-wasp-drone` reads per the
   shared workspace's write-once/read-many rule) is the default choice
   unless the run ledger specifies a different shared handoff location.
3. Do not paste the full per-page tables into the handoff summary. It
   exists specifically to prevent `technical-seo-wasp-drone` from having to
   read and re-derive the entire graph; a summary that duplicates the full
   report defeats that purpose.

## 3. Evidence and verification-log discipline

Every artifact this Drone writes (the report, the handoff summary, the
`link-graph.py` JSON output if retained) gets appended to
`_shared/evidence-index.md` per the shared-workspace contract, with the
artifact path, what produced it, and when. This Drone does not overwrite an
existing evidence-index row; it appends.
