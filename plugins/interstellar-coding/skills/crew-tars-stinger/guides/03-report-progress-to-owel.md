# 03. Report progress to OWEL

TARS collects progress for the whole project and hands it to OWEL. OWEL is the only writer of the ledger of record. TARS never opens, edits or appends `ledger.jsonl`. The grammar, the types and the ledger rules are in [the crew contract](../../crew-protocol/references/REFERENCE.md).

## What TARS collects

- Each chip: spawned, linked, PR opened, gate result, merged, deployed, verified.
- Each ruling TARS makes and each decision the owner makes.
- Each pause, stop, replacement and resume.
- Its own start, compaction resume and close-out.

Other roles send their own lines (CASE dissent, LADY findings, MURPH gates, KIPP intake, COOP milestones). TARS does not resend what a role already sent; it sends what only the orchestrator saw.

## When to send

Send at the event, not at the end of the day: one batched message to OWEL per event, with one `LEDGER` line per fact. On every tick, send one `progress` line if anything changed since the last one.

## The line

```text
LEDGER TARS <type> | <effort> | <one-line summary> | evidence: <path, PR, SHA or none> | by: <who decided>
```

| Event | Type | `by:` |
|---|---|---|
| Chip spawned, PR opened, merged, deployed | `progress` | `TARS` |
| TARS answered a question inside its authority | `ruling` | `TARS` |
| A plan, chip split or merge order was set | `decision` | `TARS` |
| The owner decided or approved something | `owner` | `owner`. Quote the owner's words verbatim |
| A replacement was spawned from a handoff packet | `handoff` | `TARS` |
| TARS resumed after compaction | `resume` | `TARS` |
| An earlier line was wrong | `correction` | `TARS`, with `corrects: L-<n>` in the summary |

Examples:

```text
LEDGER TARS progress | checkout-v2 | COOP chip 3 opened PR 214 for the address form | evidence: PR 214 | by: TARS
LEDGER TARS owner | checkout-v2 | "Yes, merge 214 once Murph passes it." | evidence: owner message 2026-11-25 14:02 UTC | by: owner
LEDGER TARS correction | checkout-v2 | corrects: L-000041; PR number was 214, not 241 | evidence: PR 214 | by: TARS
```

## The receipt

OWEL answers `RECORDED L-<n>`. Note the id next to the event in TARS's working notes and cite that id from then on. A line with no receipt is not recorded: resend it once OWEL is reachable, or spool it.

## Add, never erase

Progress is incorporated additively. Nothing already recorded is edited, shortened or removed, and TARS never asks OWEL to do so. A mistake is fixed by a `correction` line that names the entry it corrects. TARS's own working notes are append-only too.

## When OWEL cannot be reached

Do not drop the entry and do not write the ledger yourself. Spool it to the outbox; OWEL drains the outbox at start and on every pass.

```text
node <crew-protocol>/scripts/ledger.mjs spool --outbox <effort>/crew/outbox --role TARS --type progress --effort <effort> --text "<one line>" --evidence <ref> --by TARS
```

`<crew-protocol>` is the installed `crew-protocol` skill folder. Optional flags are `--evidence`, `--by`, `--corrects L-<n>` and `--at <ISO UTC>` (use `--at` for the time of the event when spooling late). A `correction` must carry `--corrects`. Exit code 0 means the entry is spooled; anything else, read the message and fix the input. Tell OWEL the outbox has entries as soon as it is reachable.

## Limits

The plugin hook denies `Edit` and `Write` tool calls on the ledger record, but it cannot see shell writes. Not writing the record from the shell is a rule TARS follows, not something a tool stops.
