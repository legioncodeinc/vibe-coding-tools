# Guide 04: Bookkeeping (2026)

Step 5: Set up accounting and bookkeeping after banking is in place.

*Derived from: `research/external/pilot-vs-bench-bookkeeping-2026.md`*

---

## Accrual vs cash accounting

| Method | When to use | Notes |
|---|---|---|
| Cash accounting | Bootstrapped, <$5M revenue, no outside investors | Simpler; records income/expenses when cash changes hands |
| Accrual accounting | VC-backed OR >$5M revenue OR planning for audit | Required for GAAP financial statements; records income/expenses when earned/incurred |

**Default for VC-backed C-Corps:** Accrual (GAAP). Investors expect GAAP financials. Both Pilot and Bench offer accrual bookkeeping.

---

## DIY threshold

Do bookkeeping yourself (QuickBooks, Bench Lite, or spreadsheet) until:
- Monthly expenses exceed **$25K–$50K**, OR
- You are preparing for a **Series A audit**, OR
- You have **payroll** (>2 employees), OR
- You have **multiple revenue streams or complex revenue recognition**

Below this threshold, DIY with QuickBooks Online ($30/month) is reasonable.

---

## Pilot

**Pricing (2026, verified):** $499/month Core plan (accrual bookkeeping, monthly close, financial statements).

**What's included:**
- Dedicated bookkeeping team
- Accrual bookkeeping (GAAP)
- Monthly financial package (P&L, balance sheet, cash flow)
- Year-end tax prep integration (with their CPAs or your CPA)
- QuickBooks portability (your data, not locked in)
- CFO services available as add-on

**Best for:**
- VC-backed startups
- Companies preparing for investor diligence or Series A
- Founders who want GAAP financials from day one

**Pricing range:** $499/month (Core) to custom enterprise pricing for revenue recognition complexity.

Source: `research/external/pilot-vs-bench-bookkeeping-2026.md`

---

## Bench

> **WARNING:** Bench shut down on December 27, 2024 and was quickly acquired. It has been operational again since early 2025, but its current pricing, bookkeeping methodology, and service reliability are uncertain.
>
> **Before recommending Bench to a founder, verify current status at https://bench.co.** Do not recommend Bench as a primary option until operational stability is confirmed.

**Pre-shutdown pricing (for reference only):** $349–$399+/month.

**What Bench offered pre-shutdown:**
- Cash-basis bookkeeping (not accrual by default)
- Dedicated bookkeeper
- Bench-proprietary platform (not QuickBooks portable)

Source: `research/external/pilot-vs-bench-bookkeeping-2026.md`

---

## Digits

> **Open question:** The Command Brief listed Digits (https://digits.com) as a third bookkeeping option. Digits did not appear in research results. Verify current Digits pricing and startup fit directly at https://digits.com before including in recommendations.

---

## Recommended stack

| Profile | Recommendation | Why |
|---|---|---|
| VC-backed startup, any stage | **Pilot** | GAAP accrual, investor-ready financials, QuickBooks portable |
| Bootstrapped, <$25K/month expenses | **DIY (QuickBooks)** | Cost savings; switch to Pilot at Series A prep |
| Bootstrapped, $25K–$100K/month expenses | **Pilot Core** | Worth the $499/month to avoid catching up at audit |
| Startup needing CFO advisory | **Pilot + CFO add-on** or **Kruze Consulting** | Pilot scales with the company |

---

## What bookkeeping does NOT cover

- Tax filing (federal and state returns) — requires a CPA or tax firm separately
- Cap table management — Carta, Pulley
- Payroll — Gusto, Rippling (separate from bookkeeping platform)
- Fundraising financial modeling — founder does this or hires a fractional CFO

---

## Connecting bookkeeping to banking

Both Pilot and Bench connect via bank feed integration:
1. Open the bank account (Mercury, Brex, Relay) first.
2. Connect the bookkeeping platform to the bank feed using OAuth or read-only credentials.
3. Set the accounting start date to the entity formation date or first transaction date.
4. First-month reconciliation typically takes 1–2 weeks with a managed service.
