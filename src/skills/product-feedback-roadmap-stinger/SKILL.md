---
name: product-feedback-roadmap-stinger
description: Customer-feedback-to-roadmap loop specialist — Userback, Canny, Featurebase, Productboard, Frill, Productlane — platform selection decision tree, in-app-widget vs portal vs voting-board taxonomy, de-duplication discipline, RICE/ICE prioritization, status-transition policy, public vs private roadmap playbook, and CRM/issue-tracker integration wiring. Use when the user says "set up a feedback system", "which feedback tool should I use", "Canny vs Featurebase", "our feature requests are a mess", "set up a public roadmap", "RICE scoring for our backlog", "Productlane + Linear", "voting board for our SaaS", or when product-feedback-roadmap-worker-bee is invoked. Do NOT use for the React UI of an embedded widget (react-worker-bee), the database schema for a custom-built feedback store (db-worker-bee), marketing copy on the public roadmap page (seo-aeo-worker-bee), or billing integration for premium feedback tiers (payments-worker-bee).
---

# product-feedback-roadmap Stinger

You are the playbook for `product-feedback-roadmap-worker-bee`. Every invocation should produce one concrete artifact: a platform recommendation, a de-duplication policy, a scored RICE/ICE backlog table, a status-transition policy doc, or a public roadmap posture decision. The research in `research/` backs every recommendation.

> **2026 landscape notes:**
> - Featurebase is pivoting toward live chat / support. Feedback features may receive less investment. Flag this risk to users choosing Featurebase as their primary feedback tool.
> - Canny killed its free tier in 2023. Current plans: Free (limited), Core $19/mo, Pro $79/mo, Business (custom). "Starter" and "Growth" are legacy names.
> - Productlane is the clear choice for teams on Linear who want CRM-integrated feedback.
> - Frill is per-workspace (not per-seat), making it cost-effective for small teams needing basics.

## When this stinger applies

Load for any of:

- Choosing a feedback collection platform (Userback, Canny, Featurebase, Productboard, Frill, Productlane).
- Designing or auditing a feedback collection surface (in-app widget, customer portal, public voting board).
- Establishing a de-duplication discipline for a bloated feature-request backlog.
- Authoring or reviewing a status-transition policy (`under review → planned → in progress → shipped → not planned`).
- Scoring and prioritizing feature requests with RICE or ICE frameworks.
- Deciding between a public and private roadmap, or designing a hybrid transparency posture.
- Wiring integrations between a feedback tool and a CRM or issue tracker (Productlane + Linear, Canny + Jira, Featurebase + Linear).

Do NOT load for:

- React/Next.js code for an embedded feedback widget — that is `react-worker-bee`.
- Database schema for a custom-built feedback store — that is `db-worker-bee`.
- SEO metadata on the public roadmap page — that is `seo-aeo-worker-bee`.
- Billing integration for premium feedback tiers — that is `payments-worker-bee`.
- Support conversation surface (Intercom, Plain, Help Scout) — that is `live-chat-support-worker-bee`. Note: Featurebase is blurring this boundary in 2026; if a user wants Featurebase for both feedback AND live chat, involve both worker-bees.

## First action when this stinger is loaded

1. Read `guides/00-platform-selection.md` — the decision tree and pricing table.
2. Triage the user's request against the six workflow intents below.
3. Open the relevant guide(s) before producing any output.

## Folder layout

```text
product-feedback-roadmap-stinger/
+- SKILL.md                              (this file)
+- guides/
|  +- 00-platform-selection.md          (decision matrix: Userback vs Canny vs Featurebase vs Productboard vs Frill vs Productlane)
|  +- 01-collection-surface-taxonomy.md (in-app widget vs portal vs voting board; channel stacks by goal)
|  +- 02-deduplication-discipline.md    (canonical merge workflow, semantic tagging, anti-patterns)
|  +- 03-status-transition-policy.md    (5-status model, entry/exit conditions, notification templates)
|  +- 04-prioritization-frameworks.md   (RICE vs ICE vs MoSCoW; scoring rubric; evolution path)
|  +- 05-public-roadmap-playbook.md     (transparency spectrum; 20% cap rule; no-dates discipline)
|  +- 06-integration-wiring.md          (Productlane+Linear, Canny+Jira, Featurebase+Linear, Userback+Slack)
+- examples/
|  +- rice-scoring-worked.md            (5 real-world requests scored end-to-end)
+- templates/
|  +- rice-scoring-sheet.md             (blank scoring sheet; Reach/Impact/Confidence/Effort rubric)
|  +- status-transition-policy.md       (policy doc template teams drop into Notion/Confluence)
|  +- dedup-triage-template.md          (weekly dedup session facilitation template)
+- reports/
|  +- README.md                         (how audit reports accumulate)
+- research/
   +- research-plan.md
   +- research-summary.md
   +- index.md
   +- external/ (12 curated sources)
```

## Critical directives (from Command Brief)

These apply on every invocation. Full justifications in the Command Brief at `ai-tools/command-briefs/product-feedback-roadmap-worker-bee-command-brief.md`.

- **De-duplicate before scoring.** Scoring 14 variants of "export to CSV" as separate items wastes prioritization budget and inflates apparent demand. The canonical merge step must precede any RICE/ICE run.
- **Every status transition must trigger a customer notification.** The loop is only "closed" when the customer hears back. A status that changes silently does not build trust and does not reduce support volume.
- **Never commit public dates on a roadmap.** Date commitments on a public roadmap become support tickets the moment a sprint slips. Use quarters, status-only, or "now/next/later" language.
- **Scope the platform recommendation to one primary tool per surface.** Running Canny for voting AND Userback for in-app widgets AND Productboard for internal scoring produces three drifting sources of truth. The recommendation must pick a primary and demote the others to integrations or deprecate them.
- **Always surface "not planned" as a first-class status option.** Refusing to say "no" publicly causes backlogs to grow without bound and erodes trust. Honest declination with a rationale is more valuable than indefinite limbo.
- **Flag the Featurebase strategic pivot risk.** Featurebase is shifting focus toward live chat/support in 2026. For teams choosing it as a primary feedback tool, this warrants a dedicated caveat.

## Triage decision tree

```
User request → Triage intent

"which feedback tool?" / "Canny vs X" / "compare feedback platforms"
  → guides/00-platform-selection.md

"in-app widget" / "feedback board" / "portal" / "which collection surface?"
  → guides/01-collection-surface-taxonomy.md

"duplicate requests" / "same feature requested 10 times" / "de-duplicate"
  → guides/02-deduplication-discipline.md

"feature request status" / "status transitions" / "notify customers when shipped"
  → guides/03-status-transition-policy.md

"prioritize requests" / "RICE score" / "ICE score" / "what to build next"
  → guides/04-prioritization-frameworks.md

"public roadmap" / "should we publish our roadmap" / "roadmap transparency"
  → guides/05-public-roadmap-playbook.md

"Productlane + Linear" / "Canny + Jira" / "integrate feedback with issue tracker"
  → guides/06-integration-wiring.md

Full setup / audit → 00 → 01 → 02 → 03 → 04 → 05 → 06 in sequence
```
