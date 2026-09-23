# Template: SAFE Conversion Model

Use this template to model the dilution impact of one or more SAFEs converting at a priced round. Replace all `[PLACEHOLDER]` values with actual figures.

Demonstrates the mechanics in `guides/02-safe-mechanics.md`.

---

## Pre-round cap table

| Shareholder | Shares outstanding | % fully diluted (pre-round) |
|---|---|---|
| Founder A | [SHARES_A] | [PCT_A]% |
| Founder B | [SHARES_B] | [PCT_B]% |
| Option pool (issued) | [ISSUED_OPTIONS] | [PCT_OPTIONS_ISSUED]% |
| Option pool (unissued) | [UNISSUED_OPTIONS] | [PCT_OPTIONS_UNISSUED]% |
| **Total (excluding SAFEs)** | **[TOTAL_SHARES]** | **[TOTAL_PCT]%** |

---

## Outstanding SAFEs

| SAFE investor | Amount | Valuation cap | Discount | Type | Pro-rata |
|---|---|---|---|---|---|
| [INVESTOR_1] | $[AMOUNT_1] | $[CAP_1] | [DISC_1]% | Post-money | Yes/No |
| [INVESTOR_2] | $[AMOUNT_2] | $[CAP_2] | [DISC_2]% | Post-money | Yes/No |

---

## Series A terms

- Pre-money valuation: $[PREMONEY]
- Investment amount: $[INVESTMENT]
- Post-money valuation: $[POSTMONEY]
- Price per share (Series A): $[PPS] = $[PREMONEY] / [TOTAL_SHARES_FULLY_DILUTED_PRE_ROUND]

---

## SAFE conversion calculation

For each SAFE, the conversion price is the **lower** of:
- The valuation cap price: $[CAP_N] / [TOTAL_SHARES_FULLY_DILUTED_PRE_ROUND]
- The discounted Series A price: $[PPS] × (1 - [DISC_N]%)

**SAFE 1 conversion:**
- Cap price: $[CAP_1] / [TOTAL_SHARES] = $[CAP_PPS_1] per share
- Discounted price: $[PPS] × (1 - [DISC_1]%) = $[DISC_PPS_1] per share
- Conversion price: $[CONV_PPS_1] (lower of the two)
- Shares issued: $[AMOUNT_1] / $[CONV_PPS_1] = [SHARES_SAFE_1] new shares

**SAFE 2 conversion:**
- Cap price: $[CAP_2] / [TOTAL_SHARES] = $[CAP_PPS_2] per share
- Discounted price: $[PPS] × (1 - [DISC_2]%) = $[DISC_PPS_2] per share
- Conversion price: $[CONV_PPS_2] (lower of the two)
- Shares issued: $[AMOUNT_2] / $[CONV_PPS_2] = [SHARES_SAFE_2] new shares

---

## Post-Series A cap table

| Shareholder | Shares | % fully diluted |
|---|---|---|
| Founder A | [SHARES_A] | [POST_PCT_A]% |
| Founder B | [SHARES_B] | [POST_PCT_B]% |
| SAFE Investor 1 (converted) | [SHARES_SAFE_1] | [POST_PCT_SAFE_1]% |
| SAFE Investor 2 (converted) | [SHARES_SAFE_2] | [POST_PCT_SAFE_2]% |
| Series A investor | [SHARES_SERIES_A] | [POST_PCT_SERIES_A]% |
| Option pool (remaining unissued) | [UNISSUED_OPTIONS] | [POST_PCT_POOL]% |
| **Total** | **[POST_TOTAL]** | **100%** |

---

## Dilution summary

| | Pre-round | Post-round | Change |
|---|---|---|---|
| Founder A ownership | [PCT_A]% | [POST_PCT_A]% | -[DELTA_A]% |
| Founder B ownership | [PCT_B]% | [POST_PCT_B]% | -[DELTA_B]% |
| Total SAFE conversion dilution | -- | [POST_PCT_SAFE_TOTAL]% | -- |
| Series A investor | -- | [POST_PCT_SERIES_A]% | -- |

---

*Reference: `guides/02-safe-mechanics.md`, `examples/happy-path-safe-to-series-a.md`*
