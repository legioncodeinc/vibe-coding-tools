# Guide 01: Discover the funnel and sequence checkpoints

## What this guide covers

How to determine which pages this Drone walks, and in what order, before any screenshot is taken.

## Procedure

1. Read `02-positioning/` for the funnel definition produced by `icp-positioning-wasp-drone`: the site's conversion actions and buyer stages. This Drone does not derive the funnel itself, it consumes the definition already produced upstream, per the shared workspace contract in prd-012-visual-funnel.
2. Sequence the walk in purchase order, not visual interest order. The research is explicit on this point: most audits start at the homepage hero and never reach checkout, which the source calls backwards, because ecommerce loses most of its money after the add-to-cart click, not before it [raw/www-pages-report-blog-ecommerce-cro-audit.md]. Apply the same discipline to lead-gen funnels: sequence toward the form submission, not away from it.
3. For a commerce funnel, use the five-step purchase-ordered walk as the default checkpoint skeleton: entry/landing, product or category discovery, product/landing page, cart, checkout, then confirmation if interactive mode is ON [raw/www-pages-report-blog-ecommerce-cro-audit.md].
4. For a lead-gen funnel (no cart), adapt the same discipline: entry/landing, supporting content or proof pages the site's own navigation surfaces toward conversion, the lead-capture form itself, then confirmation if interactive mode is ON.
5. Cap the walk at 25 pages (PRD-012 overview). If the funnel as defined by `02-positioning/` implies more than 25 genuinely distinct checkpoints, prioritize by revenue or lead exposure: rank pages by estimated traffic and price/lead-value where that data exists, and audit the highest-exposure pages first, mirroring the ecommerce source's own instruction to rank product templates by sessions times price rather than auditing everything evenly [raw/www-pages-report-blog-ecommerce-cro-audit.md].
6. Before trusting any drop-off number handed to this Drone from another Drone's output (analytics, traffic estimates), treat it as provisional evidence to corroborate visually, not ground truth. The research is explicit that a funnel analysis inherits every error in its inputs, and names the specific failure mode of comparing the wrong benchmark class (sitewide conversion vs. dedicated-landing-page conversion) to the wrong traffic [raw/junto-fr-en-blog-cro-audit.md] [raw/www-pages-report-blog-ecommerce-cro-audit.md].
7. Write the sequenced checkpoint list to `05-funnel/checkpoint-log.md` before capturing anything, using `references/templates/checkpoint-log-template.md`. This list is the walk's plan; deviations during the walk (a checkpoint that turned out unreachable) get logged, not silently substituted.

## Common failure this guide prevents

Auditing the homepage and product pages in detail, then treating cart and checkout as an afterthought. The research names this exact failure pattern and the reason it matters: cart abandonment averages 70.22% (Baymard Institute meta-analysis of 50 studies) and checkout is where extra costs, forced account creation, and site errors do the most damage [raw/www-pages-report-blog-ecommerce-cro-audit.md]. A funnel walk that shortchanges those stages misses most of the recoverable revenue.
