# Flight recorder: {effort}

Copy this file to `<effort>/crew/moon/flight-recorder.md`. MOON is the only writer. Rewrite the table in place on each pass; only append to the observations log.

## Header

| Field | Value |
|---|---|
| Effort | {effort slug} |
| Started (UTC) | {time} |
| MOON session or agent id | {id} |
| Session tools reachable | {yes, or no: recording and reporting only} |
| Beacon heartbeats readable | {yes with folder path, or no} |
| Timer for passes | {none: passes run when asked, or the timer, who configured it, and when it was last verified} |
| Last pass (UTC) | {time} |

## Agents

All times are UTC. Progress comes from transcripts or events, beacon heartbeats and git activity, never from an agent's claimed status.

| Role or chip | Session or agent id | Last real output | Last output (UTC) | Dormant since | Current problem | Identical attempts | Distinct approaches | State | Last MOON action |
|---|---|---|---|---|---|---|---|---|---|
| {COOP, or chip title} | {local_... id or agent name} | {what changed, and the source: events, heartbeat, git} | {time} | {time, or blank} | {the problem in the terms of its failure} | {0} | {1} | {ACTIVE, DORMANT, LOOPING, STUCK, PAUSED, TERMINATED} | {none, nudged, CHECKPOINT sent, paused, terminated, reported, with time} |

State rules, in short: 10 minutes without progress is DORMANT; 20 minutes without meaningful progress or a fourth approach on one problem is STUCK; a third identical attempt is LOOPING. Counts reset only when the problem changes or is solved, never on a compaction.

## Work-unit marks

| Role or chip | Unit start (UTC) | 45 minute note sent | 60 minute note sent | Extension, and who granted it |
|---|---|---|---|---|
| {role} | {time} | {time, or no} | {time, or no} | {none, or the owner's words and where they are recorded} |

## Observations log (append only)

One line per observation that changed something. Never edit or remove a line; correct a mistake with a new line that names the one it corrects.

```text
<UTC time> | <role or chip> | source: <events|heartbeat|git> | <what was observed> | state: <old> to <new> | action: <none|nudge|45 min note|60 min note|CHECKPOINT|capture|verify|pause|terminate|INTERVENTION|report to owner> | ledger: <L-n or pending>
```

{first line goes here}
