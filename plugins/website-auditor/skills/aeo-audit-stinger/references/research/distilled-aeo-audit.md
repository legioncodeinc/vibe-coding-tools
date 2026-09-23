# Distilled AEO audit research

Dense reference distilled from `raw/`. Every claim below cites its source file in brackets. Organized for aeo-audit-worker-bee's job: an objective llms.txt/AI-crawler-access technical-standards check kept in a clearly separate section from a subjective topical-alignment read. Coverage is thin: only two raw sources exist for this Stinger, and both are practitioner/vendor blogs, not an official standard or spec document. There is no primary-source llms.txt specification or an official AI-crawler-access standard in this archive, both sources are self-described heuristics from single vendors built on their own testing, so treat weightings and rankings below as one practitioner's read, not an industry-agreed standard.

Research window: single sweep, 2026-08-18.

## 1. Source authority in this archive

| Source | Type | Stated methodology |
|---|---|---|
| Ranki.io "2026 AEO checklist" | Vendor blog | Author's own year of running real-page scans against pages known to be cited or not cited by ChatGPT, Perplexity, Claude, Gemini, and Google AI Overviews; self-described as heuristic, "so you can verify the scan output against your own DOM" |
| The AEO Report "Answer Engine Optimization Checklist" | Vendor/community blog | Explicitly positions itself against "receipt-free" checklists, tags each item by which engines observably parse it versus untested hypothesis, cites named receipts (vendor docs, an internal 200-to-300-page test) for most claims |

Neither source is official docs or a published spec. The AEO Report's receipts-first framing makes its individual claims more traceable (each has a named source: a vendor's own documentation, or a dated internal test), so where the two sources give different numbers for the same signal, The AEO Report's claim is treated as the more evidence-labeled reading below, not as objectively more authoritative, since both remain vendor/community-tier sources. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## 2. TECHNICAL: llms.txt standard

| Attribute | Detail | Source |
|---|---|---|
| Location | Must be at site root, `https://yourdomain.com/llms.txt`, not a subdirectory, not a meta tag; engines that do not find it at root do not look elsewhere | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| Minimum content | Site name, one-line description, primary content sections with URLs, optional agent-specific directives for blocking certain crawlers | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| Length | No specified character limit, but most engines reportedly truncate after roughly 2,000 characters on initial parse, so front-load the critical lines | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| Formal audit status | As of May 2026, Google Lighthouse formally audits llms.txt under its "Agentic Browsing" category; sites without llms.txt fail that Lighthouse audit category outright | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| Ranki.io's independent ranking | Lists llms.txt at site root as AEO signal #4 of 15 overall, in its "crawl tier" (third of four tiers by impact), below the schema tier and content-shape tier | [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |

Both sources agree llms.txt is a real, checkable technical signal; they differ on relative weight, The AEO Report frames it as "the non-negotiable starting point" of its entire checklist (Pillar 1: Foundation), while Ranki.io ranks it fourth of fifteen signals, behind two schema signals and a content-shape signal. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## 3. TECHNICAL: AI-crawler robots.txt access

