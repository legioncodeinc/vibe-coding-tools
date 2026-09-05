# Research archive: routine-architect

Domain research for the `routine-architect` skill. Stage 2 (archive) and stage 3
(distillation) of the Queen Bee forge pipeline.

The domain is not Littlebird mechanics, which are already settled in
`references/littlebird-mcp-reference.md`. The domain is **the craft of writing a prompt for
an agent that will run unattended, on a schedule, forever, with nobody present to correct
it.**

## What is here

```
research/
├── README.md                            this file
├── distilled-routine-prompt-craft.md    stage 3, every claim cited to a raw file
└── raw/                                 stage 2, one file per archived source
```

14 sources archived, all fetched or observed 2026-08-17: 13 external sources plus one primary
observation of the live account. Each raw file carries title, URL, fetch date, source type,
and why it was archived.

## Source inventory

| File | Type | What it supplies |
|---|---|---|
| `raw/routine--prompt-craft--anthropic-best-practices-2026.md` | official-docs | Anthropic's 2026 best-practice post. Explicitness, specificity, permission to express uncertainty, the minimum-necessary-structure principle, the common-mistakes list. |
| `raw/routine--prompt-craft--claude-platform-docs-prompting.md` | official-docs | The deep first-party rule set. The clarity golden rule, positive output-format rules, long-horizon state tracking, autonomy and safety guidance, explicit tool steering. |
| `raw/routine--agent-design--anthropic-context-engineering.md` | official-docs | Right-altitude prompts, minimal high-signal tokens, and the mechanism by which agents persist across context resets: reading their own written notes. |
| `raw/routine--prompt-craft--openai-prompt-engineering-guide.md` | official-docs | Second independent vendor. Prompt ordering, exact output specification, agentic persistence and completion checking, production practice. |
| `raw/routine--agent-design--openai-practical-guide-agents.md` | official-docs | When a workflow deserves an agent, instruction-writing practices, layered guardrails, and the two human-in-the-loop triggers including failure thresholds. |
| `raw/routine--alert-fatigue--jmir-alert-appropriateness-2022.md` | academic | The hard numbers. 382 reviewed alerts, 92.9% override, 7.3% appropriate, 89% justifiable overrides. The stated cause of fatigue. |
| `raw/routine--alert-fatigue--jamia-systematic-review-2026.md` | academic | 2026 JAMIA systematic review of 22 reviews. The operational definition of fatigue as a declining trend, the proxy-measurement caution, metric prevalence. |
| `raw/routine--alert-fatigue--ewaschuk-philosophy-on-alerting.md` | community | The SRE rule set. Urgent, important, actionable, real. The five pre-writing questions. Symptom over cause. The over-monitoring asymmetry. Accountability for sub-critical reports. |
| `raw/routine--alert-fatigue--wickens-atc-cry-wolf-2009.md` | academic | The counterexample. 45% false alerts in air traffic control with no measured cry wolf effect. Archived to keep the conflict honest. |
| `raw/routine--digest-design--suprsend-batching-digests-2026.md` | vendor-blog | Digest structure. Entity-scoped grouping, tiered rendering by item count, what bypasses a digest, interrupt volume versus notification volume. Engagement figures flagged as marketing. |
| `raw/routine--digest-design--bluf-strom-awn.md` | community | Bottom line up front via Army Regulation 25-50 and Air Force Handbook 33-337. The bottom-line versus summary distinction. |
| `raw/routine--scheduled-agents--openai-chatgpt-scheduled-tasks.md` | official-docs | Documented behavior of a competing scheduled-agent feature. Per-plan slot limits, hourly minimum interval, auto-pause, change-detection tasks. |
| `raw/routine--scheduled-agents--google-gemini-scheduled-actions.md` | official-docs | Second product data point. 10-action limit, auto-pause on inactivity, unsuited workloads, the pre-preparation freshness caveat. |
| `raw/routine--grounding--littlebird-live-account-2026-08-17.md` | primary observation | The live Pro account, read-only. Two routines, one dead in a plan slot and one well written but incomplete. The 16-day repeat, the four-day identical recommendation, the unheld output ceiling. |

## Source-type mix

- official-docs: 7
- academic: 3
- community: 2
- vendor-blog: 1
- primary observation: 1

Official first-party documentation dominates the prompt-craft and product-behavior
sections. The alert-fatigue section is carried by peer-reviewed academic work, which is
deliberate: it is the section the rubric leans on hardest, and it is the section where
vendor sources would have been worthless.

## Research window

Ten sources are current: either published inside the last 12 months, or living vendor
documentation fetched on 2026-08-17. Four are deliberately older, retained because they are
foundational rather than current: two peer-reviewed measurement studies (2022 and 2009), the
Google SRE alerting document, and Army Regulation 25-50 as restated in a 2020 essay. Each of
those four raw files states its own reason. The distillation restates this in its header.

## How to use this

Read `distilled-routine-prompt-craft.md` first. Section 9 is a claim map: every domain claim
in the skill's guides traces through it to a raw file. If a claim is not in the
distillation, it is not in the archive, and it does not belong in the skill.

Section 10 lists the archive's six named gaps. Two of them matter enough to repeat here:

- **No vendor publishes guidance on writing a recurring agent prompt.** The rubric in this
  skill transfers the alert-fatigue and digest-design literature into a domain nobody has
  written a standard for. That is a defensible construction, not a documented standard, and
  the guides label it as such.
- **The three-occurrence escalation threshold is a design decision, not a research
  finding.** Failure thresholds as a concept are evidenced. The number three is not.
