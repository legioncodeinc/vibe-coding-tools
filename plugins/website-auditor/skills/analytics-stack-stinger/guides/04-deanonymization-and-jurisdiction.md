# 04. De-anonymization and jurisdiction

Scores the 3%-weighted leaf under the Analytics and insight category, and carries this pair's most legally sensitive scope. Grounded in [raw/abmatic-ai-blog-is-website-visitor-deanonymization-gdpr-compliant.md] and [raw/www-leadpipe-com-blog-state-of-website-visitor-identification-2026.md], both vendor blogs (lower-tier sources per the source-authority ordering), read the caveats below before treating anything here as settled.

## The hard rule for this leaf

**This Stinger flags. It does not adjudicate.** Per this pair's PRD non-goal: "Does not judge consent/privacy-law compliance in depth; flags what's present, `web-security-posture` and the customer's own counsel own the legal read." Never write a finding that asserts a de-anonymization vendor's use is or is not legally compliant. Write a finding that states what was detected, its tier, and the jurisdiction question, and stop there.

## The distinction that decides everything: company-level vs contact-level

| Dimension | Company-level (reverse-IP) | Contact-level (person reveal) |
|---|---|---|
| What is learned | The organization behind anonymous traffic, plus firmographics (industry, headcount, revenue band) | A named individual: name, work email, professional profile |
| Is it personal data under GDPR | Generally no (entity data) | Yes |
| Typical EU/UK lawful basis | Often outside GDPR scope, or legitimate interest if an individual is implied | Legitimate interest (B2B) or consent, with stricter scrutiny |
| US (CCPA/CPRA) treatment | Low risk, usually not "personal information" | Personal information, notice plus opt-out required, no general prior-consent requirement | 
| Relative risk level | Lower | Higher |

[raw/abmatic-ai-blog-is-website-visitor-deanonymization-gdpr-compliant.md]

**Caveat that matters in practice:** in a very small organization, "the company" and "a person" can blur. If reverse-IP resolves to a sole trader or a one-person consultancy, an individual may be identifiable in practice even from entity-level data alone. The source's own framing: "regulators look at whether someone is identifiable in practice, not just in theory." If the audited site's apparent business size is very small, flag this even for a company-level-only detection. [raw/abmatic-ai-blog-is-website-visitor-deanonymization-gdpr-compliant.md]

**Upstream sourcing is inherited risk:** a vendor's own data sourcing (data partners, public profiles, co-ops, panels) becomes the site operator's risk if that sourcing was non-compliant, "no matter how clean your own banner is." This is a diligence item worth naming in a finding, not something this Stinger can resolve or assume clean. [raw/abmatic-ai-blog-is-website-visitor-deanonymization-gdpr-compliant.md]

## The deterministic vs probabilistic distinction

| Capability tier | What is learned | Actionability | 2026 market status |
|---|---|---|---|
| Reverse-IP / company-level | An account may have visited | Low | Commoditized, declining |
| Probabilistic person-level | A likely individual (a guess) | Medium, risky | Widespread, accuracy-challenged |
| Deterministic person-level | A verified individual | High | Premium tier, growing |

[raw/www-leadpipe-com-blog-state-of-website-visitor-identification-2026.md]

Accuracy figures cited by this source (roughly 82% correct for the deterministic leader vs about half that for the most aggressive probabilistic tools) are vendor-cited, not independently confirmed, the source names no study or methodology beyond "independent testing in the category," and the source itself sells a deterministic product. Report these figures, if cited in a finding, as vendor-reported, never as an independently verified statistic. [raw/www-leadpipe-com-blog-state-of-website-visitor-identification-2026.md]

**A pattern worth naming when it applies:** a site running both a de-anonymization vendor and an AI-driven outbound/agentic sales tool carries a stacked risk, a probabilistic match feeding an autonomous outreach action removes the human error-catching step that used to mask inaccurate identification. This is a named dynamic in the research, not this Stinger's own inference, cite it if the audited site's vendor stack shows this combination. [raw/www-leadpipe-com-blog-state-of-website-visitor-identification-2026.md]

## Detection reality: this archive has no fingerprints for de-anonymization vendors

Unlike Google Tag Manager (see `guides/05-tag-manager-and-injection-cross-check.md`), no raw source in this Stinger's archive documents a script-src, global-variable, or HTML-comment signature for RB2B, Clearbit-style tools, Leadpipe, Abmatic, or any other named de-anonymization vendor. `references/templates/vendor-classification-table.md`'s Tier C list is name-only. A domain-fragment match from `references/scripts/analytics-vendor-classify.py` is a **candidate**, not a confirmed detection, route it to manual verification (read the script's own behavior, check its stated purpose against its vendor page) before writing it into `08-analytics/analytics-findings.md` as a finding.

## Jurisdiction flagging discipline

Per Q18's default in the build plan: score de-anonymization presence as N/A where restricted in the site's apparent jurisdiction, and flag the jurisdiction question itself in the report rather than resolving it. Procedure:

1. Determine the site's apparent jurisdiction from available signals (TLD, currency, address in footer/contact page, language, `02-positioning/`'s ICP notes). State the confidence level, this is inherently uncertain from outside the target.
2. If the apparent jurisdiction is EU/UK and a contact-level (person-reveal) vendor is detected, this is the highest-sensitivity combination per the company-level/contact-level table above. Score 0/N/A per the default, and raise the legal-gray-area flag with a specific note (do not just write "flagged", state what specifically is gray: e.g. "contact-level identification with no visible consent mechanism observed on a site with EU-facing signals").
3. If the apparent jurisdiction is US-only, note the lower-friction CCPA/CPRA posture (notice plus opt-out, no general prior-consent requirement) but still flag rather than clear the vendor, "lower risk" is not "no risk," and this Stinger does not have the standing to clear a legal question.
4. If jurisdiction cannot be determined, say so explicitly and flag the tooling as requiring internal (customer-side) verification, per conduct rule 5, never as a confirmed defect or a confirmed pass.

## What never appears in a finding on this leaf

- A statement that a vendor "is compliant" or "is not compliant."
- An assumption that de-anonymization tooling is inherently malicious. This pair's PRD is explicit: flagged distinctly, never assumed malicious by default.
- A confirmed vendor identity from a Tier C name match alone.
