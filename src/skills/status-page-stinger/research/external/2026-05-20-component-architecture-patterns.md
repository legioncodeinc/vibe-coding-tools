---
source_type: blog
authority: high
relevance: high
topic: component-architecture
url: https://upstat.io/blog/multi-service-status-pages
date_accessed: 2026-05-20
---

# Status Page Component Architecture and Grouping Patterns (2026)

## Key findings

- **Component = a single service, feature, or infrastructure unit** that customers depend on. Examples: Website, API, Authentication, Payment Processing, CDN, Database, Webhooks, Mobile App.

- **Two levels of hierarchy in major platforms**:
  - **Components**: individual status items with their own status indicator.
  - **Component Groups**: containers for related components (Statuspage's terminology; other platforms use equivalent concepts).
  - Two levels is the maximum hierarchy depth in Statuspage. Avoid creating three or more levels of nesting.

- **Standard component status vocabulary** (consistent across Statuspage, Instatus, Cachet, Uptime Kuma):
  - Operational: functioning as expected.
  - Degraded Performance: slower than normal, intermittent errors.
  - Partial Outage: some features or customer segments affected.
  - Major Outage: service is completely down.
  - Under Maintenance: planned work in progress.
  - **Note**: "Degraded Performance" should NOT be used when customers cannot complete core workflows - that is a Partial or Major Outage.

- **Grouping heuristics** (from multi-source 2026 research):
  1. **By customer-facing product**: Group services by the features customers recognize (e.g., "Checkout," "Account Access," "API"). Most recommended for B2C and B2B SaaS products.
  2. **By team ownership**: Works when distinct teams serve distinct customer segments. Can create internal naming confusion for customer-facing pages.
  3. **By infrastructure layer**: Frontend / Backend / Data / Integrations. Better for technical audiences (e.g., internal/private status pages for engineering teams).
  4. **By geography/region**: US Region, EU Region, APAC Region. Appropriate for global services where regional outages are common.

- **Anti-patterns**:
  - **1 component for everything** ("All Services"): Provides no diagnostic signal - customers can't tell which feature is affected.
  - **50+ granular components**: Cognitive overload; customers don't know which component matters to them.
  - **Internal service names as component labels**: e.g., "auth-service-prod-3" instead of "Authentication." Use customer-facing language.

- **Recommended component count heuristics**:
  - 5-15 total components is the sweet spot for most SaaS products.
  - 3-7 group labels maximum; more than 7 groups requires excessive scanning.
  - Limit groups to 5-7: "More groups require excessive scanning and cognitive load."
  - Place most critical services at top; collapse non-critical groups by default.

- **Third-party component status feeds**: Statuspage supports 150+ third-party components (Stripe, AWS, Twilio, Cloudflare, etc.) that auto-sync from those services' status pages. This allows your status page to surface dependency outages even if your own services are fine. Critical for SaaS products that depend on payment processors, email providers, or cloud infrastructure.

- **Component subscriptions** (granular notifications): Allow users to subscribe to specific components only. Reduces notification fatigue significantly. Critical for large, multi-feature products. Available on Statuspage Business ($399/month+), Instatus Pro+, Better Stack (all plans).

- **Dependency mapping display**: When a database fails, dependent API and web dashboard components should also show degraded/outage status. Some platforms (OneUptime, catalog-driven approaches) support automatic cascade - most require manual updates. Statuspage displays component status changes but does NOT trigger subscriber notifications for component changes alone - only incident creation triggers notifications.

## Quotes / data points

- "Components can have two levels of hierarchy using component groups. A component group can house multiple components within it and can be expanded to see a detailed view of the individual components." (Atlassian official docs)
- "Component status changes do not trigger notifications. Only incidents trigger subscriber notifications." (Atlassian official docs - critical architectural note)
- "Limit groups to 5-7: More groups require excessive scanning and cognitive load. If you need more than seven groups, consider whether your status page displays too many services or uses overly granular grouping." (Upstat.io, 2025)
- "Meaningful group names: Use labels customers recognize. 'Core Platform' means nothing; 'Account and Authentication' provides clear scope." (Upstat.io)
- "One of the first things you'll want to do when setting up your page is figure out which individual services or features you want to show the status of... ask yourself which areas of your product your users depend on most." (Atlassian official docs)

## Open questions surfaced

- Is there a documented best practice for handling third-party dependency components when the dependency is partially responsible for an outage but your own services remain functional?
- For geographic component grouping (US/EU/APAC), should each region have its own set of service components, or is a single service component with a region filter sufficient?
