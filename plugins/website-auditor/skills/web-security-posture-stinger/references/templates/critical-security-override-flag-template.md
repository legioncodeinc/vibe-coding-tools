# Critical security override flag template

Copy-ready. Grounded directly in PRD-014 AC-2 and build plan section 4.3's Question-9-adopted override rule, and consumed by `audit-scoring-wasp-drone` (PRD-020 AC-3): "Given any Security leaf scores 1, then the final letter grade is capped at C regardless of arithmetic, and this Drone's output explicitly flags which finding triggered the cap."

## When to fill this out

Every time any leaf in this pair's checklist (headers, cookies, CSP, TLS coarse check, client-side injection, payment-path) scores **1**, this file gets an entry. A single engagement may trigger the override more than once; log every triggering leaf, not just the first.

## Override banner

```markdown
## CRITICAL SECURITY OVERRIDE ACTIVE

This engagement's final letter grade is capped at C regardless of the arithmetic rollup, per the build plan's critical-security-override rule (section 4.3, adopted per Question 9). The following Security-category leaf(s) scored 1 (Critical) and triggered this cap:

| Leaf | Score | Evidence | Why this is critical |
|---|---|---|---|
| {checkpoint_name} | 1 | {evidence_pointer} | {one_line_reason} |
```

## Placement

Write this banner to `07-security/critical-override.md` whenever triggered, and mirror it into `07-security/summary.md`'s headline section so it is visible before a reader reaches the full findings table. This is the one finding in this pair's entire scope that must never be buried below the fold: PRD-014 AC-2 requires the override banner to explicitly name the triggering finding, not just note that a cap occurred.

## If not triggered

Do not omit this file's counterpart note. Write to `07-security/critical-override.md`:

```markdown
## Critical security override: not triggered

No Security-category leaf scored 1 (Critical) in this engagement. The final letter grade is not capped by this rule; see the eight-category rollup for the actual final grade.
```

An explicit "not triggered" record is itself evidence the check ran, per conduct rule 2 (evidence at the moment of finding); do not leave this file absent when the override does not fire, since an absent file is indistinguishable from a check that never ran.
