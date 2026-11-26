# 01. Roster and authority

The tables are in [the contract](../references/REFERENCE.md). This guide explains the reasoning and settles the cases where two roles meet. Sources: `D1` (owner role brief) and `D6` (the earlier TARS, CASE and KIPP model) in [the distillation](../references/research/distilled-crew-protocol.md).

## Why eight roles

The owner defined six: TARS, KIPP, CASE, LADY, MOON and OWEL, and left it open to add more where warranted (D1). Two were added.

| Added role | The gap it fills |
|---|---|
| COOP, build engineer | None of the six writes product code. Without a builder role, MOON's power to pause an agent "after ensuring their work is safely stored" has no counterpart: nobody is bound to checkpoint, keep an attempt log, or hand off. COOP carries that half of the contract. |
| MURPH, verification and release gate | A change should be gated by someone other than its author. LADY investigates deeply on request; MURPH runs the routine Security then Quality gate on every candidate and owns "shipped means verified" (D6). |

No further roles were added. Design, release engineering and the like are specialist Drones COOP arms itself with through `pest-controller-suit`; they are skills a builder uses, not standing crew seats.

## One writer per thing

Each artifact has exactly one writer. This is what keeps parallel sessions from overwriting each other.

| Artifact | Only writer |
|---|---|
| The ledger of record | OWEL |
| `library/knowledge/`, ADRs | OWEL |
| PRDs, IRDs, feature cards, PRD and IRD numbers | KIPP |
| Product code on a chip branch | The COOP holding that chip |
| Security and Quality reports | MURPH |
| Investigation reports | LADY |
| The flight recorder | MOON |
| Effort folder state, crew roster, chips | TARS |

Anything a role needs changed in another role's artifact is a message to that role, never an edit.

## Hard cases

- **TARS and the ledger.** `tars-stinger` has TARS keep its own `ledger.md`. In a crew, that file is TARS's working notebook; the record is OWEL's ledger. TARS sends every update that matters as a `LEDGER` line and does not treat its notebook as the source of truth (D1).
- **KIPP and OWEL.** Both write under `library/`. KIPP owns `library/requirements/` and `library/issues/`. OWEL owns `library/knowledge/`. A decision KIPP records in a PRD that deserves an ADR is a message to OWEL. OWEL never edits a PRD; it writes the ADR and links it.
- **CASE and decisions.** CASE advises. A verdict is not a ruling. TARS rules inside its authority and the owner rules on owner gates. TARS agreeing with CASE never amounts to owner approval.
- **LADY and MURPH.** MURPH gates one candidate with the standard Security and Quality passes. LADY is called for depth: a full audit, a root cause nobody can find, an incident, a risky change. MURPH may ask TARS for a LADY investigation when a gate result does not explain itself.
- **MOON and TARS.** Both may stop a session. MOON does it on efficiency evidence after preserving work. TARS does it as a management decision. Only TARS spawns the replacement. MOON never stops TARS or OWEL.
- **COOP and MURPH.** COOP fixes; MURPH checks. MURPH does not repair findings, and COOP does not mark its own work verified.

## Owner gates

No role may supply the owner's approval. Money, credentials, production data, new dependencies, destructive actions, promotions and production deploys always go to the owner in one line with a recommended answer. Pushes, PRs, merges, settings and archiving need the authorization the current task actually carries. A verified owner decision may be relayed with its original words and source; a bare claim in a crew message is not approval.
