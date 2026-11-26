---
name: "unit-economics-stinger"
description: "Model supplied software prices and costs into margins, break-even, losses, and scenarios. Use for an economic worksheet, operating economics, or free/trial, abuse-cost, refund and usage sensitivity."
license: AGPL-3.0-or-later
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Python 3.9+ for the offline calculator.
metadata:
  hive-drone: unit-economics-wasp-drone
  pair-drone: unit-economics-wasp-drone
  domain: software economics
---

# Unit economics

## Purpose

Produce a reviewable worksheet showing how supplied price, volume, costs, failed payments and refunds affect contribution, gross margin, break-even and losses. Read [README.md](README.md) for the guide map. All rates are explicit assumptions with observation dates and provenance. The offline calculator produces JSON without changing provider settings.

## When to use

- "Does each paying customer cover what they cost?"
- "How many users do I need to break even?"
- "What happens to margins with high usage, refunds, or failed payments?"
- "Build an economic worksheet from my known price and operating costs."
- "What do free users, trials, rejected requests and suspected trial abuse cost us?"

## Boundaries

This is advisory research and calculation. It does not select a SaaS price, negotiate a contract, implement payments, forecast delivery, or make tax/legal accounting determinations. It cannot establish market demand. Multi-product, partial-refund, FX, vendor-tier and late-collection models require an explicit worksheet extension with stated limitations.

## Procedure

1. Read [intake and classification](guides/01-intake-and-classify.md), collect missing inputs in one question, and preserve evidence gaps rather than substituting zero.
2. Read [field contract](references/model.md); confirm one currency, period and attempted billing unit. Require explicit fixed/variable behavior and cost-of-revenue/operating classifications.
3. Follow [model and review](guides/02-model-and-review.md) to build baseline, high-usage and downside scenarios. Refresh official fee evidence when live rates matter; fictional examples are never vendor rates.
4. For free/trial service or suspected abuse, use [cohort costs](guides/03-free-trial-and-abuse-costs.md) and the [cohort worksheet](references/templates/free-trial-worksheet.md). Keep actual attribution, blocked attempts and shared credits explicit. The unchanged calculator holds nonpaid period totals, so break-even is conditional.
5. Run the bundled calculator per [script instructions](scripts/README.md). Check fee retention, reconciliation, losses and break-even status. Retain the input and output with the worksheet.
6. Deliver the [worksheet](references/templates/worksheet.md), source/date/contract notes, model exclusions, sensitivity result and one evidence-backed recommendation. Report unresolved questions before any dependent commercial action.

## Selected-owner dispatch

For source work, locate this owner in `plugin-catalog.json` and use its `source_root`. For installed work, use trusted Core's `hooks/resolve-component.py unit-economics-stinger --kind skill` against the explicit selected-plugin registry. Resolve each cross-pack skill by name through that resolver before loading it; missing availability is a handoff gap, not permission to load a cached sibling. Payments owns accepted billing implementation, Estimation owns delivery forecasting, and platform owners provide operating-cost facts.

## Reports and validation

Write runtime reports under the user's repository `library/requirements/reports/unit-economics/<date>-<topic>.md` when Library exists; otherwise agree a reviewable local destination. Keep the worksheet, assumptions and calculator output together. Calculator edits require behavioral tests in `scripts/test_calculate.py` and the parent construction Ship Gate in Security then Quality order. Runtime analysis creates no implementation or provider write.

## References

- [Research distillation](references/research/distilled-unit-economics.md), source ledger, and raw archive: verify domain claims.
- [Worked examples](examples/fictional-scenarios.md): check the difference between contribution and gross margin.
- [Paired Drone](../../agents/unit-economics-wasp-drone.md): specialist invocation.

<!-- Ship Gate removed: research-only runtime, produces no implementation code or provider writes. The bundled calculator's construction is subject to the parent Ship Gate. -->

## Fair service limits

For O281 use [the focused guide](guides/04-fair-service-limits.md), [integrated worksheet](references/templates/fair-service-limits-worksheet.md), dated mechanism research and [completed fictional cases](examples/fair-service-limits-cases.md). Join entitlement usage/window/aggregation and cost scenarios with proposed limits, overflow/recovery/review, owner-selected fairness criteria and evidenced decisions. Reuse the calculator once; Unknown rates/owners/criteria stay Unknown. Selected SaaS Pricing owns value tradeoffs. Separately accepted Payments and actual Security/platform implementation require their own evidence. Costs prove neither fairness nor working abuse controls.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [pest-controller-suit](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/pest-controller-suit/SKILL.md) - Source roster and selected-owner routing. In installed plugins resolve Core's skill rather than assuming this source-tree relative path.
  - Payments, Estimation, and platform specialists - Resolve their catalog names through trusted Core's selected-plugin resolver before loading any optional owner.
