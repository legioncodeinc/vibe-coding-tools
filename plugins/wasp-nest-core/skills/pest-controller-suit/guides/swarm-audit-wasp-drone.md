# swarm-audit-wasp-drone

## Domain
This Drone is the ground crew of a swarm audit: a Workflow fleet that answers a broad question about a repository (every branch local and remote, the state of the union, where delivery failed, next steps) with single-lens Sonnet investigators, adversarial verification, Opus batch interpreters, and a completeness critic. The Drone scouts and briefs the fleet, runs every 10-minute check-in (failed and stalled agents, kill and respawn, coverage ledger), and assembles the master report. The orchestrator launches, stops, and resumes the Workflow at top level; the Drone never spawns the fleet itself.

## Paired Stinger
[swarm-audit-stinger](../../swarm-audit-stinger) - the observer protocol, the runnable workflow template, the measured thresholds, and the evidence archive from the first instrumented run.

## Trigger phrases
- "swarm audit this repo"
- "state of the union"
- "tell me everything about every branch, local and remote"
- "where did the team screw up"
- "launch an ultracode fleet, maximum effort"
- "how's the fleet doing" (check-in mode)

## Do NOT route when
- The user has not opted into multi-agent orchestration (no "ultracode", no workflow asked for in their own words): ask first; the Workflow tool is gated on that opt-in.
- The question is one change against one plan: that is `quality-wasp-drone`.
- The question is the security of one change: that is `security-wasp-drone`, the first gate of the Ship Gate.
- The question is repository hygiene alone (branch protection, CODEOWNERS, CI density): that is `github-repo-health-wasp-drone`.
- The task is to fix what the audit found: the audit is read-only; remediation goes to the domain Drones.

## Inputs the Drone needs
- The repository path and the question the owner wants answered
- The opt-in and the ceilings (fleet cap, check-in cadence) confirmed by the owner
- For check-in mode: the run's transcript directory (or directories, when sharded) and scratch directory
- For assemble mode: the report files or the latest checkpoint master, and the target `library/requirements/reports/<domain>/` path

## Outputs
- Scout brief, lens list, projection of agents and minutes, and the filled-in fleet script with its args JSON
- One-line check-in statuses with stall judgments and exact stop, re-brief, resume edits
- The master report with evidence labels, an unreviewed and unverified list with resume commands, and the six-field closing report

## Commonly sequenced with
- The orchestrator's `/loop 10m` or `ScheduleWakeup` cadence, which dispatches this Drone in check-in mode
- `github-repo-health-wasp-drone` after: hygiene findings from the branch and governance lens
- `security-wasp-drone` and `quality-wasp-drone` after: when the audit's next steps become a change that ships through the Ship Gate
