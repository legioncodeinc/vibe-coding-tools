# Distilled research: swarm audits with the Claude Code Workflow tool

Stage 3 of the forge pipeline for `swarm-audit-stinger`. Every claim ends with a citation to a file in `raw/`. The domain evidence is one fully instrumented fleet run (155 agents, 4 hours, a 4,072-file repository) plus the owner's directives and the harness's own Workflow documentation. That is one data point: numbers below are measured facts about that run, not laws, and the guides treat them as starting thresholds to re-measure.

## 1. What a swarm audit is

A swarm audit answers a broad question about a repository (every branch, state of the union, where delivery failed, next steps) by fanning out many single-lens investigators, adversarially verifying their material findings, synthesizing with batch interpreters, and closing with a completeness critic, all orchestrated by a Workflow script while an observer checks in on a fixed cadence and heals failures [raw/swarm-audit--directive--mario-swarm-rules-2026-09-08.md, raw/swarm-audit--evidence--workflow-script-knectar-2026-09-07.js]. The Workflow tool is only usable when the user opted in (the word "ultracode", a workflow request in their own words, a skill that calls it) [raw/claude-code--workflow-tool--authoring-reference-2026-09-07.md].

## 2. Roles, models, and measured durations

| Role | Model and effort used | Count in the run | Median minutes | Max minutes | Median tool calls |
|---|---|---|---|---|---|
| Investigator, one lens each | Sonnet 5, high | 11 | 24 | 33 | 91 |
| Adversarial refuter (evidence or materiality lens) | Sonnet 5, high | 118 | 8 | 16 | 31 |
| Judge on split votes | Opus 5, high | 2 | 5 | 5 | 25 |
| Batch interpreter, one report each | Opus 5, max | 4 | 12 | 12 | 16 |
| Completeness critic | Opus 5, max | 2 | 18 | 18 | 54 |
| Gap investigator (critic-directed) | Sonnet 5, high | 12 | 14 | 26 | 41 |
| Report revision | Opus 5, max | 6 | 17 | 25 | 25 |

[raw/swarm-audit--evidence--fleet-run-statistics-2026-09-07.md]

The owner's standing preference is exactly this split: Sonnet 5 investigators and refuters, Opus 5 "batch interpreters" for synthesis, maximum effort, candor about failures [raw/swarm-audit--directive--mario-swarm-rules-2026-09-08.md].

## 3. Concurrency: the cap of 100 versus the runtime cap of 16

| Fact | Value | Source |
|---|---|---|
| Owner's fleet-wide ceiling | 100 concurrent agents | [raw/swarm-audit--directive--mario-swarm-rules-2026-09-08.md] |
| Runtime cap per workflow | min(16, CPUs - 2); 16 on the 24-CPU machine measured | [raw/claude-code--workflow-tool--authoring-reference-2026-09-07.md, raw/swarm-audit--evidence--fleet-run-statistics-2026-09-07.md] |
| Lifetime cap per workflow | 1,000 agents | [raw/claude-code--workflow-tool--authoring-reference-2026-09-07.md] |
| Items per `parallel()` or `pipeline()` call | 4,096 | [raw/claude-code--workflow-tool--authoring-reference-2026-09-07.md] |
| Excess `agent()` calls | queue; they all complete | [raw/claude-code--workflow-tool--authoring-reference-2026-09-07.md] |

Resolution: 100 is the ceiling on in-flight agents summed across every concurrently running workflow and Agent-tool spawn. One workflow never exceeds the runtime cap; to fan wider, shard the work across parallel background workflows, each with its own observer, and never let the sum pass 100 [raw/swarm-audit--directive--mario-swarm-rules-2026-09-08.md].

## 4. Phase shape that worked, with timings

Investigate (11 parallel, 29 minutes wall clock) then Verify (40 findings times 2 refuters plus judges, 42 minutes) then Interpret (4 parallel Opus reports, 12 minutes) then Critic (about 20 minutes) then gap investigators and their refuters (about 22 minutes) then revisions (about 16 minutes for three reports) then a second critic round and its follow-ups (about 70 minutes) [raw/swarm-audit--evidence--fleet-run-statistics-2026-09-07.md]. A barrier is justified only where cross-item context is needed: dedup before verification and the critic after all interpreters; everything else pipelines [raw/claude-code--workflow-tool--authoring-reference-2026-09-07.md].

## 5. Verification facts

