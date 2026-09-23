# Guide 04: Apply stage-specific checklists

## What this guide covers

What to actually look for at each funnel stage, once a checkpoint's screenshots exist. Organized by stage because the research is explicit that a generic "does this look good" pass misses stage-specific failure modes that dominate real drop-off.

## Entry / landing stage

- Headline clarity: value proposition statable in under 10 words [raw/www-apexure-com-blog-landing-page-audit-checklist.md].
- Message match between the referring intent (ad, search query, nav link) and the page's own headline. This is named as the single most common conversion killer across the source's own audits, appearing in over half of them, illustrated by a cited case where fixing a message mismatch took a page from 1.02% to 6.09% conversion (a 500% increase, confirmed by A/B test) [raw/www-apexure-com-blog-landing-page-audit-checklist.md].
- Hero image relevance: reinforces the offer, is not generic decorative stock [raw/www-apexure-com-blog-landing-page-audit-checklist.md].
- CTA visible without scrolling, on both the desktop and mobile screenshot [raw/www-apexure-com-blog-landing-page-audit-checklist.md].
- At least one trust signal visible above the fold [raw/www-apexure-com-blog-landing-page-audit-checklist.md]. The same source attributes roughly 40% of all its audit findings to above-the-fold issues specifically, so weight this checkpoint accordingly rather than treating it as one line among many.
- Benefit-to-feature ratio no worse than 2:1 in the visible copy; specificity over vague claims; objection-handling for the top 2-3 objections of the target audience (cross-reference `02-positioning/` for what those objections are); reading level around Grade 6-8 [raw/www-apexure-com-blog-landing-page-audit-checklist.md].
- CTA copy: minimum 4.5:1 button contrast ratio, action-specific button text over generic ("Submit" is cited as converting roughly 3% worse than an action-specific phrase like "Get My Free Quote"), one primary action per screen [raw/www-apexure-com-blog-landing-page-audit-checklist.md].

## Product / landing page stage

- Message match to whatever referred the visitor here specifically (not just the entry page's own match) [raw/www-pages-report-blog-ecommerce-cro-audit.md].
- Price and total-cost clarity: shipping expectations surfaced on the product page itself, not three steps later [raw/www-pages-report-blog-ecommerce-cro-audit.md].
- Proof (reviews, ratings, guarantees) above the fold or one scroll away [raw/www-pages-report-blog-ecommerce-cro-audit.md].
- A single primary action (Add to Cart), everything else visually secondary [raw/www-pages-report-blog-ecommerce-cro-audit.md].

## Cart stage

- Full estimated total, shipping and tax included, shown before checkout starts [raw/www-pages-report-blog-ecommerce-cro-audit.md].
- Quantities and removal editable without page reloads or dead ends [raw/www-pages-report-blog-ecommerce-cro-audit.md].
- Cart reachable and persistent, especially on the mobile screenshot [raw/www-pages-report-blog-ecommerce-cro-audit.md].
- Upsells do not push the total meaningfully further from what the buyer expected [raw/www-pages-report-blog-ecommerce-cro-audit.md].
- Frame the cart as a decision checkpoint, not a renegotiation point, when writing findings; Baymard's meta-analysis puts average cart abandonment at 70.22%, though 42% of US abandoners self-report as "just browsing," not a fixable leak, so a high abandonment number alone is not a finding without a specific, fixable checkpoint failure behind it [raw/www-pages-report-blog-ecommerce-cro-audit.md].

## Checkout stage

Audit this stage in the priority order the research gives, which is drawn directly from Baymard's ranked reasons US shoppers with real purchase intent abandoned checkout [raw/www-pages-report-blog-ecommerce-cro-audit.md]:

1. **Extra costs too high (40% of abandonments).** Audit where shipping cost first appears in the funnel. If it's only visible at the final step, that is the single biggest fixable leak at this stage; check whether a "free shipping over $X" threshold is stated earlier, ideally on the product page.
2. **Delivery too slow (20%).** Check whether a delivery estimate is shown before payment, not only in a post-purchase confirmation email.
3. **Didn't trust the site with card info (19%).** Check for recognized payment badges and no visual jank on the payment step itself.
4. **Forced account creation (18%).** Check that guest checkout is offered, full stop; an account should be asked for only after the order completes, if at all.
5. **Checkout too long or complicated (17%).** Count the form fields. Fewer is better; flag anything that looks unnecessary for order fulfillment.
6. **Site errors or crashes (17%).** Note anything captured during the walk itself (guide 03's failure-state capture instruction feeds this directly).

The source is explicit about what does NOT belong in this stage's findings: hero copy, brand fonts, homepage carousels. Nearly every real checkout abandonment reason is operational, not aesthetic [raw/www-pages-report-blog-ecommerce-cro-audit.md].

## Speed as a cross-stage multiplier

Note page-load feel at each checkpoint as context, not as this Drone's primary metric; Core Web Vitals methodology itself is owned by `performance-cwv-stinger` / `lighthouse-pagespeed-stinger`, not this Stinger. The one data point worth carrying into a finding when it's stark: cited Portent data puts conversion at 3.05% for a 1-second load versus 0.67% at 4 seconds [raw/www-pages-report-blog-ecommerce-cro-audit.md].

## Where this checklist is silent

No checklist item above was sourced for a standalone product-listing/category page (as distinct from a product detail page); if the funnel includes a distinct category/filter step, apply the Entry-stage message-match and CTA-visibility checks as the closest sourced analogue, and label any category-specific judgment `[subjective]`.
