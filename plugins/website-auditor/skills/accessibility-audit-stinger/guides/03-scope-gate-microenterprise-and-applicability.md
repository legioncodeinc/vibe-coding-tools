# Scope gate: microenterprise exemption and applicability

Procedural companion to `references/templates/microenterprise-and-scope-gate-checklist.md`. Run this before scoring, per `guides/01-audit-procedure.md` step 2.

## 1. Determine headcount, turnover, and service-vs-product before anything else

Article 4(5) of Directive (EU) 2019/882 exempts microenterprises (fewer than 10 persons, turnover or balance-sheet total under 2,000,000 euros) providing **services** from the accessibility requirements and every obligation attached to them. [raw/groundedwp-com-blog-wcag-21-or-22-for-the-eaa.md] [raw/www-disabilityworld-org-articles-eaa-first-year-enforcement-report.md] Both sources in this Stinger's archive independently name the same threshold with consistent detail, so this is a well-corroborated fact within the archive, not a single-sourced claim.

Ask the auditor of record (via the intake data already captured in `00-intake/`, or a direct question if intake did not capture it) for the audited party's approximate headcount and turnover if not already evident from the crawled site. Do not infer headcount/turnover from the site's visual polish or apparent scale; that is not a sourced inference method.

## 2. Products never get the exemption, regardless of size

The advocacy-org source makes a distinction the vendor blog does not: the exemption "does not extend to products." [raw/www-disabilityworld-org-articles-eaa-first-year-enforcement-report.md] A one-person shop selling a physical product with an e-commerce site, or a small team shipping a packaged software product, does not qualify even if it meets the headcount/turnover thresholds, because the site is a product's storefront, not itself the service the exemption covers. Determine product-vs-service explicitly and record the reasoning; this is the single most common way this gate would be misapplied.

## 3. What the gate result changes, and what it does not

- It changes: the legal-framing language in the accessibility statement (`references/templates/eaa-conformance-statement-template.md`), specifically whether to characterize findings as EAA-compliance risk at all.
- It does not change: whether the audit runs, whether every checklist row gets scored, or whether the 0-100%/rating band gets computed. Score every engagement the same way regardless of exemption status; other regimes, general usability, and audit completeness all still matter for an exempt site.

## 4. The disproportionate-burden defense (Article 14) is narrow, report it that way if raised

If the audited party has already raised cost/feasibility as a reason not to remediate, name this defense but do not present it as reliable: it "carries the burden of proof and a five-year documentation requirement, and has not yet succeeded at the level of a whole-platform exemption" per the advocacy-org source. [raw/www-disabilityworld-org-articles-eaa-first-year-enforcement-report.md] This is single-sourced (the vendor blog does not discuss Article 14 at all); flag it as such if it appears in a customer-facing report.

## 5. Record and move on

Write the completed checklist to `06-accessibility/scope-gate.md` with every box's outcome and the product-vs-service determination, then proceed to `guides/01-audit-procedure.md` step 3. This record is itself evidence for how the accessibility statement's legal-framing language was chosen later, per conduct rule 2.
