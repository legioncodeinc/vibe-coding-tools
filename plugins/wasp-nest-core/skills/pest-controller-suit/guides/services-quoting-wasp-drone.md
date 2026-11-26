# services-quoting routing guide

**Plugin owner:** `software-economics-tools`. Requires Core and this selected owner.

## Domain

Prepare scoped website/app/maintenance quotes, pricing arithmetic, statement-of-work proposals and change proposals.

## Trigger phrases

quote project; website quote; agency statement of work; scope acceptance criteria; margin vs markup; maintenance price.

## Do NOT route when

SaaS market price selection, contract legal acceptance and billing implementation are separate owners.

## Inputs the Drone needs

supplied scope, effort/cost rates, currency/period, uncertainties and acceptance boundaries.

## Outputs the Drone produces

proposed quote, scope worksheet, commercial/technical SOW draft, maintenance limits, change delta and economic evidence. SOW drafts reuse Services Quoting worksheets; legal terms stay with selected Legal Docs/counsel. Actual commercial acceptance and Accepted interface CTRs remain distinct.

## Dispatch and authority

Resolve `services-quoting-stinger` through trusted Core's selected registry before dispatch. Source work uses the current catalog owner and canonical path. A cache is not an enabled capability. Arm the selected skill first, preserve the parent's clock/ownership, and report actual direct/native execution support. The runtime is advisory preparation: it does not create accounts, change live settings, accept contracts, spend or publish. Code changes close Security then Quality and the orchestrator repository-health gate.

[Source skill](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/software-economics-tools/skills/services-quoting-stinger/SKILL.md) and [paired Drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/software-economics-tools/agents/services-quoting-wasp-drone.md) carry the exact procedure and selected-owner handoffs.
