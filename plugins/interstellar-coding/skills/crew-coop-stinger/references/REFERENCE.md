# Crew COOP reference

Role-specific facts for COOP. The roster, ownership, authority, message grammar, ledger and hook behaviour are in [the crew contract](../../crew-protocol/references/REFERENCE.md) and are not repeated here.

## Tools COOP uses

| Job | Tool |
|---|---|
| Read the brief, PRD, contracts and code | `Read`, `Grep`, `Glob` |
| Write product code and tests inside the chip scope | `Edit`, `Write` |
| Run checks, git on its own branch, `ledger.mjs spool` | `Bash` |
| Load the armament and the routed specialist Stinger | `Skill` |
| Look up current library or platform facts | `WebSearch`, `WebFetch` |
| Message TARS, OWEL, MURPH, MOON | The host's session messaging, or the final report when running as a subagent |

COOP has no tool for starting sessions or crew agents, by design: only TARS spawns.

## Armament

| Chip | Armament | Source |
|---|---|---|
| Driven by a PRD | `/smoke-it` | [smoke-it.md](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/commands/smoke-it.md) |
| Anything else | `pest-controller-suit` and the routed Drone's Stinger | [pest-controller-suit](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/pest-controller-suit) |
| Cadence, always | `time-blocked-turns` | [agent-instructions.md](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/time-blocked-turns/references/agent-instructions.md) |

## Authority rows that are COOP's

COOP decides ordinary engineering choices inside its chip scope, the ones any competent engineer would make the same way. Everything else is someone else's:

| Decision | Who |
|---|---|
| Scope, chip split, re-brief, merge order, spawning | TARS |
| PASS or FAIL on COOP's candidate | MURPH |
| Pause or terminate COOP | MOON, after preservation; TARS may stop a session it manages |
| What gets recorded | OWEL |
| Commit, push, PR beyond the brief; merge; new dependencies; anything owner-only | The owner, through the chip brief |

## State files

| Path | Written by COOP | Purpose |
|---|---|---|
| The chip branch | Yes | Product code and tests inside the chip scope |
| `<effort>/crew/handoffs/<chip-slug>-attempts.md`, or the path the chip brief names | Yes | The attempt log. Kept in the effort folder beside the handoff packet, never in the product branch |
| `<effort>/crew/handoffs/<chip-slug>-<UTC>.md` | Yes | One handoff packet per checkpoint or stop |
| `<effort>/crew/handoffs/<chip-slug>-<UTC>.patch` | Yes, only when commits are not authorized | The saved work |
| `<effort>/crew/outbox/` | Through `ledger.mjs spool` only | Ledger lines waiting for OWEL |
| `<effort>/crew/roster.md` | No, read only | Who holds each role |

COOP writes nothing else in the effort folder and never writes the ledger record.

## Message lines

| Sends | To | Content |
|---|---|---|
| `LEDGER COOP progress` / `handoff` / `resume` | OWEL | Milestones, checkpoints, resumes |
| `GATE` | MURPH | Candidate SHA, PRD or brief, what changed |
| `CHECKPOINTED` | MOON or TARS | Branch, commit SHA or patch path, handoff packet path |
| `ASK CASE` | CASE | Only for a question of proportion inside the chip; numbered questions, COOP's lean, evidence paths |
| Six-field report | TARS | At done, stop or block |

| Receives | From | Do |
|---|---|---|
| `CHECKPOINT` | MOON or TARS | Save now; reply with proof ([guide 03](../guides/03-checkpoint-and-handoff.md)) |
| `PASS` or `FAIL` | MURPH | `PASS` covers one SHA. On `FAIL`, fix and send `GATE` again |
| `RECORDED L-<n>` | OWEL | Note the id in the attempt log header or the report |

## Limits COOP works under

| Limit | Value |
|---|---|
| Real progress | At least every 5 minutes |
| Identical attempts | At most 2 |
| Different approaches on one problem | At most 3 |
| No meaningful progress | Stop at 20 minutes |
| Deadline | The chip brief's; a replacement inherits it |

These are self-tracked. The crew hook injects context and cannot stop or time an agent.

## Templates

| File | Use |
|---|---|
| [templates/attempt-log.md](templates/attempt-log.md) | Start of every chip |
| [The handoff packet](../../crew-protocol/references/templates/handoff-packet.md) | Every checkpoint or stop |
