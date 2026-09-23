# Guide 1: quantified reading-level scoring

Applies to: `content-semantics-wasp-drone`, wave W5, reading `site-data/`
and `02-positioning/` read-only. This guide covers PRD-010 AC-1: "every
page gets a quantified reading-level score with the formula and inputs
shown."

## 1. Honest grounding, state it every time this section runs

This Stinger's research archive draws on two clusters (seo-standards and
aeo-and-answer-engines) and neither addresses readability formulas.
`references/research/distilled-content-semantics.md` section 8 says so
directly: "No source in this archive provides a reading-level formula,
grade-level target, or sentence/syllable-complexity methodology." The
Flesch Reading Ease and Flesch-Kincaid Grade Level formulas this pair uses
are therefore this Stinger's own judgment call (a well-established
public-domain formula applied because it satisfies AC-1's "formula and
inputs shown" requirement), not a claim traced to
`references/research/raw/`. State this plainly in the report's section 1
header rather than presenting the formula as archive-grounded; do not
fabricate a citation for it.

## 2. Run the script

1. Confirm `site-data/` exists and contains `<slug>.md` files.
2. Run `references/scripts/reading-level.py --site-data <path> --out
   reading-level.json`. This is the one deterministic step in this
   sub-check; do not hand-count words, sentences, or syllables, the script
   exists so this number is reproducible (conduct rule 2), and manual
   syllable counting is genuinely error-prone at scale.
3. The script strips Markdown link/emphasis/heading syntax before counting
   so the score reflects prose, not markup characters. Spot-check one or
   two pages against the raw `.md` file if a score looks implausible
   (e.g. a page that is mostly a bulleted list or a data table will
   legitimately score oddly on a sentence-based formula; note that as a
   caveat in the report rather than treating the number as wrong).
4. The syllable-counting heuristic is a vowel-group approximation, not a
   dictionary lookup. It will misjudge some words (irregular
   pluralizations, compound or unusual proper nouns, loanwords). Treat
   per-page scores as directional and reproducible run-to-run, not as
   precisely authoritative to the decimal point.

## 3. Populate section 1 of the report template

1. Copy the script's per-page output (word count, sentence count, syllable
   count, words/sentence, syllables/word, Flesch Reading Ease,
   Flesch-Kincaid Grade) directly into
   `references/templates/content-semantics-report-template.md` section 1.
   This is a mechanical copy, not another judgment pass; do not
   re-interpret the numbers.
2. Report the aggregate (pages scored, pages with no extractable prose,
   average grade) from the script's own aggregate block.
3. Keep this section strictly quantified. Nothing here gets a
   `[subjective]` label, and no ICP-relevancy judgment belongs in this
   section, per conduct rule 3 and PRD-010 AC-2's explicit separation
   requirement. That separation is enforced in guide 2.
