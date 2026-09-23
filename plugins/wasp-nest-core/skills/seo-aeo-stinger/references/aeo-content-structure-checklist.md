# AEO content-structure checklist

Every item below is grounded in the AEO/GEO research archive. Use this checklist against any content page intended to earn AI citation (ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews), in addition to normal SEO quality.

## Gate: crawler access (do this first, or nothing else matters)

- [ ] robots.txt allows the browse/search AI crawlers you want citations from: `ChatGPT-User`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot` at minimum. [raw/seo-aeo--robots--ai-crawlers-2026-yatna.md]
- [ ] The page is server-rendered (`ssr = true`) so the crawler's first fetch sees full content, not a hydration-only shell. [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md]
- [ ] The page is not paywalled, login-walled, or behind aggressive bot-blocking -- this is a binary eligibility gate applied before any content-quality evaluation. [raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md]
- [ ] The page ranks (or is realistically positioned to rank) in the top 10 of classic Google results for its target query -- top-3-ranked pages are ~34x more likely to be AI-cited than pages ranked 11-30. Classic SEO is the gate; GEO structure decides who gets cited among pages that clear it. [raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md]

## Structure (macro/meso/micro, per the highest-measured-lift research)

- [ ] Every major H2 section opens with a 40-80 word self-contained answer before any context or caveats -- engines score passages independently and prefer the one that can be lifted whole. Median cited sentence length is <=10 words; lead with the precise factual claim. [raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md]
- [ ] Headings are phrased as the question a user would actually type ("How does X work?" not "X Overview") where the section answers a discrete question.
- [ ] One idea per H2/H3 -- do not merge two subtopics under one heading; engines chunk by heading, and merged headings dilute both.
- [ ] At least one comparison or data table per substantial page where the content supports it -- tables measurably increase citation likelihood (2.5x in the largest cited study). [raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md]
- [ ] Named entities (products, companies, standards, people, dates, amounts) stated explicitly and spelled consistently across the site -- entity density correlates with a 267% citation-rate increase, and 15+ Knowledge Graph entities on a page corresponds to 4.8x higher AI Overview selection probability. [raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md]

## Evidence and sourcing (highest measured lift in the controlled Princeton study)

- [ ] Statistics are specific and cited to a named, checkable source inline (not "many studies show" or "industry data") -- adding statistics measured a +41% visibility lift; citing authoritative external sources measured up to +115% for lower-ranked content. [raw/seo-aeo--geo-aeo--geo-tactics-playbook-attrifast.md]
- [ ] Direct quotations from named, credible people are used where relevant -- quotations measured a +28% visibility lift. [raw/seo-aeo--geo-aeo--geo-tactics-playbook-attrifast.md]
- [ ] Claims prefer specific, falsifiable framing ("in testing across 38 sites between Sept 2025 and Apr 2026...") over vague framing ("we've extensively tested this") -- this pattern showed a measured 2.1-2.8 position ranking lift in a controlled E-E-A-T study and doubles as an AI-extractable evidence unit. [raw/seo-aeo--eeat--eeat-signals-2026-seomytics.md]

## Structured data (supports extraction, does not replace it)

- [ ] `Article`/`BlogPosting` schema with `datePublished`, `dateModified`, and a `Person` author block present on every substantial content page.
- [ ] `FAQPage` schema on any page with a genuine, visible FAQ section -- FAQ structure shows a 28-40% higher citation probability even though Google's own FAQ rich-result display is restricted to a narrow set of sites since 2023. Ship the schema for AI citation value regardless of Google's rich-result eligibility. [raw/seo-aeo--geo-aeo--geo-tactics-playbook-attrifast.md]
- [ ] Author `sameAs` links to verifiable profiles (LinkedIn, published work) -- measured +1.9 position ranking lift and functions as an entity-disambiguation anchor for AI trust scoring too. [raw/seo-aeo--eeat--eeat-signals-2026-seomytics.md]
- [ ] Schema matches what is visibly on the page -- do not mark up a rating, FAQ, or fact that a human reader cannot also see; mismatched schema risks a manual action and, per Google's own AI-features guidance, is not required or rewarded by AI Overviews on its own. [raw/seo-aeo--structured-data--google-confirms-no-ranking-boost-sej.md]

## Freshness

- [ ] `dateModified`/`datePublished` are visible in the byline, not just in schema -- date transparency measured a +1.2 position ranking lift and appears to be a quality-rater-feedback signal. [raw/seo-aeo--eeat--eeat-signals-2026-seomytics.md]
- [ ] High-value pages are re-dated with genuine content updates on a real cadence (industry consensus in the archive suggests ~90 days for competitive topics; no Google-sourced number for this exists in the archive -- treat as directional, not verified). Freshness is measurably weighted: ChatGPT's cited pages average 458 days fresher than organic-search results for the same query, and 76.4% of top-cited pages were updated within the last 30 days. [raw/seo-aeo--geo-aeo--ai-citations-research-machinerelations.md]

## llms.txt (ship it, but do not treat it as a primary lever)

- [ ] `/llms.txt` exists at the site root: H1 site name, one-paragraph blockquote description, H2 sections of markdown links with one-line descriptions. [raw/seo-aeo--geo-aeo--llms-txt-definitive-guide.md]
- [ ] Understand the honest limitation before promising results from this alone: adoption sits near 7% of public SaaS sites (still differentiating), it is read by ChatGPT/Perplexity/Claude crawlers but not yet by Gemini as of mid-2026, and no source in this archive isolates its effect from the rest of a bundled "three-piece set." Cost is near zero; do not oversell the payoff. [raw/seo-aeo--geo-aeo--geo-tactics-playbook-attrifast.md]

## Internal linking / topical authority (compounds citation and ranking together)

- [ ] The page links to its topic cluster's pillar (or, if it is the pillar, links out to every cluster page) with descriptive, varied anchor text -- not "click here" or "read more."
- [ ] No orphaned pages: every page has at least 2-3 inbound internal links from topically related content. [raw/seo-aeo--internal-linking--topical-authority-ahrefs.md]
- [ ] Off-topic content is not published on a topically-focused domain without a clear reason -- Google's confirmed `siteRadius` signal measures how far a page strays from a site's topical center, and straying content can dilute authority rather than merely fail to build it. [raw/seo-aeo--internal-linking--topical-authority-ahrefs.md]
