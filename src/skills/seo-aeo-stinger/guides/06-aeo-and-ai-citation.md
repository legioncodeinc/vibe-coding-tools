# 06. AEO and AI citation

Getting cited by Google AI Overviews, ChatGPT, Perplexity, and Claude. llms.txt, extractable content structure, schema's role, entity/topical authority.

Full checklist: `references/aeo-content-structure-checklist.md`. This guide explains the reasoning behind it.

## The gate: crawler access

Nothing else in this guide matters if the AI crawler cannot fetch the page. Crawler accessibility is a binary eligibility filter applied before any content-quality evaluation -- paywalled, login-walled, or aggressively bot-blocked pages are excluded from citation regardless of how well-structured they are. [raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md]

1. Allow the browse/search AI crawlers in `robots.txt`: `ChatGPT-User`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot` at minimum (`guides/01-technical-foundation.md`).
2. Server-render the page (`ssr = true`) -- a crawler that fetches a hydration-only shell sees nothing.
3. Rank, or realistically be positioned to rank, in Google's top 10 for the target query. Top-3-ranked pages are ~34x more likely to be AI-cited than pages ranked 11-30 in the largest study archived here. Classic SEO ranking is the gate; the structural work below decides who gets cited among pages that clear it. AEO does not replace SEO fundamentals. [raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md]

## What actually moves citation (measured, not vibes)

The foundational controlled study (Aggarwal et al., Princeton, KDD 2024, arXiv:2311.09735) tested content strategies across ten engines and 10,000 queries: combined techniques lifted a source's visibility in generated answers by up to ~40%. Per-technique measured lifts: citing authoritative external sources +115% (for lower-ranked content), adding statistics +41%, adding quotations +28%. [raw/seo-aeo--geo-aeo--geo-tactics-playbook-attrifast.md]

A separate, larger-scale study of 100,411 real citation events across ChatGPT, Perplexity, Claude, and Google AI Mode found: named-entity density correlates with a 267% higher citation rate; 15+ Knowledge Graph entities on a page corresponds to 4.8x higher AI Overview selection probability; tables increase citation likelihood 2.5x; FAQ structure shows 28-40% higher citation probability; schema markup was the strongest single content-level predictor (odds ratio 1.31); query-passage semantic alignment is 7.3x more predictive of citation than domain authority; the median cited sentence is 10 words or fewer. [raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md]

Practical translation into page structure:

1. Every H2 section opens with a 40-80 word self-contained answer before any context or caveats -- engines score passages independently, and the highest-scoring passage is the one that can be lifted whole.
2. Headings are phrased as the question a user would type, where the section genuinely answers a discrete question.
3. One idea per heading -- a merged heading dilutes both ideas' extractability.
4. At least one comparison or data table per substantial page, where the content supports it.
5. Named entities (products, companies, standards, people, dates, amounts) stated explicitly, spelled consistently across the whole site.
6. Statistics are specific and cited inline to a named, checkable source -- not "many studies show."
7. Direct quotations from named, credible people, where relevant.

## Freshness is a real, measured factor

ChatGPT's cited pages average 458 days fresher than organic-search results for the same query; 76.4% of top-cited pages were updated within the last 30 days. Perplexity shows the strongest freshness bias of the tracked engines. [raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md] Re-date and genuinely update high-value pages on a real cadence, not a cosmetic timestamp bump -- a stale page is a riskier quote for an engine to surface.

## Schema's role (see also guides/03)

Schema markup does not buy a citation on its own, but it removes ambiguity about what a passage is, which raises the odds it gets selected. FAQ schema is worth shipping for AI-citation value even though Google's own visual FAQ rich result is restricted to a narrow set of sites since 2023 -- the schema still feeds AI extraction regardless of whether Google renders the dropdown. `Article` schema with `datePublished`/`dateModified`/`author` and `Person` author schema with `sameAs` links both feed the same trust/entity signals that E-E-A-T evaluation uses (`guides/07`). [raw/seo-aeo--geo-aeo--geo-tactics-playbook-attrifast.md], [raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md]

## Per-engine differences worth knowing

| Engine | Dominant source type | Behavior |
| --- | --- | --- |
| ChatGPT Search | Wikipedia, editorial sites | ~7 sources per answer, deep extraction per source |
| Perplexity | YouTube, news | ~16 sources per answer, strongest freshness bias, shallower extraction per source |
| Google AI Overviews | YouTube, brand domains | Inherits classic Google Search ranking signals most heavily |
| Claude | Brand/institutional domains | Most conservative citer; never surfaced YouTube/Wikipedia/Reddit in the tracked sample |

[raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md]

ChatGPT's cited URLs overlap only 10% with Google's top-10 for the same queries -- optimizing Google rank alone does not guarantee AI citation share; measure citation directly (query the engines with target prompts) rather than inferring it from rank.

## llms.txt: ship it, do not oversell it

```
# Acme Consulting

> Acme Consulting helps mid-market manufacturers cut supply-chain lead time. This file indexes our most substantive content for AI systems.

## Company

- [About Acme](https://acme.com/about): Who we are, founded 2019, HQ in Columbus OH.

## Guides

- [Supply chain audit checklist](https://acme.com/guides/audit-checklist): A 12-point audit for identifying lead-time bottlenecks.
- [Lead time benchmarks 2026](https://acme.com/guides/benchmarks-2026): Original data from 40 manufacturer engagements.
```

Place at `/llms.txt`. Structure: H1 site name, one-paragraph blockquote description, H2 sections of markdown links with one-line descriptions. [raw/seo-aeo--geo-aeo--llms-txt-definitive-guide.md]

Honest limitation: adoption sits near 7% of public SaaS sites as of Q1 2026 (still differentiating precisely because it's rare); read by ChatGPT's crawlers, Perplexity's, and Anthropic's, but **not yet** by Google's Gemini as of mid-2026; no source in this research archive isolates llms.txt's effect from the rest of a bundled "three-piece set" some vendors sell (llms.txt + FAQ schema + citable-stats tables). Ship it because the cost is near zero, not because it is a proven primary lever. Crawler access, server-rendered content, schema, and answer-first structure are the levers with controlled-study evidence behind them. [raw/seo-aeo--geo-aeo--geo-tactics-playbook-attrifast.md]

## Measurement

Query ChatGPT, Perplexity, Claude, and Google (with AI Overviews visible) with the site's target prompts on a schedule; log whether the site is cited and which passage was lifted. Google Search Console does not show AI-engine citations -- this has to be measured manually or with a dedicated tool. Track the trend over weeks, not a single snapshot, since generated answers vary run to run.
