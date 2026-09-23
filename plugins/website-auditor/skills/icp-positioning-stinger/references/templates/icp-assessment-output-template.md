# Niche / ICP assessment output template

Copy-ready. Write this to `02-positioning/niche-icp-assessment.md`, hydrated with what was actually observed on the audited site. Per PRD-005 AC-1, every one of the four output sections (niche, ICP description, conversion-action taxonomy, buyer-readiness framing) must carry a stated confidence level; this template enforces that by giving each section its own confidence field.

**Grounding note read before filling this in:** the two ICP-methodology sources in this pair's archive (abmatic.ai, hyperspect.ai) both describe building an ICP from a company's OWN closed-won/CRM/LTV data, a method this Drone cannot run because it has no access to the audited business's internal sales data (distilled research section 2). This Drone is doing a genuinely different, unsourced task: inferring niche/ICP from external observation of the site alone (copy, navigation, detected conversion actions). The attribute vocabulary below (firmographic / technographic / behavioral) is borrowed from those sources as terminology only, not as a validated external-inference method; state that explicitly in the output rather than implying the inference procedure itself is sourced.

```markdown
# Niche / ICP assessment: {business_name}

## Niche

{One or two sentences naming the industry/vertical and specific niche within it, inferred from landing-page copy and navigation structure.}

- Evidence: {which pages/nav items/copy this was inferred from}
- Confidence: high / medium / low
- Justification: {one line}

## Ideal customer profile (external-inference)

Attribute vocabulary borrowed from abmatic.ai/hyperspect.ai terminology [raw/abmatic-ai-blog-what-is-an-ideal-customer-profile.md] [raw/hyperspect-ai-blog-icp-definition-framework.md]; the inference method itself (reading these off site copy rather than off CRM data) is this Drone's own construct, not sourced.

- Firmographic signals observed (industry, size band language, geography): {...}
- Technographic signals observed (integrations visible in page source, stack signature): {...}
- Behavioral/intent signals observed (calls-to-action, pricing tiers, self-serve vs. sales-assist framing): {...}
- ICP description (one paragraph): {...}
- Confidence: high / medium / low
- Justification: {one line}

## Conversion-action taxonomy

See `references/templates/conversion-action-taxonomy-worksheet.md` for the full worksheet; summarize the result here.

- Macro conversion(s): {...}
- Micro conversions (process-milestone / secondary-action): {...}
- Confidence: high / medium / low

## Buyer-readiness framing

See `references/templates/buyer-readiness-scoring-worksheet.md` for the full worksheet; summarize the result here. Two-stage model (awareness / decision) is an explicit collapse of the sourced three-stage awareness/consideration/decision model - see that worksheet for the collapse rule.

- Awareness-stage pages/offers: {...}
- Decision-stage pages/offers: {...}
- Stage/traffic mismatch found: {...}
- Confidence: high / medium / low

## Overall gate status

- Site focus determinable: yes / no
- If no: see `guides/04-hard-stop-gate.md` and halt per PRD-005 AC-2. Do not write this file past this point; write the critical-failure message instead.
```
