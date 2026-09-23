# Example: Happy Path -- Two SAFEs to Series A

A worked end-to-end cap table progression showing how a two-founder startup evolves from founding through two SAFE rounds to a Series A.

Demonstrates: `guides/02-safe-mechanics.md`, `guides/03-priced-round-mechanics.md`, `guides/05-option-pool-management.md`

---

## Starting cap table at founding

Two co-founders incorporate in Delaware. Each receives 5,000,000 shares of common stock.

| Shareholder | Shares | % ownership |
|---|---|---|
| Founder A | 5,000,000 | 50% |
| Founder B | 5,000,000 | 50% |
| **Total** | **10,000,000** | **100%** |

Cap table platform: Pulley (seed-stage pricing; investor is not a Carta-first fund).

---

## After first SAFE: Angel investor, $150K at $3M post-money valuation cap

Six months after founding, an angel investor writes a $150K check on a YC post-money SAFE with a $3M valuation cap, no discount, MFN clause.

- Angel SAFE ownership at signing: $150K / $3M = **5% post-money** (at conversion).
- The SAFE is recorded on the cap table as a liability (not yet equity).
- No new shares issued; founders still own 100% of issued shares.

| Shareholder | Shares | % ownership (current) | % ownership (fully diluted, SAFE as converted) |
|---|---|---|---|
| Founder A | 5,000,000 | 50% | 47.5% |
| Founder B | 5,000,000 | 50% | 47.5% |
| Angel SAFE | -- | -- | 5% |

---

## After second SAFE: Pre-seed fund, $400K at $5M post-money valuation cap

Twelve months after founding, a pre-seed fund invests $400K on a post-money SAFE with a $5M valuation cap, 20% discount, pro-rata side letter.

- Pre-seed fund SAFE ownership at signing: $400K / $5M = **8% post-money**.
- Fully diluted ownership after both SAFEs:

| Shareholder | % ownership (fully diluted, both SAFEs as converted) |
|---|---|
| Founder A | ~44% |
| Founder B | ~44% |
| Angel SAFE | ~5% |
| Pre-seed fund SAFE | ~8% |
| **Note:** rounding may not sum to 100% due to interaction at conversion |

---

## Option pool creation (seed stage)

Before the first employee hire (18 months after founding), the board approves a 10% option pool. This is done as a post-money pool expansion (founders negotiate against the pre-money shuffle).

- 10% of fully diluted post-pool shares added to option pool.
- Required new shares: to create a 10% pool in a 10M-share company, issue approximately 1,111,111 new shares (10,000,000 × 10/90).

| Shareholder | Shares | % ownership (fully diluted) |
|---|---|---|
| Founder A | 5,000,000 | ~40% |
| Founder B | 5,000,000 | ~40% |
| Option pool (unissued) | 1,111,111 | ~10% |
| Angel SAFE (as-converted) | ~556,000 | ~5% |
| Pre-seed fund SAFE (as-converted) | ~888,000 | ~8% |

A first engineering hire receives 200,000 options (approximately 1.8% fully diluted) with a 4-year vest, 1-year cliff, ISO.

---

## Series A: $3M at $12M pre-money valuation

24 months after founding, a lead VC invests $3M at a $12M pre-money valuation. Term sheet terms: 1x non-participating liquidation preference, broad-based weighted average anti-dilution, 1x pro-rata rights, 2 board seats.

Investor requires option pool expansion to 15% (post-money, successfully negotiated by founders) before the round closes.

### Pre-money fully diluted shares (before Series A new money):
Approximately 11,111,111 (founders + existing pool + new shares for SAFE as-converted).

### SAFEs convert at their respective cap prices:
- Angel SAFE: Converts at $3M cap price. The $12M pre-money is higher than the cap, so angel investor gets the benefit of the lower cap price (more shares per dollar than a Series A investor).
- Pre-seed SAFE: Converts at lower of: $5M cap price OR $12M × (1 - 20% discount) = $9.6M. The cap price ($5M) is lower, so the pre-seed fund converts at the cap.

### Post-Series A cap table (approximate):

| Shareholder | Shares (approx.) | % fully diluted |
|---|---|---|
| Founder A | 5,000,000 | ~32% |
| Founder B | 5,000,000 | ~32% |
| Lead VC (Series A preferred) | ~2,000,000 | ~13% |
| Option pool (expanded to 15%) | ~2,350,000 | ~15% |
| Angel (converted from SAFE) | ~800,000 | ~5% |
| Pre-seed fund (converted from SAFE) | ~500,000 | ~3% |
| Employee options (outstanding) | 200,000 | ~1% |

---

## Key takeaways from this example

1. **Post-money SAFEs produce predictable dilution.** At each SAFE round, founders knew exactly how much they would be diluted at conversion. Pre-money SAFEs would have produced more complex and founder-unfavorable math.
2. **The option pool shuffle matters.** By negotiating post-money pool expansion at Series A, founders avoided bearing the full dilution from the 15% pool increase alone. Everyone (including the new VC) was diluted proportionally.
3. **Cumulative dilution is larger than it looks in any single round.** Founders who started at 50% each ended up at approximately 32% each -- a 36% reduction in ownership. This is normal and expected for VC-backed startups.
4. **SAFEs are powerful but not free.** Two SAFEs totaling $550K resulted in approximately 8% combined dilution at conversion. This is reasonable, but founders should model this before issuing SAFEs to avoid surprises.

---

*References: `guides/02-safe-mechanics.md`, `guides/03-priced-round-mechanics.md`, `guides/05-option-pool-management.md`, `templates/safe-conversion-model.md`*
