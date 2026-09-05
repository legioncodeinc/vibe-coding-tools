---
source_url: https://blog.promise.legal/startup-central/pre-money-vs-post-money-safe/
retrieved_on: 2026-05-20
source_type: blog
authority: high
relevance: high
topic: safe-mechanics
stinger: investor-cap-table-stinger
---

# Pre-Money vs Post-Money SAFE: Dilution Mechanics

## Summary
Pre-money SAFEs use a capitalization denominator that excludes SAFE conversion shares, causing each new SAFE to dilute both founders and prior SAFE investors simultaneously. Post-money SAFEs include all SAFE conversions in the denominator, meaning each investor receives a fixed, pre-agreed ownership percentage at signing and SAFEs do not dilute each other. YC introduced the post-money form in 2018 precisely because pre-money SAFEs made cap table modeling impossible when multiple SAFEs were stacked. By 2024, 83% of SAFEs use the post-money structure and YC removed the pre-money form from its website.

## Key quotations / statistics
- "Pre-Money SAFE: Excludes shares from SAFE conversions when calculating capitalization"
- "Post-Money SAFE: Includes all SAFE conversion shares in the capitalization calculation"
- "Pre-money SAFEs dilute each other" vs "Post-money SAFEs don't dilute each other"
- Example: three $1M investments at $9M pre-money cap → each investor gets 8.33% (not 10%); same at $10M post-money cap → each investor gets exactly 10%
- "83% of SAFEs in 2024 use the post-money structure, and YC removed the pre-money form from its website in 2018"
- Post-money enables "high-resolution fundraising where each investor can close independently"

## Annotations for stinger-forge
- This is the critical distinction for `guides/02-safe-mechanics.md` - the pre-money vs post-money SAFE is the single most common source of founder confusion and cap table errors.
- The 83% adoption rate of post-money SAFEs (as of 2024) is a compelling statistic to open the SAFE mechanics guide with.
- The `templates/safe-conversion-model.md` should use a worked example showing the dilution difference between pre-money and post-money to make this concrete.
- Flag: "YC removed the pre-money SAFE form" - this means if a founder encounters a pre-money SAFE in 2026, it is either a legacy document or from a non-YC source and should be treated with extra scrutiny.
