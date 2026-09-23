# Guide 03: run and observe

The observer keeps the swarm honest. In the measured run there was no observer cadence, and a dropped report went unnoticed for 57 minutes until the owner asked for status [../references/research/raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md]. The full protocol is in `../references/observer-protocol.md`; this guide is the operating sequence.

## Start the cadence at launch

1. Immediately after the Workflow call returns, start the 10-minute check-in: `/loop 10m` with the status command, or `ScheduleWakeup` at 600 seconds when running in dynamic loop mode. Do not rely on the completion notification.
2. Verify the fleet actually spawned within the first two minutes: the transcript directory should hold one `agent-*.jsonl` per launched investigator, each growing. A prior session on the same repository saw every spawn fail with a sampler error; a fleet that did not spawn must be reported, not waited on.

## Each check-in

Run `node scripts/fleet-status.js <transcript-dir> --stall-minutes 10 --expect <scratch>/lenses:*.md --expect <scratch>/reports:0*.md` and act on the output in this order:

1. FAILED agents: the workflow template already re-dispatches them; confirm in the output that a `:retry` label started. If the retries are exhausted (the product shows under `unreviewed` in the run's logs), plan a resume with a narrower brief.
2. STALLED agents: an agent with no transcript growth for 10 minutes, or older than its role threshold, is stalled. Stop, re-brief, resume (below).
3. Expected outputs: every phase must leave files. Missing files with no running producer mean a dropped product; treat as FAILED.
4. Post one status line to the owner: started, running, failed, stalled, phase, projected remaining agents and minutes, elapsed. Mention any decision needed.

## Stop, re-brief, resume (kill and respawn)

The Workflow runtime has no per-agent kill, so the unit of control is the run:

1. `TaskStop <task id>`.
2. Edit the persisted script for the stalled call: split the lens into narrower briefs, remove the step that looped (a build that hangs, a fetch that times out), lower effort, or change model. Change the prompt, not only the label; a same prompt replays the same stall.
3. `Workflow({scriptPath, resumeFromRunId})`: every completed `agent()` call returns from cache instantly; only the changed call and everything after it run live [../references/research/raw/claude-code--workflow-tool--authoring-reference-2026-09-07.md].
4. Log the stall and the fix in the coverage ledger you keep for the closing report. At most two identical attempts and three approaches per product; then stop and ask the owner with the exact error [../references/research/raw/swarm-audit--directive--mario-swarm-rules-2026-09-08.md].

Before every stop, look at what the in-flight agents are doing (`fleet-status.js` prints the last tool call): a stop loses their work, so time it at a phase boundary when the stall allows.

## Stall thresholds

Investigator 50 min, refuter 25, judge 15, interpreter 25, critic 40, gap investigator 40, revision 40, and for every role 10 minutes without transcript growth. These come from one measured run (medians 24, 8, 5, 12, 18, 14, 17) and are re-measured by the status script on every run [../references/research/raw/swarm-audit--evidence--fleet-run-statistics-2026-09-07.md].

## Cost and cut points

At every check-in state agents so far against the projection. If the owner stops the run, the checkpoint masters written after Interpret and after each critic round are the deliverable base; assemble per guide 05 and list everything unreviewed, unverified, or unproduced with the exact resume command.

## Environment interruptions

Expect permission-classifier denials on outward actions (artifact publish, admin merge) and never route around them; deliver files and hand the owner the command [../references/research/raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md]. Expect toolchain shims: on this machine `eval "$(fnm env --shell bash)"` precedes npm in Git Bash, and Docker-dependent proofs are UNVERIFIABLE-HERE.
