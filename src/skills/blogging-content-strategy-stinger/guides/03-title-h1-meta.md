# 03 - Title, H1, and Meta Description

Three distinct text slots. Each serves a different system. Conflating them is one of the most common blog optimization errors.

> Research sources: `research/external/2026-05-20-incremys-meta-description-guide.md`, `research/external/2026-05-20-w3era-meta-description-ctr-guide.md`

---

## The three slots and their purposes

| Slot | Seen by | Purpose | Character limit |
|---|---|---|---|
| **Title tag** (`<title>`) | Google SERP, browser tabs, social shares | Win the click from the SERP | 50–60 characters (up to ~600px display width) |
| **H1** | Reader on-page, AI extraction systems | Confirm the post delivers on the title's promise; sets the AEO anchor | No hard limit; 6–12 words is the practical range |
| **Meta description** | Google SERP snippet (when not rewritten) | Convert the impression into a click | 130 characters (mobile) / 156 characters (desktop) — front-load the value into the first 8–10 words |

**They can and should differ.** The title tag is optimized for CTR on the SERP. The H1 is optimized for the on-page reader and for AI extraction (featured snippets, AI Overviews). The meta description is a micro-landing-page copy.

---

## Title tag: the CTR craft

A good title tag does three things:
1. Signals clearly what the post is about (matches the query intent).
2. Differentiates from the 9 other results on the SERP.
3. Avoids clickbait that the content cannot deliver.

**Effective title patterns:**

| Pattern | Example | Best for |
|---|---|---|
| Number list | "7 cluster-pillar mistakes that tank topical authority" | Informational, listicle |
| Year + authority | "Content marketing strategy for B2B SaaS (2026 guide)" | Informational, guides |
| Comparison | "Ahrefs vs Semrush: which is worth it for indie hackers?" | Commercial investigation |
| How-to | "How to build topical authority in 90 days (without a team)" | Informational |
| Question | "What is a pillar page and do you actually need one?" | Informational, SERP PAA |
| Data-led | "Clustered content drives 30% more traffic. Here's the architecture." | Informational, trust-building |

**Forbidden patterns:**
- Clickbait that overpromises: "This one trick will triple your traffic" → the content rarely delivers; Google's systems penalize intent mismatch.
- Keyword-stuffed: "Content marketing content strategy content cluster strategy 2026" → lower CTR, potential spam signal.
- Vague: "A guide to blogging" → gives the reader no signal about why this guide is different.

---

## H1: the AEO anchor

The H1 differs from the title tag when:
1. The title tag is optimized for CTR (front-loaded curiosity signal) and the H1 should be a clear statement that AI extraction systems can anchor to.
2. The title uses a question format but the H1 should state the answer framing directly.

**Example:**
- Title tag: "What is topical authority and why does it matter in 2026?"
- H1: "Topical Authority: The 2026 Framework for Ranking Without Domain Age"

The H1 version is more extractable by AI systems because it leads with the subject + the specific value proposition, making it suitable as a featured-snippet anchor.

**Rule:** When the title tag ends in a question, make the H1 a statement that implies the answer. When the title tag is already a clear declarative statement, the H1 can match the title exactly.

---

## Meta description: the Promise + Proof + Benefit + CTA framework

The canonical meta description framework (from `research/external/2026-05-20-incremys-meta-description-guide.md`):

1. **Promise**: State what the reader will get. "Learn how to map a content cluster in 30 minutes."
2. **Proof**: A factual element that is actually on the page. "With the same architecture that helped [domain X] hit 30% more organic traffic."
3. **Benefit**: The outcome for the reader. "So your posts build topical authority instead of competing against each other."
4. **CTA**: One low-friction action. "Read the full guide."

**Why the Proof element matters:** Google rewrites meta descriptions when the written copy does not reflect actual page content. Including a specific, verifiable claim from the page (a stat, a framework name, a checklist count) anchors the meta to the content and prevents rewrite.

**Example meta description (156 chars):**
> "Map a content cluster in 30 min using the pillar-first model. Includes word-count ranges by intent, internal linking rules, and the 12-point pre-publish checklist."

- Promise: "Map a content cluster in 30 min"
- Proof: "pillar-first model", "word-count ranges by intent", "12-point pre-publish checklist" — all specific things on the page
- Benefit: implied (the structure of "Includes X, Y, Z" signals value)
- CTA: not needed here because the value list does the work

---

## Diagnosing and fixing low-CTR metas

Use Google Search Console (GSC) as the signal:
1. Filter by high impressions + low CTR (< 2% for informational terms on page 1).
2. These are the posts where Google may be ignoring your meta or your title is not converting.
3. Check: is Google rewriting your meta? Open an incognito search for the exact query. If the snippet in the SERP differs from your meta, Google rewrote it.

**Fixing a rewritten meta:**
- Review the meta against the page content. The meta must promise something the page delivers.
- Front-load: put the most important claim in the first 8–10 words.
- Mirror the dominant search intent: if the query is informational but your meta sounds transactional, rewrite it.

**Fixing a low-CTR title:**
- Check the SERP: do the other titles use a pattern (numbers, years, specific format) that yours lacks?
- Add specificity: "A guide to content marketing" → "Content marketing for B2B SaaS founders (2026)"
- Test the CTR hypothesis: update one post's title, let it run for 30 days, check GSC for CTR change.

---

## Quick-check: three questions before publishing

1. Does the title signal clear value within 50–60 characters?
2. Does the H1 function as an extractable statement (not a question) for AEO purposes?
3. Does the meta description include at least one Proof element from actual page content?

If any answer is "no," revise before publishing.

See `examples/happy-path-new-saas-blog.md` for worked title/H1/meta examples across a full cluster.
