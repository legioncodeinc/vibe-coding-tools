# Example: Existing Blog Audit

**Scenario:** A SaaS founder has 34 existing blog posts published over 18 months. Traffic has plateaued. There is no cluster strategy — posts were published ad-hoc on whatever seemed interesting. Goal: retroactively map posts to clusters, identify gaps, and set a renewal cadence.

---

## Step 1: Audit the existing post inventory

The founder exports all 34 post titles and URLs into a spreadsheet. Categories assigned manually by reviewing titles:

| Topic group | Post count | Has a pillar? | Has 5+ cluster articles? |
|---|---|---|---|
| Product updates / announcements | 8 posts | No (announcements, not a cluster) | No |
| Remote work tips | 7 posts | No explicit pillar | Sort of (scattered) |
| Engineering productivity | 6 posts | No | No |
| Hiring developers | 5 posts | No | No |
| Misc / one-offs | 8 posts | N/A | N/A |

**Finding:** The 8 product-update posts cannot be clustered for organic search — they are evergreen-zero content. The 7 remote-work posts are almost a cluster but lack a pillar. The engineering-productivity posts are a viable cluster. The hiring posts are thin.

---

## Step 2: Cluster extraction decisions

**Cluster A (retrofit): Engineering productivity**
- 6 existing posts are candidate cluster articles.
- Pillar needed: None of the 6 is comprehensive enough to serve as a pillar. Decision: write a pillar ("The complete guide to engineering team productivity") that links to all 6.
- Gap identified: No post covers "measuring engineering productivity" — a high-value cluster article missing from the set.

**Cluster B (retrofit): Hiring developers**
- 5 posts are thin (600-900 words each, light on actionable guidance).
- Two options: (a) merge the weakest posts into consolidated cluster articles + add a pillar, or (b) rewrite + expand each post.
- Decision: merge 2 thin "remote hiring" posts into one 1,800-word cluster article; add a pillar ("The startup founder's guide to hiring software engineers").

**Abandoned cluster: Remote work tips**
- 7 posts, but the topic is not aligned with the product (developer hiring platform). Ranking for "remote work tips" attracts traffic with no conversion path.
- Decision: Mark these for no-invest. Leave them live but do not add new cluster content to this topic. Redirect the oldest 3 (under 400 words) to the blog index.

---

## Step 3: Internal link repair

For each cluster that was retrofitted:

1. Update the pillar page to link out to all 6+ cluster articles by name.
2. Update each cluster article to link back to the pillar using natural anchor text.
3. Add cross-links between cluster articles where topics are adjacent.
4. Submit updated URLs via GSC for re-indexing.

---

## Step 4: Pre-publish checklist run on updated posts

When updating an existing post to the cluster architecture, run the full checklist (`guides/07-pre-publish-checklist.md`) on each updated post. Pay special attention to:
- **Check 3 (intent match):** Old posts may have been written with the wrong intent for their keywords. Reclassify after retroactive clustering.
- **Check 8 (meta complete):** Old posts often have missing or stale meta descriptions. Run the title/meta review from `guides/03-title-h1-meta.md`.
- **Check 10 (AEO blocks):** Old posts rarely have 40-60 word answer blocks. Add them as a high-value refresh action.

---

## Step 5: Renewal cadence after audit

After the audit and retrofit:

- **Months 1-2:** Write the two missing pillar pages (cluster A + cluster B). Retrofit internal links across all affected posts.
- **Month 3:** Write the gap cluster article ("measuring engineering productivity") identified in the audit.
- **Month 4 onward:** Standard cadence of 2-4 cluster articles per month across clusters A and B.
- **Monthly refresh:** Review GSC for traffic drops on the retrofitted posts; update stats quarterly.

---

## Outcome expected at 6 months

- Two complete clusters (8-12 posts each) with proper pillar + cluster + internal linking.
- Abandoned "remote work tips" cluster stabilized (no investment, no harm).
- First visible topical authority signals for "engineering productivity" and "hiring developers" clusters.
- Foundation for adding a third cluster in month 7+ (if business goal expands).
