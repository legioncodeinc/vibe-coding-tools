# Guide 05: Option Pool Management

The employee equity pool (ESOP or option pool) is how startups compensate employees with equity. Sizing it correctly, refreshing it at the right time, and managing individual grants are all distinct skills.

Source: [`research/external/2026-05-20-option-pool-sizing-refresh-dilution.md`](../research/external/2026-05-20-option-pool-sizing-refresh-dilution.md), [`research/external/2026-05-20-iso-vs-nso-tax-treatment-2026.md`](../research/external/2026-05-20-iso-vs-nso-tax-treatment-2026.md)

---

## Initial option pool sizing

### Stage-by-stage benchmarks

| Stage | Typical option pool size (fully diluted) |
|---|---|
| Pre-seed (2-3 founders, no outside funding) | 5-10% |
| Seed (first institutional round) | 10-15% |
| Series A | 15-20% (investors often require a refresh to this level as a condition) |
| Series B+ | Depends on headcount plan; typically 10-15% post-Series A pool refreshed again |

These benchmarks are on a **fully diluted basis** -- counting all issued shares, outstanding options, warrants, and SAFEs on an as-converted basis.

### The option pool shuffle

At a priced round, investors often require an option pool expansion as a condition of closing. Whether that expansion is pre-money or post-money has a significant dilution impact on founders.

**Option pool shuffle (pre-money, investor-favorable):**
- The new pool is carved out before the pre-money valuation is calculated.
- Dilution formula: `New Founder Ownership = Original Ownership × (1 - Pool Size %)`
- Example: Founder owns 70% before expansion. Adding 10% pre-money option pool → founder owns 70% × (1 - 10%) = 63%.
- Investors are NOT diluted by the pool creation; founders and SAFEs bear the entire dilution.

**Post-money pool expansion (founder-favorable):**
- The new pool is created after the new money lands, diluting everyone (founders and new investors) proportionally.
- Always negotiate for post-money pool expansion.

> **Negotiation tip (from research):** Negotiate the option pool size based on your specific hiring plan for the next 18-24 months, not a flat percentage. VCs who ask for a "standard 15%" option pool at Series A are often asking for more than you need. Build a headcount model: [# of new hires] × [average option grant by role] = required pool size. Then negotiate based on the model.

---

## Option pool refresh

When the existing option pool is depleted (or close to it), the board approves a "pool refresh" -- creating new authorized shares and adding them to the option pool.

### When to refresh

- When the option pool drops below 3-5% of fully diluted shares (insufficient runway for 12-18 months of hiring).
- As a condition of a priced round (most common trigger).
- Following a significant acquisition of talent (acqui-hire).

### 2026 trend: milestone-based top-ups

Source (`research/external/2026-05-20-option-pool-sizing-refresh-dilution.md`) notes a 2026 trend toward milestone-based pool top-ups rather than single large refreshes. Instead of a 15% expansion at Series A, companies create a 10% pool at Series A with automatic authority to add another 5% when the company hits a specified revenue or headcount milestone. This reduces dilution on day one while guaranteeing headroom for future grants.

---

## Grant mechanics

### The grant workflow

1. Board approves a grant (board consent or meeting minutes with a resolution).
2. Current 409A is valid (see `guides/04-409a-valuations.md` for timing rules).
3. Option grant agreement is issued to the employee and countersigned.
4. Cap table platform (Carta, Pulley) is updated with the grant date, share count, strike price, and vesting schedule.
5. Employee is notified of their equity (total shares, strike price, vesting start date, cliff).

See `templates/option-grant-checklist.md` for the pre-grant checklist.

### Grant sizing benchmarks

| Role | Typical seed-stage grant (% fully diluted) | Typical Series A grant (% fully diluted) |
|---|---|---|
| First engineering hire | 0.25-0.5% | 0.1-0.25% |
| VP/Head of Engineering | 0.5-1.0% | 0.25-0.5% |
| Chief of Staff | 0.1-0.25% | 0.05-0.1% |
| Non-technical individual contributor | 0.1-0.2% | 0.05-0.1% |
| Advisor | 0.1-0.25% (2-year vest, no cliff common) | Same |

These are benchmarks; adjust for competitive market conditions, candidate leverage, and company stage. Carta's compensation benchmarking tool has current percentile data by role and stage.

---

## ISO vs NSO: the essential distinction

| | ISO (Incentive Stock Option) | NSO (Non-Qualified Stock Option) |
|---|---|---|
| Who can receive | US employees only (not contractors) | US and international employees, contractors, advisors |
| Tax at grant | No tax | No tax |
| Tax at exercise | No ordinary income tax; may trigger AMT (Alternative Minimum Tax) | Ordinary income tax on spread (FMV - strike price) |
| Tax at sale | Long-term capital gains if held 2 years from grant and 1 year from exercise | Capital gains on appreciation above FMV at exercise |
| $100K limit | Annual limit on ISOs that can vest (value at grant) | No limit |
| Company deduction | No tax deduction for company | Company can deduct the spread at exercise |

**Default allocation:** Grant ISOs to US employees up to the $100K annual vesting limit. Grant NSOs beyond that, to contractors, and to international employees.

> **Lawyer caveat:** ISO/NSO election, early exercise rights (83(b) election), and AMT exposure are complex tax topics. Have a qualified startup lawyer and tax advisor involved in setting up the option plan.

---

*See `guides/04-409a-valuations.md` for 409A timing rules. See `guides/06-vesting-schedules.md` for vesting mechanics. See `templates/option-grant-checklist.md` for the pre-grant checklist.*
