# Research Summary: product-tour-onboarding-ui-stinger

- **Depth tier:** normal
- **Time window:** 2025-11-20 to 2026-05-20 (6 months)
- **Files written:** 8 external source notes (4 from prior run + 4 from this completion run)
- **Queries executed:**
  - "Userpilot Appcues Userflow 2026 comparison" → `2026-05-20-saas-platform-comparison.md`
  - "Driver.js Shepherd.js open source tour 2026" → `2026-05-20-oss-tour-libraries.md`
  - "Driver.js React integration official docs" → `2026-05-20-driverjs-react-integration.md`
  - "Tour maintenance UI change drift 2026" → `2026-05-20-tour-maintenance-unbreakable.md`
  - "Product tour segment trigger feature flag gate user segment 2026" → `2026-05-20-segment-triggers-feature-flags.md`
  - "Onboarding checklist activation gamification progress SaaS 2026" → `2026-05-20-checklist-activation-gamification.md`
  - "Shepherd.js 14/15 React integration accessibility tutorial 2025 2026" → `2026-05-20-shepherdjs-react-integration.md`
  - "Product tour analytics measuring effectiveness completion rate funnel 2026" → `2026-05-20-tour-analytics-effectiveness.md`

---

## Five most influential sources

**1. `2026-05-20-tour-maintenance-unbreakable.md`** (Product Fruits, March 2026): `relevance: critical`

The single most actionable source in the research folder. Defines the four-strategy drift-prevention framework: dynamic URL wildcards, text targeting, data attributes, and analytics-driven maintenance. Introduces the "data attributes are a formal agreement between CX and engineering" framing that anchors `guides/06-maintenance-and-drift.md`. Provides the `data-component="MainSaveButton"` concrete HTML pattern. The "two-for-one" insight (same `data-*` attributes improve Cypress/Selenium test coverage) is a high-value selling point for engineering buy-in. stinger-forge should build the entire maintenance guide around this source's four-strategy taxonomy.

**2. `2026-05-20-checklist-activation-gamification.md`** (Jimo, February 2026): `relevance: critical`

Definitive 2026 treatment of onboarding checklist design. Provides the activation-vs-completion distinction (the most important conceptual anchor for the stinger), the six-stage SaaS onboarding framework, the three gamification mechanics (endowed-progress, Zeigarnik, variable-ratio), and quantified benchmarks (50%+ activation lift from behavioral triggers + step-level analytics). The "three to five steps max" rule and "behavioral triggers, not login triggers" principle are direct output for `guides/05-checklist-activation.md`.

**3. `2026-05-20-saas-platform-comparison.md`** (Userpilot blog, 2026): `relevance: critical`

The primary source for `guides/01-platform-selection.md`. Provides current 2026 pricing for all four major SaaS platforms, G2 ratings, and the critical callout that Appcues locks checklists behind its $879/month Growth tier. The "MAU cost trap" analysis (Appcues + analytics vs. Userpilot all-in) is a decisive factor in platform selection for sub-10K MAU teams. stinger-forge should use this as the price anchor in the decision matrix.

**4. `2026-05-20-segment-triggers-feature-flags.md`** (userTourKit + OneUptime, 2026): `relevance: critical`

Covers the three-gate trigger idiom (`hasSeenTour && isInSegment && flagEnabled`) that every tour implementation needs. Introduces userTourKit as a 2026 headless React library with native PostHog flag sync, Next.js App Router adapter, and `usePersistence` / `useRoutePersistence` hooks. The "don't show again" persistence contract is documented as a required companion to every trigger. stinger-forge should use the three-gate TypeScript snippet in `guides/04-segment-triggers.md`.

**5. `2026-05-20-tour-analytics-effectiveness.md`** (Tandem, May 2026): `relevance: high`

Provides the CFO-ready measurement framework: activation rate, time-to-first-value, CAC payback, not tour completion %. Anchors `templates/tour-audit-report.md` with the attribution chain (guidance → activation event → Day 30 retention → renewal). The Chameleon 2025 benchmark (3-step → 72%, 7-step → 16%) is the quantitative justification for the "3-5 steps max" rule. Stage-based conversion benchmarks (Series A through C+) give stinger-forge the maturity-aware framing needed for the qualification guide.

---

## Five open questions

1. **Userflow + Next.js App Router (2026):** Does Userflow support Next.js App Router natively without a client-only wrapper? The Command Brief flags this as an open question; research did not conclusively answer it. Before stinger-forge recommends Userflow for Next.js teams, this should be verified against the Userflow docs (`userflow.com/docs`).

2. **Pendo Guides programmatic API:** Is there a stable Pendo Guides REST or JavaScript API for programmatic tour management (vs. only the visual builder)? The research found Pendo's AI Resource Center feature (Pendomonium 2026) but no confirmed programmatic trigger API. This matters for the `guides/01-platform-selection.md` "code-depth" axis.

3. **userTourKit production maturity:** userTourKit (v0.11.0, May 2026) appears in the research as a strong open-source alternative, but its GitHub star count, production adoption, and maintenance funding are unknown. Before recommending it alongside Driver.js and Shepherd.js in the stinger, stinger-forge should verify its GitHub repo health.

4. **Shepherd.js v14 vs v15 migration scope:** The Command Brief specifies Shepherd.js 14.x; research found the library is now at v15.2.2 (March 2026), with breaking changes in v15.0.0 (Svelte removal, vanilla TypeScript). stinger-forge should document the migration path in `guides/03-driver-js-shepherd-js.md` and decide whether to target v15 as the canonical version.

5. **PostHog tour analytics depth:** The research found that PostHog provides step-level drop-off analytics for product tours (from posthog.com/docs/product-tours/analytics), but did not capture the specific HogQL query or dashboard configuration needed to build the tour-to-activation funnel. stinger-forge should fetch the PostHog tour analytics docs page for the concrete query example to include in `templates/tour-audit-report.md`.

---

## Sources to re-fetch if needed

- `https://docs.shepherdjs.dev/recipes/react/`: the official Shepherd.js React recipe page (separate from the LogRocket tutorial). Returned only an index in the search; a direct scrape would yield the canonical code examples.
- `https://userflow.com/docs`: the Userflow developer docs were listed in the research plan but not scraped. Required to answer Open Question 1 (Next.js App Router compatibility).
- `https://posthog.com/docs/product-tours/analytics`: partial content retrieved via search summary; a direct scrape would provide the HogQL funnel query for the audit template.
- `https://github.com/shipshapecode/shepherd/blob/main/CHANGELOG.md`: the full Shepherd.js CHANGELOG was fetched (139KB, 2339 lines) but not processed into a research file due to size. If stinger-forge needs specific v14→v15 migration details, re-fetching and extracting the relevant sections is recommended.
