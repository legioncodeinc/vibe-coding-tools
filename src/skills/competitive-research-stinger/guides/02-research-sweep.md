# Guide 02: The Research Sweep

## Aggregator-first, not one search per competitor

Search for "best <category> software" or "top N <category> tools" style roundup articles rather than searching for individual company names one at a time. A single good roundup reliably names 10 to 15 real competitors. Fetching 2 to 3 different roundups (they rarely agree completely, which is useful) plus the subject company's own site is normally enough to reach a 25 to 35 company list in well under 10 tool calls [`../references/research/distilled-competitive-research.md`, section 2].

Search query pattern that works: `best <category> tools <current year>` and `<category> software comparison`. Vary the category noun across searches (e.g. "visitor identification," "visitor deanonymization," "website visitor tracking") since different publishers use different terms for the same category, and each variant surfaces a partly-different roundup set.

## Source hierarchy

When roundups disagree on a fact (price, feature, match rate), prefer in this order:
1. The vendor's own pricing/product page (fetch it directly if the figure matters, e.g. for a battlecard)
2. A roundup that cites a specific number with attribution
3. A roundup that states a number with no attribution

Never present a "custom quote" or gated-pricing company with a fabricated number. State "custom quote" or "not disclosed" plainly in the workbook; a false precision is worse than an honest gap.

## What to capture per company

At minimum, for every company that will get a row: name, website, category (per Guide 01's taxonomy), starting price or pricing model, one or two key differentiating features, target market, and a one-line comparison note written relative to the subject company (not a generic description). The comparison note is what makes the row useful; a company name and a price alone is not competitive research, it is a directory listing.

## Efficiency note

Batch independent fetches in a single tool-call round rather than fetching sequentially when the fetches do not depend on each other's results, per standard parallel-tool-use practice. A research sweep for a 30+ company list is comfortably done in 3 to 5 total rounds of tool calls when batched this way.
