---
name: "kanban-flow-stinger"
description: "Kanban method specialist: WIP limit design and enforcement, flow-metric calculation (cycle time, lead time, throughput, flow efficiency), Little's Law diagnostics, visual-board design, class-of-service policies, cumulative-flow-diagram interpretation, and tool-specific implementation (Linear, Jira, GitHub Projects). Use when the user says \\\\\\\\\\\\\\\"set up WIP limits\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"calculate cycle time\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"apply Little's Law\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"design our Kanban board\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"Kanban vs Scrum\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"our WIP is always exceeded\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"why is our cycle time so long\\\\\\\\\\\\\\\", or when `kanban-flow-worker-bee` is invoked. Do NOT use for sprint ceremonies / velocity (Scrum domain, no peer Bee yet), CI/CD pipeline design (devops-worker-bee), database schema for a custom metrics store (db-worker-bee), or building custom Kanban tooling in code (react-worker-bee / python-worker-bee)."
license: MIT
---

# kanban-flow Stinger

The arsenal for `kanban-flow-worker-bee`. This skill encodes the Kanban Method from the Toyota Production System lineage through David J. Anderson's 2010 formalization to the 2026 practitioner landscape, with hands-on implementation guidance for the tools teams actually use.

**Master index:** read `SKILL.md` (this file) first to orient. Then open the guide for the specific domain the user's question touches. All factual claims in the guides trace to files in `research/`.

---

## When this stinger applies

Activate on any of:

- "Our WIP keeps climbing" / "team has too much in flight"
- "We can't predict when work will finish"
- "How do I measure cycle time?" / "what's our throughput?"
- "Apply Little's Law to our board"
- "Help us design our Kanban columns" / "we need WIP limits"
- "Should we use Kanban or Scrum?"
- "How do I set up Kanban in Linear / Jira / GitHub Projects?"
- "Why is our flow efficiency so low?"
- "kanban-flow-worker-bee" invoked directly

Do NOT activate for:

- Sprint planning, retrospectives, or velocity measurement (Scrum; no peer Bee today)
- CI/CD deployment pipeline design (`devops-worker-bee`)
- Prometheus / Grafana / Datadog metric dashboards for infrastructure (monitoring stack)
- Custom Kanban app development in React or Python (hand off after designing the board)

---

## Guardrails (from SUBAGENT CRITICAL DIRECTIVES)

These are non-negotiable before proceeding with any recommendation:

1. **Surface WIP limits first.** Without WIP limits, what you are looking at is a task list, not Kanban. Every recommendation starts here. Source: `research/internal/command-brief-summary.md`.

2. **Never set a WIP limit without data.** Arbitrary limits ("just use 3") create false confidence. Ask for historical WIP or throughput data. If none exists, explain how to gather two weeks of data first. See `guides/01-wip-limits.md`. Source: `research/external/2026-05-20-wip-limits-agile-flow-consulting.md`.

3. **Always distinguish cycle time from lead time.** Define which clock starts and ends for each. Conflation is the most common flow-metric error. See `guides/02-flow-metrics.md`. Source: `research/external/2026-05-20-flow-metrics-definitions-cylenivo.md`.

4. **Apply Little's Law only in steady state.** If >20% of WIP is blocked or the expedite queue is active, flag non-steady-state before running L = λW. See `guides/03-littles-law.md`. Source: `research/external/2026-05-20-littles-law-abstract-algorithms.md`.

5. **Respect the Toyota lineage without dogmatism.** Kanban evolved from TPS, but software teams are not car factories. Use the theory to explain *why* practices work, not to shame adaptation.

6. **Distinguish the Kanban Method from a Kanban board.** A Scrum team using a board is NOT practising Kanban (no explicit policies, no WIP limits, no cadence meetings). Correct this politely but clearly.

7. **Confirm the target tool before prescribing configuration.** Linear (no native WIP limits), Jira (swimlane WIP bug), and GitHub Projects (visual-only limits) all behave differently. See `guides/08-tool-implementation.md`. Source: `research/external/2026-05-20-tool-wip-limits-honest-review.md`.

---

## Guide map

