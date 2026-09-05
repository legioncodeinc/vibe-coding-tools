# cold-outreach-stinger

Opinionated cold outreach playbook for founder-led B2B sales — tool selection (Apollo / Clay / Smartlead / Instantly / Lemlist), email deliverability and domain warmup, multi-touch sequence design, AI personalization without slop, reply handling, and list hygiene.

Paired with `cold-outreach-worker-bee` (`ai-tools/agents/cold-outreach-worker-bee.md`). Command Brief at `ai-tools/command-briefs/cold-outreach-worker-bee-command-brief.md`. Research grounding from `scripture-historian` at `research/research-summary.md`.

## Folder layout

```
cold-outreach-stinger/
├── SKILL.md                          — the primary instruction set (start here)
├── README.md                         — this file
├── guides/
│   ├── 00-principles.md              — six non-negotiables that govern every engagement
│   ├── 01-tool-decision-matrix.md    — Apollo vs Clay vs Smartlead vs Instantly vs Lemlist
│   ├── 02-infrastructure-and-deliverability.md — domain setup, SPF/DKIM/DMARC, warmup
│   ├── 03-sequence-design.md         — step count, cadence, copy, CTA discipline
│   ├── 04-clay-personalization.md    — waterfall enrichment, Claygent SKIP rule, slop test
│   ├── 05-list-hygiene.md            — ICP filters, verification, catch-all handling, GDPR
│   ├── 06-reply-handling.md          — reply taxonomy, disqualification, forward-to-DM
│   └── 07-diagnostics.md             — troubleshooting deliverability drops and reply rate collapses
├── examples/
│   ├── saas-founder-sequence.md      — 5-step sequence for VP Engineering at B2B SaaS company
│   ├── clay-personalization-worked.md — Clay waterfall for job-change trigger campaign
│   └── deliverability-fix-walkthrough.md — scenario: reply rate dropped to 0.5%, step-by-step fix
├── templates/
│   ├── sequence-5-step.md            — 5-step cold email sequence scaffold
│   ├── clay-waterfall-formula.md     — Clay enrichment waterfall formula template
│   ├── deliverability-audit-checklist.md — DNS/warmup/volume diagnostic with pass/fail criteria
│   ├── reply-classification-table.md — reply taxonomy with recommended next action
│   └── icp-definition-worksheet.md   — ICP worksheet (industry, size, title, trigger, fears)
├── reports/
│   └── README.md                     — how audit reports accumulate over time
└── research/                         — populated by scripture-historian; read-only
    ├── research-plan.md
    ├── research-summary.md           — start here for the research findings overview
    ├── index.md
    └── external/                     — 14 source notes (2025-09 to 2026-05)
```
