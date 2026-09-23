---
name: "ghl-to-mermaid-stinger"
description: "Turn a GoHighLevel/HighLevel account JSON export into per-workflow files and Mermaid flowcharts. Use for GHL snapshot exports, workflow diagrams, automation maps, or SuperSnapshot AI exports."
license: AGPL-3.0-or-later
compatibility: "Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex, Cowork"
metadata:
  hive-drone: "ghl-to-mermaid-wasp-drone"
  domain: "ghl-export-visualization"
  pair-drone: "ghl-to-mermaid-wasp-drone"
---

# GHL to Mermaid Stinger

## Purpose

HighLevel documents no API that can read the logic or steps of a workflow, so a browser-side
account export is the only practical source of automation structure. This stinger turns such
an export into two things: per-workflow JSON with every asset the workflow touches resolved to
a name, and Mermaid flowcharts sized to render in a stock Mermaid renderer. It also covers the
layout arithmetic that keeps those charts readable, and the label sanitization that keeps them
safe, both of which were measured rather than assumed.

## When to use

- "Turn this GoHighLevel export into a flowchart" / "map our HighLevel automations"
- "Split this account export into one file per workflow"
- "Which emails and tags does this workflow touch?"
- A SuperSnapshot AI (or equivalent) location export needs to become a diagram
- A generated Mermaid chart is too large, too tall, or will not render

## When not to use

- Anything requiring a **live** HighLevel API call: auth, contacts, opportunities, calendars,
  conversations, webhooks, rate limits, Marketplace apps. Route to `gohighlevel-stinger`
- HighLevel AI Studio, Vibe, Content AI, or funnel/website building. Route to
  `highlevel-ai-studio-stinger`
- Mermaid diagrams unrelated to a GHL export where no export parsing is involved. The
  authoring reference here still applies; the export half does not
- Security review of the resulting code's secret handling. Route to `security-stinger`

## Procedure

1. **Confirm the export shape before writing anything.** Check `_graph` and `_workflowSteps`
   exist. If either is missing, stop and say so; this stinger's approach depends on them.
   See `guides/01-parse-the-export.md`.
2. **Never sequence by `order`.** It is branch-scoped; one observed workflow has 77 steps at
   `order: 0`. Traverse `next[]`, scoping the targeted set **per workflow**.
3. **Join steps to assets through `_graph.edges`** where `via == "workflow_step:<stepId>"`.
   Linkage is already resolved; do not re-derive it.
4. **Slim the output.** Collapse the step's `references[]` and the graph-derived asset list
   into one deduped `touches[]`, and swap UUIDs for short ids with a `stepIdMap`.
5. **Sanitize every label.** `securityLevel` does not do this: `<b>` and
   `<img onerror=...>` render as live DOM even under `strict`. Substitute `<` and `>`
   yourself. See `references/mermaid-authoring-reference.md`.
6. **Pick the layout rule by content type.** A workflow's steps are a sequence: render them
   as one, tall if that is the truth. A workflow's emails are a set: row-chain them with the
   invisible `~~~` link using `cols = max(2, round(0.91 * sqrt(n)))`.
   See `guides/02-generate-charts.md`.
7. **Size against 50,000 characters and 500 edges**, the Mermaid defaults, not against a file
   ceiling. Split on edge boundaries, and verify each part's real serialized size.
8. **Validate by rendering, not by reading.** Run `scripts/lint.py`, then render at least one
   chart through Mermaid and read its `viewBox` to confirm proportions.
   See `guides/03-size-and-validate.md`.
9. **Report every export gap you hit.** Unresolved `goto` targets, workflows with no trigger,
   email templates with no subject. State them; never let a chart imply completeness it does
   not have.

## References map

- `references/export-schema-reference.md`, load when you need the field tables, the step-type
  to shape map, or the list of fields that must never be emitted
- `references/mermaid-authoring-reference.md`, load when authoring or debugging chart syntax,
  limits, escaping, or layout
- `references/research/distilled-research-article.md`, load when a claim needs verifying or a
  conflict needs settling; every line cites its raw source
- `references/research/raw/`, source-repository archive for tracing a distilled claim; omitted from the installed plugin
- `guides/01-parse-the-export.md`, load when reading an export
- `guides/02-generate-charts.md`, load when emitting Mermaid
- `guides/03-size-and-validate.md`, load when a chart is oversized or will not render
- `scripts/extract.py`, run to produce per-workflow JSON plus charts from an export
- `scripts/lint.py`, run after every generation, before reporting done
- `scripts/viewer.py`, run to build a self-contained HTML viewer with pan and zoom

## Known limits, stated up front

| Limit | Detail |
|---|---|
| One-way | Reads an export. Cannot write workflow changes back, cannot refresh from the API |
| Stale silently | A stale export yields a stale chart and the platform gives no signal |
| `goto` unresolved | Observed exports record the step but not its jump target |
| Email metadata sparse | Most referenced emails are templates carrying no subject and no sender |
| Layout constants are v11 | The 389x178 cell size and the `0.91*sqrt(n)` formula were measured on Dagre. Re-measure before trusting on v12 ELK |
| Single-sample schema | Field presence derives from one real export. Code defensively |

## Related drones and stingers

- [gohighlevel-stinger](../gohighlevel-stinger/SKILL.md) in this pack - the live HighLevel REST API: auth, contacts, opportunities, webhooks, Marketplace apps. Everything this stinger cannot reach because no read API for workflow logic exists.
- [highlevel-ai-studio-stinger](../highlevel-ai-studio-stinger/SKILL.md) in this pack - HighLevel AI Studio, Vibe, Content AI, and site building.
- [ghl-to-mermaid-wasp-drone](../../agents/ghl-to-mermaid-wasp-drone.md) - The paired Drone. Delegate to it when the task is a full export-to-charts run rather than a single question about syntax or schema.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [gohighlevel-stinger](../gohighlevel-stinger/SKILL.md) in this pack - GoHighLevel REST API authority. Use for any live API call, since workflow structure itself is not readable over the API.
  - [highlevel-ai-studio-stinger](../highlevel-ai-studio-stinger/SKILL.md) in this pack - HighLevel AI Studio and site/content creation.
  - `security-stinger` in Wasp Nest core - security audit pass, first gate of the Ship Gate pipeline.
  - `quality-stinger` in Wasp Nest core - quality audit pass, second gate after security.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
