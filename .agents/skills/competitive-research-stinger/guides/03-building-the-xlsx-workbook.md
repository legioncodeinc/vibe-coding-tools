# Guide 03: Building the XLSX Workbook

Read the base `xlsx` skill first; this guide only adds domain-specific conventions on top of it. Do not restate xlsx-skill mechanics here that already live there (openpyxl usage, `recalc.py`, formula discipline).

## Tab structure

**Tab 1: Competitor Landscape.**
- Row 1: header, bold, dark fill, white text, wrap text, centered.
- Row 2: the SUBJECT company, visually distinct fill (a light highlight color, not the same as any category color), positioned first. Every comparison-note column in every other row is written relative to this row.
- Remaining rows: one per competitor. Columns at minimum: Company, Category, Website, a differentiator/type column (e.g. identification type, pricing model), Starting Price, Key Features, Target Market, and a "How It Compares To <Subject>" column that is never generic; it always names the specific gap or overlap.
- Freeze panes below the header row. Autofilter across the full data range.
- Professional font throughout (Arial or Times New Roman unless told otherwise), per the base xlsx skill.

**Tab 2 (or a later tab): Read Me / sourcing.**
- What this workbook is, how the subject/competitor comparison should be read, as-of date, and where the data came from (name the roundups and the subject's own site).
- An explicit caution that gated or custom pricing is directional, not contractual, and should be reverified before use in a customer-facing document.

**Optional tab: Feature Roadmap / gap analysis** (build this when the user wants a "what should we build" output, not just a landscape).
- Columns: Feature, Seen In (comma-separated competitor names), Status (Gap / Partial / Have), Priority (High / Medium / Low / Maintain), Why It Matters (one to two sentences, never a bare feature name with no rationale).
- Encode Status via cell fill color and Priority via font color. Two independent visual channels let a reader triage the tab by scanning color alone, without needing a legend on every row. Suggested mapping: Gap = red fill, Partial = yellow fill, Have = green fill; High priority = red font, Medium = amber font, Maintain/Have = green font.
- Every row's rationale should say WHY it matters for the subject specifically (e.g. "closes the loop from identified to contacted, cutting the CRM hops that leak leads"), not restate the feature name.

## Verification before delivery

- If the workbook contains any formula, run `recalc.py` and confirm `status: success`, zero errors, before sending.
- Open the workbook with `openpyxl.load_workbook` and sanity-check row/column counts and a couple of spot-check cell values programmatically; do not assume the generation script ran correctly just because it exited without an exception.
- Re-read the "How It Compares" and "Why It Matters" columns for genericness. A row that would be equally true if you swapped in a different company's name is not finished.

Reference template with concrete column widths, fill colors, and a worked example: `../references/xlsx-workbook-template.md`.
