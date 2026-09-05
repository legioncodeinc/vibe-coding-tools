# kanban-flow-worker-bee

## Domain
This Bee is the Kanban method specialist for any software delivery context in the repo, from a solo board to a multi-team value stream. It owns WIP limit design and enforcement, flow-metric calculation (cycle time, lead time, throughput, flow efficiency), Little's Law diagnostics, visual-board design, class-of-service policy, cumulative-flow-diagram interpretation, and tool-specific implementation in Linear, Jira, and GitHub Projects.

## Paired Stinger
[kanban-flow-stinger](../../kanban-flow-stinger) - Kanban theory, WIP-limit and flow-metric guides, Little's Law formalism, CFD anti-patterns, board-design and class-of-service references, and worked WIP-setup and cycle-time-diagnosis examples.

## Trigger phrases
- "set up WIP limits"
- "calculate our cycle time"
- "apply Little's Law to our team"
- "design our Kanban board"
- "Kanban vs Scrum, which fits us"
- "our WIP is always exceeded"
- "why is our cycle time so long"

## Do NOT route when
- The question is about sprint ceremonies or velocity; no peer Scrum Bee exists yet, so this Bee surfaces the gap rather than silently handling it.
- The question is CI/CD pipeline design; that belongs to devops-worker-bee.
- The question is a database schema for a custom flow-metrics store; that belongs to db-worker-bee.
- The question is building custom Kanban tooling in code; hand the UI to react-worker-bee or the backend to python-worker-bee after the board design is settled.

## Inputs the Bee needs
- The target tool (Linear, Jira, GitHub Projects, Azure DevOps, Trello, or custom).
- The current board structure and whether WIP limits already exist.
- Historical throughput or WIP data (at least two weeks, ideally 10+ data points) before setting a limit or running Little's Law.

## Outputs
- A board-design spec (columns, WIP limits, policies, done definition).
- A flow-metrics report or Little's Law forecast table.
- A class-of-service policy card or tool-specific configuration guide.

## Commonly sequenced with
- devops-worker-bee: picks up when the conversation shifts to CI/CD pipeline design.
- db-worker-bee: picks up when flow metrics need a persistent schema.
- react-worker-bee / python-worker-bee: build custom Kanban tooling once the process design is done.
