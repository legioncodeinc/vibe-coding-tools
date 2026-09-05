# Vercel Observability, Web Analytics, Speed Insights

- URL: https://vercel.com/docs/observability ; https://vercel.com/docs/speed-insights ; https://vercel.com/docs/analytics
- Fetched: 2026-08-14
- Source type: Official Vercel docs
- Component: Observability

## Content

### Three distinct, complementary products - do not conflate

1. **Observability** (`/docs/observability`): framework-aware infrastructure insights - Vercel Functions, External APIs, Edge Requests, Middleware, Fast Data Transfer, Image Optimization, ISR, Blob, Build Diagnostics, AI Gateway, Queues, External Rewrites, Microfrontends. Available at Team level and/or Project level depending on data source (see table in source). Free on all plans with limitations; **Observability Plus** (Paid Pro/Enterprise only - not included in Pro Trial) adds more metrics, higher limits, longer retention. Includes "Notebooks" (save/organize queries) and a "Debug production errors" CLI workflow for stepping through 500 errors.
2. **Speed Insights**: Core Web Vitals dashboard (FCP, LCP, Real Experience Score/RES) with time-series (P75/P90/P95/P99), a Kanban-style "needs improvement" board by route/path/element, and a geographic map view. Tracks data across **all deployed environments including preview**, not just production.
3. **Web Analytics**: visitor-level analytics (who's visiting, not performance). Separate quickstart/setup from Speed Insights.

### Practical routing

"To understand who is visiting your site, use Web Analytics." "To set up Speed Insights... see the Quickstart." "To monitor your site's performance, use Speed Insights." These are positioned as complementary, not redundant - Speed Insights answers "is it fast," Web Analytics answers "who's here," Observability answers "what's the infrastructure doing."

### Gap in this research pass

No raw source was fetched for the exact Speed Insights/Web Analytics **npm package install and code-level wiring** for SvelteKit specifically (e.g. `@vercel/speed-insights/sveltekit`, `@vercel/analytics/sveltekit` component names and hook placement). Guides in this skill should flag that the exact package import path needs a live-docs check before scaffolding, rather than guessing an import path - this mirrors the WorkOS skill's precedent of flagging an unresolved package-name question instead of inventing one.
