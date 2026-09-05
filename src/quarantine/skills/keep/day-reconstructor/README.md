# day-reconstructor

Rebuilds a work session into a dev log and a ready-to-paste changelog block, including the problems and decisions no commit message records.

## What it does

You finish at 4am, close the terminal, and the record closes with it. Commits cover the code. They do not cover the error that ate three hours, the two approaches that failed first, or the choice made in a chat panel.

This skill reads what Littlebird captured. It groups it into work threads, pulls out each problem with what you tried and what fixed it, records decisions with the alternative not taken, and renders a Keep a Changelog block.

Two things separate it from writing this up yourself. The session boundary is yours, not the calendar's, so an 8pm to 8am stretch is one log with one date. And where a repository is reachable it reconciles against your commits, turning a file that was probably edited into one observed in a diff.

## When to use it

- "I genuinely do not know what I did last night."
- You need a standup line and the session ended twelve hours ago.
- A problem has been open three sessions and you want every attempt listed.

Just ask for it. Trigger phrases include "what did I do today", "what did I work on last night", "write my dev log", "changelog entry for this session", "reconstruct my day" and "I need to write my standup".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Routine | Daily, session end plus about an hour | A draft text report: problems, decisions, threads, changelog block, coverage note |
| On demand | Any session you name | The file, plus git reconciliation, redaction and confirmation |

Run the routine. The report lands while the session is still in your head, and its time comes from the boundary you state, never midnight: a session ending at 08:00 wants a 09:00 report. The skill sets it up for you, showing the exact prompt and schedule for approval before creating it.

## What you get

One Markdown file per session, dated by the day it started, at `dev-log/2026-08 (August)/2026-08-17.md`. Eleven sections, problems first, because a timeline buries the useful part. File lists split by evidence tier and never merge:

```
**Files changed**  (Confirmed against git unless marked)
- src/client/session.ts    changed, not committed as of session end

**Files in view, not established as changed**
- src/auth/index.ts
```

A plain-prose standup variant of 120 to 200 words comes out too, in your own voice skill if one is installed.

## What it needs

- The Littlebird MCP on a Power or Pro plan. No degraded mode. A dev log written without capture is fiction.
- Your session boundary, stated once.
- A GitHub or GitLab connector, or a local clone. Optional. Without it, file claims cap below Confirmed and the note says reconciliation did not run.
- [sop-forge](../sop-forge/README.md), for the deduplication script and the redaction pass. Without it, both run by hand.

## Limits worth knowing

It will not assert a commit it did not reconcile against a repository. No SHA, no message, no count. It also refuses to give a coverage percentage, because nothing supports computing one. The coverage note names each gap with its length and position instead.

An assistant's output is never logged as your authorship. Your acceptance or rejection of it is logged as your decision, and a rejection is usually the more informative entry.

It is a personal work record, not a productivity measurement, and says so in its header. It drafts and holds: no commit, no push, no edit to `CHANGELOG.md`.

## Related skills

[sop-forge](../sop-forge/README.md), when the session is worth teaching rather than recording. [learning-capturer](../learning-capturer/README.md), when the output is one fix you never want to re-debug. [daily-brief](../daily-brief/README.md), the forward-looking counterpart. [routine-architect](../routine-architect/README.md), when the routine needs rework.

## Under the hood

`SKILL.md` is the full instruction set: the four sweeps, the attribution rules, the routine prompt verbatim. The guides are `session-boundaries.md`, `activity-attribution.md`, `problem-solved-extraction.md` and `changelog-formats.md` under `references/`.

`references/research/` holds 12 archived primary sources, both changelog specifications among them. Every domain claim traces to one.
