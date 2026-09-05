# 07 - Pre-Publish Checklist

The canonical 12-point gate. No post goes live without passing this checklist. For updates to existing posts, run only the sections relevant to the changed content.

> Research sources: `research/external/2026-05-20-contentconquered-13-quality-standards-checklist.md`, `research/external/2026-05-20-quetext-content-quality-check-8-steps.md`

---

## How to run the checklist

For each item: **PASS** (no action needed), **FAIL** (block publication, fix before proceeding), or **NA** (item does not apply to this post type).

Minimum to publish: all applicable items are PASS. A single FAIL item blocks the post.

---

## The 12-point checklist

### 1. Accuracy — all factual claims verified

**Pass criteria:** Every statistic, quote, product name, pricing figure, and factual claim traces to a primary source (not a roundup article). Hyperlinks to cited sources are live and point to the correct page.

**Fail criteria:** Any "studies show" without a named study; any pricing or version number that was pulled from memory without verification; any claim that cannot be sourced if challenged.

**Solo-founder tip:** For statistics, add the source URL inline as you draft. Do not leave source verification for the checklist run — it doubles the time and produces worse sourcing.

---

### 2. Originality — no unattributed use of others' content

**Pass criteria:** All direct quotes are attributed. All frameworks, models, or checklists borrowed from external sources are cited. Content is substantively original — not a rewording of the top-ranking post for this keyword.

**Fail criteria:** Paragraphs that closely paraphrase a competitor post without adding new information or perspective. Unattributed use of another author's framework.

---

### 3. Search intent match — the post delivers what the SERP query predicts

**Pass criteria:** A reader who finds this post via its primary keyword would consider their query answered. The post does not deliver informational content for a transactional query or vice versa.

**Fail criteria:** The post was written for one intent but optimized for a keyword that belongs to another. Run the SERP intent check from `guides/02-post-length-by-intent.md` if uncertain.

---

### 4. Readability — prose is clear and appropriately structured

**Pass criteria:** Sentences are mostly under 25 words. Paragraphs are mostly under 4 lines. Headers break the content into scannable sections at logical intervals. No jargon without explanation.

**Fail criteria:** Walls of text with no H2s for 600+ words; sentence constructions that require re-reading; paragraphs that cover two distinct topics.

---

### 5. Internal links — at least 2 internal links per 1,000 words

**Pass criteria:** The post links to its parent pillar page (if it is a cluster article), to 1-2 related cluster articles, and uses natural anchor text (not "click here"). All internal links are live.

**Fail criteria:** No links back to the pillar; no links to adjacent cluster content; broken internal links.

---

### 6. AI content verification

**Pass criteria:** If any content was AI-generated or AI-assisted, it has been reviewed for factual accuracy (AI tools hallucinate statistics and product names), edited for brand voice, and verified against primary sources for any specific claims.

**Fail criteria:** AI-generated statistics published without verification; AI prose published verbatim without review for accuracy and originality; AI-generated lists that include items that are factually incorrect or outdated.

---

### 7. Image alt text — all images have descriptive alt text

**Pass criteria:** Every image (including header images, screenshots, diagrams) has an alt text attribute that describes the image content. Alt text for decorative images is empty (`alt=""`); alt text for informational images includes relevant keywords naturally.

**Fail criteria:** Missing alt text; alt text that is just the filename; keyword-stuffed alt text.

---

### 8. Meta complete — title tag and meta description are written

**Pass criteria:** Title tag is 50-60 characters; meta description is under 156 characters (desktop) / 130 (mobile); both follow the guidelines in `guides/03-title-h1-meta.md`. H1 is present and matches or deliberately differs from the title tag for AEO reasons.

**Fail criteria:** Missing meta description; title tag over 65 characters; H1 missing; meta description that does not include at least one specific, verifiable claim from the page content.

---

### 9. CTA present and passes the "why now" test

**Pass criteria:** Post has exactly one primary CTA; CTA passes the three-question test from `guides/06-cta-rubric.md`; CTA does not use any of the banned patterns.

**Fail criteria:** No CTA; multiple competing CTAs; CTA copy that contains a banned pattern ("please subscribe," "if you enjoyed this," "click here").

---

### 10. AEO blocks where applicable

**Pass criteria (informational posts):** Every H2 section begins with a 40-60 word standalone answer block; statistics cite primary sources by name and year; comparison content uses tables; FAQ section present if PAA shows for the primary keyword. See `guides/05-aeo-formatting-patterns.md` for the full AEO checklist.

**NA criteria:** Transactional or navigational posts; posts where AEO formatting would break the natural prose flow without adding extraction value.

---

### 11. Mobile preview — post renders correctly on mobile

**Pass criteria:** Post is checked on a mobile viewport (375px width minimum). Header hierarchy is readable; tables scroll horizontally without breaking layout; CTAs are large enough to tap; no content is clipped.

**Fail criteria:** Table overflow that makes columns unreadable; font size under 16px for body copy; CTA button too small to tap with a thumb.

---

### 12. No keyword stuffing

**Pass criteria:** The primary keyword appears in: the title tag, the H1, the first 100 words of the body, and 2-3 times naturally in the body. Secondary keywords appear where they fit naturally. Keyword density is not tracked by count — the criterion is whether the prose reads naturally.

**Fail criteria:** The primary keyword appears more than once per 200 words on average; keywords inserted into sentences where they do not read naturally; keyword variants repeated in every header.

---

## Checklist record-keeping

For every post reviewed: note the date, post URL (or working title), reviewer, and any FAIL items with the fix applied. Keep this record in `library/knowledge-base/content/checklist-log.md` if the repo has that path, or in a shared doc.

See `examples/happy-path-new-saas-blog.md` for a worked checklist run.
