# 03. Buyer-readiness model

How `icp-positioning-wasp-drone` builds the two-stage buyer-readiness framing PRD-005 requires (goals: "Applies a two-stage buyer-readiness model (e.g. awareness-stage visitor vs. decision-stage visitor) to frame later content and funnel analysis").

## Read this before writing any output: the grounding is an explicit collapse, not a native source

This is the single most important honesty note in this pair's authorship. The distilled research is unambiguous: **no source in this pair's five-source archive describes a two-stage buyer-readiness model.** Two independent sources converge on a **three-stage** model instead:

- Awareness / consideration / decision, from a conversion-path buyer-stage audit methodology. [raw/321webmarketing-com-audit-conversion-paths-buyer-stage.md]
- TOFU / MOFU / BOFU, the same three stages under a page-level funnel vocabulary. [raw/tbstdigital-com-au-structuring-website-tofu-mofu-bofu.md]

The distilled research's own words on this: "the two-stage framing in the PRD reads as a deliberate simplification of the three-stage industry-standard model (collapsing 'consideration' into either the awareness or decision side, unstated which), not a variant this research found independently attested anywhere," and its explicit recommendation is that "if `icp-positioning-wasp-drone`'s two-stage model needs firmer grounding, it should be built as an explicit collapse of the three-stage awareness/consideration/decision model documented here, with the collapse rule stated in the Drone's own guide, not sourced as if a two-stage model exists natively in the literature." This guide is that stated collapse rule.

## The collapse rule

- **Two-stage "awareness"** = source three-stage **awareness** (unchanged).
- **Two-stage "decision"** = source three-stage **consideration + decision**, merged into one bucket.

**Why merge consideration into decision rather than into awareness** (this Stinger's own engineering judgment call, not sourced): the source model's offer-type descriptions place consideration-stage visitors closer in commercial intent to decision-stage visitors than to awareness-stage visitors. Awareness-stage offers are low-commitment (newsletter, educational download, content-series subscription, simple assessment tool); consideration-stage offers are already "higher-value/comparative" (comparison guides, in-depth webinars, ROI calculators, case studies), a meaningfully closer intent signal to decision-stage's high-commitment offers (consultation requests, demo sign-ups, trial activations, pricing-page interactions) than to awareness-stage's low-commitment ones. [raw/321webmarketing-com-audit-conversion-paths-buyer-stage.md] Merging on this side keeps "actively evaluating solutions, even before choosing a specific vendor" on the higher-intent bucket, which better serves this framing's stated downstream purpose (content and funnel analysis in later waves). State this reasoning in the output when the two-stage framing is used, rather than presenting the two-stage split as a standard model.

## Procedure

1. **Classify every page and every conversion offer identified in `02-conversion-taxonomy.md`** against the source three-stage vocabulary first, using the page-type and offer-type mapping table in `references/templates/buyer-readiness-scoring-worksheet.md`:
   - Awareness/TOFU: homepage, blog/articles, resource hub, campaign landing pages, high-level about page. [raw/tbstdigital-com-au-structuring-website-tofu-mofu-bofu.md]
   - Consideration/MOFU: service/solution overviews, case studies, detailed about-us, downloadable resources, events/webinars. [raw/tbstdigital-com-au-structuring-website-tofu-mofu-bofu.md]
   - Decision/BOFU: pricing, contact us, book-a-demo, testimonials, FAQs. [raw/tbstdigital-com-au-structuring-website-tofu-mofu-bofu.md]
2. **Apply the collapse rule** to produce the final two-stage classification per page/offer.
3. **Run the stage/traffic mismatch check.** Per the sourced four-step audit procedure: map every conversion mechanism to a stage (step 1, done above); identify the highest-traffic pages using whatever external proxy is available (internal-link density, prominence in navigation) or state plainly that no traffic data is available externally; cross-reference the two to find mismatches, the named example being "high traffic going to awareness-stage blog posts that have no relevant conversion path"; validate with behavioral data only where available to this audit (this Drone will typically have none, since it observes the site externally). [raw/321webmarketing-com-audit-conversion-paths-buyer-stage.md] The source names this mismatch check "the single largest opportunity for improving lead capture" - if found, state it explicitly.
4. **Write the result** to `02-positioning/buyer-readiness.md` using `references/templates/buyer-readiness-scoring-worksheet.md`, with the collapse rule and its reasoning restated in the output (not just applied silently), and a stated confidence level for the framing as a whole.

## What this does NOT license

Do not use this collapse as precedent for inventing other unsourced simplifications elsewhere in this Drone's output. This specific collapse is authored here because PRD-005 explicitly required a two-stage model as a binding product decision; absent such an explicit instruction, prefer stating the fuller three-stage/TOFU-MOFU-BOFU model this archive actually supports.
