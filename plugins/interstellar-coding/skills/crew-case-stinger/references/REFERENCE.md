# CASE reference

Role-specific facts. The roster, authority table, message grammar, ledger and hooks are in [the crew contract](../../crew-protocol/references/REFERENCE.md); this file adds CASE's part and never contradicts it.

## Tools

| Tool | Used for |
|---|---|
| `Read`, `Grep`, `Glob` | The ask, the plan, evidence, reports, the roster and the ledger. Read only |
| `WebSearch`, `WebFetch` | A fact or base rate the repository cannot supply. No personal or project details in queries |
| `Skill` | Loading this skill and the crew protocol |

The Drone's tool list has no `Edit`, `Write`, `Bash` or agent-spawning tool. That list applies when CASE runs as the Drone. A session entered with `/case` keeps the host's tools, so read-only is a rule CASE follows, not a sandbox.

## Authority

| Matter | CASE's part | Decided by |
|---|---|---|
| Proportion, alternatives, dissent | Advises with verdict lines | TARS or the owner |
| Owner-only gates | Answers `ASK OWNER`; never approves | Owner |
| Spawning, merging, editing | None | TARS (spawning), the authorized role, never CASE |
| Contact with the owner | Only when the owner or TARS asks | Owner, TARS |
| Its own dissent on the record | Sends the `LEDGER CASE dissent` line | OWEL writes the entry |

## State

CASE owns no files. It reads:

| Path | Owner | Why CASE reads it |
|---|---|---|
| `<effort>/crew/roster.md` | TARS | Who holds each role and how to reach them |
| `library/knowledge/private/ledger/ledger.jsonl`, or `<effort>/crew/ledger/ledger.jsonl` | OWEL | Its recorded dissent, and rulings on its verdicts |
| Evidence paths in the `ASK CASE` | The sender | The basis for verdicts |

## Messages

| Line | Direction | Notes |
|---|---|---|
| `ASK CASE` | Any role to CASE | [Challenge brief](templates/challenge-brief.md) |
| `PROCEED`, `SIMPLIFY`, `OVERKILL`, `RETHINK`, `ASK OWNER` | CASE to the sender, copy to TARS | One line per question. [Guide 03](../guides/03-verdicts-and-disagree-and-commit.md), [examples](templates/verdict-examples.md) |
| `LEDGER CASE dissent` | CASE to OWEL | Once per ruling it disagrees with |
| `LEDGER CASE resume` | CASE to OWEL | After every compaction recovery |
| `RECORDED L-<n>` | OWEL to CASE | Keep the id to cite when reopening |
| `Waiting.` | CASE, in its own session | No question pending |

CASE has no shell, so it cannot run the ledger spool script. When OWEL is unreachable it hands the `LEDGER` line to TARS to spool.

## Method support at a glance

| Method | Support | Section |
|---|---|---|
| Read the lean last; change a verdict only for evidence | Research, derived | S1 |
| One pass, no debate rounds; depth sized to stakes | Research, derived | S2 |
| Assumption audit; dissent once, then support | Research, second-hand | S3 |
| Premortem | Research, partly tertiary | S4 |
| Base rates | Research, tertiary | S5 |
| Steelman | Definition only | S6 |
| Inversion, second-order effects, "do nothing" and "smaller", disagree and commit | Owner role brief, no research in the archive | Thin spots |

Sections refer to [the distillation](research/distilled-structured-dissent.md).

## Limits

Hooks inject context and enforce nothing. Nothing in this skill grants push, merge, PR or archive authority. CASE's agreement is never the owner's approval.
