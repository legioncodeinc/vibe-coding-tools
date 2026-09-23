# Reference: XLSX Competitor Workbook Template

Worked column and styling reference, derived from the field-tested build in `research/raw/competitive-research--session-build--ospry-xlsx-pdf-case-study.md`. Copy the shape, not the literal company data.

## Tab 1: Competitor Landscape

Columns (11, widths in characters as used in the reference build):

| # | Header | Width | Notes |
|---|---|---|---|
| 1 | Company | 26 | Subject company row 2, bold, distinct fill |
| 2 | Category | 26 | The taxonomy bucket this row belongs to |
| 3 | Website | 20 | |
| 4 | ID Type / Differentiator | 14 | Domain-specific: swap for whatever axis matters (identification type, deployment model, etc.) |
| 5 | Reported Scale / Metric | 24 | Database size, match rate, whatever the category's comparable metric is |
| 6 | Pricing Model | 22 | Subscription, per-seat, credit-based, usage-based, custom |
| 7 | Starting Price | 26 | State "custom quote" plainly when true; never fabricate a number |
| 8 | Key Features | 46 | Semicolon or comma separated, most distinctive first |
| 9 | Target Market | 26 | |
| 10 | Compliance / Privacy Notes | 30 | Only if materially different from category norm |
| 11 | How It Compares To \<Subject\> | 46 | Never generic; names the specific gap or overlap |

Styling: header row `PatternFill` dark navy/charcoal, white bold font, wrap text, centered, row height ~40. Data rows: Arial 10pt, wrap text top-aligned, thin light-gray borders. Subject row: light highlight fill (e.g. `FFF2CC`), bold font. `freeze_panes = "A2"`, `auto_filter.ref` across the full range.

## Tab 2: Read Me

Plain paragraphs, not a table: purpose, how to read the benchmark row, category definitions if non-obvious, sourcing (name the specific roundups/sites fetched), an explicit caution that gated/custom pricing figures are directional only, and suggested next steps (e.g. "score each competitor 1-5 on the dimensions that matter most to build a scored battlecard").

## Tab 3 (optional): Feature Roadmap

| # | Header | Notes |
|---|---|---|
| 1 | Feature | Named capability, not a vague theme |
| 2 | Seen In (Competitors) | Comma-separated names |
| 3 | Status | Gap / Partial / Have, fill-colored (red/yellow/green) |
| 4 | Priority | High / Medium / Low / Maintain, font-colored (red/amber/green) |
| 5 | Why It Matters | 1-2 sentences, always ties back to the subject's specific position, never a bare restatement of the feature name |

Column widths used in the reference build: 34, 44, 26, 34, 12, 50 (6 columns; the reference build split Priority into its own narrow column after Status).
