# Case Study: OSPRY Competitor Landscape XLSX and Branded PDF Build

- URL: internal, Cowork session that forged this stinger
- Fetched: 2026-08-26
- Source type: first-party build log (field-tested, not a guess)

## Notes

This is the primary source for this stinger's procedure. It is a real, executed build for OSPRY (a visitor deanonymization and lead intelligence company), covering research through a 3-tab XLSX workbook through a 12-page branded PDF report, including every defect actually hit and how it was diagnosed and fixed. Treat every claim below as verified, not theoretical.

### Research phase
- Fetched the target company's own site first (ospry.ai) before searching competitors, to lock the correct comparison frame (what OSPRY actually does: person and company level visitor identification, AI ICP fit scoring, CRM routing) before evaluating anyone else against it.
- Used aggregator/roundup articles (e.g. a "best visitor identification software" blog post) as an efficient way to surface 10 to 15 named competitors per search, then fetched 2 to 3 of the best roundups in full rather than one search per competitor. This produced a 33-competitor list across 4 categories in about 6 tool calls.
- Categorization emerged from the data itself (visitor deanonymization, lead generation database, lead scraping, GTM workflow automation) rather than being decided up front. This matches the "direct competitor vs substitute vs complement" framing in raw2: most of the 33 were not direct competitors to OSPRY, they were adjacent categories worth naming as such rather than treating identically.

### XLSX workbook build
- Used the xlsx skill's own conventions: `openpyxl`, professional font (Arial), a benchmark row for the subject company highlighted with a distinct fill, category color coding, a frozen header row, autofilter, and a "Read Me" tab documenting sourcing and caveats.
- Second pass added a "Feature Roadmap" tab: each row scored Gap / Partial / Have against the full competitor set, with a Priority column and a one-line rationale. Status was color-coded (red/yellow/green fills) and priority was color-coded via font color, giving two independent visual signals without needing a legend on every row.
- No formulas were used in this particular workbook (it is a curated comparison table, not a model), so `recalc.py` was not load-bearing here, but the general xlsx-skill discipline (professional font, explicit sourcing, no hardcoded values presented as live data) still applied.

