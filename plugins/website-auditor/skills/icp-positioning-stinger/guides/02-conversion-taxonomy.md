# 02. Conversion taxonomy

How `icp-positioning-wasp-drone` builds the site-specific conversion-action taxonomy required by PRD-005's goals ("purchase, lead-form submit, phone call, newsletter signup, account creation, booking" is the PRD's own example list, not an exhaustive one).

## Source vocabulary

This entire guide is grounded in one primary source, Nielsen Norman Group, treated in the distilled research as "the highest-authority source in this archive on this specific point" because it is a UX-research organization's own published distinction rather than a vendor blog. [raw/nngroup-com-macro-vs-micro-conversions.md]

- **Macro conversion**: "a desired user action that directly contributes to the primary goals of your business." [raw/nngroup-com-macro-vs-micro-conversions.md]
- **Micro conversion**, two subtypes:
  - **Process-milestone**: "conversions that represent linear movement toward a macro conversion" (e.g. add-to-cart on the path to a purchase). [raw/nngroup-com-macro-vs-micro-conversions.md]
  - **Secondary-action**: "micro conversions that do not directly lead up to a macro conversion but may predict future macro conversions" (e.g. content share, video watch, newsletter signup). [raw/nngroup-com-macro-vs-micro-conversions.md]
- Macro conversions are rare: "the average macro-conversion rate is only 2.9%" across industries, which is why the micro-conversion vocabulary exists as a supplement, not a replacement metric. [raw/nngroup-com-macro-vs-micro-conversions.md] Do not treat a low count of detected macro conversions on the audited site as itself suspicious; it is the expected pattern.

## Procedure

1. **Enumerate every distinct conversion mechanism** observable on the audited site from external inspection: forms, phone-number CTAs, "buy now"/"add to cart" buttons, newsletter signup fields, account-creation flows, booking/scheduling widgets, chat-request buttons, and any other action a visitor can take that produces a state change. Use `references/templates/conversion-action-taxonomy-worksheet.md` as the working table.
2. **Determine the site's primary business goal first**, before classifying individual actions - NN/G's worked examples key macro-conversion identity to business purpose (sell -> purchase; collect leads -> lead form; promote events -> registration; build community -> account creation). [raw/nngroup-com-macro-vs-micro-conversions.md] Getting this wrong misclassifies everything downstream, since "macro" is defined relative to the business's own primary goal, not in the abstract.
3. **If the site's goal is nonmonetary** (informational, service-directory, community), apply NN/G's mandatory/optional distinction before scoring anything as a conversion rate: a mandatory action (no alternative path) should be evaluated on ease-of-use/error-count/support-interaction signals instead of conversion rate; an optional action (multiple paths exist) keeps conversion rate as a valid metric. [raw/nngroup-com-macro-vs-micro-conversions.md] State which regime applies in the output.
4. **Classify each enumerated action** as macro, process-milestone micro, or secondary-action micro, filling in the worksheet's evidence-pointer column with the page/element it was observed on.
5. **Check for the single-mechanism pattern.** If the site has exactly one conversion mechanism and it is a high-commitment type (contact form, demo request, sales call), flag it per the sourced finding: "Most B2B websites are built with one primary way to convert... This is lazy strategy, and it's the primary reason inbound programs fail to produce qualified leads." [raw/321webmarketing-com-audit-conversion-paths-buyer-stage.md] **Do not treat this finding as evidence the site's focus is undeterminable** - per the distilled research (section 5), single-mechanism is a site-strategy finding, not a focus-determinability finding; the hard-stop gate (`04-hard-stop-gate.md`) evaluates a different, stricter condition.
6. **Write the result** to `02-positioning/conversion-taxonomy.md` using the worksheet template, with a stated confidence level for the taxonomy as a whole.

## What this taxonomy feeds downstream

`03-buyer-readiness-model.md`'s page/offer classification worksheet draws directly on the macro/micro actions identified here - run this guide's procedure before that one. `prd-006-keyword-intelligence` (wave W3) also reads `02-positioning/` afterward and needs the taxonomy to exist without it having to re-derive niche or ICP itself (PRD-005 AC-3); an incomplete or unclassified taxonomy defeats that downstream contract even if the niche/ICP sections are otherwise solid.
