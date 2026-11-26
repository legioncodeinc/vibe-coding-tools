# Crew TARS reference

Role-specific facts for TARS leading the crew. The roster, ownership, authority, message grammar, ledger and hook behaviour are in [the crew contract](../../crew-protocol/references/REFERENCE.md) and are not repeated here. Tool names for chips, sessions, timers and CI come from the `tars-stinger` tool map ([tars-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/data-and-ai-tools/skills/tars-stinger), `references/REFERENCE.md`).

## Where the crew contract overrides tars-stinger

| Matter | tars-stinger alone | In the crew |
|---|---|---|
| Ledger of record | TARS's `ledger.md` in the effort folder | OWEL's ledger. TARS's `ledger.md` is working notes and a session table only; every fact also goes to OWEL as a `LEDGER` line |
| Standing helpers | Guide 01 step 6 spawns CASE, then KIPP, from `case-brief.md` and `kipp-brief.md` | Skip that step. CASE and KIPP are crew roles: one of each, briefed from the crew member brief with `/case` and `/kipp`, after OWEL and MOON. Never start the `tars-stinger` pair beside them |
| CASE | Adviser and read-only watcher of systems and CI; a recorded owner delegation can let TARS and CASE approve together | Adviser only: no systems watch and no co-approval. TARS or the owner decides. Verdicts add `RETHINK`. CI stays on TARS's poller and tick |
| PRDs and numbering | KIPP writes PRDs and reserves PRD and IRD numbers | The crew KIPP does this, also writes IRDs and keeps the library. TARS keeps FR, CTR and migration numbering |
| After compaction | The compaction hook and the tick prompt say to reload `/tars` ([guide 08](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/data-and-ai-tools/skills/tars-stinger/guides/08-lessons-2026-11-02.md)) | Run [the crew recovery order](../guides/01-start-and-resume.md) wherever they say that. It loads `/interstellar` material and `tars-stinger`, guide 08 and its nine owner rules included. Do not spawn the `tars-stinger` pair |
| Stall handling | TARS nudges, stops and re-briefs | MOON watches efficiency and sends `INTERVENTION`; TARS spawns the replacement. TARS may still stop a session it manages |
| Gate before merge | The chip brief carries the Ship Gate | MURPH issues `PASS` or `FAIL`; a `FAIL` blocks the merge |
| No desktop chip tools | Say so and stop | Use the subagent fallback and say which mode is running |

Everything else in `tars-stinger` stands: the five rules, the tick, the CI poller, the owner-only gates.

## Tools TARS uses for crew work

| Job | Tool |
|---|---|
| Offer, find, read, message, stop a session | The chip and session tools in the `tars-stinger` tool map |
| Run a crew member where those tools are missing | `Agent` with the role's Drone, top level only |
| Message a crew member | `SendMessage` to the session id, or to the named agent in fallback mode |
| Write `crew/roster.md` and working notes | `Bash` redirection inside the effort folder only |
| Spool a ledger entry | `node <crew-protocol>/scripts/ledger.mjs spool` |

`Edit`, `NotebookEdit`, `Workflow` and `Write` are disallowed for the Drone when it runs as the main thread. `Bash` stays, so "writes no product code" is a behavioural rule.

## Authority rows that are TARS's

- Plan, chip split, merge order, routine answers, re-briefs.
- Spawning any session or replacement agent. TARS only.
- Stopping a session it manages, after the work is preserved.

Not TARS's: verdicts on proportion (CASE advises), PRD and IRD numbering (KIPP), ledger entries and ADR wording (OWEL), PASS or FAIL (MURPH), and every owner-only gate.

## State files TARS writes

| Path under the effort folder | Purpose |
|---|---|
| `crew/roster.md` | Who holds each role, ids, state. From [the roster template](../../crew-protocol/references/templates/crew-roster.md) |
| `crew/outbox/` | Spooled ledger entries, through `ledger.mjs spool` only |
| `watch.txt`, `ledger.md` | From `tars-stinger`: the watch list, and local working notes |

TARS reads, and never writes, `crew/handoffs/`, `crew/moon/`, `crew/lady/`, `crew/ledger/` and the ledger record.

## Message lines TARS sends and receives

| Sends | To |
|---|---|
| `LEDGER TARS <type> ...` | OWEL |
| `ASK CASE` | CASE |
| `INVESTIGATE` | LADY |
| `CHECKPOINT` | Any agent it manages |

| Receives | From |
|---|---|
| `RECORDED L-<n>` | OWEL |
| Verdict lines (copies) | CASE |
| `FINDINGS` | LADY |
| `CHECKPOINTED` | The checkpointed agent |
| `INTERVENTION` | MOON |
| `PASS` or `FAIL` (copies) | MURPH |

## Templates

| File | Use |
|---|---|
| [templates/crew-member-brief.md](templates/crew-member-brief.md) | Every crew member's brief, including replacements |
