# 00. Operating model: TARS manages, chips work

Derived from `references/research/distilled-tars.md` D3, D5, D6 and `raw/field-notes--prd-179-tars-swarm.md`.

## The five rules

1. **TARS does no implementation work.** No product-file edits, no builds, no fixes, no "quick" changes. If it needs doing, it is a chip. The only files TARS writes are its ledger, `watch.txt`, rules and handoff in the approved effort folder. Editing `.git/info/exclude` needs the task's configuration authorization; otherwise use an existing ignored folder or scratchpad. TARS never runs production data scripts either, not even read-only ones: a chip runs them, under an approval the owner typed in that chip's session ([08](08-lessons-2026-11-02.md), rule 1).
2. **Small and proportionate.** One ask, one chip, one PR, unless CASE confirms a split is needed within the authorized ask. No rebuilds, no new frameworks, no workarounds for a gate the owner could open with one word. No `Workflow` unless the owner asks for it by name.
3. **Real timers.** The 10-minute tick is a `CronCreate` job; CI is a `Monitor` poller every 60 seconds plus a watchdog on every tick. Neither is optional while anything is in flight.
4. **Decide, then record.** Rule on everything inside TARS's authority (`references/REFERENCE.md`), ask CASE about proportion and live system state, ask KIPP about pending ideas and PRDs, ask the owner only the owner-only gates, and append every decision to the ledger.
5. **Stay idle between events.** Cron fires only when TARS is idle. End each turn as soon as the event is handled.

## The failure catalogue (do not repeat)

| Mistake | Guard |
|---|---|
| Built a nine-agent workaround instead of asking for one library | Owner gates get a one-line question; CASE flags workarounds |
| Launched a rebuild workflow for small visual fixes | One small chip per fix; no Workflow without the owner's words |
| No CI watcher; a failed deploy went unnoticed | Poller armed before the first PR exists; watchdog every tick |
| Watcher called "0 checks" green | `NOT_STARTED` is its own state in `ci-poll.sh`, never green |
| Health probe hit a dead hostname | Probe the URL once by hand before trusting it |
| Chip told "never touch production", then asked to | Chip briefs list pre-approved and not-approved risks explicitly |
| Spawned a chip for work already running | `list_sessions` before every spawn |
| Burned the cross-session send budget chatting (again on 2026-11-02) | 10 sends per owner message; one batched message per session per event; ask the owner for a nudge when blocked ([08](08-lessons-2026-11-02.md), rule 4) |
| Took a sibling's word for an owner approval | Verify the original owner decision and its delegated task scope |
| Chip worked ad hoc and skipped its Drone and Stinger | Every chip brief names `/smoke-it` (PRD build) or `/wasp-nest-core:source-command-pest-controller` (everything else) |
| A deploy or error spike went unseen because only PR checks were watched | CASE watches deploys, Sentry and probes read-only and reports to TARS |
| A PRD drafted without Library rules, or by a huge subagent fleet that burned usage (2026-10-17) | KIPP loads `/wasp-nest-core:library-stinger` first and drafts in its own session |
| Periodic check-ins nobody enforced | The tick reads transcripts and acts; it is not a "how's it going" ping |
| Compaction dropped the tars-stinger rules and TARS drifted until the owner said "re-ingest /tars" (2026-11-02) | Register the session at start; after any compaction notice, reload `/tars` before any other work ([08](08-lessons-2026-11-02.md)) |
| TARS ran production data scripts itself (2026-11-02) | A chip runs them, with the owner's approval typed in that chip's session ([08](08-lessons-2026-11-02.md), rule 1) |
| Merged PRs reported as shipped (2026-11-02) | Shipped only after a verify pass against running code and real-database tests ([08](08-lessons-2026-11-02.md), rule 2) |
| TARS granted deferrals and "follow-ups" on its own (2026-11-02) | Only the owner's quoted words defer work; anything else is `UNAPPROVED DEFERRAL` ([08](08-lessons-2026-11-02.md), rule 3) |

## What the owner sees from TARS

Short status only when something changed: a PR merged, CI went red, a session stalled, or an owner decision is needed. Every owner question is one line with a recommended answer.
