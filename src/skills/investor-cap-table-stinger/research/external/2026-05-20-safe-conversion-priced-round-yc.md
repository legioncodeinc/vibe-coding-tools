---
source_url: https://www.glencoyne.com/guides/safe-notes-equity-rounds
retrieved_on: 2026-05-20
source_type: blog
authority: high
relevance: high
topic: safe-mechanics
stinger: investor-cap-table-stinger
---

# SAFE Notes vs Priced Equity: Technical Guide to Modeling Conversion and Dilution

## Summary
Technical practitioner guide covering the conversion sequencing of SAFEs at a priced round. Three simultaneous events occur at priced round close: all SAFEs and convertible instruments convert into preferred shares, the stock option pool is created or increased, and new investment money enters. The conversion order matters: YC's fixed-percentage SAFE converts first to maintain its target ownership, then MFN SAFEs convert on the most favorable terms, then the priced round and option pool dilute all existing ownership. The option pool created pre-money (before new investment) dilutes only founders and existing stakeholders, not the new investor - the "option pool shuffle."

## Key quotations / statistics
- "During a priced round, three things happen simultaneously: All SAFEs and convertible instruments convert into preferred shares; A stock option pool is created or increased to a pre-agreed percentage; New money is invested"
- "YC's $125k SAFE converts to maintain 7% ownership (including any option pool) after all SAFEs convert"
- "YC's MFN SAFE converts on the terms of the lowest cap SAFE issued since the batch start date"
- "Both the priced round and option pool creation dilute founder and existing investor ownership"
- 2026 SAFE cap context: "pre-seed SAFE caps typically range $3M-$8M, while seed caps range $8M-$20M"

## Annotations for stinger-forge
- The three-simultaneous-events model and the conversion ordering logic are the core mechanics for `templates/safe-conversion-model.md` and `examples/happy-path-safe-to-series-a.md`.
- The "option pool shuffle" (pre-money pool creation dilutes founders not investors) is a specific term used by practitioners and VCs - it should appear in the `guides/03-priced-round-mechanics.md` and `guides/05-option-pool-management.md`.
- This source is complementary to the YC official deal page - together they give both the investor perspective and the technical conversion mechanics.
