# Guide 07: Series A Data Room Checklist

A Series A data room is the document package investors review during due diligence after signing a term sheet. 68% of failed Series A deals cite documentation problems. Start preparing 3-6 months before you expect to raise.

Source: [`research/external/2026-05-20-series-a-data-room-checklist-2026.md`](../research/external/2026-05-20-series-a-data-room-checklist-2026.md), [`research/external/2026-05-20-investor-data-room-platforms-2026.md`](../research/external/2026-05-20-investor-data-room-platforms-2026.md), [`research/external/2026-05-20-vc-due-diligence-60-document-standard.md`](../research/external/2026-05-20-vc-due-diligence-60-document-standard.md)

---

## The 5-item investor speed test

Before a deep-dive review, experienced investors check five things in the first five minutes. These must be ready, accurate, and easy to find:

1. **Fully diluted cap table** (Carta or Pulley export, as of today).
2. **3 years of audited financials** (or 2 years + most recent quarters for early-stage).
3. **Current month P&L** (unaudited management accounts).
4. **ESOP scheme summary** (option pool size, options outstanding, options available, current 409A FMV).
5. **Data room index** (a one-page table of contents showing every document and where it lives).

If any of these are missing or inaccurate, the investor may delay the process until they are corrected.

---

## Canonical 7-category folder structure

See `templates/data-room-folder-structure.md` for a copy-paste version.

### 1. Corporate / Legal

- Certificate of Incorporation (as amended, including all amendments for preferred stock)
- Bylaws (current version)
- State filing receipts / good standing certificate
- Organizational chart (legal entities, parent/subsidiary relationships)
- Board consent approvals (historical, including all major decisions)
- Annual meeting minutes

### 2. Cap Table / Equity

- Fully diluted cap table (Carta or Pulley export, current date)
- All SAFE agreements and side letters (including MFN side letters and pro-rata side letters)
- Stock purchase agreements (founder equity)
- Option plan document (current version, board-approved)
- Option grants (individual grant agreements for all outstanding options)
- Warrant agreements (if any)
- Current 409A valuation report

### 3. Financial Statements

- Audited financials (3 years if available, or since founding)
- Current management P&L, balance sheet, cash flow
- Trailing 12-month financial model (actuals vs budget)
- Revenue breakdown by customer/product line
- Cap ex schedule (if applicable)
- Bank statements (last 3 months)

### 4. Customer / Revenue

- Top 10 customer contracts (or representative sample)
- Customer concentration analysis (% of ARR by top customers)
- Churn analysis (gross and net dollar retention)
- Pipeline data (open opportunities, forecasted close)
- NPS or CSAT data (if available)

### 5. Intellectual Property / Technology

- IP assignment agreements (all founders and key employees must have signed)
- Patent filings (if any)
- Open-source license inventory (anything with GPL/AGPL that could affect the product)
- Security audit report or pentest results (if available)
- Architecture overview document (1-2 pages)

### 6. Human Resources

- Organizational chart (people, current and planned)
- Employee list with roles, start dates, and compensation
- Key employment agreements (C-suite and key technical roles)
- Non-compete and non-solicitation agreements (check enforceability by state -- California does not enforce non-competes)
- Contractor agreements (confirm IP assignment is included)

### 7. Risk / Regulatory

- Any litigation (disclosed, pending, threatened)
- Regulatory approvals or compliance certifications (SOC 2, HIPAA if applicable)
- Privacy policy and Terms of Service (current, publicly accessible versions)
- Material contracts (loans, leases, service agreements above $50K/year)
- Insurance policies (D&O, E&O, general liability)

---

## Common gaps founders miss

- **IP assignment agreements not signed.** If a founder wrote code before the company was incorporated and did not sign a Proprietary Information and Inventions Assignment (PIIA), the company may not own its own IP. Fix this early -- investors will flag it.
- **Option grants without board consent.** Every option grant requires a board resolution. If grants were issued informally without board approval, correct the record before the data room.
- **SAFE agreements not tracked.** Founders sometimes issue SAFEs without recording them on the cap table. Do a full SAFE audit and reconcile against the cap table.
- **Out-of-date 409A.** A stale 409A may require retroactive correction of option grants. See `guides/04-409a-valuations.md`.
- **Bench / bookkeeping gaps.** If the company used Bench for bookkeeping (note: Bench shut down in December 2024 and was reacquired; verify records are intact and current before starting data room preparation).

---

## Data room platforms

- **Carta Data Rooms:** Best for founders already on Carta; integrates cap table directly.
- **DocSend:** Widely used for pitch decks (with link-level analytics showing time spent per page). Less suited for full due diligence packages; better for initial traction/deck sharing.
- **Notion:** Increasingly popular for early-stage data rooms; easy to organize and share; lacks the access-logging and investor-friendly UX of dedicated platforms.
- **Box / Google Drive:** Functional but require manual access management; no built-in investor analytics.

**Recommendation:** For Series A due diligence, use Carta Data Rooms if you are on Carta; otherwise use a dedicated platform like DocSend's Spaces (for more structured due diligence). Notion works for seed-stage but may feel informal at Series A.

> Note: Aumni and Vauban are portfolio analytics platforms used by VCs (LP/investor-side tools), not data room tools for founders. Do not include them in a founder's data room workflow.

---

*See `templates/data-room-folder-structure.md` for the copy-paste folder template. See `examples/happy-path-safe-to-series-a.md` for context on where this fits in the fundraising timeline.*
