# Microenterprise exemption and scope gate checklist

Copy-ready pre-score gate, run once per engagement before scoring begins. Grounded in distilled research section 4. [raw/groundedwp-com-blog-wcag-21-or-22-for-the-eaa.md] [raw/www-disabilityworld-org-articles-eaa-first-year-enforcement-report.md]

## 1. Is the audited party a microenterprise under Article 4(5)?

Directive (EU) 2019/882 Article 4(5) exempts microenterprises, defined as fewer than 10 persons with turnover or balance-sheet total under 2,000,000 euros, providing services, from the accessibility requirements and every obligation attached to them. [raw/groundedwp-com-blog-wcag-21-or-22-for-the-eaa.md] [raw/www-disabilityworld-org-articles-eaa-first-year-enforcement-report.md]

- [ ] Fewer than 10 persons employed
- [ ] Annual turnover or balance-sheet total under 2,000,000 euros
- [ ] The audited party is providing a **service** through the site (not selling a product)

If all three boxes are checked, the site is exempt from the EAA's accessibility requirements. **This does not mean skip the audit.** Score and report normally; WCAG conformance still matters for usability, other jurisdictions (US ADA/Section 508, etc., not researched in this Stinger's archive, flag as unresearched if relevant) and general audit quality. It means: do not frame findings as EAA-compliance risk in the report, and say so explicitly, since that framing would misstate the audited party's actual legal exposure.

## 2. Products do not get the exemption, even for a microenterprise

The advocacy-org source makes a distinction the vendor-blog source does not: the microenterprise exemption is services-side only, it "does not extend to products." [raw/www-disabilityworld-org-articles-eaa-first-year-enforcement-report.md] If the audited site sells or is itself a product (e.g. self-service kiosk software, a packaged consumer device's companion site) rather than a service, the exemption does not apply regardless of headcount/turnover. Determine product-vs-service before checking box 3 above; do not assume "small business" implies "exempt."

## 3. Is the disproportionate-burden defense (Article 14) relevant here

Only relevant if the audited party has already raised cost/feasibility concerns about remediation. The advocacy-org source states this defense "carries the burden of proof and a five-year documentation requirement, and has not yet succeeded at the level of a whole-platform exemption" as of its publish date. [raw/www-disabilityworld-org-articles-eaa-first-year-enforcement-report.md] Report this defense, if raised by the audited party, as narrow and burden-of-proof-heavy, not as a reliable exemption path; this is single-sourced (the vendor blog does not discuss Article 14) and should be flagged as such if repeated in a report.

## 4. Record the gate result

Write the outcome of this checklist to `06-accessibility/scope-gate.md` before scoring begins, with the checked boxes and the product-vs-service determination named explicitly. This record is itself evidence for how the accessibility statement's legal-framing language was chosen, per conduct rule 2 (evidence at the moment of finding).
