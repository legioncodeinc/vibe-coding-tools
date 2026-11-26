# icp-research-wasp-drone

**Plugin owner:** `growth-and-customer-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
This Drone turns a company domain into an evidence-backed Ideal Customer Profile. It seeds from the company's own site (pricing, customers, careers, integrations, security pages), fans out across customers, market, hiring, voice-of-customer, news, and technographic lanes using Exa and Firecrawl (or generic search and fetch in degraded mode), records every signal in a validated evidence ledger, grades claims by independent sources while weighing revealed evidence above stated marketing, and delivers a dossier with segments, tiers, buying-committee roles, pains, triggers, disqualifiers, and the gap between positioning and reality. It is research-only and works at account and role level; it never profiles people.

## Paired Stinger
[icp-research-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/growth-and-customer-tools/skills/icp-research-stinger) - domain-seeded ICP research: scope and privacy rules, tool capability map for current Exa and Firecrawl (including retired tool names), seven lane playbooks, the evidence ledger schema and grading script, synthesis and quality guides, worked examples, and templates including the lane brief used to dispatch parallel lanes.

## Trigger phrases
- "find the ICP for example.com"
- "who are this company's ideal customers?"
- "reverse-engineer this competitor's ICP"
- "build segments, tiers, and a buying committee from public research"
- "does their positioning match who actually buys from them?"
- "research this account before our call"
- "use Exa or Firecrawl to profile who buys from this company"

## Do NOT route when
- The ICP step belongs to a website-audit engagement (wave W2, its hard focus gate, and the audit workspace): route to `icp-positioning-wasp-drone`.
- The request is a competitor spreadsheet, feature-gap analysis, or battlecards: route to `competitive-research-wasp-drone` (it may use this Drone's market lane as input).
- The request is writing or sending outbound sequences: route to `cold-outreach-wasp-drone`.
- The request is CRM fields, fit-score implementation, or enrichment sync: route to `crm-integration-wasp-drone`.
- The request is interviewing customers to validate an ICP: route to `discovery-research-wasp-drone`.
- The request is for named people, emails, phone numbers, or personal profiles: decline; out of scope for every Drone.
- The request is an ICP from the company's own CRM or closed-won data: internal analytics, not web research.

## Inputs the Drone needs
- A domain, URL, or unambiguous company name.
- A specific purpose sentence and the requester.
- Depth (Quick, Standard, Deep) and an approved spend cap for Exa and Firecrawl.
- Which tools are connected (Exa or Firecrawl via MCP or API), or acceptance of degraded mode.
- The output directory.

## Outputs
- Research brief, seed brief, one ledger file and notes per lane.
- Merged ledger, scored JSON, rendered evidence table.
- ICP dossier and machine-readable `icp.json`.
- A short report: primary ICP, confidence, positioning gap, spend, missing lanes, hand-offs.

## Commonly sequenced with
- Parallel fan-out: one Drone runs the seed lane; the orchestrator then dispatches one Drone per off-site lane from the top level; one Drone merges, grades, and writes the dossier.
- Go-to-market follow-ups: `competitive-research-wasp-drone`, `cold-outreach-wasp-drone`, `crm-integration-wasp-drone`, `discovery-research-wasp-drone`, `alt-ads-platforms-wasp-drone`.

## Critical directives the orchestrator should respect
- Dispatch lanes from the top level only; a dispatched Drone does not spawn further agents.
- Account and role level only: reject any brief that asks for people or contact data.
- Approve the spend cap before a run; third-party API spend is an external effect.
- Treat tool names as dated: the Drone binds capabilities to the session's actual tools.
- Findings must be strong or moderate ledger claims; weak and contested claims stay hypotheses.

---

*Part of Pest-Controller-Suit's roster. See [`.claude/skills/pest-controller-suit/SKILL.md`](../SKILL.md) for the full colony.*
