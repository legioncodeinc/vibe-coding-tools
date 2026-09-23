# 04. Report and workspace output

Where this Drone's findings go, and the housekeeping rules that apply to a bonus/conditional Drone specifically.

## Destination

Per the build plan's shared audit workspace (section 3) and PRD-018's shared-workspace contract, this Drone reads `site-data/` and writes to `11-blog/` inside the run's own workspace folder (`www.example.com-audit/11-blog/`), not into this plugin repository's `library/` tree. That `library/` convention (used by `security-stinger` and other internal dev-facing Stingers) is for reports about THIS repository's own code, this Drone instead produces external-target audit findings that live in the per-run audit workspace the build plan defines. Use `references/templates/11-blog-summary-template.md` as the exact skeleton, do not improvise a different section order.

## N/A handling is not optional and is not a soft skip

If no blog is detected, `11-blog/README.md` (or equivalent) still gets written, with the "no blog detected" branch filled in honestly: what was checked, what wasn't found, and the explicit statement that this checkpoint resolves to 0/N/A and is excluded from scoring, not counted as a missed opportunity (PRD-018 AC-1). A missing `11-blog/` output is indistinguishable from "this Drone never ran" to `audit-scoring-wasp-drone` downstream, which is a worse failure mode than an honest N/A.

## Evidence capture, at the moment of finding

Per this pair's conduct rules, evidence is captured at the moment of finding (artifact path, URL, or the script's own output path), never reconstructed from memory afterward. Concretely: when `select-recent-posts.py` runs, save its JSON output into `11-blog/` alongside the human-readable summary, do not just read it once and paraphrase it away. When an AI-authorship band cites a research figure, the `[raw/...]` citation goes in at write time, not backfilled at the end of the run from memory of "something in the Springer paper."

## Verification log

Any candidate finding this Drone considered and then rejected or reframed (e.g. a post that looked AI-authored on a first pass but, on checking the method/error-rate discipline in [03-ai-authorship-probability-band-reporting.md](03-ai-authorship-probability-band-reporting.md), didn't clear the bar for inclusion at the confidence level first drafted) gets logged in `11-blog/`'s verification log with the reason, per this pair's conduct rules. Silently dropping a candidate finding is not compliant, logging why it didn't survive is.

## Read-only by default

This Drone never places an order, submits a form, or creates account state on the target site, read-only/passive is the default per this pair's conduct rules, and any exception requires explicit per-run opt-in that defaults OFF. Nothing in this Drone's scope (recency ranking, word count, quality read, AI-authorship analysis) requires anything beyond reading already-crawled `site-data/` content, so in practice this default should never need to be overridden for this pair.

## Handoff

`audit-scoring-wasp-drone` and `audit-reporting-wasp-drone` consume `11-blog/` downstream (per the build plan's W7/W8 wave ordering). This Drone's job ends at a complete, honestly-scoped `11-blog/` output, it does not compute a final score or assemble the customer/auditor report itself.
