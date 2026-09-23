# Guide 06: Final QA Checklist

Run this in full before any XLSX or PDF from this stinger reaches the user. Every unchecked item needs either a fix or an explicit, stated reason it does not apply; silent skips are not acceptable.

## XLSX

- [ ] Subject company is row 2 (or clearly first), visually distinct, and every comparison note in every other row is written relative to it, not generic
- [ ] Every category present in the research is represented, either as a column value or as separate tabs
- [ ] Read Me / sourcing tab exists: as-of date, sources named, gated-pricing caveat stated
- [ ] Header row frozen, autofilter applied, professional font throughout
- [ ] If any formula exists: `recalc.py` run, `status: success`, zero errors
- [ ] Spot-checked at least 3 data cells against the original research to confirm no transcription drift
- [ ] Feature roadmap tab (if present): Status and Priority both color-coded independently, every rationale explains WHY, not just WHAT

## Branded PDF

- [ ] Brand kit confirmed to belong to the correct subject company, not a sibling product or parent company
- [ ] Print-specific brand rules (e.g. light-palette-for-PDF) followed literally if the brand guide states any
- [ ] Every page rendered to PNG and visually inspected; page count matches expectation
- [ ] Logo visibly renders (not black-on-black or white-on-white) on every page it appears on
- [ ] No orphaned near-blank pages (grayscale near-white-pixel fraction above ~0.98 on any page that is not legitimately sparse)
- [ ] grep for the literal em dash character and `&mdash;` returns zero matches, unless the user has explicitly said em dashes are fine
- [ ] Any multi-hue chart's palette passed `validate_palette.js ... --pairs all` in the relevant color mode; if it failed, the chart was faceted to single-hue instead, not shipped as-is
- [ ] Market-pattern section states at least one computed statistic with its implication, not just a list of facts
- [ ] Battlecards (if present) each have a Fact, an honest Impact in both directions, and a literal, sayable Act
- [ ] Report is dated and sourced

## Delivery

- [ ] File sent via SendUserFile with a one-line, non-redundant caption (the user can open the file; do not re-describe its full contents in prose)
- [ ] If a folder is connected on the user's device and the deliverable has a natural home there, committed via `device_commit_files` and the location stated in plain language
- [ ] If this is a revision of a previously delivered file, the SAME file path/name is reused so it lands as an update, not a duplicate
