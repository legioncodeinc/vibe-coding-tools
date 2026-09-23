# Conversion-action taxonomy worksheet

Copy-ready worksheet `icp-positioning-wasp-drone` fills in for every conversion action it detects on the audited site, writing the result to `02-positioning/conversion-taxonomy.md`. Classification vocabulary (macro / process-milestone micro / secondary-action micro) is sourced directly from Nielsen Norman Group, the highest-authority source in this pair's research archive. [raw/nngroup-com-macro-vs-micro-conversions.md]

## Classification definitions (verbatim from source)

- **Macro conversion:** "a desired user action that directly contributes to the primary goals of your business." [raw/nngroup-com-macro-vs-micro-conversions.md]
- **Process-milestone micro conversion:** "conversions that represent linear movement toward a macro conversion" (e.g. add-to-cart on the path to a purchase). [raw/nngroup-com-macro-vs-micro-conversions.md]
- **Secondary-action micro conversion:** "micro conversions that do not directly lead up to a macro conversion but may predict future macro conversions" (e.g. newsletter signup, content share, video watch). [raw/nngroup-com-macro-vs-micro-conversions.md]

Worked macro-conversion examples by business purpose, per NN/G: sell products/services -> completed purchase; collect sales leads -> submitted lead form; promote events -> completed registration; build a social community -> account created. [raw/nngroup-com-macro-vs-micro-conversions.md]

## Mandatory vs. optional actions (for nonmonetary/nontransactional sites)

If the audited site's primary goal is nonmonetary (informational, community-building, service-directory), apply NN/G's mandatory/optional distinction before scoring conversion rate at all: a **mandatory** action has no alternative path (conversion rate is the wrong metric here; use ease-of-use, error-count, or support-interaction signals instead), an **optional** action has multiple paths (conversion rate remains valid). [raw/nngroup-com-macro-vs-micro-conversions.md] State explicitly in the worksheet which regime applies before filling in the table below.

## Worksheet table

| # | Detected action | Where observed (page/element) | Classification (macro / process-milestone micro / secondary-action micro) | Mandatory or optional | Confidence | Evidence pointer |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |

Fill one row per distinct conversion mechanism found on the site (purchase, lead-form submit, phone call, newsletter signup, account creation, booking, etc., per PRD-005's own example list). A site typically surfaces more than one; do not stop at the first macro conversion found.

## Single-mechanism flag

If the worksheet ends up with exactly one row and it is the site's only conversion path, flag this explicitly: "Most B2B websites are built with one primary way to convert: a high-commitment contact form, demo request, or sales call... This is lazy strategy, and it's the primary reason inbound programs fail to produce qualified leads." [raw/321webmarketing-com-audit-conversion-paths-buyer-stage.md] Per the distilled research (section 5), a single-mechanism site is evidence of poor site strategy, NOT by itself evidence that the site's focus/niche is undeterminable; do not treat a single-mechanism finding as grounds for the hard-stop gate (see `guides/04-hard-stop-gate.md`).

## Summary fields (write these below the table)

- Primary business goal inferred (transactional / lead-gen / informational / community / other): ____
- Macro conversion(s) identified: ____
- Total conversion mechanisms found: ____
- Single-mechanism site: yes / no
- Confidence in this taxonomy overall: high / medium / low, with one-line justification
