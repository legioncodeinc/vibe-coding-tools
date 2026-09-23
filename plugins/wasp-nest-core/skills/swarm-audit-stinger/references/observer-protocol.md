# Observer protocol: check in, kill, respawn, heal

The observer is whoever owns the run: the orchestrator itself, or an observer agent the orchestrator spawns and reviews. The cadence and the guarantees are the owner's directives, not tunables: a check-in every 10 minutes, agents that make no progress are stopped and respawned, and no workstream or work product ever goes unreviewed because an agent failed [research/raw/swarm-audit--directive--mario-swarm-rules-2026-09-08.md].

## The 10-minute check-in

Run once every 10 minutes from launch until the closing report. On Claude Code, drive it with `/loop 10m` (or `ScheduleWakeup` at 600 seconds in dynamic loop mode) so the cadence survives long tool waits; do not rely on the completion notification alone, which is how a dropped report stayed invisible for 57 minutes [research/raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].

Each check-in runs `node scripts/fleet-status.js <transcript-dir> --stall-minutes 10` and reads three things:

1. Envelope: started, results, failed, running, and elapsed. Any `failed` event is a lost work product until the ledger shows it re-dispatched.
2. Running agents: age and minutes since the transcript last grew. An agent whose transcript has not grown for 10 minutes is stalled. An agent older than its role threshold (table below) is stalled even if the file is still growing, because it is looping.
3. Expected outputs: the files each phase must produce (lens detail files, verify notes, report files) against what is on disk.

Then post one status line to the owner: agents started and running, phase, stalls, products awaiting review, projected remaining agents and minutes, and the cost signal (agents so far against the plan). Keep it to one line unless something needs a decision.

## Stall thresholds (single-sample starting points; re-measure every run)

| Role | Median measured | Max measured | Stall threshold (kill at) |
|---|---|---|---|
| Investigator | 24 min | 33 min | 50 min, or 10 min without transcript growth |
| Refuter | 8 min | 16 min | 25 min, or 10 min without growth |
| Judge | 5 min | 5 min | 15 min |
| Interpreter | 12 min | 12 min | 25 min |
| Critic | 18 min | 18 min | 40 min |
| Gap investigator | 14 min | 26 min | 40 min |
| Revision | 17 min | 25 min | 40 min |

Source of the medians and maxima: [research/raw/swarm-audit--evidence--fleet-run-statistics-2026-09-07.md]. Thresholds are max plus about 50 percent, floored at the owner's 10-minute no-progress rule.

## Kill and respawn (the Workflow tool has no per-agent kill)

1. Record the stall in the coverage ledger: product key, agent id, minutes, evidence (last tool call in the transcript).
2. `TaskStop <workflow task id>`. Every completed `agent()` call is cached by prompt and options; stopping loses only the in-flight agents.
3. Edit the persisted script (the path is in the launch result). For the stalled call, change the work, not just the label: split the lens into two or three narrower briefs, drop a step that was looping (a build, a network fetch), lower effort, or switch model. A changed prompt is a new cache key; an unchanged one would replay the same stall.
4. Resume with `Workflow({scriptPath, resumeFromRunId})`. Cached results return instantly; only the changed call and what follows run live [research/raw/claude-code--workflow-tool--authoring-reference-2026-09-07.md].
5. At most two identical attempts and three different approaches per product, then stop and ask the owner with the exact error [research/raw/swarm-audit--directive--mario-swarm-rules-2026-09-08.md].

Inside the script, agent death (a null return) is healed without the observer: `withRetry()` in the workflow template re-dispatches up to three times with an attempt suffix in the label and a narrowed prompt, and records anything still missing under `unreviewed` so the closing report prints it.

## The no-unreviewed guarantee

Every work product has a ledger row: `{ product, producer, reviewer, status }`. A product is complete only when both producer and reviewer rows are complete. The observer's check-in reports every row not complete. The workflow template enforces the same rule in code: interpreter output that is null gets re-dispatched, and a report file on disk without a structured return is treated as produced-but-unreviewed and fed to the critic and revisions anyway, never dropped [research/raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].

When the owner cuts the run, the closing report lists: products complete, products produced but unreviewed, products never produced, findings never verified, and the exact resume command for each.

## Sharding toward the cap of 100

One workflow runs at most min(16, CPUs - 2) agents at once [research/raw/claude-code--workflow-tool--authoring-reference-2026-09-07.md]. To run wider, launch several background workflows over disjoint shards (for example lenses in one, verification in another) and keep the sum of in-flight agents at or below 100. Each workflow gets its own transcript directory; the observer runs `fleet-status.js` on each and sums the running counts. Never launch a shard whose in-flight agents would push the sum past 100; queue it.

## Cost and time signals at every check-in

State agents started against the plan's projection, elapsed minutes against the plan's projection, and the current phase. The measured run produced 155 agents in 4 hours and was cut before the editor stage; the owner must be able to stop at a phase boundary with a complete artifact, which is why the workflow template writes a checkpoint master after Interpret and after each critic round [research/raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].
