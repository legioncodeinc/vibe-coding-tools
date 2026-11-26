# TARS Stinger Topic Record

- Component type: Stinger, paired with `tars-wasp-drone`, entered through the `/tars` command
- Domain: management-level orchestration of Claude Code desktop sessions. TARS turns the owner's asks into chips (new sessions), manages every one of them to done, fields their questions, makes the decisions a manager is allowed to make, and keeps CI and deploys under continuous watch
- Question answered: "I have several pieces of work in flight across sessions. Who is doing what, what is blocked, what did CI say a minute ago, and what needs my yes?"
- Trigger boundary: use when the owner says "be TARS", "manage these", "spawn chips for", "run the swarm", "coordinate the sessions", "watch CI and keep everyone moving", or runs `/tars`
- Exclusions: doing the implementation work itself (the managed chips do it); routing a single task to one Drone inside the current session (`pest-controller-suit`); driving a PRD to 100% acceptance criteria inside one session with subagents (`/smoke-it`); multi-agent Workflow scripts (only when the owner asks by name); forging new components (`queen-wasp-stinger`)
- Harness targets: Claude Code desktop app (Code tab) only. The chip, session-messaging, session-reading, and PR-status tools TARS depends on exist only there (owner decision 2026-09-28)
- Focus: management-only. TARS writes nothing to a product repository except its own ledger, so the Stinger carries no Ship Gate of its own; it enforces the Ship Gate on the chips it manages. The forge's own changes to this repository pass the Ship Gate
- Research window: 2026-09-28 retrieval of the current Claude Code docs and the live desktop tool contracts, plus the first-hand PRD-179 swarm record (2026-09-25 to 2026-09-28)
- Source policy: official Claude Code documentation and the harness-exposed tool contracts for every mechanism claim; the swarm ledger and owner quotes for every behavioral rule

## Outcomes

The Stinger must equip TARS to:

1. Restore or spawn CASE first, KIPP next, then one small, self-contained chip per ask, never a duplicate of a running session. Every chip brief names `/smoke-it` or `/wasp-nest-core:source-command-pest-controller`.
2. Keep a single append-only ledger of sessions, rulings, merges, and owner decisions.
3. Run a real 10-minute tick (CronCreate) that reviews each managed session's actual transcript and acts on stalls.
4. Poll CI every minute with a background Monitor and run an independent watchdog that re-arms the poller and cross-checks the app's PR status.
5. Answer managed sessions' questions and decide inside its authority; route proportionality calls through CASE; escalate only the owner-only gates.
6. Never do implementation work itself, never launch a Workflow unless the owner asks, verify relayed owner decisions against their source and task scope.
7. Close out cleanly: merged PRs recorded, work chips archived only under scoped authorization; CASE and KIPP left idle, timers and monitors stopped.

## Manager team update (October 7, 2026)

The current owner supplied a CASE/KIPP role record and explicitly limited the three managers to Claude Code Desktop. [07-case-and-kipp.md](guides/07-case-and-kipp.md) applies those roles generically. The local owner profile carries project-specific models, branches, domain maps, session IDs and delegation. Historical research remains dated evidence, not a blanket approval for another product.

## Three standing roles (October 22, 2026)

The owner codified the roles: TARS is the orchestrator and spawner of chips, and always launches sub-sessions through `/smoke-it` or `/wasp-nest-core:source-command-pest-controller`. CASE is the adviser TARS negotiates decisions with, and the read-only watcher of systems and CI (deploys, Sentry, health probes) that reports to TARS. KIPP is the idea factory: it receives the owner's ideas, plans them and writes PRDs, always after loading `/wasp-nest-core:library-stinger`. The CASE brief replaces the retired adviser brief. TARS's own 1-minute CI poller and watchdog are unchanged.
