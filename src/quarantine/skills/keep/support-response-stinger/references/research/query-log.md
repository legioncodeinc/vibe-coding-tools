# Query and ranking log

- Capture date: 2026-09-04
- Trend window: 2026-06-04 through 2026-09-04 inclusive
- Community focus: Reddit `r/gohighlevel`, adjacent public Reddit results, HighLevel Ideas, and the public product status incident stream
- Official answer source: HighLevel Support Portal current knowledge base
- Language: English

## Query families

The sweep combined broad and feature-specific searches. Exact recurring terms included:

- `site:reddit.com/r/gohighlevel HighLevel issue OR problem OR not working after:2026-06-03 before:2026-09-05`
- `site:reddit.com/r/gohighlevel workflow after:2026-06-03 before:2026-09-05`
- `site:reddit.com/r/gohighlevel email SMS calendar after:2026-06-03 before:2026-09-05`
- `site:reddit.com GoHighLevel troubleshooting after:2026-06-03 before:2026-09-05`
- `site:status.gohighlevel.com incidents August 2026 HighLevel`
- `site:ideas.gohighlevel.com 2026 issue HighLevel`
- `site:help.gohighlevel.com/support/solutions/articles troubleshooting HighLevel`
- Product-specific variants for email, deliverability, SMS, A2P, phone, workflows, calendars, contacts, opportunities, forms, funnels, domains, payments, integrations, AI agents, mobile app, and login

The date syntax is deliberately one day wider at each boundary for search-engine recall. Inclusion is then filtered against the exact 2026-06-04 through 2026-09-04 timestamps captured in each raw record.

## Inclusion rules

An issue may enter the top 100 when all of these are true:

1. It describes a customer-observable failure, blocked task, confusing behavior, compliance barrier, or billing/access problem.
2. It is supported by at least one archived source.
3. Its safe response can be grounded in official documentation or can honestly stop at evidence collection and escalation.
4. It is distinct enough to require different diagnostics or a different next action.

Feature requests without a current failure mode are excluded. Promotional posts are excluded except when their comments contain a dated, concrete issue. Duplicate symptom descriptions are merged under one normalized issue.

## Ranking method

The result is an evidence-ranked support shortlist, not a claim about all HighLevel tickets worldwide. No public source exposes complete ticket counts or query volume.

Issues are ordered by these evidence classes:

1. Repeated recent community reports plus a matching incident or official troubleshooting entry.
2. A recent public incident or multiple independent recent community reports plus official troubleshooting coverage.
3. One recent community report plus a matching current official troubleshooting entry.
4. A current official article updated inside the trend window and surfaced in a troubleshooting or popular-articles section.
5. A current official troubleshooting entry with a clear, recurring support intent but no observed recent public mention.

Ties are broken by number of independent source types, then recency, then breadth of customer impact. Every catalog row carries its evidence class so a future refresh can rerank it without pretending that ordinal position is a measured ticket count.

## Known limits

- Private Facebook groups, private support tickets, logged-in community content, agency inboxes, and internal query logs were unavailable.
- Search engines do not guarantee exhaustive Reddit indexing.
- Reddit posts are self-selected reports and can overrepresent severe or novel failures.
- Product-status incidents measure outages, not ordinary setup questions.
- Official help article order and modification date are useful support-intent signals, not ticket-volume metrics.

For a statistically representative ranking, replace or augment this public sweep with a redacted export of `{agency}` ticket tags and internal search terms, then retain this public evidence as the external comparison set.
