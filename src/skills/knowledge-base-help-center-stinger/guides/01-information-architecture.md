# Information Architecture — Knowledge Base Help Center

## Search-first principle

A KB's primary job is to surface the right article in two clicks. Every architecture decision — category hierarchy, article titles, search tagging, internal linking — must serve discoverability first and aesthetic taxonomy second.

**Practical implication:** Build the category hierarchy from your search-no-results report, not from your product's internal naming. Users search for what they need, not what you call features.

---

## Category hierarchy

Limit to three levels maximum:

```
Top-level category (5-8 max)
  └── Sub-category (3-5 per top-level)
        └── Article
```

**Naming rules:**
- Top-level categories: job-to-be-done language ("Getting started", "Billing & subscriptions", "Troubleshooting"), not product architecture language ("Module A", "Feature B").
- Sub-categories: specific feature/task area ("Invite team members", "Update payment method").
- Avoid categories with <3 articles; consolidate or promote to a higher level.

**Anti-patterns:**
- "General" or "Miscellaneous" categories — use them only as a trash bin to clean up weekly.
- Categories named after internal team names ("Customer Success", "Platform team") — users do not know your org chart.

---

## Article templates

Use four article types mapped from the Diátaxis model:

### Concept article
**When:** The user needs to understand what something is before they can use it.
**Structure:** (1) One-sentence definition. (2) Why it matters. (3) How it relates to adjacent features. (4) Link to the relevant how-to.
**Title pattern:** "What is [X]?" or "Understanding [X]"

### How-to article
**When:** The user needs step-by-step instructions to complete a task.
**Structure:** (1) Prerequisite callout. (2) Numbered steps, one action per step. (3) Expected outcome. (4) Troubleshooting section for the top 2-3 failure modes.
**Title pattern:** "How to [verb] [object]" (e.g., "How to invite team members")

### Troubleshooting article
**When:** The user is stuck on a specific error or unexpected behavior.
**Structure:** (1) Symptom description (match what the user would type). (2) Cause table. (3) Resolution steps per cause. (4) Escalation path (support link).
**Title pattern:** "[Error message]" or "Why is [thing] not working?"

### Reference article
**When:** The user needs a specification, list, or lookup table.
**Structure:** Tables, lists, code blocks. Minimal prose. Use search tags heavily.
**Title pattern:** "[Feature] settings", "[Feature] limits and quotas"

---

## Search tagging

Most KB platforms expose an "article tags" or "keywords" field. Use it:

- Add 3-5 tags per article: product feature name, common user vocabulary, error message fragments.
- Normalize synonyms: if users search both "MFA" and "two-factor authentication", both should map to the same article via tags.
- Review your search-no-results report monthly and add missing tags to existing articles before writing new ones.

---

## Internal linking

- Every concept article must link to its primary how-to.
- Every how-to article must link to the relevant reference article (settings, limits).
- Add a "Related articles" section at the bottom of every article (most platforms support this natively).
- When a troubleshooting article resolves with "contact support", embed the support link inline — do not make the user hunt for it.

---

## Article length discipline

| Article type | Target length | Hard cap |
|---|---|---|
| Concept | 200-400 words | 600 words |
| How-to | 300-600 words + steps | 1,000 words |
| Troubleshooting | 300-800 words | 1,200 words |
| Reference | Tables/lists | No cap |

> If a how-to article exceeds 1,000 words, split it into two articles and link them.

---

*Sources: `research/external/2026-05-20-kb-analytics-content-gap.md`, `research/internal/command-brief-analysis.md`.*
