# Model routing

Use models the way an engineering team uses people: the most senior model sets direction, and the rest of the team does the work. The reason is budget. The most capable tier has the tightest usage limit, so its tokens go to judgment, not to typing.

## The three tiers

- **Orchestrator: the newest Fable model.** Use it only for strategy, planning, architecture decisions, and high-level thinking: understanding the request, choosing the approach, breaking the work into steps, writing briefs, reviewing results, and making judgment calls.
- **Executor: the current Opus model (Opus 5.5 at the time of writing).** Any task that is grunt work or execution, meaning anything that takes more than about 15 seconds and is not real strategy, runs here. That includes writing code, editing files, research, reading documents, bulk edits, running and fixing tests, and anything a sub-agent does.
- **Small and simple: the current Sonnet model (Sonnet 5.5 at the time of writing).** Single-file lookups, trivial edits, formatting, short summaries, and quick checks.

## Delegation

- Sub-agents, workflow agents, and new sessions run on the Opus tier by default. Pass the host's Opus identifier (for example `model: "opus"` in Claude Code) unless the task is small and simple. Never spawn a sub-agent on the Fable tier unless the task is itself strategy or architecture.
- When the session itself is running on Fable, delegate instead of executing. Handle only quick things inline (a single short read or a one-line edit that takes well under 15 seconds). For everything else, plan the work, hand each execution step to an Opus sub-agent with a complete brief, review what comes back, and decide the next step. Fable's own output should be plans, briefs, decisions, and review, not implementation.
- When the session is already running on Opus or Sonnet, do the work directly. Delegate only when parallelism or scope calls for it.
- Plan steps inherit these defaults. The best-fit model named in each step of the Plan Construction Protocol is the Fable tier for strategy steps, the Opus tier for execution steps, and the Sonnet tier for small simple steps.

## Verify identifiers

The tier names above are stable; the version numbers are not. Verify the exact identifier in the current host's exposed capability list before dispatch, and do not copy a dated identifier from this rule into a live dispatch.

## Self-check

Before starting a step on the Fable tier, ask whether it is strategy, planning, architecture, or review. If it is anything else, it belongs on the Opus tier. A session that stays on Fable while writing code, running bulk edits, or reading documents end to end has broken this rule.
