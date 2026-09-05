# Research Plan: product-tour-onboarding-ui-stinger

- **Depth tier:** normal
- **Time window:** 2025-11-20 back to 2026-05-20 (6 months)
- **Page budget target:** ~30-50 unique pages (normal tier, focused domain)
- **Source breadth target:** official docs, practitioner blogs, GitHub READMEs, comparison articles, community posts

## Initial queries (from `big-bang-space` via Command Brief)

1. "Userpilot Appcues Userflow 2026 comparison"
2. "Driver.js Shepherd.js open source tour 2026"
3. "Product tour segment trigger 2026"
4. "Tour maintenance UI change drift 2026"
5. "Checklist activation gamification 2026"

## Expansion queries (authored by scripture-historian)

### Branch from "Userpilot Appcues Userflow 2026 comparison"
- "Pendo Guides vs Appcues product tour 2026"
- "product tour SaaS pricing comparison 2026"
- "Userflow Next.js App Router integration 2026"

### Branch from "Driver.js Shepherd.js open source tour 2026"
- "Driver.js 9 tutorial React integration 2026"
- "Shepherd.js 14 accessibility tooltip 2026"
- "Intro.js 8 product tour library 2026"

### Branch from "Product tour segment trigger 2026"
- "product tour feature flag gate user segment 2026"
- "onboarding tour event based trigger posthog mixpanel 2026"

### Branch from "Tour maintenance UI change drift 2026"
- "data-tour attribute stable selector strategy 2026"
- "Playwright test product tour selector CI 2026"
- "tour as code version control 2026"

### Branch from "Checklist activation gamification 2026"
- "onboarding checklist progress persistence localStorage 2026"
- "product activation milestone SaaS 2026"
- "confetti celebration animation onboarding 2026"

## Reference URLs to scrape (from Command Brief)
- https://driverjs.com/docs/
- https://shepherdjs.dev/docs/
- https://introjs.com/docs/
- https://userpilot.com/docs/
- https://userflow.com/docs

## Execution notes
- Run all 5 initial search queries in parallel via `firecrawl search`
- Cross-validate with `web_search_exa` on SaaS comparison and maintenance topics
- Scrape top 2-3 canonical docs pages per open-source library
- Target 8-12 external source notes, grouped by topic subfolder
- Stop at 6-month window; all queries use `--tbs qdr:m` or equivalent recency filter
