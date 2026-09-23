# Guide 01: scout and plan

The swarm is only as good as the brief it is given. The measured run spent about 15 minutes of inline scouting before launch and the investigators still needed 24 minutes each; skipping the scout would have made every one of them re-derive the same facts [../references/research/raw/swarm-audit--evidence--fleet-run-statistics-2026-09-07.md].

## Confirm the opt-in and the ceilings

1. Confirm the Workflow opt-in exists: the word "ultracode" in the request, a workflow asked for in the user's own words, or ultracode on for the session. Without it, do not call Workflow [../references/research/raw/claude-code--workflow-tool--authoring-reference-2026-09-07.md].
2. State the owner's ceilings back: at most 100 in-flight agents across all workflows, a check-in every 10 minutes, stalled agents stopped and respawned, nothing left unreviewed [../references/research/raw/swarm-audit--directive--mario-swarm-rules-2026-09-08.md].
3. Read the clock and start the work unit; the time-blocked-turns protocol governs the orchestrator as well as the workers.

## Scout inline (read-only)

Collect these into the shared brief. Every item was needed by at least one investigator in the measured run.

| Item | Command or source |
|---|---|
| Branches, remotes, worktrees, stashes, tags | `git fetch --all --prune`, `git branch -vv`, `git branch -r -v`, `git worktree list`, `git stash list`, `git tag -l`, `git ls-remote --heads origin` |
| Divergence per branch | `git rev-list --left-right --count main...<branch>`, `git log --oneline main..<branch>` |
| PRs, issues, rulesets, workflow runs | `gh pr list --state all`, `gh issue list --state all`, `gh api repos/<o>/<r>/rulesets`, `gh run list` |
| Layout, docs, handoffs, ledgers, PRDs | `find` to depth 3 excluding vendored trees; read the current handoff in full |
| Toolchains and hazards | versions of node, npm, go, docker, terraform, python; shims (fnm) and missing tools; whether dependencies are installed |
| Live endpoints | read-only `curl -sI` against documented hostnames |
| Upstream provenance | `git ls-remote --tags <upstream> 'refs/tags/<tag>*'` including the peeled `^{}` line |

Fix shared prerequisites once, before launch, so parallel agents do not race on them: the measured run ran `npm ci` inline first, because two lenses would otherwise both have installed dependencies into the same folder [../references/research/raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].

## Choose lenses and roles

One investigator per concern. Start from the ten lenses in the workflow template and add or remove by the question. The critic in the measured run flagged the absence of a database-tier lens, a persistence lens, a license lens, an integration-guide lens, a cost lens, and an access-hygiene lens; those are now in the default set [../references/research/raw/swarm-audit--evidence--critic-findings-2026-09-07.md]. Assign every mutating local command (build, install, terraform init) to exactly one lens.

Models: Sonnet 5 at effort high for investigators, refuters, and gap investigators; Opus 5 at effort max for interpreters, critic, revisions, and editor; Opus at effort high for judges. This is the owner's standing preference [../references/research/raw/swarm-audit--directive--mario-swarm-rules-2026-09-08.md].

## Size and price the fleet before launch

Use the measured medians to project: investigators 24 min, refuters 8 min (two per material finding), interpreters 12 min, critic 18 min, revisions 17 min, gap investigators 14 min [../references/research/raw/swarm-audit--evidence--fleet-run-statistics-2026-09-07.md]. Agent count for a full run on a mid-sized repository: about 10 investigators plus 2 times the material findings (80 to 170) plus 4 interpreters plus critic rounds (each about 1 critic, 6 to 10 gap investigators, their refuters, 4 revisions, 1 reconciler) plus 1 editor. The measured run: 155 agents, 4 hours at a runtime cap of 16 concurrent.

Tell the owner the projection (agents, wall clock, phases) and offer a smaller configuration (fewer lenses, one critic round, verification of high and critical only) before launching. The owner cut the measured run for cost during the last phase [../references/research/raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].

## Write the plan

Record: the question, the lenses, the shared brief, the constraints, the models, the projected agents and minutes, the check-in cadence, the scratch directory, the args JSON (with the date, since scripts cannot read the clock), and where the deliverable will be filed (`library/requirements/reports/<domain>/`). Then move to guide 02.
