# Guide 3: content-structure signals (lead length, headings, schema)

These are supporting observations that inform the subjective ICP-relevancy
and non-commodity judgments in guide 2; they are not their own pass/fail
scoring checkpoint, because the underlying research here is thinner
(single-vendor, or carries a real cross-source tension) than the ICP or
reading-level sections. Report them as observations with their sourcing
caveat stated, not as confirmed defects.

## 1. Lead-paragraph length: report both cited ranges, do not pick a winner

Two vendor sources in this archive disagree on the exact target length and
are the same authority tier (neither is official docs or a published
spec): Ranki.io recommends 30-90 words; The AEO Report recommends 40-60
words generally, with per-engine variance it frames as empirically
measured (ChatGPT ~50-60 words, Perplexity ~40-50, Claude ~60-80, Gemini
~40 then truncates). [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

1. Measure the lead paragraph's word count per page.
2. Report it against both ranges in the table (section 3a of the report
   template); do not collapse to a single pass/fail verdict, since neither
   source is more authoritative than the other.
3. Both sources DO agree on shape, independent of exact length: answer the
   question in sentence one, no scene-setting preamble. Check for that
   shape explicitly (a lead that opens with something like "In today's
   rapidly evolving landscape, businesses are exploring..." is the named
   bad-lead pattern; a lead that states the claim and its stakes
   immediately is the named good-lead pattern). [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## 2. Heading structure: single-source stat, treat as plausible not established

Pages with proper H1/H2/H3 nesting had a claimed 34% higher citation rate
in Perplexity than flat-HTML pages using bolded text instead of H2s, per
one vendor's self-reported, uncorroborated 200-page internal test. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

1. Check: exactly one H1, two to five H2s for major sections, H3s nested
   under H2s for subtopics, no skipped levels, no headings used purely for
   visual styling.
2. Report the structural facts (H1 count, H2 count, skipped levels,
   styling-only headings) as observations. Cite the 34% figure only with
   its "single-source, self-reported, not independently corroborated"
   caveat attached; never present it as an established industry figure.

## 3. Schema presence: informational only, mind the Google-vs-AI-engine tension

Report presence/absence of Article/BlogPosting schema, FAQPage schema, and
author byline. Do not score absence of FAQPage schema as a defect against
Google Search specifically: Google's FAQ rich-result feature stopped
appearing in Google Search results as of 2026-05-07, and Google's own
generative-AI guide explicitly tells sites they can skip special schema for
Google's OWN generative AI features. [raw/developers-google-com-search-updates.md] [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]

The AEO checklist sources' claimed AI-citation benefit for FAQPage/
Article/BreadcrumbList/SpeakableSpecification schema describes a DIFFERENT
consumer of the same markup: third-party AI answer engines (Bing,
Perplexity, ChatGPT voice) that parse a page's structured data
independently of Google Search's own rich-result UI. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] [raw/theaeoreport-com-answer-engine-optimization-checklist.md]
Report both facts if schema is absent; do not conflate "no FAQ rich result
in Google Search" with "no AI-citation benefit," they are not the same
claim and this archive does not support treating them as one.

## 4. Populate section 3 of the report template

Write the lead-length, heading-structure, and schema-presence tables into
`references/templates/content-semantics-report-template.md` section 3,
each with its sourcing caveat included, not trimmed for brevity.
