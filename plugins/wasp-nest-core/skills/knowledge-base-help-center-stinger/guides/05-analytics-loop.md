# Analytics Loop — KB Content-Gap Feedback

## The CRAVA Framework

Source: `research/external/2026-05-20-kb-analytics-content-gap.md`

CRAVA is a five-KPI KB health scorecard. Track all five weekly.

| KPI | Formula | Healthy threshold |
|---|---|---|
| **C**overage | Articles covering top 50 ticket topics / 50 | >80% |
| **R**each | Unique KB sessions / total support contacts | >60% |
| **A**nswer rate | Search sessions with a click + stay >60s / total search sessions | >55% |
| **V**ote score | Positive article ratings / total ratings | >70% |
| **A**voidance rate | Tickets closed with a KB article link / total tickets | >30% |

A healthy KB scores >4/5 dimensions above threshold. Any dimension below threshold is a content or configuration problem.

---

## Search success rate formula

```
Search success rate = (sessions where user clicked a result AND stayed >60s) / total search sessions
```

Target: >55%. A rate below 40% means the articles are being surfaced but are not answering the question (title mismatch or article quality issue).

---

## The 4-fix playbook for zero-result queries

When a search query returns zero results:

| Fix | When to apply |
|---|---|
| **Add tags** to an existing article | The article exists but is not tagged with the user's search vocabulary |
| **Rewrite the article title** | The article title uses internal naming; the user searches with different vocabulary |
| **Write a new article** | No article exists for this query; it represents a genuine content gap |
| **Add a redirect** | The query matches a deprecated feature or renamed concept; redirect to the current article |

Apply fixes in this order. Most zero-result queries are fixed by tagging existing articles, not by writing new ones.

---

## Weekly content triage ritual (30 minutes)

1. Pull the search-no-results report from the KB platform (most platforms expose this in their analytics dashboard).
2. Open the `templates/content-gap-triage.md` template.
3. For each query in the top-10 no-results list:
   - Classify: existing article (tag fix) / title fix / new article needed.
   - Assign an owner.
   - Set a "fix by" date (same sprint).
4. For each article with >5 downvotes in the last 7 days:
   - Identify the most common reason (wrong/outdated, confusing, missing steps).
   - Assign a "rewrite" task with a 2-week deadline.
5. Measure: check if last week's fixes reduced the no-results count.

---

## Setting up search analytics per platform

| Platform | Where to find no-results queries |
|---|---|
| Help Scout Docs | Reports → Search Queries → "No Results" filter |
| Intercom Articles | Reports → Articles → Failed Searches |
| Document360 | Analytics → Search Analytics → Zero-Result Searches |
| ReadMe.com | Metrics → Searches (Enterprise only; requires sales call) |
| Zendesk Guide | Explore → KB dashboard → Search queries with no answers |

---

## AI deflection analytics

When AI deflection is enabled, track these two metrics in addition to CRAVA:

| Metric | Formula | Target |
|---|---|---|
| **Deflection rate** | Conversations resolved by AI without a human reply / total AI conversations | >40% |
| **Fallthrough rate** | Conversations where AI escalated to a human / total AI conversations | <30% |

If the fallthrough rate is high:
- Review the AI's "I don't know" answers — they map directly to missing KB content.
- Export Fin's "unresolved" conversation transcripts weekly and add them to the content-gap triage.

---

## Document360 Eddy AI citation analytics

Source: `research/external/2026-05-20-document360-2026-features.md`

Document360 Business+ tracks which articles appear in each Eddy AI response (citation analytics). This is the most sophisticated content-gap instrument available in 2026:
- Articles cited frequently but rated poorly → rewrite priority.
- Articles never cited despite high search volume → embedding gap; re-chunk the article.
- Topics with no cited articles → content gap; create new articles.

---

*Sources: `research/external/2026-05-20-kb-analytics-content-gap.md`, `research/external/2026-05-20-document360-2026-features.md`.*