- Two refuters per finding with distinct lenses (re-derive the evidence; challenge severity, attribution, and settled-decision status), an Opus judge only on split votes: 71 of 98 round-1 verdicts held with corrections, 24 held as written, 3 were refuted; the judge was needed twice [raw/swarm-audit--evidence--fleet-run-statistics-2026-09-07.md].
- Because corrections dominate, the verdict schema must carry corrected claim, severity, and disclosure flag, and interpreters must use the corrected wording [raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].
- A cap on verification (40 of 83 material findings) silently reduced coverage; the fix is to cap concurrency, not coverage, and to list any unverified remainder explicitly with a re-run command [raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].

## 6. Failure and recovery facts

| Failure | What it cost | Rule derived | Source |
|---|---|---|---|
| Interpreter returned malformed structured output; `.filter(Boolean)` dropped its report from revisions and the editor list | One of four reports carried uncorrected errors; discovered an hour later only because the owner asked | Null is a re-dispatch signal; keep a coverage ledger; never filter products without logging and re-queueing | [raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md] |
| No observer cadence | Failure invisible for about 57 minutes | Check in every 10 minutes: journal counts, transcript growth, expected files | [raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md, raw/swarm-audit--directive--mario-swarm-rules-2026-09-08.md] |
| Run cut for cost before the editor ran | Master assembled by hand | Checkpoint deliverables per phase; give cost and time estimates at launch and at every check-in | [raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md] |
| Parallel revisions criticized each other's pre-revision text | Stale contradictions in round 2 | Cross-report reconciliation runs after all revisions land, never inside them | [raw/swarm-audit--evidence--critic-findings-2026-09-07.md] |
| Permission classifier blocked artifact publish and admin merge | Delivery fell back to files and an owner command | Deliver files first; treat gated actions as owner steps | [raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md] |
| Environment hazards (fnm shim, no Docker, missing node_modules, Date.now unavailable, shared mutating commands) | Would have produced false failures and races | Scout and fix prerequisites once before launch; single owner per mutating command; timestamps via args | [raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md] |

Healing mechanics available in the runtime: `TaskStop` stops a run; editing the persisted script and resuming with `resumeFromRunId` re-runs only the first changed `agent()` call and everything after it while cached results return instantly; a changed prompt or label is a new cache key, which is how a stalled agent is respawned with a narrower brief without re-paying for completed work [raw/claude-code--workflow-tool--authoring-reference-2026-09-07.md].

## 7. Critic facts

The critic found ten gaps, eight unverified claims, and seven contradictions in round 1, then eight, eight, and five in round 2, and the two rounds found different things because round-1 gap investigations exposed new territory [raw/swarm-audit--evidence--critic-findings-2026-09-07.md]. The critic re-derived counts and re-read cited code before accepting the most consequential claim [raw/swarm-audit--evidence--critic-findings-2026-09-07.md]. Two rounds are the measured minimum; the loop ends when the critic returns ready or the owner's budget ends, and either way the unresolved critic items are printed in the deliverable [raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].

## 8. Evidence labeling

Facts carry VERIFIED (checked on this machine, command or file and line cited), REPORTED (a document asserts it), or UNVERIFIABLE-HERE (needs Docker, live access, credentials, or the owner); findings carry a verification-pass status (CONFIRMED, CONFIRMED_WITH_CORRECTIONS, REFUTED, UNRESOLVED). Reports that blurred the two contradicted each other and themselves [raw/swarm-audit--evidence--critic-findings-2026-09-07.md]. The owner's prose rule (no em dashes or en dashes) is enforced by a byte sweep before delivery [raw/swarm-audit--directive--mario-swarm-rules-2026-09-08.md, raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].

## 9. Cost envelope of the measured run

155 agents, 4 hours, deliverables of about 1.5 MB of markdown (four reports, master, 17 lens files, 74 refuter notes) [raw/swarm-audit--evidence--fleet-run-statistics-2026-09-07.md]. The owner stopped the run for credit before the final stage; any plan must state the projected agent count and duration up front and offer a smaller configuration [raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].

## 10. Gaps in this research

- One run on one repository: thresholds are single-sample. Re-measure with `scripts/fleet-status.js` on every run and update the thresholds table.
- No measurement of sharding across parallel workflows toward the 100 cap; the resolution in section 3 is derived from documented runtime limits, not observed.
- No measurement of a dedicated observer agent; the observer in the run was the orchestrator, and it did not check in until asked.
- Cowork, Cursor, and Codex have no Workflow tool; the swarm procedure there falls back to the harness's parallel-agent surface, which this research did not exercise.
