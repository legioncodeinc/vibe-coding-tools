# RICE Scoring Sheet

A ready-to-use scoring template for feature requests. Clone this into a Notion database, Airtable, or spreadsheet.

## Formula

```
RICE Score = (Reach × Impact × Confidence%) / Effort
```

Higher score = higher priority.

## Component scales

### Reach

Estimated number of users affected per quarter. Use your analytics: active users who would encounter or benefit from this feature.

| Range | Example |
|-------|---------|
| > 1000 | Core workflow feature, all active users |
| 100-1000 | A segment of active users (e.g., users on Pro plan) |
| 10-100 | Power users, a specific integration audience |
| < 10 | Edge case, niche workflow |

### Impact (fixed scale — do not deviate)

| Score | Label | Definition |
|-------|-------|-----------|
| 3 | Massive | Affects core value prop; would materially change trial-to-paid conversion |
| 2 | High | Removes a significant pain point for a large segment |
| 1 | Medium | Meaningful improvement; noticeable to users |
| 0.5 | Low | Nice-to-have; users request it but work around it |
| 0.25 | Minimal | Cosmetic or preference-level change |

### Confidence

| Score | Level | When to use |
|-------|-------|------------|
| 100% | Strong prior evidence | Shipped similar feature; A/B test data; customer contract |
| 80% | User research data | Interviews, usability tests, survey data |
| 50% | Qualitative signal | Support tickets, informal conversations |

Do not score below 50%. If confidence is below 50%, run a discovery sprint before scoring.

### Effort

Person-months required across design, development, and QA. One engineer for two weeks = 0.5.

| Range | Example |
|-------|---------|
| 0.25 | Config change, 1 engineer, 1 day |
| 0.5 | Small feature, 1 engineer, 2 weeks |
| 1 | Medium feature, 1 engineer, 1 month |
| 2 | Larger feature, 2 engineers, 1 month |
| 3+ | Major initiative |

## Scoring table (blank)

| # | Request | Reach | Impact | Confidence | Effort | RICE Score | Priority rank |
|---|---------|-------|--------|-----------|--------|------------|---------------|
| 1 | | | | | | =(C×D×E)/F | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |

## Notes

- De-duplicate your backlog before filling this sheet. See `guides/02-deduplication-discipline.md`.
- Reach should come from your analytics, not guesses. If you do not have analytics data, use ICE instead (see `guides/04-prioritization-frameworks.md`).
- Review and re-score at the start of each planning quarter.
- For a worked example with 5 real-world requests scored, see `examples/rice-scoring-worked.md`.
