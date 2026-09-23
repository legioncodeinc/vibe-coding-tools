# Guide 03: Priced Round Mechanics (Series A+ Term Sheets)

A priced round is the first issuance of preferred stock. The term sheet captures the economic and governance terms that will govern the company's cap structure for years. This guide translates the key provisions into plain language and flags the founder-unfavorable terms.

Source: [`research/external/2026-05-20-series-a-term-sheet-anatomy-2026.md`](../research/external/2026-05-20-series-a-term-sheet-anatomy-2026.md)

---

## Anatomy of a Series A term sheet

### Economic terms

| Term | Plain English | Watch out for |
|---|---|---|
| **Pre-money valuation** | The company's value before new investment. $10M pre-money + $2M investment = $12M post-money | Investors may express valuation as post-money; confirm which it is before discussing ownership percentages |
| **Investment amount** | The total dollars the investor is committing | May be split across tranches; confirm whether tranches are conditional |
| **Option pool (pre-money)** | An ESOP refresh is often required as a condition of closing. If done pre-money, founders bear the full dilution from the pool increase | Always negotiate pool expansion as post-money; if pre-money, model the dilution carefully. See `guides/05-option-pool-management.md` |
| **Liquidation preference** | The amount investors receive in an exit before common stockholders get anything | See below -- this is the most negotiated and least understood term |
| **Anti-dilution** | Protects investors if the company raises a future round at a lower valuation (down round) | See below |
| **Dividends** | Most Series A term sheets include a 8% cumulative dividend that is only paid at liquidation/exit, not in cash | Largely paper provision; rarely paid; confirm it is "non-cash" and accrues only at exit |

### Governance terms

| Term | Plain English | Watch out for |
|---|---|---|
| **Board composition** | How many seats, who holds them | Common: 2 founders + 1 lead investor + 2 independent seats. Resist giving the investor majority board control |
| **Pro-rata rights** | Investor's right to maintain their ownership % in future rounds | Standard and reasonable; accept |
| **Information rights** | Investor's right to quarterly financials, annual audit | Standard; accept |
| **Protective provisions** | Actions the company cannot take without investor approval (e.g., raise debt, sell the company, issue new shares) | Standard list is acceptable; watch for overly broad "any material contract" clauses |
| **Drag-along rights** | Requires all shareholders to vote yes on an acquisition approved by a majority of shareholders and investors | Standard; confirm the approval threshold is reasonable (typically majority of investors + majority of common) |

---

## Liquidation preference: the most important economic term

A liquidation preference determines who gets paid first -- and how much -- when the company is acquired or liquidated.

### Types

| Type | What it means | Founder impact |
|---|---|---|
| **1x non-participating preferred** | Investor gets their money back first (or converts to common and shares pro-rata), whichever is higher. Standard at Series A. | Acceptable. Investor participates in the upside above their investment. |
| **1x participating preferred** | Investor gets their money back PLUS their pro-rata share of any remaining proceeds. | Founder-unfavorable. Investor double-dips. Resist this. |
| **2x non-participating preferred** | Investor gets 2x their investment back before common gets anything. | Founder-unfavorable except in a down or bridge round. Push back. |

**The standard at Series A is 1x non-participating preferred.** If a term sheet proposes participating preferred, this is a significant negotiation point.

### Example

Company is acquired for $15M. Series A: $5M at $10M pre-money (investor owns 33%).

| Preference type | Investor gets | Founder (67%) gets |
|---|---|---|
| 1x non-participating | Higher of: $5M or 33% × $15M = $4.95M. Investor converts → $4.95M | $10.05M |
| 1x participating | $5M + 33% × ($15M - $5M) = $5M + $3.3M = $8.3M | $6.7M |

---

## Anti-dilution provisions

Anti-dilution protects investors if the company raises a future round at a lower valuation ("down round").

| Type | What it means | Founder impact |
|---|---|---|
| **Broad-based weighted average** | Adjusts conversion price based on the weighted average of all shares outstanding. Standard. | Acceptable at Series A. |
| **Narrow-based weighted average** | Similar but counts fewer shares in the average, giving investors more protection. | Founder-unfavorable; negotiate to broad-based. |
| **Full ratchet** | Resets the conversion price to the new lower price, regardless of amount raised. | Very founder-unfavorable; resist strongly. |

---

## Negotiation principles

1. **Valuation is not the only lever.** A high valuation with a 2x participating preference can be worse than a lower valuation with 1x non-participating.
2. **Push for post-money option pool expansion.** The option pool shuffle (pre-money pool increase) dilutes founders, not investors. Push for post-money.
3. **Governance over economics for long-term control.** Board composition matters more than a 1-2% valuation difference. Do not trade board control for valuation.
4. **Use NVCA model documents as a baseline.** The NVCA model term sheet is the industry standard for "fair to all parties." Major deviations from NVCA terms require explanation.

> **Lawyer caveat:** Have a qualified startup lawyer review all term sheets before responding to the investor. Term sheets are not legally binding for the investment but do bind on exclusivity and confidentiality. The mechanics described here are general; your specific situation requires tailored legal advice.

*See `examples/happy-path-safe-to-series-a.md` for cap table context. See `guides/05-option-pool-management.md` for the option pool shuffle mechanics.*
