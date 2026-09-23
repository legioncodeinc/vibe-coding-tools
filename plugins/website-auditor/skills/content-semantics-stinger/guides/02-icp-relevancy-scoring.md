# Guide 2: subjective ICP-relevancy scoring

Covers PRD-010 AC-2: every page gets a `[subjective]` ICP-relevancy score
against `02-positioning/`'s ICP, kept in a clearly separate section from
the reading-level numbers (guide 1). Do not let this section's judgment
bleed into section 1's numbers, and do not let section 1's numbers bleed
into this section's judgment: a page can be effortlessly readable and
completely off-ICP, or dense and jargon-heavy yet exactly on-ICP for a
technical buyer persona. They are independent findings.

## 1. Read `02-positioning/` first, do not re-derive its taxonomy

`icp-positioning-stinger` owns the niche/ICP/conversion-action taxonomy
work (per PRD-010's binding scope: "this Drone is the subjective-copy-quality
specialist," positioning is not this Drone's job). Read `02-positioning/`'s
output for this run and use its firmographic/technographic/behavioral
attributes, its macro/micro conversion-action taxonomy, and its
awareness/consideration/decision funnel-stage model as the vocabulary and
criteria for this section. Do not invent a parallel ICP framework here.

## 2. Apply the ICP-relevancy rubric

1. Use `references/templates/icp-relevancy-scoring-rubric-template.md` for
   the 1-6 scale definition specific to this checkpoint. It bridges the
   build plan's universal zero-to-six scale to ICP-relevancy specifically;
   this rubric is this Stinger's own construction (no source in this
   archive defines an ICP-relevancy scoring methodology, per distilled
   section 8's explicit gap note), built to apply, not replace,
   `icp-positioning-stinger`'s grounded taxonomy.
2. For every page, name the specific `02-positioning/` attribute or funnel
   stage the page maps to (or fails to map to). "Seems relevant" is not a
   justification; cite the attribute by name.
3. Score honestly toward the low end when a page is generically on-topic
   but not clearly aimed at the specific ICP `02-positioning/` names. The
   rubric's grade 3 exists specifically for that "relevant to anyone
   interested" case, do not round it up to a 4 or 5 out of generosity.

## 3. Apply the non-commodity content check

Google's own stated content-quality bar applies to both traditional and
AI-surfaced content: a page not technically sound and high-quality enough
to rank in traditional search will not perform in AI-generated answers
either, and the bar stresses non-commodity content specifically, meaning
content with distinct value beyond restating widely available information. [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]

1. For every page, judge whether it clears this bar: does it offer
   something a reader could not get from any competitor's page on the same
   topic, or does it restate commodity information available elsewhere?
2. This is a genuinely subjective call and should be labeled `[subjective]`
   like the rest of this section. It is distinct from the reading-level
   score: a page can be perfectly readable and still be commodity content.
3. Feed this into the ICP-relevancy rubric's grade-6 requirement (rubric
   template: grade 6 requires clearing the non-commodity bar in addition
   to a clear ICP/funnel-stage mapping), but report it in its own row too,
   since a page can fail the non-commodity check while still being
   correctly ICP-targeted (e.g. an on-ICP page that is nonetheless a
   thin rewrite of a competitor's page).

## 4. Populate section 2 of the report template

Write the per-page ICP-relevancy table and the non-commodity-content table
into `references/templates/content-semantics-report-template.md` section
2, both labeled `[subjective]`, both with evidence pointers into
`site-data/` and the specific `02-positioning/` file cited.
