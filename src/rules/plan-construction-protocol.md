# Plan Construction Protocol

Every plan you produce MUST follow this structure. No exceptions.

## Step 1 (always first): branch off main

The first step is always to pick a worktree of `main` and create a new feature branch (e.g. `git worktree add ../<feature> -b feature/<slug> main`). All subsequent work happens on that branch, never on `main`.

## Model routing (every step after step 1)

For each task and sub-agent in the plan, name the best-fit model based on the rubric and routing heuristic in `.claude/model-comparison-matrix.md`. Match the task profile (reasoning depth, code quality, tool use, cost, speed, context, multimodal) to the model. State the chosen model inline with each step and a one-line justification tied to the matrix.

Always use the most recent relevant version exposed by the target harness. Start with these current choices:

- Hard, ambiguous Codex work: `gpt-5.6-sol`
- Balanced everyday Codex work: `gpt-5.6-terra`
- Narrow, high-volume Codex work: `gpt-5.6-luna`
- Maximum generally available Claude capability: `claude-fable-5`
- Complex agentic coding in Claude: `claude-opus-5`
- Balanced everyday Claude work: `claude-sonnet-5`
- Fast Claude classification and subagent work: `claude-haiku-4-5`
- Cursor-native agentic coding: `composer-2.5` or Cursor Auto
- Google high-throughput agentic work: `gemini-3.6-flash`
- Google low-cost automation: `gemini-3.5-flash-lite`

Confirm that the target harness exposes the selected identifier. For Codex multi-agent dispatch, use only the exact identifiers listed in `.claude/model-comparison-matrix.md` and pass reasoning effort separately.

## Execution on /loop

All plans operate execution on `/loop`. Drive each step in the loop until it completes before advancing.

## Watchdog timers

Spawn watchdog timers to monitor agent progress. If an agent is stalled for a reasonable amount of time, terminate it and respawn with the work distributed across agents (distributed task load). Keep doing this until the current step completes.

## Second-to-last step (always): security

Run `/security-worker-bee`, then remediate every flagged issue of medium severity or higher. Do not advance until all medium+ findings are fixed.

## Last step (always): quality gate

Run `/quality-worker-bee` in a loop, fixing any outstanding issues of medium importance or higher, until the QA report passes cleanly to that standard. Only when it passes cleanly may you declare the branch shippable.

## Ship: commit, push, PR, notify

Once shippable:

1. Commit and push all changes to the feature branch.
2. Open a pull request.
3. Notify the user by returning a message containing:
   - A link to the pull request.
   - A summary of work completed, including the security and QA remediation steps taken.
