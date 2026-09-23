# Content semantics report template

Copy this into `03-seo/content-semantics.md` for the run and fill in every
`{placeholder}`. Section order and headings are fixed so
`audit-scoring-wasp-drone` can find each checkpoint by heading text, and so
the quantified reading-level section (AC-1) and the `[subjective]`
ICP-relevancy section (AC-2) stay in clearly separate sections, per PRD-010
and conduct rule 3. Never let a subjective ICP-relevancy read bleed into
the quantified reading-level numbers; they are reported and scored
separately.

---

# Content Semantics

**Run:** {engagement_ref}
**Pages analyzed:** {page_count} (from `site-data/`)
**Generated:** {run_timestamp_iso8601}

## 1. Reading-level estimate `[quantified]`

Computed via `references/scripts/reading-level.py` using the Flesch
Reading Ease and Flesch-Kincaid Grade Level formulas. **Formula and inputs
grounding note, state this every time this section is used:** this
Stinger's own research archive has no readability-formula coverage
(`references/research/distilled-content-semantics.md` section 8); the
formula choice is this Stinger's own judgment call using a well-established
public-domain formula, not a claim sourced from `references/research/raw/`.
Say so plainly in the report rather than presenting the formula as
archive-grounded.

| Slug | Word count | Sentence count | Syllable count | Words/sentence | Syllables/word | Flesch Reading Ease | Flesch-Kincaid Grade | Evidence |
|---|---|---|---|---|---|---|---|---|
| {slug} | {n} | {n} | {n} | {n} | {n} | {score} | {grade} | `site-data/{slug}.md` |

**Aggregate:** {pages_scored} pages scored, {pages_with_no_prose} pages
with no extractable prose, average Flesch-Kincaid grade {avg_grade}.

## 2. ICP-relevancy score `[subjective]`

Kept in this clearly separate section per PRD-010 AC-2 and conduct rule 3.
Scored against the ICP defined in `02-positioning/` (this Stinger does not
duplicate `icp-positioning-stinger`'s taxonomy; it applies that taxonomy's
output). Cite the specific ICP attribute or conversion-action-taxonomy
element a page does or does not serve, do not just assert a number.

| Slug | ICP-relevancy score (1-6) | Which ICP attribute(s) this page serves or misses | Reasoning `[subjective]` | Evidence |
|---|---|---|---|---|
| {slug} | {1-6} | {firmographic/technographic/behavioral attribute, or funnel stage, from 02-positioning/} | {one to two sentences} | `site-data/{slug}.md`, `02-positioning/{relevant-file}` |

**Non-commodity content check** (per Google's own stated bar, applies to
both traditional and AI-surfaced content): a page can be well-written and
readable and still fail this bar if it merely restates commodity
information available elsewhere, which is distinct from the mechanical
reading-level score above. [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]

| Slug | Non-commodity? `[subjective]` | Reasoning |
|---|---|---|
| {slug} | {yes/no/partial} | {what distinct value the page does or does not offer beyond restating widely available information} |

## 3. Content-structure signals

Supporting signals that inform the subjective ICP-relevancy call above;
report these as observations, not as their own pass/fail score, since the
underlying research is single-source or has an internal tension flagged
below.

### 3a. Lead-paragraph length

Two vendor sources in this archive disagree on the exact target and are
treated as equal-authority tier; report the observed length and let the
reader judge against both ranges rather than picking a winner. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

| Slug | Lead-paragraph word count | Within 30-90 words (Ranki.io)? | Within 40-60 words (AEO Report general target)? | Answers the topic in sentence one? |
|---|---|---|---|---|
| {slug} | {n} | {yes/no} | {yes/no} | {yes/no} |

### 3b. Heading structure

Single-source finding (self-reported, no independent corroboration in this
archive): pages with proper H1/H2/H3 nesting had a 34% higher citation rate
in Perplexity than flat-HTML pages using bolded text instead of H2s, per
one vendor's internal 200-page test. Treat as plausible but unverified,
not an established figure. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

| Slug | Exactly one H1? | H2 count (target 2-5) | Skipped heading levels? | Headings used only for visual styling? |
|---|---|---|---|---|
| {slug} | {yes/no} | {n} | {yes/no} | {yes/no} |

### 3c. Schema presence (informational only, do not score against Google's own rich-result UI)

Report presence/absence only. Do not treat absence of FAQ rich-result
eligibility as a defect: Google's FAQ rich-result feature stopped
appearing in Google Search as of 2026-05-07, and Google's own generative-AI
guide tells sites they can skip special schema for Google's OWN generative
AI features. The AI-answer-engine citation benefit claimed by the AEO
checklist sources is a claim about third-party engines parsing schema
independently, a different consumer of the same markup; do not conflate
the two. [raw/developers-google-com-search-updates.md] [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md] [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md]

| Slug | Article/BlogPosting schema? | FAQPage schema? | Author byline (microdata or `rel="author"`)? |
|---|---|---|---|
| {slug} | {yes/no} | {yes/no} | {yes/no} |

## 4. Findings register rows (for `scoring/findings-register.csv`)

| Checkpoint | Score | Evidence | Justification |
|---|---|---|---|
| Reading-level estimate `[quantified]` | {0-6} | section 1 above | {one line} |
| ICP-relevancy `[subjective]` | {0-6} | section 2 above | {one line} |

## 5. Rejected or reframed candidates

Per conduct rule 4, any candidate finding that failed verification is
logged here with the reason, not silently dropped.

| Candidate | Reason rejected/reframed |
|---|---|
| {finding} | {reason} |
