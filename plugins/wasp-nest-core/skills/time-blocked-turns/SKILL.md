---
name: time-blocked-turns
license: AGPL-3.0-or-later
description: "Follow a requested agent work cadence. Use for timed blocks, retry limits, checkpoints, questions, and handoff reports. Read references/ for details."
metadata:
  hive-tier: standalone
---

# Time-blocked turns

Carry the assigned task to a concrete result while making scope, elapsed time, questions, and evidence visible. This skill implements the cadence Mario supplied on September 8, 2026. It is an instruction-following protocol, not a timer, scheduler, or enforcement service.

This is a standalone session protocol, not a specialist Stinger and not an orchestrator. It has no companion Drone by design.

## Load and apply

Read [Agent operating instructions](references/agent-instructions.md) in full before doing task work. That file is the canonical, standalone instruction block; do not maintain a second copy of its rules here. Apply it within the host's instruction hierarchy and the user's authorization for this task.

If the skill is loaded after the opening message, do not manufacture an earlier opening or timestamp. Adopt the cadence for the remaining work and carry the truthful start state into the report. To govern the very first message, the user must supply the standalone instructions before that message, or the host must already have loaded them.

Use the user's existing task, requested approach, permissions, and deadline. Loading this skill is not permission to change configuration, install tools, modify other agents' work, or perform external actions. Do not ask the user to repeat an authorization already given for this task.

## Keep continuity

Track the active work unit's start, deadline, latest substantive progress, attempts, passing checks, worker reviews, pending questions, and any explicit extension. Preserve this state across status requests, new messages steering the same task, tool yields, and context compaction. A new message does not automatically buy another hour.

Apply the same discipline to a one-step lookup and a long implementation. Scale the work and report to the task. A lookup needs its relevant lookup check; it does not need a plan, test suite, worker, or full audit merely to satisfy the format.

## Portable use

For an AI without skills, give it the complete [Agent operating instructions](references/agent-instructions.md) as user or project instructions before assigning the task. Replace the controlling user's name only if needed. The protocol needs no product-specific API.

For a host that accepts a skill folder, this folder contains the entrypoint and its references. Keep those relative paths together. Installation and activation remain actions for the user or an expressly authorized task; this skill does not deploy itself elsewhere.

Read [Origin, clarifications, and examples](references/origin-and-examples.md) only when explaining where the behavior came from, reviewing fidelity to Mario's rules, or checking an ambiguous cadence decision. That document also distinguishes observed behavior from untested promises.

Read [Session-start hooks](references/session-start-hooks.md) for how this cadence is auto-injected at session start in Claude Code, Devin CLI, and Cursor, without pasting the protocol in by hand each time.

## Completion standard

Use the canonical six-field report at every end, checkpoint, or stop. Attach results to actual evidence, quote the relevant failure output, and identify anything unfinished. Do not claim that loading a skill guarantees another model will comply or that a background watchdog exists.
