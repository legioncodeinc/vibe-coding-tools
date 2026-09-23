Distilled research for the external, unauthenticated Core Web Vitals audit this Stinger runs in wave W5 (reading `site-data/`), cross-linked with but not duplicating `lighthouse-pagespeed-worker-bee`'s repo-improvement CWV coverage. Coverage is thin: only two raw sources exist, both filed under the single research cluster "core-web-vitals-and-delivery," one official Google documentation and one vendor/analyst blog. Despite this Stinger's stated scope including a CDN/caching-header audit, neither raw source documents CDN caching headers, edge delivery, or cache-control strategy at all, both are INP-focused with one covering LCP/CLS pass-rate context only in passing. Any future claim about caching-header audit methodology is not yet researched and should not be treated as grounded until a dedicated source is pulled.

Research window: single sweep, 2026-08-18.

## 1. The three published Core Web Vitals thresholds and 2026 pass rates

| Metric | Threshold | Measurement point | Origin pass rate (2026) | Source |
|---|---|---|---|---|
| LCP (Largest Contentful Paint) | 2.5 seconds | p75 of page loads, mobile and desktop segmented | 78% | [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md] |
| INP (Interaction to Next Paint) | 200 milliseconds | p75 of page loads, mobile and desktop segmented | 72% | [raw/web-dev-articles-optimize-inp.md] [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md] |
| CLS (Cumulative Layout Shift) | 0.1 | p75 of page loads, mobile and desktop segmented | 84% | [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md] |

None of the three threshold numbers themselves changed in the 2026 update; what changed, per the vendor-blog source, is INP measurement methodology tightening and expanded CrUX soft-navigation coverage for single-page applications. [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md] The pass-rate percentages above come only from the vendor/analyst blog, which describes itself as "an analyst synthesis rather than a news report" drawing on web.dev documentation, Chrome team public writing, and the evolving CrUX dataset, it does not cite a specific dataset snapshot or sample size for these percentages. The official web.dev source (higher authority per source type) confirms the 200ms INP threshold and the p75-across-mobile-and-desktop measurement convention but does not itself state or corroborate any pass-rate percentage. Treat the 78/72/84 figures as vendor-reported, not independently confirmed by the official source. [raw/web-dev-articles-optimize-inp.md] [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md]

## 2. INP is the metric with the most audit-relevant work remaining

INP is the newest and lowest-passing of the three Vitals, and per the vendor blog it is also the hardest to fix because it requires understanding the event loop, long tasks, and the rendering pipeline rather than just optimizing asset delivery, in contrast to LCP (largely solved via framework-level image optimization, CDN edge delivery, streaming SSR) and CLS (mature, well-catalogued fixes: late images without dimensions, injected banners, font swaps). [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md] The official web.dev guide corroborates the difficulty framing directly: INP "assesses a page's overall responsiveness to user interactions by observing the latency of all qualifying interactions that occur throughout the lifespan of a user's visit," and the final INP value is the longest interaction observed (sometimes ignoring outliers), not just the first interaction. [raw/web-dev-articles-optimize-inp.md]

## 3. FID to INP transition: why an old-looking green score can be misleading

Both sources agree on the substance of this transition, which is directly relevant to any audit encountering a site whose team believes it already "passed" responsiveness. First Input Delay (FID), the metric INP replaced (official transition March 2024 per the vendor blog), measured only the delay before the browser began processing the FIRST interaction on a page, a narrow proxy that was "easy to game and easy to pass while still shipping an application that felt sluggish." INP instead measures the latency of the SLOWEST interaction across the entire page lifecycle, from tap to visible update. [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md] The practical consequence cited: sites reporting green FID scores were found to register INP values north of 400 milliseconds once measured properly, and "teams that passed Core Web Vitals under the FID regime and have not revisited their INP numbers since 2024 are likely carrying more performance debt than their dashboards suggest." [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md] Audit implication: if a target site's own tooling or dashboards still reference FID, flag that as stale instrumentation rather than evidence of good responsiveness.

## 4. Anatomy of an interaction: what INP actually decomposes into

The official web.dev guide breaks every measured interaction into three subparts, all of which sum to total interaction latency:

| Subpart | Definition | Common causes of delay | Source |
|---|---|---|---|
| Input delay | Starts when the user initiates an interaction, ends when the event callback begins running | Main-thread activity from script parsing/compiling, fetch handling, timer functions, or overlapping interactions | [raw/web-dev-articles-optimize-inp.md] |
| Processing duration | Time for the event callback(s) to run to completion | Expensive synchronous work inside the handler; not yielding to the main thread | [raw/web-dev-articles-optimize-inp.md] |
| Presentation delay | Time for the browser to present the next frame containing the visual result | Layout/paint cost of the resulting DOM update | [raw/web-dev-articles-optimize-inp.md] |

During page load specifically, script evaluation, parsing, compiling, and executing newly fetched JavaScript, can itself create long tasks on the main thread that extend input delay before the page is fully interactive, even though the page has visually rendered. [raw/web-dev-articles-optimize-inp.md]

## 5. Diagnosing slow interactions: field data first, lab data second

The official guide's recommended sequence: start with field data (ideally a Real User Monitoring provider that reports not just the INP value but which specific interaction caused it, its type, and whether it happened during or after page load). Absent a RUM provider, use PageSpeed Insights to read CrUX (Chrome User Experience Report) data, Google's Core Web Vitals field dataset covering millions of sites, but CrUX "often does not provide the contextual data you'd get from a RUM provider," so a RUM solution is still recommended when available. Once field data flags a problem, move to lab testing: reproduce by following common user flows and specifically testing interactions that occur during page load, when the main thread is typically busiest. [raw/web-dev-articles-optimize-inp.md] For this Stinger's external-audit context (no RUM access to the target site), this means PageSpeed Insights/CrUX is likely the only field-data channel available, and its documented contextual-data gap should be disclosed in any audit output that leans on it.

## 6. Remediation levers named in the raw archive

- Reduce input delay by minimizing main-thread contention during page load (script evaluation/parsing/compiling of newly fetched JS is a named cause). [raw/web-dev-articles-optimize-inp.md]
- Yield to the main thread often inside event callbacks: do as little work as possible in a callback, and where logic is unavoidably complex, break it into separate tasks so the collective work does not become one long task. [raw/web-dev-articles-optimize-inp.md]
- Framework-level concurrency features can help but require deliberate adoption: React's `useTransition` and `useDeferredValue` mark state updates as non-urgent so the browser can yield to user input during expensive renders; merely upgrading to React 18/19 without using these APIs does not improve INP. Angular's signal-based reactivity (stable since Angular 17) is described as "proven effective at reducing" the same class of problem, though the source's sentence describing the specific mechanism is cut off in the archived text and should not be over-cited beyond "signals help, mechanism not fully captured here." [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md]

## 7. Gap note: CDN/caching-header audit is unresearched

This Stinger's own SKILL.md and Bee description name a "CDN/caching-header audit" as part of its scope. Neither raw source addresses CDN caching behavior, `Cache-Control`/`ETag`/`Age` header interpretation, edge/CDN provider fingerprinting, or stale-while-revalidate style caching strategy in any form, the vendor blog's LCP discussion mentions "CDN edge delivery" once as a contributing factor to LCP pass-rate improvement generally, with no header-level or audit-methodology detail. [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md] Do not fabricate caching-header guidance from general knowledge; this gap should be closed by a dedicated research pass before that half of the Stinger's scope is authored.
