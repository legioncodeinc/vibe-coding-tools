Deterministic scripts for this audit domain live in the shared
`shared/scripts/` folder at the plugin root by default; see that folder's
README for the full centrally shared script list. None of the eleven
scripts listed there cover readability scoring, so this pair carries one
script of its own:

| Script | Purpose |
|---|---|
| `reading-level.py` | Computes Flesch Reading Ease and Flesch-Kincaid Grade Level, plus the word/sentence/syllable-count inputs, per page from `site-data/*.md`. Satisfies PRD-010 AC-1's "quantified reading-level estimate... with the formula and inputs shown." **Read the script's own docstring before citing its output**: the formula choice itself is NOT sourced from this Stinger's research archive (that archive explicitly has no readability-formula coverage, see `references/research/distilled-content-semantics.md` section 8), it is a well-established public-domain formula applied as this Stinger's own judgment call. |

Run it once per audit, after `site-crawler-wasp-drone` has finished
writing `site-data/`, before authoring the quantified section of
`03-seo/content-semantics.md` from
`references/templates/content-semantics-report-template.md`. See
`guides/01-reading-level-scoring.md` for the full procedure this script
fits into.
