# Guide 02: SAFE Mechanics (YC Post-Money Standard)

The Simple Agreement for Future Equity (SAFE) is the dominant pre-priced-round fundraising instrument for US startups. This guide covers the post-money YC SAFE -- the only version to use by default.

Source: [`research/external/2026-05-20-pre-money-vs-post-money-safe-mechanics.md`](../research/external/2026-05-20-pre-money-vs-post-money-safe-mechanics.md), [`research/external/2026-05-20-yc-safe-deal-terms-analysis.md`](../research/external/2026-05-20-yc-safe-deal-terms-analysis.md), [`research/external/2026-05-20-safe-conversion-mechanics-priced-round.md`](../research/external/2026-05-20-safe-conversion-mechanics-priced-round.md)

---

## Post-money vs pre-money SAFE (mandatory reading)

> **Default to post-money.** 83% of SAFEs issued in 2024 use post-money structure. YC removed the pre-money SAFE from its website in 2018. Pre-money SAFEs cause unexpected dilution that founders discover only at conversion.

| | Post-money SAFE (default) | Pre-money SAFE (avoid) |
|---|---|---|
| Ownership % at signing | Fixed and predictable: investor gets exactly [investment / valuation cap] | Unpredictable: ownership depends on how many total SAFEs were issued, which may not be known at signing |
| Dilution effect on founders | Founders diluted proportionally as SAFEs convert | Founders bear disproportionate dilution when multiple SAFEs convert together |
| Investor preference | Strongly preferred: investor knows their ownership at signing | Less preferred: investor's ownership can shrink if more SAFEs are issued later |
| YC availability | Default YC form; actively distributed | Removed from YC website 2018; must be requested separately |

**The post-money SAFE protects all parties** by locking in ownership percentages at signing rather than deferring the math to conversion. Always use it unless the user explicitly asks for a different instrument and explains why.

---

## Anatomy of a post-money SAFE

A SAFE has four economic terms and two optional provisions:

### Required terms

| Term | What it means |
|---|---|
| **Investment amount** | The dollar amount the investor is wiring |
| **Valuation cap** | The maximum company valuation at which the SAFE converts to equity. If the priced round values the company above the cap, the SAFE investor gets the benefit of the cap price |
| **Discount rate** | A percentage discount to the priced round valuation (e.g., 20% discount = the SAFE converts at 80% of the Series A price). Most SAFEs have EITHER a cap OR a discount, occasionally both |
| **Conversion trigger** | A priced equity financing above a threshold (typically $1M), an acquisition, or the company's IPO |

### Optional provisions

| Provision | What it does |
|---|---|
| **MFN (Most Favored Nation) clause** | If the company issues a later SAFE with better terms (lower cap, higher discount), the MFN SAFE automatically gets upgraded to those better terms. Common for the earliest checks when the cap is uncertain |
| **Pro-rata side letter** | Gives the investor the right to participate in future priced rounds up to their pro-rata ownership percentage, preventing dilution beyond the conversion point. Institutional seed investors almost always require this |

---

## Conversion math

### Post-money SAFE conversion at a priced round

**Scenario:** Founder raises a $500K SAFE with a $5M post-money valuation cap. Company then raises a Series A at a $10M pre-money valuation.

1. **SAFE investor's ownership at signing:**
   - $500K / $5M cap = 10% post-money ownership (at the time of the Series A, before new money)

2. **At conversion:**
   - The SAFE converts to preferred stock at the cap price, not the Series A price.
   - The SAFE converts as if the company was valued at $5M at the Series A price, giving the SAFE investor more shares than a Series A investor paying $10M would get for the same dollar amount.

3. **Fully diluted cap table after Series A:**
   - SAFE converts first, then new Series A money lands.
   - Founders are diluted by the SAFE conversion + the Series A investment.

See `templates/safe-conversion-model.md` for a worked three-investor dilution table.

### Multiple SAFEs converting together

When multiple SAFEs with different caps/discounts convert at the same priced round, they each convert independently at their respective terms. The order of conversion affects the final per-share price calculation. In practice, the cap table platform (Carta, Pulley) handles this calculation; the founder needs to understand the total dilution, not the per-SAFE arithmetic.

---

## Common SAFE mistakes

- **Issuing SAFEs without a cap.** An uncapped SAFE is founder-unfavorable; it can convert at a very high valuation giving the investor very little equity, or at a low valuation giving them a lot -- the founder has no control over where it lands.
- **Using pre-money SAFEs without knowing the difference.** The math looks the same at signing but diverges significantly at conversion when multiple SAFEs are outstanding.
- **Forgetting the pro-rata side letter.** Institutional investors almost always expect a side letter for their follow-on rights. Issuing the SAFE without it means renegotiating at Series A.
- **Not recording the SAFE on the cap table platform.** SAFEs are not equity yet, but they must be modeled on the cap table so the founder can see the diluted ownership before the Series A closes.

---

> **Lawyer caveat:** Have a qualified startup lawyer review all SAFE documents before signing. The mechanics described here are accurate for standard YC forms, but any modifications to the standard form require legal review.

*See `templates/safe-conversion-model.md` for a worked conversion scenario. See `examples/happy-path-safe-to-series-a.md` for a full cap table progression.*
