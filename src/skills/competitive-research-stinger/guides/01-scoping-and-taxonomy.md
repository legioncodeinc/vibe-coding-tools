# Guide 01: Scoping and Taxonomy

Before any research tool call, lock four things. A vague scope produces a vague workbook.

## 1. Confirm the subject company

Read the subject company's own site or product docs FIRST, before researching anyone else. Extract: what it actually does in plain terms, its stated target market, its pricing model if published, and how it positions itself against the category it competes in. This becomes the benchmark row and the frame every competitor gets compared against. Getting this wrong (researching competitors before the subject) is the single most common way a competitive workbook ends up comparing the wrong things [`../references/research/distilled-competitive-research.md`, section 2].

## 2. Confirm the category boundary

Ask, or infer from the request, which of these the user actually wants:
- A single tight category (e.g. "everyone who does visitor deanonymization")
- A cluster of adjacent categories (e.g. "visitor deanonymization, lead generation, lead scraping, and related services")
- A specific named shortlist (e.g. "compare us against these 5 named companies")

If the request names multiple category words (as the reference build did: "lead generation, lead scraping, visitor deanonymization, and other related services"), expect the final company list to span several genuinely different categories, not one. Do not force every discovered company into a single undifferentiated table; let the categories emerge from what the companies actually do, then give the workbook a real category column or category-grouped tabs [`../references/research/distilled-competitive-research.md`, section 1].

## 3. Sort every candidate by competitive role, not just "similar or not"

Use the five-role taxonomy before deciding how a discovered company appears in the deliverable:

| Role | Deliverable treatment |
|---|---|
| Direct competitor | Full row, feature-gap candidate, battlecard candidate |
| Substitute | Full row, explicitly flagged as a different workflow/approach |
| Potential entrant | Narrative mention only, not a full row, unless already active in market |
| Complement | Excluded from the competitor table entirely |
| Gatekeeper | Out of scope for a competitor workbook |

Full definitions and dimensions: `../references/research/distilled-competitive-research.md`, section 1.

## 4. Confirm the deliverable shape before building

Ask (or infer from context) whether the user wants:
- An XLSX workbook only
- A branded PDF only
- Both, with the PDF drawing its data from the same research as the XLSX

If a branded PDF is in scope, scope the brand-asset discovery now (see `03-building-the-branded-pdf.md`) rather than after the research is done; finding out mid-build that the brand kit lives three folders deeper than expected, or belongs to a different product than the subject, wastes a full build cycle.

## Output of this stage

A one-paragraph scope statement (subject company, category boundary, deliverable shape) stated back to the user before research starts, unless the session is unattended, in which case state the assumption plainly at the top of the work and proceed.
