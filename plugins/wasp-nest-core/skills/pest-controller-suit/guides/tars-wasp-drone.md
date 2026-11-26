# tars-wasp-drone

**Plugin owner:** `data-and-ai-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
TARS manages work spread across Claude Code Desktop sessions. It is the orchestrator: it turns the owner's asks into small chips, launches every chip through `/smoke-it` (a PRD-driven build) or `/wasp-nest-core:source-command-pest-controller` (everything else), and tracks their approved outcomes. CASE is its adviser and scoped decision tie-breaker, and watches systems and CI read-only for TARS. KIPP is the idea factory: it receives the owner's ideas, plans them and writes PRDs, always after loading `library-stinger`. Restore CASE first, KIPP next and then authorized work chips. The owner profile defines branch, model, effort, routing and approvals. TARS does no implementation and does not gain permission to push, merge, publish or change settings from agreement with CASE alone.

## Paired Stinger
[tars-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/data-and-ai-tools/skills/tars-stinger) carries the operating model, CASE/KIPP guide, owner profile, session briefs, feature-card/index templates, handoff, tick and CI-watch procedures. [Manager-team rules](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/data-and-ai-tools/skills/tars-stinger/guides/07-case-and-kipp.md) separate delegated decisions from owner-only gates.

## Trigger phrases
- "be TARS"
- "manage these sessions"
- "spawn chips for this"
- "run the swarm"
- "coordinate the sessions and watch CI"
- `/tars`

## Do NOT route when
- The work fits in the current session; route it to the domain Drone directly.
- One PRD should be driven to 100% acceptance with subagents inside one session; that is `/smoke-it`.
- The harness is not the Claude Code desktop app; TARS's chip and session tools do not exist elsewhere.
- The owner wants a multi-agent audit fleet; that is `swarm-audit-wasp-drone`.

## Inputs the Drone needs
- The owner's ask in plain words.
- The repository and base branch chips should target.
- Checks to ignore and the required check name, for the CI poller.
- The verified owner profile, CASE/KIPP session state and scoped delegation, if any.

## Outputs
- Chips (new sessions) with standalone briefs.
- A ledger of sessions, rulings, merges, deploys, and owner decisions.
- Feature Desk cards and PRDs written by KIPP, reviewed through CASE, then built by `/smoke-it` chips.
- Exact review/proof evidence and the actions authorized by the owner, followed by a six-field close-out.

## Commonly sequenced with
- Any domain Drone: each chip arms itself with the Drone named in its brief.
- ci-release-wasp-drone: arms a chip when the CI or release plumbing itself is broken.
- kanban-flow-wasp-drone: flow analysis when many chips run at once.
