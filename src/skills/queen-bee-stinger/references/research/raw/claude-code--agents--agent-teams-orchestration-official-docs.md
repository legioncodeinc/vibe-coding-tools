# Orchestrate teams of Claude Code sessions (agent-teams)
- URL: https://code.claude.com/docs/en/agent-teams
- Fetched: 2026-08-14
- Source type: official-docs
- Component: agents

# Orchestrate teams of Claude Code sessions

> Coordinate multiple Claude Code instances working together as a team, with shared tasks, inter-agent messaging, and centralized management.

Agent teams are experimental and disabled by default. Enable them by setting `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in your settings.json or environment. Without that variable, no team is set up at session start, no team directories are written, and Claude does not spawn or propose teammates. Agent teams have known limitations around session resumption, task coordination, and shutdown behavior.

Agent teams let you coordinate multiple Claude Code instances working together. One session acts as the team lead, coordinating work, assigning tasks, and synthesizing results. Teammates work independently, each in its own context window, and communicate directly with each other.

Unlike subagents, which run within a single session and can only report back to the main agent, you can also interact with individual teammates directly without going through the lead.

This page describes agent teams as of v2.1.178. With `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` set, spawning a teammate no longer needs a setup step, and cleanup happens automatically when the session exits. Before v2.1.178, you asked Claude to create and name a team first, and Claude used the `TeamCreate` and `TeamDelete` tools to set it up and remove it. Both tools no longer exist. The `team_name` input on the Agent tool is accepted but ignored, and the `team_name` field in `TaskCreated`, `TaskCompleted`, and `TeammateIdle` hook payloads carries the session-derived name and is deprecated.

## When to use agent teams

Agent teams are most effective for tasks where parallel exploration adds real value. The strongest use cases are:

- Research and review: multiple teammates can investigate different aspects of a problem simultaneously, then share and challenge each other's findings
- New modules or features: teammates can each own a separate piece without stepping on each other
- Debugging with competing hypotheses: teammates test different theories in parallel and converge on the answer faster
- Cross-layer coordination: changes that span frontend, backend, and tests, each owned by a different teammate

Agent teams add coordination overhead and use significantly more tokens than a single session. They work best when teammates can operate independently. For sequential tasks, same-file edits, or work with many dependencies, a single session or subagents are more effective.

### Compare with subagents

Both agent teams and subagents let you parallelize work, but they operate differently. Choose based on whether your workers need to communicate with each other. For separate sessions that pass messages to each other without a team, see cross-session messaging.

| | Subagents | Agent teams |
| :---------------- | :----------------------------------------------- | :-------------------------------------------------- |
| Context | Own context window; results return to the caller | Own context window; fully independent |
| Communication | Report results back to the main agent only | Teammates message each other directly |
| Coordination | Main agent manages all work | Shared task list with self-coordination |
| Best for | Focused tasks where only the result matters | Complex work requiring discussion and collaboration |
| Token cost | Lower: results summarized back to main context | Higher: each teammate is a separate Claude instance |

Use subagents when you need quick, focused workers that report back. Use agent teams when teammates need to share findings, challenge each other, and coordinate on their own.

## Enable agent teams

Agent teams are disabled by default. Enable them by setting the `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` environment variable to `1`, either in your shell environment or through settings.json:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

## Start your first agent team

After enabling agent teams, describe the task and the teammates you want in natural language. Claude spawns them and coordinates work based on your prompt.

Example prompt that works well because the roles are independent and can explore the problem without waiting on each other:

```text
I'm designing a CLI tool that helps developers track TODO comments across
their codebase. Spawn three teammates to explore this from different angles:
one on UX, one on technical architecture, one playing devil's advocate.
```

From there, Claude populates a shared task list, spawns teammates for each perspective, has them explore the problem, and synthesizes findings when finished.

Claude may sometimes use subagents instead of creating a team. Subagents appear in the same agent panel as teammates, so the panel alone doesn't confirm a team formed. If Claude spawned subagents instead, ask again and explicitly request an agent team.

The lead's terminal lists teammates in the agent panel below the prompt input. From the panel:
- Up and down arrows: select a teammate
- Enter: open the selected teammate's transcript and message it directly
- Escape: interrupt the selected teammate's current turn

As of v2.1.199, an idle teammate's row stays in the panel while any teammate or subagent is still working, so you can select it to review its transcript or send it more work. Once every agent in the panel is idle, idle rows hide after 30 seconds and reappear on the teammate's next turn; the teammate stays running and addressable while hidden. In v2.1.181 through v2.1.198, an idle row hid 30 seconds after its own turn ended, even while other teammates were still working; idle rows are not hidden on versions before v2.1.181.

When more than three teammates are idle at once, the rows beyond the first three collapse into a single row that counts the collapsed teammates, such as `2 idle agents` when five are idle. Select it and press Enter to expand the collapsed rows, or press Esc to collapse them again. Working teammates, failed teammates, and the teammate you're viewing always keep their own rows.

If you want each teammate in its own split pane, see "Choose a display mode."

## Control your agent team

Tell the lead what you want in natural language. It handles team coordination, task assignment, and delegation based on your instructions.

### Choose a display mode

Agent teams support two display modes:

- In-process: all teammates run inside your main terminal. Use the up and down arrow keys in the agent panel to select a teammate, then press Enter to view it and type to message it directly. Works in any terminal, no extra setup required.
- Split panes: each teammate gets its own pane. You can see everyone's output at once and click into a pane to interact directly. Requires tmux, or iTerm2.

`tmux` has known limitations on certain operating systems and traditionally works best on macOS. Using `tmux -CC` in iTerm2 is the suggested entrypoint into tmux.

The default is `"in-process"`. Before v2.1.179 the default was `"auto"`, so upgraded sessions that previously opened split panes now stay in one terminal unless you set the mode explicitly. Set `"auto"` to enable split panes when you're already running inside a tmux session, or when your terminal is iTerm2 with the `it2` CLI installed, falling back to in-process otherwise. The `"tmux"` setting enables split-pane mode and auto-detects whether to use tmux or iTerm2 based on your terminal.

As of v2.1.186, set `"iterm2"` to use iTerm2 native split panes explicitly. This mode requires the `it2` CLI and shows an error with the install command if `it2` is missing.

To override the default, set `teammateMode` in `~/.claude/settings.json`:

```json
{
  "teammateMode": "auto"
}
```

To set the mode for a single session, pass it as a flag:

```bash
claude --teammate-mode auto
```

The `--teammate-mode` flag is experimental and doesn't appear in `claude --help`.

Split-pane mode requires either tmux or iTerm2 with the `it2` CLI.

### Specify teammates and models

Claude decides the number of teammates to spawn based on your task, or you can specify exactly what you want:

```text
Spawn 4 teammates to refactor these modules in parallel. Use Sonnet for
each teammate.
```

Teammates don't inherit the lead's `/model` selection by default. To change the model used when the prompt doesn't specify one, set "Default teammate model" in `/config`. Pick "Default (leader's model)" to have teammates follow the lead's current model.

Claude Code checks each teammate's model, whether requested in your prompt or set through "Default teammate model," against your organization's `availableModels` allowlist. When the allowlist blocks a value, Claude Code substitutes another model:
- Family alias such as `opus`: On the Anthropic API and Claude Platform on AWS, Claude Code runs the teammate on the newest version of that family the allowlist permits. On providers with provider-specific model IDs, where the substitution doesn't operate, a blocked alias falls back like any other blocked value per the next bullet.
- Any other blocked value, including a family alias on providers where the substitution doesn't operate or whose family has no permitted version: Claude Code uses the default teammate model. When the blocked value is the "Default teammate model" setting itself, Claude Code uses your provider's default Opus model, or the lead's model when the allowlist blocks that too.

Teammates inherit the lead's effort level. In split-pane mode this applies from v2.1.186; earlier versions did not pass the lead's session effort to split-pane teammates.

### Require plan approval for teammates

For complex or risky tasks, you can require teammates to plan before implementing. The teammate works in read-only plan mode until the lead approves their approach:

```text
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```

When a teammate finishes planning, it sends a plan approval request to the lead. The lead reviews the plan and either approves it or rejects it with feedback. If rejected, the teammate stays in plan mode, revises based on the feedback, and resubmits. Once approved, the teammate exits plan mode and begins implementation.

The lead makes approval decisions autonomously. To influence the lead's judgment, give it criteria in your prompt, such as "only approve plans that include test coverage" or "reject plans that modify the database schema."

### Talk to teammates directly

Each teammate is a full, independent Claude Code session. You can message any teammate directly to give additional instructions, ask follow-up questions, or redirect their approach.

- In-process mode: use the up and down arrow keys in the agent panel to select a teammate, then press Enter to view its session and type to send it a message. Press `x` on a selected teammate to stop it. Press Ctrl+T to toggle the task list.
- Split-pane mode: click into a teammate's pane to interact with their session directly. Each teammate has a full view of their own terminal.

While you're viewing an in-process teammate, plain text and skills go to that teammate, but built-in commands still run in the lead's session.

A teammate's model and fast mode are fixed when it spawns, so `/model` and `/fast` only change the lead's settings. As of v2.1.199, typing either command while viewing a teammate shows a notice that the change applies to the lead; earlier versions applied it to the lead with no indication. `/effort` still applies to the viewed teammate's later turns, because teammates follow the lead's effort level.

### Assign and claim tasks

The shared task list coordinates work across the team. The lead creates tasks and teammates work through them. Tasks have three states: pending, in progress, and completed. Tasks can also depend on other tasks: a pending task with unresolved dependencies cannot be claimed until those dependencies are completed.

The lead can assign tasks explicitly, or teammates can self-claim:
- Lead assigns: tell the lead which task to give to which teammate
- Self-claim: after finishing a task, a teammate picks up the next unassigned, unblocked task on its own

Task claiming uses file locking to prevent race conditions when multiple teammates try to claim the same task simultaneously.

### Shut down teammates

To gracefully end a teammate's session, refer to it by name. For example, with a teammate named researcher:

```text
Ask the researcher teammate to shut down
```

The lead sends a shutdown request. The teammate can approve, exiting gracefully, or reject with an explanation.

The team's shared directories are cleaned up automatically when the session ends, so there's no separate cleanup step.

### Enforce quality gates with hooks

Use hooks to enforce rules when teammates finish work or tasks are created or completed:
- `TeammateIdle`: runs when a teammate is about to go idle. Exit with code 2 to send feedback and keep the teammate working.
- `TaskCreated`: runs when a task is being created. Exit with code 2 to prevent creation and send feedback.
