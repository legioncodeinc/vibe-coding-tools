# Buyer-readiness scoring worksheet

Copy-ready worksheet `icp-positioning-wasp-drone` fills in to classify the audited site's pages and conversion offers against a buyer-readiness model, writing the result to `02-positioning/buyer-readiness.md`.

## Grounding and an explicit collapse notice

**This worksheet applies a two-stage model** (awareness-stage visitor vs. decision-stage visitor), per PRD-005's exact instruction. **This is stated here plainly, not hidden: the distilled research found no two-stage buyer-readiness model in any of the five archived sources.** Two independent sources converge on a **three-stage** model instead: awareness / consideration / decision [raw/321webmarketing-com-audit-conversion-paths-buyer-stage.md], and the synonymous TOFU / MOFU / BOFU [raw/tbstdigital-com-au-structuring-website-tofu-mofu-bofu.md]. Per the distilled research's own recommendation ("if `icp-positioning-wasp-drone`'s two-stage model needs firmer grounding, it should be built as an explicit collapse of the three-stage awareness/consideration/decision model documented here, with the collapse rule stated in the Drone's own guide, not sourced as if a two-stage model exists natively in the literature"), this worksheet's two stages are defined as an explicit collapse:

- **Two-stage "awareness"** = source three-stage **awareness**.
- **Two-stage "decision"** = source three-stage **consideration + decision**, collapsed together.

**Why collapse consideration into decision rather than into awareness (judgment call, not sourced):** the source model's own offer-type descriptions place consideration-stage visitors closer in commercial intent to decision-stage visitors ("higher-value/comparative" offers: comparison guides, in-depth webinars, ROI calculators, case studies) than to awareness-stage visitors (low-commitment: newsletter, educational download, content-series subscription). [raw/321webmarketing-com-audit-conversion-paths-buyer-stage.md] Collapsing consideration into decision keeps "any visitor who is actively evaluating solutions, even before choosing a specific vendor" on the higher-intent side of the split, which better serves this pair's stated downstream purpose (framing content and funnel analysis for prd-006/keyword-intelligence). This reasoning is this Stinger's own; flag it as a judgment call in the output, do not present the collapse rule as independently sourced.

## Page-type to stage mapping (source three-stage vocabulary, before collapse)

| Source stage | TOFU/MOFU/BOFU synonym | Typical page types | Typical offers |
|---|---|---|---|
| Awareness | TOFU | Homepage, blog/articles, resource hub, campaign landing pages, high-level about page [raw/tbstdigital-com-au-structuring-website-tofu-mofu-bofu.md] | Newsletter signup, educational PDF/guide download, content-series subscription, simple assessment tool [raw/321webmarketing-com-audit-conversion-paths-buyer-stage.md] |
| Consideration | MOFU | Service/solution overviews, case studies, detailed about-us, downloadable resources, events/webinars [raw/tbstdigital-com-au-structuring-website-tofu-mofu-bofu.md] | Comparison guides, in-depth webinars, ROI calculators, case studies [raw/321webmarketing-com-audit-conversion-paths-buyer-stage.md] |
| Decision | BOFU | Pricing, contact us, book-a-demo, testimonials, FAQs [raw/tbstdigital-com-au-structuring-website-tofu-mofu-bofu.md] | Consultation requests, demo sign-ups, free trial activations, pricing-page interactions [raw/321webmarketing-com-audit-conversion-paths-buyer-stage.md] |

## Two-stage worksheet table (this Drone's actual output)

| # | Page or offer | Source three-stage classification | Collapsed two-stage classification (awareness / decision) | Evidence pointer |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

## Stage/traffic mismatch check

Per the sourced four-step audit procedure: (1) map every conversion mechanism to a stage (done above); (2) identify the highest-traffic pages (use whatever traffic signal is available externally, e.g. internal-link density as a proxy, or state "no traffic data available externally" if none is); (3) cross-reference the two to find stage/traffic mismatches, the named example being "high traffic going to awareness-stage blog posts that have no relevant conversion path"; (4) validate with behavioral data (A/B testing, heatmaps, session recordings) only where available to this audit. [raw/321webmarketing-com-audit-conversion-paths-buyer-stage.md] Step 3's finding is presented in the source as "the single largest opportunity for improving lead capture" - if a mismatch is found, name it explicitly in the output rather than only listing the raw classification table.

## Summary fields (write these below the table)

- Awareness-stage pages/offers found: ____
- Decision-stage pages/offers found (consideration + decision, collapsed): ____
- Stage/traffic mismatch identified: yes / no / no traffic data available externally
- Confidence in this buyer-readiness framing overall: high / medium / low, with one-line justification
