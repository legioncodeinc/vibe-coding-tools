# Run agents in parallel - Claude Code Docs
- URL: https://code.claude.com/docs/en/agents
- Fetched: 2026-08-14
- Source type: official-docs
- Component: agents

> Compare the ways Claude Code can take on multiple tasks at once: subagents, agent view, agent teams, and dynamic workflows.

Subagents, agent view, agent teams, and dynamic workflows each parallelize work in a different way. The right one depends on whether you want to stay in each conversation yourself, hand tasks off and check back later, or have Claude coordinate a group of workers for you.

| Approach | What it gives you | Use it when |
| :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subagents | Delegated workers inside one session that do a side task in their own context and return a summary | A side task would flood your main conversation with search results, logs, or file contents you won't reference again |
| Agent view | One screen to dispatch and monitor sessions running in the background, opened with `claude agents`. Research preview | You have several independent tasks and want to hand them off, check status at a glance, and step in only when one needs you |
| Agent teams | Multiple coordinated sessions with a shared task list and inter-agent messaging, managed by a lead. Experimental and disabled by default | You want Claude to split a project into pieces, assign them, and keep the workers in sync |
| Dynamic workflows | A script that runs many subagents and cross-checks their results, for work too big to coordinate one turn at a time or that needs more than a single pass | A job outgrows a handful of subagents, or you want findings verified against each other: a codebase-wide audit, a 500-file migration, cross-checked research, or a plan drafted from several angles |

In every approach the workers are Claude sessions. To involve a different tool, expose it to Claude as an MCP server.

Three more tools support this work without being a way to run agents themselves:

* **Worktrees** give each session a separate git checkout, so parallel sessions never edit the same files. Agent view moves each dispatched session into its own worktree automatically, and subagents you spawn can each get one too.
* **Cross-session messaging** lets Claude list and message your other Claude Code sessions on this machine, on another machine, or on Claude Code on the web, so sessions you run yourself can pass findings and status between themselves.
* **`/batch`** is a skill that has Claude split one large change into 5 to 30 worktree-isolated subagents that each open a pull request. It's a packaged use of subagents and worktrees, not a separate coordination style.

A few other features run Claude without you driving each step, but they solve a different problem than splitting work across agents:

* A **background bash command** runs one shell command without blocking the conversation. It doesn't spawn an agent.
* A **forked subagent**, started with `/subtask`, is a subagent that inherits your full conversation context instead of starting fresh. To copy the whole session into a new background session that runs alongside it, use `/fork`.
* A **routine** runs a session on a schedule in the cloud, not in parallel on your machine.

Running several sessions or subagents at once multiplies token usage.

## Choose an approach

The right approach depends on who coordinates the work, whether the workers need to communicate, and whether they edit the same files:

* **Who coordinates the work?**
 * Claude delegates and collects results inside one conversation: subagents
 * You hand off independent tasks and check back later: agent view
 * Claude plans, assigns, and supervises a group of workers: agent teams (experimental and disabled by default)
 * A script holds the plan instead of Claude's turn-by-turn judgment: dynamic workflows
* **Do the workers need to talk to each other?** Subagents report results back to the conversation that spawned them, and agent view sessions report only to you, though separate sessions can pass messages with cross-session messaging. Teammates in an agent team share a task list and message each other directly.
* **Do the tasks touch the same files?** Isolate the work with worktrees. Agent teams don't isolate teammates in worktrees, so partition the work so each teammate owns a different set of files.

## Check on running work

* For background sessions, `claude agents` opens agent view: one screen showing every session, its state, and which ones need your input.
* For subagents in the current session, named background subagents appear in the @-mention typeahead with their status. `/agents` no longer opens a panel (as of v2.1.198); it prints a notice pointing to the subagent file locations.
* For anything running in the background of the current session, `/tasks` lists each item and lets you check on, attach to, or stop it.
* For dynamic workflows, `/workflows` lists running and completed runs, the phase each is in, and how many agents have finished.

## Comparison table: Subagents vs Agent teams (from the agent-teams doc)

| | Subagents | Agent teams |
| :---------------- | :----------------------------------------------- | :-------------------------------------------------- |
| **Context** | Own context window; results return to the caller | Own context window; fully independent |
| **Communication** | Report results back to the main agent only | Teammates message each other directly |
| **Coordination** | Main agent manages all work | Shared task list with self-coordination |
| **Best for** | Focused tasks where only the result matters | Complex work requiring discussion and collaboration |
| **Token cost** | Lower: results summarized back to main context | Higher: each teammate is a separate Claude instance |

Agent teams are experimental and disabled by default; enabled via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. One session acts as the team lead, coordinating work, assigning tasks, and synthesizing results. Teammates work independently, each in its own context window, and communicate directly with each other. Team config is stored at `~/.claude/teams/{team-name}/config.json`, task lists at `~/.claude/tasks/{team-name}/`, and each agent's mailbox is a JSON file at `~/.claude/teams/{team-name}/inboxes/{agent}`.

## Applicability note (Cowork)

Cowork's official documentation (see `cowork--agents--support-get-started-cowork.md`) describes only "sub-agent coordination" as a first-class capability — Cowork "breaks complex work into smaller tasks and coordinates parallel workstreams to complete them" and "may coordinate multiple sub-agents working simultaneously." The richer Claude Code surfaces documented here — agent view, agent teams, dynamic workflows, worktrees, cross-session messaging — are Claude Code (CLI/IDE) concepts; no official Cowork documentation found in this research confirms agent view, agent teams, or dynamic workflows are exposed in the Cowork desktop/web/mobile UI. Cowork's parallelism is presented to end users simply as automatic sub-agent coordination during a task, without user-facing controls to choose between these modes.