| Engine | User-agent to check | Source |
|---|---|---|
| ChatGPT | GPTBot (also ChatGPT-User) | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Perplexity | PerplexityBot | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Claude | ClaudeBot | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Gemini | Googlebot (same user-agent as Google Search; blocking Googlebot blocks Gemini by default) | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| Google AI features generally | Google-Extended | [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Cohere | Cohere-AI | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |

The AEO Report's specific guidance: most sites should allow all four major agents; blocking GPTBot while allowing CCBot (Common Crawl) lets ChatGPT train on the content while blocking it from citing that content in answers, described as "the worst of both worlds"; a wildcard `Allow: /` works, but naming each agent explicitly in llms.txt gives finer control over crawl depth and frequency. Receipts cited: OpenAI's GPTBot documentation (updated March 2026), Perplexity's webmaster guidelines (January 2026), Anthropic's ClaudeBot spec (April 2026). [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

Ranki.io independently lists "AI-bot robots.txt access for GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Cohere-AI" as signal #5 of 15, immediately below llms.txt in its ranking, both in the crawl tier. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md]

## 4. TECHNICAL: structured-data / schema signals

| Schema | Purpose per this archive | Source |
|---|---|---|
| FAQPage | Ranki.io's #1-ranked signal overall: 5-8 real Q/A pairs, 40-100 words per answer, phrased to match literal user query wording, not paraphrased | [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Article / BlogPosting | Ranki.io's #2-ranked signal: provides headline, author, datePublished, and articleBody fields explicitly so extractors do not have to infer article boundaries from cluttered DOM (sidebars, related-content grids, ad units) | [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Organization | Site-level: publisher name, logo, social links; part of The AEO Report's minimum schema set | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| BreadcrumbList | Site-hierarchy context; part of The AEO Report's minimum schema set; also one of the schema types Bing's documentation states it extracts for AI-answer citation cards | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| SpeakableSpecification | Marks 2-3 key paragraphs; ChatGPT voice responses reportedly favor pages that have it over pages that do not | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| Any JSON-LD present | Ranki.io signal #9 of 15: even non-FAQ/non-Article JSON-LD signals general structured-data readiness | [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |

The AEO Report's specific receipts for schema mattering to AI answer engines: Bing Webmaster Tools' "Schema Markup for AI Answers" guide (updated February 2026) states Bing extracts Organization, Article, FAQPage, BreadcrumbList, and SpeakableSpecification when building citation cards, this is called out as the only major search engine that explicitly publishes what it parses for AI-generated answers; Perplexity's citation cards were observed (HTML inspection, May 2026) to visibly render Article schema's headline, author, and datePublished fields; an internal ChatGPT voice-response A/B test (April 2026) found voice responses favor SpeakableSpecification-marked pages. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

Ranki.io's framing for why FAQPage ranks first: Google deprecated FAQ rich snippets in 2023, most SEOs dropped the schema as a result, but AI engines kept parsing it, producing a signal-asymmetry advantage, "less competition for the citation slot than they used to." [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md]

## 5. SUBJECTIVE: topical-alignment and content-shape signals

These are content-shape judgments, not binary technical pass/fail checks, and should stay in this Stinger's subjective section, separate from sections 2 through 4 above.

- Definitional first paragraph: Ranki.io recommends 30-90 words directly answering the page topic in plain English (signal #3 of 15, content-shape tier). The AEO Report gives a narrower general target of 40-60 words, with stated per-engine variance from a 300-page internal test (March to May 2026): ChatGPT extracts the first 50-60 words as its default citation snippet, Perplexity 40-50, Claude 60-80, Gemini the first 40 (then truncates mid-sentence if grammar does not break cleanly). Both are vendor/community-tier, present both ranges rather than picking one as definitive; The AEO Report's per-engine breakdown is more actionable when auditing for a specific engine's likely citation behavior. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] [raw/theaeoreport-com-answer-engine-optimization-checklist.md]
- Answer-style H2/H3 headings: Ranki.io signal #7 of 15, phrased as the literal question a user would type. The AEO Report reports a specific citation-rate lift for semantic heading structure, 34% higher citation rate in Perplexity for pages with proper H2/H3 nesting versus flat-HTML bolded-text pages, from an internal 200-page test, May 2026, a single-source, self-reported statistic with no independent corroboration in this archive. Per-engine display behavior: Perplexity renders H2 text in citation preview cards, Claude extracts H2s as section anchors, ChatGPT and Gemini do not visibly show headings in citations but use them for parsing segmentation. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] [raw/theaeoreport-com-answer-engine-optimization-checklist.md]
- Structured tables for comparisons/specs: Ranki.io signal #8 of 15, content-shape tier. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md]
- Author byline: Ranki.io signal #6 of 15 (author microdata or `rel="author"`); The AEO Report treats author as a required Article-schema sub-field rather than a standalone item, a framing difference, not a factual disagreement. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## 6. Ranki.io's four-tier weighting model (one vendor's heuristic, not a standard)

Ranki.io groups its 15 signals into four impact tiers: schema tier (FAQPage, Article/BlogPosting) is described as highest leverage in 2026, specifically because of the FAQ-schema signal-asymmetry described in section 4; content-shape tier (definitional intros, answer-style headings, structured tables) is second; crawl tier (llms.txt, AI-bot robots.txt access, author byline) is third; foundation tier (HTTPS, title length 30-60 characters, meta description 80-160 characters, exactly one H1, lang attribute, Open Graph tags, any JSON-LD) is fourth and described as the tier AEO shares with ordinary SEO rather than something distinctly AEO. This tiering is explicitly self-described ("the ones that actually move citation rates," "I rebuilt mine after a year of running real-page scans"), not a cited external standard. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md]

## 7. Research gaps

Neither source in this archive is an official standard, spec, or engine-vendor primary document for llms.txt itself (no fetch of an llms.txt specification exists here, only secondhand description of its format and the Lighthouse audit that checks for it). The AEO Report's raw file is truncated mid-section (cuts off inside "Internal linking with des...") so any internal-linking-specific AEO guidance it may have contained past that point is not captured in this archive and should not be assumed. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]
