# Structured-data / schema signals checklist (AEO citation-readiness)

Grounded in `references/research/distilled-aeo-audit.md` Section 4. This checklist works against `site-data/*.html` (JSON-LD blocks in the crawled page), read-only, no live fetch - unlike the llms.txt and AI-crawler checks, this is not a singleton site-root file, so it is squarely inside the standard "read only from site-data/" contract.

```markdown
## Schema signals - <page path>

| Schema type | Purpose (this archive) | Present? | Evidence (site-data/ path + extracted JSON-LD snippet) | Source |
|---|---|---|---|---|
| FAQPage | Ranki.io's #1-ranked signal overall: 5-8 real Q/A pairs, 40-100 words per answer, phrased to match literal user query wording | | | [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Article / BlogPosting | Ranki.io's #2-ranked signal: headline, author, datePublished, articleBody fields explicit, so extractors do not have to infer boundaries from cluttered DOM | | | [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Organization | Site-level publisher name, logo, social links; part of The AEO Report's minimum schema set | | | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| BreadcrumbList | Site-hierarchy context; one of the schema types Bing's documentation states it extracts for AI-answer citation cards | | | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| SpeakableSpecification | Marks 2-3 key paragraphs; ChatGPT voice responses reportedly favor pages that have it | | | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| Any JSON-LD present (fallback signal) | Ranki.io signal #9 of 15: general structured-data readiness even without a specific AEO-tier type | | | [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
```

## Why FAQPage is weighted highest by one source

Ranki.io's stated reasoning: Google deprecated FAQ rich snippets in 2023, most SEOs dropped the schema as a result, but AI engines kept parsing it - a signal-asymmetry advantage, "less competition for the citation slot than they used to." This is one vendor's framing, not independently corroborated in this archive; present the FAQPage-schema presence/absence as fact, and the "why it matters more now" framing as attributed opinion. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md]

## Receipts behind The AEO Report's schema claims (cited third-party evidence, not first-hand verification by this Stinger)

Bing Webmaster Tools' "Schema Markup for AI Answers" guide (updated February 2026) states Bing extracts Organization, Article, FAQPage, BreadcrumbList, and SpeakableSpecification when building citation cards - called out in this archive as the only major search engine that explicitly publishes what it parses for AI-generated answers. Perplexity's citation cards were observed (HTML inspection, May 2026) to visibly render Article schema's headline/author/datePublished fields. An internal ChatGPT voice-response A/B test (April 2026) found voice responses favor SpeakableSpecification-marked pages. Treat these as the source's own cited receipts, not this Stinger's independent verification. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## Boundary with technical-seo-stinger

Do not re-score general structured-data validity (Product/Offer/Review schema per Google's Search Central changelog) here - that is technical-seo-stinger's Section 8 coverage in its own distillation. This checklist is scoped to the specific schema types this archive documents as mattering for AI-answer citation, a narrower and partially overlapping set.
