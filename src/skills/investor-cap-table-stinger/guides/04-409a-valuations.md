# Guide 04: 409A Valuations

A 409A is a valuation of the company's common stock for tax purposes, required under IRS Section 409A before granting stock options. Getting this wrong exposes employees to 20% federal excise taxes on top of ordinary income tax. Getting the timing wrong can produce the same result.

Source: [`research/external/2026-05-20-409a-valuation-triggers-validity-2026.md`](../research/external/2026-05-20-409a-valuation-triggers-validity-2026.md), [`research/external/2026-05-20-409a-provider-comparison-carta-vs-third-party.md`](../research/external/2026-05-20-409a-provider-comparison-carta-vs-third-party.md)

---

## What a 409A is and why it matters

Under IRS Section 409A, stock options must be granted with a strike price at or above the current fair market value (FMV) of the company's common stock. A 409A valuation provides a defensible FMV by applying one of three approved methodologies (income, market, asset).

**If options are granted below FMV:** The entire option grant is treated as deferred compensation, triggering:
- 20% federal excise tax on top of ordinary income tax for the employee
- Interest penalties
- Potential personal liability for the board members who approved the grant

---

## ⚠️ The danger zone: signed term sheet invalidates your 409A

> **Critical warning:** A signed term sheet (even non-binding) is a "material event" that invalidates a current 409A valuation. Granting options between a signed term sheet and a new 409A exposes employees to the 20% penalty tax described above.

**The correct sequence:**
1. Sign term sheet.
2. Get a new 409A **before** granting any options.
3. Close the priced round.
4. Get another new 409A after closing (the priced round itself is a material event).
5. Then grant options at the new FMV.

Skipping step 2 is the most common 409A timing mistake. It happens because founders think "we'll close in 30 days, we'll just grant options now." Do not do this.

---

## Trigger events requiring a new 409A

| Event | Action required |
|---|---|
| First option grant | 409A required before granting |
| 12 months have passed since the last 409A | New 409A required (even with no other trigger) |
| Signed term sheet (priced round) | New 409A before any new option grants |
| Closing of priced round | New 409A within 30-90 days |
| Acquisition offer (LOI signed) | New 409A before any new grants |
| Material change in business (significant revenue change, new major contract, loss of major customer) | Consult counsel; may require new 409A |
| SAFE issuance alone | Does NOT trigger a new 409A requirement (SAFEs are not equity) |

---

## Validity window

A 409A valuation is valid for **12 months** unless a material event occurs sooner. The 12-month clock starts from the valuation date (the "as of" date in the report), not the date the report is delivered.

If any trigger event (see table above) occurs within the 12-month window, the 409A is invalidated from that date regardless of how recently it was completed.

---

## Provider selection

### Carta's 409A service

Carta provides 409A valuations as an integrated service for companies on the platform.

- **Pricing:** Approximately $1,500-$5,000 depending on company complexity and round stage. Pricing is not publicly fixed; confirm directly with Carta for current rates.
- **Turnaround:** 5-15 business days (standard). Expedited options may be available.
- **Integration:** Directly integrated with Carta's cap table -- the FMV from the 409A feeds directly into the option grant workflow.
- **Defensibility:** Carta's methodology is IRS-defensible (uses Carta's registered valuation analysts). Appropriate for Series Seed through Series B.

> **Open question (OQ-1 from research-summary.md):** Research could not confirm whether Carta currently offers a distinct "automated" 409A tier with a faster turnaround. Verify at `https://carta.com/services/409a-valuations/` before citing specific product tiers to users.

### Third-party 409A providers

For companies at later stages (Series B+) or with complex capital structures, third-party providers offer deeper analysis and stronger audit defensibility:

| Provider | Notes |
|---|---|
| Shareworks Valuation (Morgan Stanley) | Enterprise; common for pre-IPO companies |
| Scalar | Independent; frequently used by tech startups |
| Heron Finance | Startup-friendly pricing; used at seed/Series A |
| Empire Valuation Consultants | Traditional valuation firm; high defensibility |

Third-party is recommended when: the company is preparing for an IPO, the last round was at a high valuation multiple, or the IRS is more likely to scrutinize (e.g., many option grants, complex capital structure).

### Carta vs third-party: when to choose

| Scenario | Recommendation |
|---|---|
| Pre-seed through Series A | Carta integrated service (convenience + cost) |
| Series B+ or pre-IPO | Third-party provider (audit defensibility) |
| IRS audit concern or complex structure | Third-party provider |
| Carta not your cap table platform | Third-party provider (Pulley partners with third-party valuators) |

---

## How to use the 409A FMV for option grants

1. Receive the 409A report. Note the "common stock FMV" figure (e.g., $0.15/share).
2. Set the option strike price at or above this FMV. The strike price cannot be lower.
3. The board approves the option grant at a meeting with the strike price documented in board minutes.
4. The cap table platform records the grant with the strike price and grant date.
5. The option grant agreement is signed by both the company and the employee.

> **Lawyer caveat:** Option grant mechanics (ISOs vs NSOs, early exercise rights, 83(b) elections) have legal and tax implications. Have a qualified startup lawyer set up your first grant template.

---

## ISO vs NSO: the 30-second version

This is covered in depth in `guides/05-option-pool-management.md`. Quick reference:

- **ISO (Incentive Stock Option):** Tax-advantaged; only for US employees (not contractors); subject to $100K annual exercise limit; may trigger AMT.
- **NSO (Non-Qualified Stock Option):** For US contractors, advisors, and international employees; taxed as ordinary income at exercise.

The 409A FMV applies to both types; the tax treatment differs at exercise and sale.

---

*See `templates/option-grant-checklist.md` for the pre-grant checklist. See `guides/05-option-pool-management.md` for pool sizing and grant mechanics.*
