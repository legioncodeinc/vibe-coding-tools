---
source_url: https://katico.com/blog/knowledge-base-metrics/
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: analytics-loop
stinger: knowledge-base-help-center-stinger
---

# KB Metrics and Search-First Architecture: CRAVA Framework (2026)

**Published:** May 2025 | **Source:** Katico Blog | **Secondary:** Opensolr No-Results Dashboard, Helpable KB Analytics

## Summary

Covers the CRAVA metrics framework for KB health measurement and the concrete instrumentation pattern for search-first architecture. Combines Katico's framework with Opensolr's no-results dashboard approach and Helpable's real-time analytics feature. Primary source for the "search-first" architectural principle in `guides/01-information-architecture.md` and the analytics KPIs in `guides/05-analytics-loop.md`.

## Key quotations / statistics

**CRAVA framework (Katico):**
- **C**overage: Does the KB address the full range of user questions? (measured by topic breadth vs. incoming ticket topics)
- **R**elevance: Are articles surfaced by search actually answering the question? (measured by "search success rate" - user clicks article AND stays > 60 seconds)
- **A**ccessibility: Can users find articles in 2 clicks or fewer? (measured by search click depth)
- **V**alidity: Is the content still accurate? (measured by article age + feedback ratings + support team review frequency)
- **A**ction: Do readers take the intended action after reading? (measured by CTA click rate, ticket reduction, or form completion)

**Search success rate calculation:**
```
Search success rate = (searches with article click AND stay > 60s) / total searches × 100
Target: > 65% is considered healthy for a well-structured KB
```

**Opensolr No-Results Dashboard pattern:**
- IP-deduplication removes crawler/bot queries from no-results tracking.
- Four-fix playbook for zero-result queries: create article, add synonym, improve title, add redirect.

**Helpable analytics (real-time):**
- No-result occurrence counts with trend lines over time (week-over-week delta).
- CSV export for external analysis in Google Sheets or BI tools.
- Google Analytics 4 (GA4) event integration: `kb_search_no_results` event with `query` parameter.

**Search-first architecture principle:**
- Search is the primary navigation for KBs > 50 articles.
- Category navigation is secondary - it should reinforce, not replace, search.
- Article titles must match how users ask questions (conversational titles outperform technical titles in search result click-through).
- "Reverse-engineer your article titles from your search-no-results queries."

## Annotations for stinger-forge

- CRAVA gives `stinger-forge` a concrete 5-KPI health scorecard for `guides/05-analytics-loop.md`. Each dimension maps to a measurable signal.
- The search success rate formula (stay > 60 seconds = success) is the single most actionable metric for search-first KBs. Include it in the weekly triage ritual template.
- "Reverse-engineer your article titles from your search-no-results queries" is the most important content-gap principle in the research. It closes the loop between search analytics and article creation. Feature it prominently in `guides/05-analytics-loop.md`.
- GA4 integration (`kb_search_no_results` event) provides an analytics instrumentation path for teams whose KB platform doesn't have built-in search analytics (e.g., Help Scout Docs with custom search). Include as an implementation snippet in `guides/05-analytics-loop.md`.
- The CRAVA "Validity" dimension (article age + feedback ratings + review frequency) is the foundation for a content maintenance calendar - a recurring ritual to review articles older than 6 months. Include in `templates/content-gap-triage.md`.
