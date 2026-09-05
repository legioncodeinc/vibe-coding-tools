---
source_url: https://docs.document360.com/docs/search-analytics
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: analytics-loop
stinger: knowledge-base-help-center-stinger
---

# KB Search Analytics and Content Gap Identification (2026)

**Sources synthesized:** Document360 Search Analytics docs (Jan 2026), Supportbench ticket-tagging-to-KB-gap guide (April 2026), Katico KB metrics framework (May 2025), Opensolr No-Results Dashboard pattern
**Retrieved:** 2026-05-20

## Summary

Covers the full analytics loop for knowledge base content gap identification: search-no-results tracking, failed ticket deflection mapping, and the CRAVA metrics framework for continuous KB health measurement. This is the primary source for `guides/05-analytics-loop.md`. Multiple platforms and approaches are represented, converging on a shared workflow pattern.

## Key quotations / statistics

**Document360 Search Analytics (January 2026):**
- No-result dashboard: shows all search queries that returned zero results, sorted by frequency.
- "Bounced searches" metric: queries where the user searched, clicked an article, and immediately returned to search (indicating the article didn't answer the question).
- User-type filtering: segment search analytics by user role (admin, reader, contributor) to distinguish internal vs external search failures.
- Article performance reports: views per article, time-on-page, article ratings (thumbs up/down).

**Supportbench content gap method (April 2026):**
- AI auto-tagging of incoming tickets to identify topics.
- "KB gap flag": when a ticket receives a tag that has no corresponding KB article, it is automatically flagged for content creation.
- Deflection KPIs: deflection rate (tickets avoided / total tickets), time-to-answer (average seconds from KB search to resolution), CSAT on KB interactions.

**Katico CRAVA framework (May 2025):**
- CRAVA: **C**overage (breadth), **R**elevance (is the article answering the actual question?), **A**ccessibility (search discoverability), **V**alidity (is the content still accurate?), **A**ction (do readers take the intended action?).
- Search success rate: percentage of searches where the user clicks an article and stays on it for > 60 seconds (proxy for "answered").

**Opensolr No-Results Dashboard pattern:**
- IP-deduplication: filter out bot and crawler queries from no-results tracking to avoid noise.
- 4-fix playbook for zero-result queries: (1) create the missing article, (2) add synonym/alias to an existing article, (3) improve article title to match search intent, (4) add a redirect from the failed query to the closest existing article.

**Weekly triage ritual (synthesized from multiple sources):**
- Pull top-20 no-result queries from the previous week.
- Cross-reference with incoming ticket volume for the same topics.
- Rank by: (frequency of no-results query) × (ticket volume for same topic) = content gap priority score.
- Assign article creation to a team member. Review at next week's triage.

## Annotations for stinger-forge

- The weekly triage ritual is the core workflow for `guides/05-analytics-loop.md`. Include it as a step-by-step template with a link to `templates/content-gap-triage.md`.
- The CRAVA framework gives `stinger-forge` a vocabulary for KB health that is more nuanced than just "deflection rate." Include it in `guides/05-analytics-loop.md` as the 5 KPIs to track.
- Document360's user-type filtering (admin vs reader search analytics) is a differentiator that makes its search analytics more actionable than Help Scout Docs or Zendesk Guide. Note this in `guides/08-document360.md`.
- The Supportbench AI auto-tagging pattern (ticket → tag → KB gap flag) represents the most automated version of the content-gap loop. Teams using Zendesk, Freshdesk, or Intercom can replicate this with webhook-triggered tag logic.
- "Bounced searches" is a critical metric that most teams don't track. Include it as a mandatory instrumentation step in the `templates/kb-setup-checklist.md`.
- The 4-fix playbook for zero-result queries belongs in `guides/05-analytics-loop.md` as the "what to do after the triage" section. It covers both content creation and metadata optimization paths.
