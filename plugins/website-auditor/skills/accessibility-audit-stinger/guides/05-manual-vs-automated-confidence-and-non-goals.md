# Manual vs automated confidence, and this pair's non-goals

Read before reporting any finding as more certain than it is. Directly implements PRD-013's stated non-goal and conduct rule 5 (confidence stated, not implied).

## 1. What `a11y-scan.py` can and cannot catch

`shared/scripts/a11y-scan.py` implements exactly six deterministic structural checks: page language presence, page title presence, image alt-attribute presence, form-input label association, generic/empty link text, and heading-level order. Each maps to a WCAG success criterion, but each also has a stated limit in the script's own output (e.g. it checks alt-attribute *presence*, not whether the alt text is *meaningfully descriptive*). Never report an automated pass on one of these six checks as confirming the full success criterion; report it as confirming only the structural subset the script actually tested, and say so in the justification field, matching the phrasing already in the script's own `justification` output.

Every other row in `references/templates/wcag-2.1-aa-checklist-scoring-table.md`, which is most of it, requires a heuristic read of the rendered page (contrast ratios, focus order, keyboard operability, consistent navigation, error handling) that this script does not and cannot perform from static HTML alone.

## 2. This is an automated-plus-heuristic pass, not a full manual accessibility audit

PRD-013's stated non-goal: "Does not replace a full manual accessibility audit; this is an automated-plus-heuristic pass, reported at the confidence level that implies." A full manual audit would include real assistive-technology testing (screen readers, switch devices, voice control) with users who rely on them; this Drone does none of that. State this limitation explicitly in every report this Drone produces, not only in this guide.

## 3. Scope: EU/EAA only, other jurisdictions are an explicit gap

This Stinger's entire raw archive concentrates on the European Accessibility Act. Neither raw source documents the US Americans with Disabilities Act, Section 508, or any other non-EU accessibility regime. [raw/groundedwp-com-blog-wcag-21-or-22-for-the-eaa.md] [raw/www-disabilityworld-org-articles-eaa-first-year-enforcement-report.md] If an engagement's audited party operates primarily outside the EU or serves a primarily non-EU customer base, say so explicitly in the report: this Stinger's legal/enforcement framing (guide 02) does not transfer, and the underlying WCAG 2.1 AA technical checklist is jurisdiction-agnostic (it is the same standard cited by most accessibility regimes globally) but the legal-claim-language guidance is not.

## 4. Testing methodology is a named, unfilled gap

Neither raw source documents WCAG success-criteria testing methodology at the level of "how do you actually verify criterion X" (distilled research section 6, explicit gap). This Stinger's checklist template's per-row "how to check" guidance (the automated-vs-heuristic split) is this Stinger's own construction, informed by general accessibility-testing practice, not sourced to the raw archive. Treat it as a reasonable working method, not a cited standard; if a specific criterion's testing approach is contested, say so rather than presenting the checklist's method as definitive.

## 5. Verification log, not silent rejection

Any candidate finding that does not survive a second look (a false-positive from `a11y-scan.py`, a heuristic judgment reversed on re-read) goes into `06-accessibility/summary.md`'s rejected/reframed candidates table with the reason, per conduct rule 4. Do not just delete a rejected candidate; the record that it was considered and rejected is itself part of the deliverable.
