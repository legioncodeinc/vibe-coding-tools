# 04 - Keyword Research Scoping

Keyword research is a scoping tool, not a writing tool. Its job is to validate or invalidate a cluster hypothesis. Stop when you have enough data to make a go/no-go decision — the marginal value of the 50th keyword in a cluster is near zero.

> Research sources: `research/external/2026-05-20-devtoolpicks-ahrefs-vs-semrush-indie-hackers.md`, `research/external/2026-05-20-devtoolpicks-ahrefs-alternatives-indie-hackers.md`

---

## The "good enough" threshold

Keyword research is done when you can answer four questions for each cluster:

1. **Is there search demand?** (Any volume is acceptable for a new domain; rising trend is better than declining.)
2. **Is the competition within reach?** (Keyword difficulty < 30 for a new domain; < 50 for a domain with some authority.)
3. **Does the intent match our content plan?** (The SERP majority matches informational/commercial-investigation as appropriate.)
4. **Does ranking here serve a business goal?** (Traffic from this cluster has a plausible path to signups, revenue, or brand value.)

If all four are "yes," proceed to brief. Do not continue researching.

---

## Tool decision matrix for indie hackers (current as of May 2026)

| Situation | Recommended tool | Monthly cost |
|---|---|---|
| Pre-revenue, zero budget | Google Search Console (verified site) + Ahrefs Webmaster Tools (free, verified sites) + Keyword Surfer Chrome extension | Free |
| Under $5K MRR | Semrush Pro (5 projects, 500 keywords, 26B keyword database) | $117.33/mo annual |
| Budget-constrained, need a paid tool | SE Ranking | ~$52/mo annual |
| Keyword research only | Mangools (KWFinder) | $29.90/mo annual |
| Backlink analysis priority | Ahrefs Starter (launched Jan 2026, ~$29/mo) or Lite ($129/mo) | $29–129/mo |
| Full SEO + AI visibility tracking | Semrush One (launched Oct 2025, includes ChatGPT/Perplexity/AI Overviews monitoring) | ~$165/mo annual |

**Free stack recommendation for bootstrapped founders:**
1. Google Search Console — impressions and clicks for existing content.
2. Ahrefs Webmaster Tools — keyword difficulty and backlink data for your verified domain.
3. Keyword Surfer (Chrome extension) — quick volume overlay while browsing Google.
4. Google Autocomplete + "People Also Ask" — free seed expansion.
5. AnswerThePublic free tier (3 searches/day) — intent-framed question generation.

---

## The scoping workflow

**Phase 1: Cluster hypothesis (5 min)**
State the cluster as one sentence: "We want to rank for content about [topic] for [audience] to drive [outcome]." This is the filter for everything in Phase 2.

**Phase 2: Seed keyword generation (15 min)**
- Enter the cluster topic into your keyword tool's search.
- Export or list the top 20 related keywords by relevance (not volume).
- Add: the top 5 Google Autocomplete completions for the seed term and the top 5 People Also Ask questions that appear on page 1 for the seed term.

**Phase 3: Filter and group (10 min)**
Apply the four "good enough" questions to each keyword:
- Remove any keyword where intent mismatch makes ranking unlikely (navigational or transactional keywords in an informational cluster).
- Group semantically related keywords into the same post (they should be handled by one post, not ten separate posts).
- Flag 1-3 keywords per cluster article as the primary target + semantically related secondaries.

**Phase 4: Go/no-go decision (5 min)**
- Does the cluster have at least one keyword with volume AND manageable difficulty?
- Does it have sufficient long-tail support for at least 5 cluster articles?
- If yes to both: write the cluster map. If no: pivot the cluster hypothesis or drop it.

---

## What "keyword research without obsession" means

Keyword obsession is the failure mode where a founder spends three weeks on research, builds a spreadsheet of 500 keywords, and never writes a single post.

**Signs of keyword obsession:**
- Filtering for exact search volumes when the range estimate is sufficient.
- Researching a cluster when you have already validated it can work but have not started writing.
- Trying to find "zero competition" keywords instead of keywords you can credibly target.

**Antidote:** Set a time budget. Scoping a single cluster should take 30 minutes maximum. If you need 3 hours, the cluster scope is too large — split it into two clusters and scope each in 30 minutes.

---

## Keyword research for zero-tool situations

If the user has no paid tools and the free stack is not sufficient:

1. Search the seed topic on Google. Manually note the titles of the top 5 results (these are your competitor post structures).
2. Scroll to the "People Also Ask" section and note every question.
3. Note the "Searches related to" section at the bottom of the SERP.
4. Use these as your cluster article candidates without any volume data.

This "zero tool" approach is slower to validate but produces the same cluster architecture. The tradeoff: you may invest in a cluster that has lower search volume than expected. Acceptable for founders building brand authority; less acceptable for founders depending on organic traffic for revenue.

> **TODO: open question** — The canonical "good enough" stop criteria (difficulty + volume thresholds by domain authority tier) was not fully resolved in the research. The guidance above represents best-practice synthesis; a future `scripture-historian` refresh with query "keyword research stop criteria domain authority tier 2026" would sharpen this guide.
