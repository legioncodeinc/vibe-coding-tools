# Distilled content semantics research

Dense reference distilled from `raw/`. Every claim below cites its source file in brackets. Organized for content-semantics-worker-bee's job: a quantified reading-level estimate per page kept strictly separate from a `[subjective]`-labelled ICP-relevancy score. This archive draws on two research clusters, seo-standards (the same Google changelog and Semrush vendor-blog pair used by technical-seo-stinger) and aeo-and-answer-engines (two AEO checklist blogs), because content semantics sits at the intersection of both. None of the four sources is a readability-formula reference (Flesch-Kincaid or similar); the archive covers content-quality and content-structure signals instead, which is what is distilled below. Treat any specific reading-level scoring methodology as a research gap, not something this archive supports.

Research window: single sweep, 2026-08-18.

## 1. Source authority in this archive

| Source | Type | Cluster |
|---|---|---|
| Google Search Central "What's new" changelog | Official docs (Google) | seo-standards |
| Semrush blog on Google's generative AI search guide | Vendor blog | seo-standards |
| Ranki.io "2026 AEO checklist" | Vendor blog | aeo-and-answer-engines |
| The AEO Report "Answer Engine Optimization Checklist" | Vendor/community blog | aeo-and-answer-engines |

No source in this archive is a primary standard or spec document for content-quality scoring; the highest-authority material is Google's own documentation, the two AEO checklist sources are self-described practitioner heuristics from single vendors, not independently verified industry standards. Where they conflict with each other or with Google's official position, that is called out below rather than resolved by picking a winner. [raw/developers-google-com-search-updates.md] [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md] [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## 2. Google's baseline content-quality bar (applies to both traditional and AI-surfaced content)

Google's position, per its official generative-AI-optimization guide (published 2026-05-15): AI Overviews and AI Mode are not separate systems from core Search, they use retrieval-augmented generation and query fan-out to surface content already in the Search index. A page that is not technically sound and high-quality enough to rank in traditional search will not perform in AI-generated answers either. The guide's notable new sections stress the importance of non-commodity content, meaning content with distinct value beyond restating widely available information. Google's spam policies apply equally to generative AI responses as to traditional results. [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]

This is the ICP-relevancy-adjacent baseline: a page can be well-written and readable and still fail the "non-commodity" bar if it merely restates commodity information available elsewhere, which is a content-quality judgment distinct from a mechanical reading-level score. [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]

## 3. Definitional lead paragraph length: sources disagree

| Source | Recommended lead length | Reasoning given | Source type |
|---|---|---|---|
| Ranki.io | 30 to 90 words, directly answers the page topic in plain English | Listed as AEO signal #3 of 15, in the "content-shape" tier | Vendor blog |
| The AEO Report | 40 to 60 words as a general target, with per-engine variance: ChatGPT extracts the first 50 to 60 words, Perplexity 40 to 50, Claude 60 to 80, Gemini the first 40 (then truncates mid-sentence if grammar does not break cleanly) | Framed as empirical, "measured citation snippet length per engine using exact character counts from citation card HTML," tested across 300 client pages March to May 2026 | Vendor/community blog |

Both sources are the same authority tier (vendor/community blog, neither is official docs or a published spec), so neither reading is objectively more authoritative. The AEO Report's number is narrower and claims a specific empirical methodology (300-page test); Ranki.io's range is wider and framed as a heuristic from "a year of running real-page scans." For an audit, the AEO Report's per-engine breakdown is more actionable if the target audience for a given page is a specific engine, otherwise Ranki.io's broader 30-90 word range is the safer general check. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

Both sources agree on the shape of a good lead: answer the question in sentence one, no scene-setting preamble. The AEO Report gives a concrete bad-lead example ("In today's rapidly evolving AI landscape, businesses are exploring...") versus a good-lead example that states the claim and its stakes immediately. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## 4. Heading structure as a semantic signal

The AEO Report reports semantic H1/H2/H3 heading structure correlates with citation rate: pages with proper heading nesting had a 34% higher citation rate in Perplexity than flat-HTML pages using bolded text instead of H2s, in an internal test across 200 client pages, May 2026. This is a single-source, self-reported statistic with no independent corroboration in this archive; treat it as a plausible but unverified data point, not an established figure. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

Per-engine heading behavior, per the same source: Perplexity renders H2 text in citation preview cards, Claude extracts H2s as section anchors for long-form answers, ChatGPT and Gemini do not visibly show headings in citations but use them for content segmentation during parsing. Rule stated: exactly one H1, two to five H2s for major sections, H3s nested under H2s for subtopics, no skipped levels, no headings used purely for visual styling. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

Ranki.io independently lists "answer-style H2/H3 headings, phrased as the literal question a user would type" as AEO signal #7 of 15, in the content-shape tier, one tier below schema. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md]

## 5. Schema as a semantic-structure signal, and a live tension with Google's own current stance

Ranki.io ranks FAQPage JSON-LD as the single highest-impact signal across all 15 it tracks, and Article/BlogPosting schema second: 5-8 real question/answer pairs in 40-100 words each, phrased to match literal user query wording rather than paraphrased. Its stated reasoning: Google deprecated FAQ rich snippets in 2023, most SEOs dropped FAQPage schema as a result, but AI engines kept parsing it, creating a signal-asymmetry advantage for sites that kept shipping it. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md]

