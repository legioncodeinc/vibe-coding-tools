# Distilled Research: Competitive Research, XLSX Workbooks, and Branded PDF Reports

Dense synthesis of this stinger's research archive. Every claim below cites its raw source; read the raw file when a claim needs tracing back to its origin.

## 1. Competitor identification and categorization

Do not build a flat list of "companies that seem similar." Sort every discovered company into one of five roles before deciding how it should appear in the deliverable [raw/competitive-research--landscape-mapping--umbrex-framework.md]:

| Role | Definition | Treatment in the output |
|---|---|---|
| Direct competitor | Same segment, same kind of solution | Full comparison row, feature-gap analysis, battlecard candidate |
| Substitute | Different approach, same customer need | Comparison row, but flag explicitly as "different workflow" or "adjacent category" |
| Potential entrant | Adjacent player capable of entering | Note in market-pattern narrative, not a full row unless already active |
| Complement | Enhances the subject's value prop rather than competing | Exclude from competitive tables, mention only if relevant to strategy |
| Gatekeeper | Platform, reseller, distributor, or regulator controlling access | Out of scope for a competitor workbook; belongs in a go-to-market analysis instead |

Common mapping dimensions to capture per company, so the workbook supports more than one cut of the data: customer segment, price tier and published-vs-gated pricing, route to market, geography/regulatory posture, and core capability strength [raw/competitive-research--landscape-mapping--umbrex-framework.md]. The category itself (e.g. "visitor deanonymization" vs "lead generation database") should emerge from what the collected companies actually do, not be decided before research starts [raw/competitive-research--session-build--ospry-xlsx-pdf-case-study.md].

## 2. Research sweep technique

The efficient path is aggregator roundups, not one search per competitor. A "best X software" or "top N tools" blog post reliably surfaces 10 to 15 named competitors per fetch; 2 to 3 full fetches of different roundups plus the subject company's own site is enough to build a 30+ company list in a handful of tool calls [raw/competitive-research--session-build--ospry-xlsx-pdf-case-study.md]. Always fetch the subject company's own site FIRST, before any competitor research, to lock the correct comparison frame; researching competitors before understanding the subject produces a workbook that compares the wrong things.

## 3. XLSX workbook construction

Follow the base `xlsx` skill's conventions (openpyxl, professional font, explicit formulas over hardcoded values where the sheet contains any live calculation, `recalc.py` before shipping any formula-bearing workbook). On top of that base, this domain adds:

- A benchmark row for the subject company, visually distinct (fill color), positioned first, with every other row's comparison notes written relative to it.
- Category color coding on the tab that lists all competitors together, or a separate tab per category, either is acceptable; the category itself should be a real column, not folded into free text.
- A "Read Me" or sourcing tab: where the data came from, as-of date, and an explicit warning that gated/custom pricing is directional, not contractual.
- A second, distinct tab for a feature gap analysis when the deliverable calls for one: Feature, Seen In (which competitors), Status (Gap / Partial / Have), Priority, and a one-line rationale. Use two independent visual encodings, a fill color for Status and a font color for Priority, so a reader scanning the tab gets both signals without a legend on every row [raw/competitive-research--session-build--ospry-xlsx-pdf-case-study.md].

## 4. Branded PDF construction

The reliable pipeline for a print-quality, brand-accurate PDF in this environment is: author a self-contained HTML+CSS document, then render it with headless Chromium via Playwright (`page.pdf(print_background=True, ...)`), then verify by rasterizing every page back to PNG (`pdftoppm -png -r 100`) and visually inspecting each one. A PDF that "builds without an error" is not verified; only a page-by-page visual check is [raw/competitive-research--session-build--ospry-xlsx-pdf-case-study.md].

### Brand kit discovery
Before styling anything, locate the SUBJECT company's actual brand kit, and confirm it is the subject's, not a parent company's or a sibling product's. A connected brand/marketing repo is not guaranteed to be single-product; read whatever README or brand-guide file exists and match the company name inside it against the target before trusting any token, color, or logo file from it. If a brand guide states a print-specific convention (e.g. "use the light palette for PDF/print even though the product UI is dark"), that is a real, binding rule to follow, not a stylistic option [raw/competitive-research--session-build--ospry-xlsx-pdf-case-study.md].

### Four defects verified in production, with fixes
1. **Logo renders invisible.** An SVG using `fill="currentColor"` in more than one place (root tag and body path both) needs EVERY occurrence replaced when recoloring for a data-URI `<img>` embed, because `currentColor` cannot resolve inside an embedded SVG document with no CSS cascade reaching it. A count-limited `str.replace()` is the classic way to miss the second occurrence and ship an invisible logo.
2. **Orphaned blank page.** A `margin-top: auto` footer inside a flex column with `min-height` set is fragile the instant content height approaches the page boundary: when content overflows, the auto margin collapses to zero and the footer alone gets sliced onto the next physical page. Budget vertical space defensively for the largest data table the report will contain, and verify page count and content against expectations by rendering every page to an image.
3. **Banned punctuation surviving into final copy.** If a user preference or brand voice guide bans a character (commonly the em dash), grep for it explicitly as a final step (the literal character and any HTML entity form) rather than trusting that it was avoided by intent.
4. **A brand's own "categorical" palette is not automatically colorblind-safe.** Run any multi-hue palette intended for simultaneous use in one chart through the `dataviz` skill's validator (`node scripts/validate_palette.js "<hex-list>" --mode light --pairs all`) before using it. If it fails and cannot be re-stepped within the brand's approved hues, facet into single-hue charts instead of forcing a chart some readers cannot parse; this is the dataviz skill's own sanctioned fallback for exactly this situation.

## 5. Turning a comparison table into a high-value asset

A plain feature-comparison table is the floor, not the ceiling, of a competitive research deliverable. What measurably raises value, most to least impactful [raw/competitive-research--session-build--ospry-xlsx-pdf-case-study.md]:

1. **Compute real statistics from the collected data and lead with them.** "5 of 17 (29%) visitor-deanonymization vendors resolve to a named person" is a finding; a 17-row table alone is not. Every market-pattern claim in the output should be a number derived from the workbook, never an impression.
2. **Write a market-pattern narrative in prose**, not bullets, that states the "so what" of the computed statistics: what the split implies about who the subject actually competes with, and any smaller trend signals worth tracking (a positioning wedge a subset of competitors share, an emerging or underserved sub-segment).
3. **Battlecards for the closest competitors, structured as Fact, Impact, Act** [raw/competitive-research--battlecards--klue-battlecard-101.md]: their pitch (fact), where they genuinely win and where the subject wins back (impact), and a literal, sayable talk track (act). Directional language beats neutral description; specific numbers beat vague comparisons. Keep the set small (5 to 6 cards) and pick the competitors closest on the dimension that actually decides deals, not the longest or best-known names.
4. **Treat accuracy as a shipped feature, not an afterthought.** Stale or wrong competitive intel destroys trust in the whole asset faster than having a smaller one [raw/competitive-research--battlecards--klue-battlecard-101.md]. Date the report, name the sources, and flag anything gated/custom/unverified as such rather than presenting it with false precision.