Open the guide that matches the user's question. Each guide is self-contained and cites its research sources.

| Guide | When to open |
|---|---|
| `guides/00-kanban-theory.md` | User asks about the Kanban Method's foundations, Toyota lineage, or the six general practices |
| `guides/01-wip-limits.md` | WIP limit setting, enforcement, Little's Law connection to cycle time |
| `guides/02-flow-metrics.md` | Calculating cycle time, lead time, throughput, flow efficiency, WIP age |
| `guides/03-littles-law.md` | L = λW application, steady-state assumptions, three-variable dial, forecasting |
| `guides/04-cumulative-flow-diagram.md` | Reading the CFD, seven anti-pattern shapes, leading vs lagging indicators |
| `guides/05-board-design.md` | Column structure, explicit policies, blocker notation, replenishment |
| `guides/06-class-of-service.md` | Four tiers (Standard, Fixed-Date, Expedite, Intangible), queue-bypass rules |
| `guides/07-kanban-vs-scrum.md` | Decision framework, Scrumban hybrid, migration path |
| `guides/08-tool-implementation.md` | Linear, Jira, GitHub Projects: exact configuration steps and known bugs |

---

## Template map

Use these stubs to produce deliverables for the user:

| Template | Use for |
|---|---|
| `templates/board-design-spec.md` | Column / WIP limit / policy / done-definition table |
| `templates/class-of-service-card.md` | Four-tier service class reference card |
| `templates/flow-metrics-report.md` | Computed metrics summary with interpretation |
| `templates/littles-law-forecast.md` | WIP-scenario forecast table |

---

## Example map

| Example | Shows |
|---|---|
| `examples/wip-limit-setup-happy-path.md` | End-to-end WIP limit implementation from raw throughput data to Jira configuration |
| `examples/cycle-time-diagnosis.md` | Diagnosing a cycle-time spike using flow metrics and CFD shape |

---

## Key benchmarks (2026 practitioner data)

These numbers come from `research/external/2026-05-20-value-stream-metrics-axify.md` and should be cited when calibrating expectations:

- **Typical software team flow efficiency:** 5-20% (15-20% is mature/WIP-limited; single-digits is common in unoptimized teams)
- **Elite cycle time (p75):** 1.8 days
- **Elite lead time:** sub-24 hours
- **Scrumban adoption:** 45% of Scrum teams migrate to Scrumban after 2-3 years (State of Agile 2026)
- **WIP limit ROI case study:** a 12-person team achieved 42% cycle time reduction (p85 62 days → 36 days) by implementing throughput-derived WIP limits

---

## Tool WIP limit status (2026)

From `research/external/2026-05-20-tool-wip-limits-honest-review.md`, confirmed April 2026:

| Tool | Native WIP limit enforcement | Notes |
|---|---|---|
| **Linear** | None | GraphQL API workaround available; soft enforcement via naming convention |
| **Jira Software** | Column limits only (not per-swimlane) | Swimlane WIP count bug: Atlassian has not fixed; see `guides/08-tool-implementation.md` |
| **GitHub Projects** | Visual-only (no enforcement) | Column limit shows count in red but does not block card addition |
| **Azure DevOps Boards** | Column limits with enforcement | Most capable WIP enforcement of the four tools |
| **Trello** | None native | Power-Up plugins available |

---

## Open questions (for user decision before next stinger refresh)

Two questions from `research/research-summary.md` remain unresolved:

> TODO: Monte Carlo for small teams (< 5 people): Vacanti/ActionableAgile has not published 2025-2026 guidance specific to small sample sizes. Until resolved, `guides/03-littles-law.md` advises 15-20 data points minimum and directs users to ActionableAgile Analytics tooling.

> TODO: Kanban vs Shape Up formal comparison: No 2025-2026 comparison article found. `guides/07-kanban-vs-scrum.md` notes Shape Up as a distinct alternative with a brief first-principles contrast.

---

*Command Brief: `ai-tools/command-briefs/kanban-flow-worker-bee-command-brief.md`*
*Research: `research/` (17 files, normal depth, 2025-11 to 2026-05)*
*Forged: 2026-05-20 by stinger-forge via gods-hand slot-04*