This sits in tension with a fact from this Stinger's own seo-standards cluster: Google's official changelog confirms the FAQ rich result feature itself stopped appearing in Google Search results as of 2026-05-07 (documentation removed accordingly). [raw/developers-google-com-search-updates.md] The two facts are not strictly contradictory, they describe different consumers of the same schema (Google Search's own rich-result UI versus third-party AI answer engines that parse the page's structured data independently), but a content-semantics audit should not conflate them: a site can correctly show zero FAQ rich results in Google Search while FAQPage schema still carries a claimed AI-citation benefit per the AEO checklist sources. Google's own generative-AI guide, notably, tells sites they can skip "special schema" for its OWN generative AI features. [raw/developers-google-com-search-updates.md] [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md] [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md]

The AEO Report corroborates schema's relevance to AI answer engines but with different named schemas and receipts: Bing Webmaster Tools documentation (the only search engine, per this source, that explicitly publishes what it parses for AI answers) states Bing extracts Organization, Article, FAQPage, BreadcrumbList, and SpeakableSpecification schema for citation cards; Perplexity's citation cards visibly render Article schema's headline, author, and datePublished fields; ChatGPT voice responses reportedly favor pages with SpeakableSpecification blocks. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

Minimum schema set per The AEO Report: Organization (site level), Article (every content page, with author, publish date, image), BreadcrumbList (site hierarchy), SpeakableSpecification (if targeting ChatGPT voice selection), FAQPage (when a post answers three or more explicit questions). [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## 6. Mythbusting relevant to content-semantics scope, per Google (Google-ecosystem only)

Google's guide explicitly tells sites to skip, for Google Search and its generative AI features specifically: content chunking (pre-fragmenting an article into small pieces for AI systems, unnecessary because Google's systems parse multi-topic pages and extract relevant passages directly); AI-specific rewriting to capture long-tail keyword variants (unnecessary because AI features understand synonyms and general meaning); special schema or Markdown versions of a page (not required for inclusion). [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]

Google's guide explicitly disclaims its own scope: "this guide applies only to the Google ecosystem... ChatGPT, Claude, and other AI engines may play by different rules." [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md] This is the load-bearing caveat for reconciling section 5 above: the AEO checklist sources are describing multi-engine behavior (ChatGPT, Perplexity, Claude, Gemini) that Google's own mythbusting guidance does not claim to cover or contradict.

## 7. Author byline as a semantic-authority signal

Ranki.io lists an author byline (author microdata or `rel="author"`) as AEO signal #6 of 15. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] The AEO Report treats author as a required field within Article schema itself rather than a standalone signal. [raw/theaeoreport-com-answer-engine-optimization-checklist.md] Both agree author attribution is expected; they differ on whether it is a discrete checklist item or a schema sub-field, which is a framing difference, not a factual disagreement.

## 8. Research gaps

No source in this archive provides a reading-level formula, grade-level target, or sentence/syllable-complexity methodology; a quantified reading-level estimate for a crawled page cannot be sourced from this archive and needs a dedicated readability-literature fetch. No source provides an ICP-definition methodology either, "non-commodity content" (section 2) is the only content-quality-relevance concept this archive actually supports, and it is Google's term for Google's own systems, not a general ICP-relevancy framework. [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]
