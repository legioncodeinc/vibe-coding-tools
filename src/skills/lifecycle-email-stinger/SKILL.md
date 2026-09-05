---
name: "lifecycle-email-stinger"
description: "Writes evidence-grounded hot and warm lead follow-up emails. Use for lead classification, sequences, cadence, suppression, QA, and measurement. Not for cold outreach or support tickets."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, and Claude Cowork.
metadata:
  hive-bee: "lifecycle-email-worker-bee"
  domain: "lifecycle email"
  pair-bee: "lifecycle-email-worker-bee"
---

# Lifecycle Email Stinger

## Purpose

Build truthful, useful hot and warm lead follow-up emails from supplied evidence. This stinger classifies the lead, selects a bounded cadence, drafts one distinct reason to respond per step, defines suppression and human handoff, and supplies QA plus measurement criteria. It produces content and implementation handoffs. It does not send email or configure a platform.

## When to use

- Build a follow-up sequence for a verified hot or warm lead.
- Rewrite weak check-in emails into evidence-grounded next steps.
- Decide follow-up cadence, stop rules, human handoff, or re-entry logic.
- Classify a lead from explicit actions, replies, stage, and timing.
- QA or measure an existing lead follow-up sequence.

## When not to use

- Cold prospecting, purchased or scraped lists, newsletters, or product announcements.
- Customer support ticket replies. Use `support-response-stinger`.
- HighLevel workflow, CRM, domain, or mailbox configuration. Use `gohighlevel-stinger`.
- Legal conclusions about whether a campaign may be sent.

## Procedure

1. Read `guides/01-intake-classify-and-plan.md`. Complete `references/intake-schema.md`, return readiness, and classify through `references/classification-rubric.md`.
2. Stop on `HOLD`. List the smallest missing facts needed to proceed. Never invent consent, prior contact, pain, price, proof, urgency, scarcity, results, or timing.
3. For `HOT`, read `guides/02-build-hot-lead-follow-up.md` and use `references/templates/hot-lead-sequence.md`.
4. For `WARM`, read `guides/03-build-warm-lead-follow-up.md` and use `references/templates/warm-lead-sequence.md`.
5. Use `references/cadence-and-stop-rules.md`. A real lead-stated date or agreed next step overrides a default test cadence.
6. Read `guides/04-review-measure-and-handoff.md`. Run `references/qa-checklist.md`, define outcomes through `references/measurement-framework.md`, and return `PASS` or `HOLD`.
7. Keep customer-facing drafts white-label as `{agency}`. Do not mention or link research vendors, communities, HighLevel, GoHighLevel, or internal help sources in the email copy.
8. If platform implementation is requested, provide the handoff and route execution to `gohighlevel-stinger`. Do not change platform state.

## Output contract

Return:

1. Readiness and lead-state classification with evidence.
2. Assumptions, unknowns, and prohibited claims.
3. Sequence table with timing, reason, CTA, and exit condition.
4. Complete plain-text email drafts.
5. Suppression, human handoff, and re-entry rules.
6. QA result and unresolved platform tests.
7. Primary outcome, guardrails, and evaluation plan.

Never label `DRAFT_WITH_GAPS` content as send-ready.

## References map

- `guides/01-intake-classify-and-plan.md` - load first for every request.
- `guides/02-build-hot-lead-follow-up.md` - load for direct buying signals, active evaluations, and decision-stage follow-up.
- `guides/03-build-warm-lead-follow-up.md` - load for valid, non-immediate interest and nurture.
- `guides/04-review-measure-and-handoff.md` - load after drafting for QA, measurement, and platform handoff.
- `references/intake-schema.md` - required facts, readiness states, and intake form.
- `references/classification-rubric.md` - observable state criteria and evidence strength.
- `references/cadence-and-stop-rules.md` - timing priority, starting hypotheses, exit rules, and re-entry.
- `references/qa-checklist.md` - truth, white-label, lifecycle, compliance, and rendering gates.
- `references/measurement-framework.md` - event schema, outcome metrics, reply classes, and experiment card.
- `references/templates/hot-lead-sequence.md` - complete H0 through H4 reusable sequence.
- `references/templates/warm-lead-sequence.md` - complete W0 through W4 reusable sequence.
- `references/research/distilled-lifecycle-email.md` - cited current research and evidence limits.
- `references/research/raw/` - source-level provenance, including outside-window Google and FTC constraints.

## Related bees and stingers

- [lifecycle-email-worker-bee](../../agents/lifecycle-email-worker-bee.md) - paired specialist for executing this workflow.
- [support-response-stinger](../support-response-stinger) - provider-side support ticket follow-up and white-label technical responses.
- [gohighlevel-stinger](../gohighlevel-stinger) - HighLevel API, workflow, webhook, and platform implementation.
- [technical-writing-craft-stinger](../technical-writing-craft-stinger) - deeper prose and documentation-quality review.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [support-response-stinger](../support-response-stinger) - Provider-side support ticket response and follow-up emails.
  - [gohighlevel-stinger](../gohighlevel-stinger) - HighLevel platform implementation and integration work.
  - [technical-writing-craft-stinger](../technical-writing-craft-stinger) - Technical writing quality and reader-focused revision.

<!-- Ship Gate removed: research-only stinger, produces no committable code. -->

