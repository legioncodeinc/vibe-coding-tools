# 04. Report and workspace output

Where this Drone's findings go, and the housekeeping rules that apply to a bonus/conditional Drone specifically.

## Destination

Per the build plan's shared audit workspace (section 3) and PRD-019's shared-workspace contract, this Drone reads `site-data/` and `_shared/target-profile.json`, and writes to `12-ecommerce/` inside the run's own workspace folder (`www.example.com-audit/12-ecommerce/`), not into this plugin repository's `library/` tree. That `library/` convention is for reports about this repository's own code; this Drone instead produces external-target audit findings that live in the per-run audit workspace. Use `references/templates/12-ecommerce-summary-template.md` as the exact skeleton, do not improvise a different section order.

## N/A handling is not optional and is not a soft skip

If no commerce platform is detected, `12-ecommerce/`'s output still gets written, with the "no commerce detected" branch filled in honestly: what signal (or absence of one) in `_shared/target-profile.json` and `site-data/` led to that conclusion, and the explicit statement that this checkpoint resolves to 0/N/A and is excluded from scoring (PRD-019 AC-1). A missing `12-ecommerce/` output is indistinguishable from "this Drone never ran" to `audit-scoring-wasp-drone` downstream.

## Evidence capture, at the moment of finding

Per this pair's conduct rules, evidence is captured at the moment of finding, never reconstructed from memory afterward. Save `product-schema-checklist.py`'s JSON output into `12-ecommerce/` alongside the human-readable summary. When a metadata or structured-data claim traces to a `[raw/...]` source, the citation goes in at write time.

## Verification log

Any candidate finding this Drone considered and then rejected or reframed gets logged in `12-ecommerce/`'s verification log with the reason, per this pair's conduct rules. Common cases worth logging explicitly: a structured-data "missing field" that turned out to be present under a nonstandard key the script didn't recognize (reframe, don't silently drop), or a copy-quality observation that on closer read was actually present but below the fold (reframe as "present but low-visibility," not dropped).

## Read-only by default, with the conduct rule spelled out for this domain specifically

Read-only/passive is the default. Any step that would create state on the target (placing an order, adding to cart, submitting a form, uploading a file) requires explicit per-run opt-in that defaults OFF, per this pair's conduct rules. Nothing in this Drone's scope (metadata completeness, copy/conversion read) requires add-to-cart or checkout interaction, structured-data and on-page copy are both readable from the already-crawled page. If a future run's scope genuinely needs a cart/checkout interaction (e.g. verifying a price shown at checkout matches the JSON-LD price), that is exactly the kind of step this default-OFF opt-in gate exists to catch, do not perform it silently.

## Handoff

`audit-scoring-wasp-drone` and `audit-reporting-wasp-drone` consume `12-ecommerce/` downstream (per the build plan's W7/W8 wave ordering). This Drone's job ends at a complete, honestly-scoped `12-ecommerce/` output, it does not compute a final score or assemble the customer/auditor report itself.
