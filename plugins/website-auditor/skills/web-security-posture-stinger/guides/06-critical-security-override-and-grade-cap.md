# Critical security override and the final grade cap

Grounded directly in build plan section 4.3 (adopted as-is per Question 9) and PRD-014 AC-2. This is the one mechanic in this pair's entire scope with direct, immediate consequences for every other category's score, so read it carefully.

## 1. The rule

"Any Security leaf scoring 1 caps the final grade at C regardless of arithmetic. A site with an active critical security finding should not be able to present an A because everything else is tidy." (build plan section 4.3, adopted). PRD-014 AC-2 states the acceptance criterion exactly: "Given any leaf in this category scores 1 (critical), then per the scoring engine's override rule (prd-020, build plan Q9), the final grade is capped at C regardless of arithmetic, and this Drone's output explicitly flags which finding triggered the cap."

## 2. This Drone's job is to flag, not to apply, the cap

`audit-scoring-wasp-drone` applies the actual cap during its own wave-W7 rollup (PRD-020). This Drone's job in wave W5 is narrower but non-negotiable: every leaf that scores 1 must be identifiable as a critical finding in this pair's own output, with the exact evidence pointer, so that Drone can find and apply the override correctly. A critical finding buried in a findings table with no distinguishing flag is a handoff failure, even if the underlying score is correct.

## 3. Fill the template every time, triggered or not

Use `references/templates/critical-security-override-flag-template.md` for both outcomes. A triggered override gets the banner with every triggering leaf named. A non-triggered pass gets the explicit "not triggered" note. Do not simply omit `07-security/critical-override.md` when nothing triggers it; an absent file is indistinguishable from a check that never ran, which fails conduct rule 2's evidence-at-the-moment-of-finding requirement just as much as a missing finding would.

## 4. What counts as a critical (1) finding for override purposes

Any leaf in this pair's checklist scoring 1: an absent required header, a present header that should be absent (X-XSS-Protection non-zero, Expect-CT present), a session cookie missing Secure/HttpOnly, a CSP absent entirely. Do not extend the override to a leaf this pair explicitly did not score (the unresearched TLS-depth and payment-path gaps from `guides/05`); an unscored gap is not the same as a scored 1, and asserting otherwise would misapply the override rule to a finding this archive does not actually support.

## 5. Mirror the banner in the summary, do not bury it

Per `references/templates/critical-security-override-flag-template.md`'s placement instructions, the triggered banner goes into `07-security/summary.md`'s headline section, ahead of the full findings table. This is a deliberate exception to build-order-by-appearance in `guides/08-report-and-handoff-to-scoring.md`; the override is the single fact about this engagement most likely to change the reader's next action, so it leads the summary regardless of where its underlying leaf sits in the checklist.
