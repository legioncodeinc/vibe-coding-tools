# 07. Content strategy and topical authority

E-E-A-T, internal linking, topical clusters, and what moves rankings fastest for a new domain in 2026.

## E-E-A-T: what Google's own docs say

E-E-A-T is not itself a specific ranking factor -- it is a mix of factors Google's automated systems use to identify helpful content, weighted most heavily for YMYL (Your-Money-or-Life) topics: health, financial stability, safety, societal welfare. Of the four components, Trust is explicitly the most important; Experience, Expertise, and Authoritativeness all feed into Trust rather than standing as equal independent pillars. Human Search Quality Raters use the Rater Guidelines to assess E-E-A-T, and their scores calibrate Google's automated ranking systems -- they do not directly set any individual page's rank. [raw/seo-aeo--eeat--google-helpful-content-docs.md]

Google's stated test for content: is the "why" behind it to help people directly, or primarily to attract search traffic? Content made primarily to manipulate rankings, including via AI generation, violates Google's spam policies. [raw/seo-aeo--eeat--google-helpful-content-docs.md]

## What measurably moves rankings (controlled study, not correlation)

A 38-site before/after study (Sept 2025-Apr 2026, YMYL and non-YMYL) found six structural patterns produced measurable ranking lifts within 60-120 days, ordered by effect size:

1. First-person experiential language in body content ("in my testing across 22 sites...") -- +2.8 positions vs. third-person impersonal framing on otherwise identical content.
2. Specific data points with named sources or methodology ("Semrush's 42,000-post study") vs. vague citations ("many studies show") -- +2.1 positions.
3. Author entity schema with `sameAs` links to verifiable profiles (LinkedIn, conference talks, published books) -- +1.9 positions.
4. Original research artifacts (even modest ones -- a 200-respondent survey, a 50-site audit -- as long as methodology is disclosed) -- +1.8 positions vs. pure summarization content.
5. Cross-referencing between articles by the same author within a topic cluster (8+ interlinked articles) -- +1.5 positions.
6. Visible `datePublished`/`dateModified` in the byline, not just in schema -- +1.2 positions.

[raw/seo-aeo--eeat--eeat-signals-2026-seomytics.md]

Three commonly-recommended signals showed **zero** measurable ranking effect once confounds were controlled: author bio length (50-400 words made no difference), author social-media follower counts, and the literal word "expert" in a bio. Do not spend editorial effort on these; spend it on the six above instead. [raw/seo-aeo--eeat--eeat-signals-2026-seomytics.md]

**Gap flagged:** no source in this archive gives a Google-attributed, controlled number for new-domain ranking velocity specifically -- the 38-site study measures lift on existing content, not cold-start timelines. Treat any specific "X weeks to rank a new domain" claim as directional practitioner consensus, not verified Google-sourced fact, and say so if a client asks for a hard number.

## Topical authority and internal linking

Topical authority: search engines recognizing a site as the expert source across the full range of related queries in a subject, not just individual keywords. Built with a pillar page (broad hub) plus cluster pages (deep spokes on subtopics), bidirectionally interlinked -- the pillar links to every cluster page, every cluster page links back to the pillar, closely related clusters cross-link. Orphaned pages (no internal links pointing to them) are the highest-priority linking gap to close first. [raw/seo-aeo--internal-linking--topical-authority-ahrefs.md]

Google's 2024 Content Warehouse API leak confirmed two internal signals computed on domain-level embeddings: `siteFocusScore` (how concentrated a domain's content is around a core topic) and `siteRadius` (how far individual pages stray from that center). Publishing off-topic content on a topically-focused domain can actively **dilute** topical authority, not merely fail to build it -- this is a real reason to say no to an off-brief content request, not just an editorial preference. [raw/seo-aeo--internal-linking--topical-authority-ahrefs.md]

AI Mode's "query fan-out" (a single user query expanded into multiple related sub-queries before an answer is assembled) rewards sites with comprehensive topic coverage, since a well-covered cluster surfaces across more of the fanned-out sub-queries -- this compounds visibility specifically in AI-mediated search, on top of whatever it does for classic ranking. Topical authority also directly affects AI citation: AI platforms preferentially cite sources they have evidence to trust on a subject. [raw/seo-aeo--internal-linking--topical-authority-ahrefs.md]

## Practical sequence for a new site or new topic

1. Pick one topic where competence, demand, and business value intersect. Close it (comprehensive coverage, fully interlinked) before opening a second topic -- five half-finished clusters lose to one complete one.
2. Write the pillar page first: broad, well-structured, linking out to every planned cluster page even before all of them exist yet, updated as each one ships.
3. Publish cluster pages in a deliberate order, linking each one back to the pillar with descriptive (never "click here") anchor text from day one.
4. Apply the six E-E-A-T retrofit patterns above to every page as it's written, not as an afterthought pass later.
5. Check for orphans regularly -- any page with zero or near-zero inbound internal links from its own cluster is invisible in the site's own architecture, regardless of what the sitemap claims.

## Cross-reference

This guide covers the content and linking layer. `guides/06-aeo-and-ai-citation.md` covers how the same topical/entity signals feed AI citation specifically, and `guides/03-structured-data.md` covers the `Person`/`Article` schema that operationalizes author-entity trust signals.
