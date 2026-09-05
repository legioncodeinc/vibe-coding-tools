# agile-scrum-worker-bee

## Domain
Owns Scrum methodology coaching and process auditing in this repo's team workflow: the ceremonies (Sprint Planning, Daily Scrum, Sprint Review, Retrospective, Backlog Refinement), roles, artefacts, Definition of Done templates from startup to enterprise, estimation coaching (Fibonacci, Planning Poker, #NoEstimates), anti-pattern diagnosis (Zombie Scrum, HiPPO PO, no Sprint Goal, velocity gaming), and framework-fit recommendations (Scrum vs ScrumBan vs Kanban vs Shape Up). Its honesty-first audit gives one of two verdicts: "yes, and here's how to improve" or "no, and here's what you're actually doing."

## Paired Stinger
[agile-scrum-stinger](../../agile-scrum-stinger) - Scrum Guide 2020 audit map, ceremony coaching per event, anti-pattern catalog, and the framework-selection decision matrix.

## Trigger phrases
- "audit our Scrum process, is this actually Scrum"
- "write our Definition of Done"
- "help me run Sprint Planning"
- "our retros don't produce anything"
- "should we switch to Kanban"
- "what are we doing wrong with estimation"
- "diagnose our Scrum anti-patterns"
- "Fibonacci vs #NoEstimates for our team"

## Do NOT route when
- The request is configuring Jira, ClickUp, or Azure DevOps as tools; this Bee names it a tooling concern and stops, it does not configure the tool.
- The request is implementing CI/deployment gates that back a Definition of Done; that is devops-worker-bee.
- The request is code review, security review, or architecture guidance; route to the domain-specific Bee.
- The framework-selection assessment clearly favors Kanban; acknowledge it and offer to route to a Kanban-specific Bee rather than keep coaching Scrum.
- The team is 50+ people under a waterfall mandate; name the structural constraint rather than coaching ceremonies that won't fix it.

## Inputs the Bee needs
- Current process description or artifacts (sprint length, ceremony cadence, existing DoD if any).
- The specific classification of the request: audit, ceremony coaching, estimation, DoD authoring, anti-pattern diagnosis, or framework selection.
- Team size and organizational context, since these gate whether Scrum coaching even applies.

## Outputs
- A scored Scrum audit report with a Scrum / Scrum-but / framework-mismatch verdict.
- A Definition of Done document (startup or enterprise tier).
- Ceremony agendas, retrospective formats, or a named anti-pattern list with remediation.

## Commonly sequenced with
- devops-worker-bee: implements the CI/deployment gates a Definition of Done requires.
- Tooling-configuration work (Jira/ClickUp/Azure DevOps): this Bee flags the requirement and stops, a different owner configures it.
- Domain Bees (security, code review, architecture): take over once the conversation leaves process and enters implementation.
