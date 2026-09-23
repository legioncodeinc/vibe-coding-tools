# 04. Structured data for citation

Grounded in `references/research/distilled-aeo-audit.md` Section 4. Unlike guides 02-03, this checkpoint has no dedicated script - it reads JSON-LD out of `site-data/*.html`, the same read-only crawl output every Wave-5 Drone shares, and there is no live-fetch shortcut for it. Use `references/templates/schema-signals-checklist.md` to work it.

## The six schema signals this archive documents

| Schema | Why it matters here | Source |
|---|---|---|
| FAQPage | Ranki.io's #1-ranked signal overall: 5-8 real Q/A pairs, 40-100 words per answer, phrased to match literal user query wording, not paraphrased | [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Article / BlogPosting | Ranki.io's #2-ranked signal: headline, author, datePublished, articleBody fields explicit, so extractors do not have to infer boundaries from cluttered DOM | [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Organization | Site-level publisher name, logo, social links; part of The AEO Report's minimum schema set | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| BreadcrumbList | Site-hierarchy context; one of the schema types Bing's documentation states it extracts for AI-answer citation cards | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| SpeakableSpecification | Marks 2-3 key paragraphs; ChatGPT voice responses reportedly favor pages that have it | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| Any JSON-LD present | Ranki.io signal #9 of 15: general structured-data readiness even without a specific AEO-tier type | [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |

## Why FAQPage ranks first for one source

Google deprecated FAQ rich snippets in 2023 and most SEOs dropped the schema as a result, but AI engines kept parsing it, producing a signal-asymmetry advantage - "less competition for the citation slot than they used to," in Ranki.io's own framing. Note the tension with technical-seo-stinger's own archive: that Stinger's distillation (Section 8) explicitly says NOT to score a page down for lacking FAQ rich-result eligibility markup, since that specific Google feature was removed. The two are not contradictory: FAQ rich-result eligibility (a Google-Search-results-page feature) and FAQPage schema's role in AI-answer-engine citation (this Stinger's concern) are genuinely different mechanisms with different current relevance, even though they use the same underlying schema type. Say so explicitly if a report ever needs to reconcile the two Stingers' findings on the same page. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md]

## Receipts behind the Bing/Perplexity/ChatGPT claims

Bing Webmaster Tools' "Schema Markup for AI Answers" guide (updated February 2026) states Bing extracts Organization, Article, FAQPage, BreadcrumbList, and SpeakableSpecification when building citation cards - the only major search engine in this archive that explicitly publishes what it parses for AI-generated answers. Perplexity's citation cards were observed (HTML inspection, May 2026) to visibly render Article schema's headline/author/datePublished fields. An internal ChatGPT voice-response A/B test (April 2026) found voice responses favor SpeakableSpecification-marked pages. These are the source's own cited receipts; this Stinger has not independently re-verified them, and neither should a report imply first-hand verification it didn't do. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## Extraction note

Extracting and parsing JSON-LD from `site-data/*.html` is a straightforward `<script type="application/ld+json">` scan; this Stinger does not ship a dedicated extraction script for it because the parsing itself is trivial and the judgment (does this FAQPage entry contain real Q/A content vs. boilerplate, does the Article schema's author field point at a real byline) is exactly the kind of read a script's severity_hint would either oversimplify or get wrong. Do the extraction inline while working the checklist, cite the exact `site-data/` file and JSON-LD block in the evidence column.