### Branded PDF build: brand kit discovery
- The user's device had a "brand-kit" style repo connected. Before building anything branded, the correct product's brand assets had to be located specifically. On first pass, the top-level brand-guide.md in the connected folder belonged to a DIFFERENT product (the parent company's own dev-tooling brand), not the target company. The actual target's kit was nested three levels down (`brand_kit/products/<company>/`). Lesson: a connected marketing/brand repo is not guaranteed to be single-product; read the README and confirm the product name inside the guide matches the target before using any of its tokens, colors, or logo files, and ask the user to confirm if there is any ambiguity.
- The brand guide explicitly specified a print/PDF convention: use the LIGHT palette for printed/PDF artifacts even though the product's live UI is dark-native. This is a real, stated brand rule, not an assumption, and it directly decided the report's background/text colors.
- The brand's own README explicitly named 4 hex values as the categorical / chart-series palette. Do not assume a brand's primary accent color is safe to reuse for 4-way categorical charting; validate it (see next section).

### Defect 1: logo rendered invisible (black-on-black)
- Symptom: the wordmark/symbol logo appeared to render (dimensions correct, positioned correctly) but the bird's body was effectively invisible against the dark cover background, leaving only a thin colored accent visible.
- Root cause: the source SVG set `fill="currentColor"` in two places, once on the root `<svg>` element and once on the body `<path>` element. The fix code only replaced the FIRST occurrence of that string (a Python `str.replace(..., count=1)`), which patched the root tag but left the body path's fill unresolved. `currentColor` never resolves inside a data URI `<img>` tag because there is no CSS cascade reaching into that embedded SVG document, so the unresolved body defaulted to black. On a black cover, that is invisible.
- Fix: replace every occurrence of `fill="currentColor"` in a source SVG being recolored for an `<img data:image/svg+xml;base64,...>` embed, not just the first. General rule: when programmatically recoloring an SVG string for `<img>` embedding, `str.replace()` calls must not be count-limited unless you have counted the actual occurrences first.
- Verification method that caught it: rendering each PDF page to PNG at 100dpi (`pdftoppm -png -r 100 file.pdf preview`) and visually inspecting with the Read tool. This is the load-bearing verification step for any branded PDF; do not ship without it.

### Defect 2: orphaned blank page
- Symptom: a 12-page PDF had one page (page 5) containing nothing but the shared page footer, no header, no content.
- Root cause: a data table with 17 rows was a few pixels taller than the printable page height. The page's footer used `margin-top: auto` inside a flex column to stay pinned to the bottom of a `min-height: 11in` container. When content overflowed past 11in, the auto margin collapsed to zero (no room left to push into) and the browser's print pagination sliced the page: the table (nearly) fit on page N, and the footer alone was pushed onto page N+1.
- Fix: reduce table row vertical padding and page top/bottom padding slightly so the largest table plus its footer fit inside one physical page, and re-verify by rendering to PNG.
- General rule: any print-CSS layout using `margin-top: auto` to pin a footer inside a flex column is fragile the moment content height is close to the page boundary. For a report where row count is data-driven and not fixed at author time, budget vertical space defensively (assume the largest category will be at or near the row count that appears in production) and always render every single page to an image and check it, page count included, rather than trusting that "it built without an error" means it is correct.
- A cheap automated pre-check that helped in a follow-up build: convert every page to grayscale and compute the fraction of near-white pixels; a page above roughly 0.98 with no legitimately-sparse content (like a 1-row table) is very likely an orphaned/blank page and should be inspected before delivery.

### Defect 3: banned punctuation (em dash)
- The user's standing preference explicitly banned em dashes from all output. Early drafts of the PDF's prose used them for connective clauses (common in AI-generated prose). This was caught on a targeted `grep` pass for the em dash character and the `&mdash;` HTML entity before final delivery, not by eye. Every instance was rewritten using a period, colon, comma, or semicolon instead, matching the exact same "no em dash" rule that this stinger's own repo also enforces globally.
- General rule: when a user or brand voice guide bans a specific character or construction, grep for it explicitly as a final QA step. Do not rely on "I didn't mean to use it" as prevention; verify.

### Defect 4: categorical chart palette failed colorblind-accessibility validation
- The target brand's own documentation named 4 hex colors as its categorical/chart-series palette (green, blue, violet, orange). Before using all 4 simultaneously in one chart, the palette was run through this Hive's `dataviz` skill validator (`scripts/validate_palette.js "<hex,hex,hex,hex>" --mode light --pairs all`).
- Result: the palette FAILED. The blue and violet in that specific brand palette have a normal-vision Delta E of about 12.7 (below the skill's 15 floor) and a deuteranopia Delta E of about 3.1 (well below the 6 to 8 floor band that would even be legal with secondary encoding). Two colors a brand guide calls "categorical" are not automatically safe to place side by side in one multi-series chart.
- Fix applied: instead of forcing a 4-color simultaneous chart, the charts were faceted, each chart used exactly one hue (so no cross-color discrimination was required at all), which sidesteps the categorical check entirely and is explicitly sanctioned by the dataviz skill for this situation ("under --pairs all cut series or facet instead").
- General rule: never assume a design system's stated "categorical" or "chart series" colors are colorblind-safe as a set. Run the validator before building any chart that shows more than one hue at once; if it fails and cannot be re-stepped within the brand's approved colors, facet into single-hue charts rather than shipping a chart some readers cannot parse.

### What made the deliverable "high value" versus a plain comparison
On a second pass, the user explicitly asked for "more data and better insights than just bulleted points and tables" to make it "a high value asset." What was added, in order of impact:
1. **Computed statistics from the collected data**, not just a longer list. Example: of 17 visitor-deanonymization competitors, exactly 2 were person-only, 3 were both person and company level, and 12 were company-only, meaning only 5 of 17 (29%) were genuinely direct competitors on identification depth. That reframes the whole category and tells the reader which 5 logos actually matter.
2. **A market-pattern narrative page** that states the "so what" of the data in prose (not bullets): why the split matters, what it implies about who OSPRY actually competes with, and two smaller trend signals (compliance-led positioning in a subset of vendors, an emerging product-led-growth-only vendor).
3. **Sales battlecards** for the closest 5 competitors, each following the Fact/Impact/Act pattern from raw1: their pitch, where they genuinely win, where the subject company wins back, and a literal talk track a rep can say on a call.
4. A revision cycle: the user caught two real defects (logo, blank page) after first delivery. Both were root-caused precisely (not just patched blindly) and the fix was verified by re-rendering every page, not assumed fixed because the build command exited successfully.
