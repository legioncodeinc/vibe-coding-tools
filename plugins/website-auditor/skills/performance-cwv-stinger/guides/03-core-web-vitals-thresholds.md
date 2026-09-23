# 03. Core Web Vitals thresholds

Scores the Core Web Vitals leaf (4% of Technical deployment). Grounded in [raw/web-dev-articles-optimize-inp.md] (official Google documentation) and [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md] (vendor/analyst blog).

## The three published thresholds

| Metric | Threshold | Measurement point | Origin pass rate (2026) | Source |
|---|---|---|---|---|
| LCP (Largest Contentful Paint) | 2.5 seconds | p75 of page loads, mobile and desktop segmented | 78% | [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md] |
| INP (Interaction to Next Paint) | 200 milliseconds | p75 of page loads, mobile and desktop segmented | 72% | [raw/web-dev-articles-optimize-inp.md] [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md] |
| CLS (Cumulative Layout Shift) | 0.1 | p75 of page loads, mobile and desktop segmented | 84% | [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md] |

None of the three threshold numbers changed in the 2026 update; what changed is INP measurement methodology tightening and expanded CrUX soft-navigation coverage for single-page applications. [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md]

**Grounding caveat on the pass-rate percentages:** the 78/72/84 figures come only from the vendor/analyst blog, which describes itself as "an analyst synthesis rather than a news report" and does not cite a specific dataset snapshot or sample size. The official web.dev source confirms the 200ms INP threshold and the p75-across-mobile-and-desktop measurement convention, but does not itself state or corroborate any pass-rate percentage. Report the 78/72/84 figures as vendor-reported context (e.g. "typical of the broader web per a 2026 industry synthesis"), never as an independently confirmed statistic about the specific site under audit. [raw/web-dev-articles-optimize-inp.md] [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md]

## Which metric carries the most audit-relevant work

INP is the newest and lowest-passing of the three, and it is also the hardest to fix, it requires understanding the event loop, long tasks, and the rendering pipeline rather than just optimizing asset delivery. LCP is largely solved via framework-level image optimization, CDN edge delivery, and streaming SSR; CLS is mature with well-catalogued fixes (late images without dimensions, injected banners, font swaps). [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md] If a site's INP is failing while LCP and CLS pass, that is the expected shape of a 2026-era finding, not itself surprising; don't under-weight it just because it's common. See `guides/04-inp-diagnosis.md` for INP-specific diagnosis.

## The FID-to-INP trap

First Input Delay (FID), the metric INP replaced (official transition March 2024), measured only the delay before the browser began processing the FIRST interaction on a page, a narrow proxy that was "easy to game and easy to pass while still shipping an application that felt sluggish." INP instead measures the latency of the SLOWEST interaction across the entire page lifecycle. Sites reporting green FID scores were found to register INP values north of 400 milliseconds once measured properly. [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md]

**Audit implication:** if the target site's own visible tooling, badges, or third-party dashboards still reference FID, flag that as stale instrumentation, evidence the team hasn't revisited responsiveness since the 2024 transition, rather than treating a historical FID pass as evidence of good current responsiveness.

## Scoring

Apply the plugin-wide 0-6 scale per metric, or roll the three into a single leaf score if the audit-scoring template calls for one combined value, check `references/templates/performance-findings-template.md` for the current expected shape. Boolean pass/fail against the published threshold (per metric, per the p75 mobile/desktop-segmented convention) is the primary evidence; use the 0-6 scale to reflect how many of the three metrics pass and by what margin, not a single metric's raw number alone.

## Field-data availability

Absence of CrUX field-data coverage for a domain (common for lower-traffic sites) is not itself a failing score. State it explicitly as a limitation in the finding's field-data availability note, and rely on lab data as the primary evidence in that case, per `guides/05-external-audit-vs-lighthouse-ci.md`'s discussion of this Stinger's external-audit constraints.
