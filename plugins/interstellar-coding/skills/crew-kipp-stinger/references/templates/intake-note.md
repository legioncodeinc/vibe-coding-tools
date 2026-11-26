# Intake: {short title}

| Field | Value |
|---|---|
| Effort | {effort slug} |
| Opened (UTC) | {YYYY-MM-DDTHH:MMZ} |
| Status | {open, waiting on owner, written, handed off, parked, declined} |
| Document | {prd-### or ird-### and its index path, or "none yet"} |
| Ledger ids | {L-###### for the intake line, and later lines} |

## The owner's ask (verbatim)

> {Exact words. Do not tidy them.}

- Said at (UTC): {time}
- Source: {this session, a message relayed by TARS with its id, an issue link}

## Present behaviour

{What happens today, in plain words.}

| Claim | Source path and lines |
|---|---|
| {behaviour} | {path:lines, or "not found, looked in ..."} |

## Desired outcome

{What is true afterwards that is not true now, in the owner's terms.}

## Overlaps

| Existing work | Path, PR or note | Relation |
|---|---|---|
| {PRD, IRD, open PR, other intake note} | {path or number} | {same, adjacent, blocks, blocked by} |

## Recommendation

{One of: new PRD, extend prd-###, IRD, no document needed, decline. One sentence why.}

## Owner gates

| Question (recommended answer first) | Gate it touches | Answer (verbatim) | Answered at (UTC) |
|---|---|---|---|
| {pick-one question} | {scope, money, credentials, production data, dependency, destructive action, priority} | {exact words or "waiting"} | {time} |

## Number

| Number | Files check | Branches check | Open PRs check | Label |
|---|---|---|---|---|
| {prd-### or ird-###} | {highest found, date} | {refs checked, last fetch date} | {gh result, date} | {verified or unverified: which check is missing} |

## Needs for other roles

- Contract needed: {interface name, PRDs that depend on it, or "none"}
- Knowledge or ADR needed (OWEL): {topic and evidence paths, or "none"}

## Routing

{TARS's reply to the handoff: accepted, sent back with questions, split, parked. Time and message id.}
