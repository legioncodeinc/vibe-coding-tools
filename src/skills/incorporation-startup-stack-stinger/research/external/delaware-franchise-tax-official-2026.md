---
source_url: https://corp.delaware.gov/frtaxcalc/
source_url_2: https://corp.delaware.gov/paytaxes/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: delaware-compliance
stinger: incorporation-startup-stack-stinger
---

# Delaware Franchise Tax: Official Rate Schedule and Filing Instructions (2026)

Source: Delaware Division of Corporations (official, last updated June 2018 but rates unchanged as of 2026 research)

## Summary

Delaware C-Corps pay an annual franchise tax with a minimum of $175 (Authorized Shares Method) or $400 (Assumed Par Value Capital Method). For most seed-stage startups with 10M authorized shares, the Assumed Par Value Capital Method produces a lower tax (often minimum $400) vs the Authorized Shares Method (which would be much higher at 10M shares). Annual report filing fee: $50 for non-exempt domestic corporations. All annual reports and franchise taxes are due March 1.

## Key quotations / statistics

### From Delaware Division of Corporations (official):
- "The minimum tax is currently $175.00, using the Authorized Shares Method and the Minimum Tax using the Assumed Par Value Capital Method is $400.00 with a maximum tax of $200,000.00 for both methods."
- "All active Domestic Corporation Annual Reports and Franchise Taxes for the prior year are due annually on or before March 1st."
- "Failure to file the report and pay the required franchise taxes will result in a penalty of $200.00 plus 1.5% interest per month on tax and penalty."
- "Annual Report Filing Fees: Non-Exempt Domestic Corporations – $50.00."

### Authorized Shares Method rate schedule:
- 5,000 shares or less: $175.00 (minimum)
- 5,001 – 10,000 shares: $250.00
- Over 10,000 shares: $250.00 plus $85.00 per additional 10,000 shares
- Maximum: $200,000

### Assumed Par Value Capital Method:
- Minimum: $400
- Rate: $400 per $1,000,000 (or fraction thereof) of assumed par value capital
- Maximum: $200,000
- "For corporations having no par value stock the authorized shares method will always result in the lesser tax."

### Large Corporate Filer tier:
- Companies listed on a national stock exchange + whose annual report shows total gross assets over $10M trigger "large corporate filer" status
- Large corporate filer maximum: $250,000/year

### Practical calculation for typical startup (10M authorized shares, par value $0.0001):
- Under Authorized Shares Method: $250 + (9,000 × $85 / 10,000) = ~$76,500 (VERY HIGH - this is the trap)
- Under Assumed Par Value Capital Method: If FMV is modest, minimum $400 applies
- **Key insight from research:** The Assumed Par Value Method almost always produces the minimum $400 for early-stage startups. Total annual cost: $400 franchise tax + $50 annual report fee = **$450/year**

### Key dates:
- March 1: Annual report + franchise tax due
- Penalty: $200 + 1.5% monthly interest for failure to file

## Annotations for stinger-forge

- **guides/00-entity-type-decision.md / guides/01-formation-platforms.md:** The $450/year total annual Delaware compliance cost ($400 franchise tax + $50 report fee) is the figure to use in the "Delaware C-Corp vs LLC cost comparison." NOT the Authorized Shares Method number which can be $76K+ for 10M shares. Registered agents ($100-300/year) add to this.
- **CRITICAL TRAP:** The Authorized Shares Method produces $76,500+ for a typical startup with 10M authorized shares. Always recommend the Assumed Par Value Method. Most formation services (Atlas, Clerky) know this and compute it correctly.
- **guides/00-entity-type-decision.md:** Use the $450/year figure to counter the "but Delaware is expensive" objection. This is much cheaper than an LLC conversion later.
- **guides/05-founder-paperwork.md / registered agent section:** Registered agent is required for Delaware companies. First-year usually included in formation fee. Year 2+: $100-$300/year depending on provider.
- Payment note: "Corporations owing $5,000.00 or more make estimated payments with 40% due June 1st, 20% due by September 1st, 20% due by December 1st, and the remainder due March 1st." (Only relevant for larger companies.)
