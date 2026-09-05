# What is Task Mining (Celonis insights page)

- **URL:** https://www.celonis.com/insights/topics/what-is-task-mining
- **Fetched:** 2026-08-17
- **Source type:** vendor-blog (marketing content on a vendor domain, ranked below the
  product documentation)
- **Why archived:** It names the specific low-level signals a commercial task mining product
  treats as automation indicators. That signal list is the closest published thing to the
  pattern signatures a capture-based detector needs, and it is why copy-paste and
  application switching appear as named signatures rather than as invented categories.

## The captured signals, quoted

> "capture user interaction data such as clicks, copy/pastes, time spent per application"

Then: understand application usage and user behavior across applications.

## Signals treated as automation indicators

| Signal | How the page frames it |
|---|---|
| Copy and paste operations | Captured as a first-class metric alongside clicks and time per application |
| Application switching | Part of understanding how teams execute work across applications |
| Manual data entry | Illustrated with filling in a purchase order and checking amounts against a spreadsheet |
| Repetitive patterns | Framed as identifying non-value-adding activities |

## Work invisible to process mining, quoted

> "all the steps that happen outside of major systems, like checking emails or consulting
> spreadsheets"

This is the vendor's own statement of why desktop capture exists as a category: the
transactional system does not record the work done around it, so the automation opportunity
is systematically invisible to any analysis built on system logs alone.

## Stated benefits

- Decrease amount of time spent on non-value-adding activities.
- Identify opportunities in how users execute work outside of transactional systems.
- Discover team training needs and application adoption.

## Reliability note

This is vendor marketing. The signal taxonomy is useful and matches the academic pipeline
in `automation--task-mining--leno-rpm-vision-and-challenges.md`. Any efficiency or savings
claim on the page is unverified and is not carried into the distillation.
