# Template: Series A Data Room Folder Structure

Copy this folder structure into Carta Data Rooms, DocSend Spaces, Notion, or Google Drive. Fill in each document before sharing with investors.

Reference: `guides/07-data-room-checklist.md`

---

```
[Company Name] -- Series A Data Room
├── 00-Index.md                              ← Data room table of contents (1-page summary of all documents)
│
├── 01-Corporate-Legal/
│   ├── Certificate-of-Incorporation.pdf     ← As amended, including all preferred stock amendments
│   ├── Bylaws-Current.pdf
│   ├── Good-Standing-Certificate.pdf        ← Dated within 90 days
│   ├── Organizational-Chart.pdf             ← Legal entity structure
│   ├── Board-Consents-Historical/
│   │   ├── YYYY-MM-DD-[Action].pdf
│   │   └── (one file per major board consent)
│   └── Annual-Meeting-Minutes/
│
├── 02-Cap-Table-Equity/
│   ├── Cap-Table-Fully-Diluted-[DATE].pdf   ← Carta or Pulley export, current date
│   ├── SAFE-Agreements/
│   │   ├── SAFE-[InvestorName]-[Date].pdf
│   │   └── SAFE-[InvestorName]-ProRata-SideLetter-[Date].pdf
│   ├── Founder-Stock-Purchase-Agreements/
│   ├── Option-Plan-Current.pdf              ← Board-approved option plan document
│   ├── Option-Grants-Outstanding/           ← Individual grant agreements
│   ├── 409A-Valuation-Current.pdf           ← Must be within validity window
│   └── Warrant-Agreements/                  ← If any
│
├── 03-Financial-Statements/
│   ├── Audited-Financials-[YEAR].pdf        ← 3 years if available
│   ├── Management-Accounts-[MONTH-YEAR].pdf ← Current P&L, balance sheet, cash flow
│   ├── Financial-Model-Actuals-vs-Budget.xlsx
│   ├── Revenue-Breakdown-by-Customer.xlsx
│   └── Bank-Statements-Last-3-Months/
│
├── 04-Customer-Revenue/
│   ├── Top-10-Customer-Contracts/
│   ├── Customer-Concentration-Analysis.pdf
│   ├── Churn-Analysis-NRR-GRR.pdf
│   └── Pipeline-Snapshot-[DATE].pdf
│
├── 05-IP-Technology/
│   ├── IP-Assignment-Agreements/            ← All founders and key employees MUST have signed
│   ├── Patent-Filings/                      ← If any
│   ├── Open-Source-License-Inventory.md
│   ├── Security-Audit-or-Pentest.pdf        ← If available
│   └── Architecture-Overview.pdf
│
├── 06-Human-Resources/
│   ├── Org-Chart-Current.pdf
│   ├── Employee-List-Roles-Comp.xlsx        ← Redact individual salaries if preferred; keep role + band
│   ├── Key-Employment-Agreements/           ← C-suite and key technical roles
│   └── Contractor-Agreements/               ← Confirm IP assignment is included
│
└── 07-Risk-Regulatory/
    ├── Litigation-Disclosure.pdf            ← "None" is a valid entry if no litigation
    ├── Compliance-Certifications/           ← SOC 2, HIPAA, ISO 27001 if applicable
    ├── Privacy-Policy-TOS-Links.md          ← Current publicly accessible URLs
    ├── Material-Contracts/                  ← Loans, leases, agreements above $50K/year
    └── Insurance-Policies/                  ← D&O, E&O, general liability
```

---

## Pre-share checklist

Before sharing the data room link with any investor:

- [ ] All 7 folders have at least one document.
- [ ] Cap table export is dated within 7 days.
- [ ] 409A is within its validity window (see `guides/04-409a-valuations.md`).
- [ ] All IP assignment agreements are signed by all founders (not just employees).
- [ ] Option grants all have board consent on file.
- [ ] No blank placeholder pages (`[TBD]`, `INSERT HERE`) remain in any document.
- [ ] Data room index (`00-Index.md`) is accurate and complete.
- [ ] Access permissions are set correctly (view-only for most; download for accountants/lawyers doing deeper review).

---

*Reference: `guides/07-data-room-checklist.md`. See `examples/happy-path-safe-to-series-a.md` for fundraising context.*
