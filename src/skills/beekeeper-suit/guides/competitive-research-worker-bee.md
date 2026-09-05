# competitive-research-worker-bee

## Domain

This Bee creates source-grounded competitor-landscape workbooks and brand-matched competitive reports. It owns the research sweep, category taxonomy, feature-gap analysis, computed market-pattern insights, and sales battlecards. It does not implement the roadmap items it identifies.

## Paired Stinger

[competitive-research-stinger](../../competitive-research-stinger) - source capture, comparison taxonomy, workbook and report construction, quality checks, and battlecard procedures.

## Trigger phrases

- "build a competitor comparison spreadsheet"
- "research our competitors"
- "make a battlecard deck"
- "create a competitive landscape report"
- "run a feature-gap analysis"

## Do NOT route when

- The request is to implement a feature identified by the research. Route to the owner of that implementation domain.
- The request is general product-roadmap prioritization without a research artifact. Route to the relevant product planning owner.
- The request is to build an application UI, backend, or integration. Route to that implementation Bee.

## Inputs the Bee needs

- Named competitors or category, target audience, product scope, and research date cutoff.
- The intended output format, brand assets, comparison criteria, and allowed public or licensed sources.
- A decision owner for claims that require customer evidence or private data.

## Outputs

- A cited comparison workbook and report that separate verified claims, observed patterns, and open questions.
- Feature-gap and market-pattern analysis with traceable sources and decision-ready battlecards.

## Commonly sequenced with

- `library-worker-bee` when findings must become a PRD or IRD.
- The relevant implementation Bee only after the owner approves a bounded roadmap slice.
- The Ship Gate before any repository commit or push.

---

*Part of Beekeeper-Suit's roster. See [`.claude/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full colony.*
