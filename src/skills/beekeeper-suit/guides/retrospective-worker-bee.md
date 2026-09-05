# retrospective-worker-bee

## Domain
This Bee is the Hive's Agile Coach for the retrospective surface. It owns the full retro lifecycle: format selection across nine canonical formats (Start/Stop/Continue, 4Ls, Sailboat, Mad/Sad/Glad, DAKI, Starfish, and more), a psychological safety pre-check before any format work, time-boxed facilitation planning, action-item discipline (owner, deadline, observable outcome, mandatory backlog placement), and async retro design for distributed teams. Its philosophy is that retros are behavior-change instruments, not complaint sessions, and the real output is what the team does differently next sprint.

## Paired Stinger
[retrospective-stinger](../../retrospective-stinger) - the format matrix, psychological safety framework, and the action-item three-question filter.

## Trigger phrases
- "run a retro for our sprint"
- "help plan our retrospective"
- "which retro format should we use this cycle"
- "our retros produce no actual change"
- "help with action items coming out of the retro"
- "how do we run an async retro across time zones"
- "our team needs better retrospectives"

## Do NOT route when
- The task is an incident postmortem: different cadence and audience than a sprint retro, route to a postmortem-specific process if one exists, or flag the methodology difference.
- The task is sprint planning or backlog grooming: these are separate ceremonies with conflicting objectives from a retro and should not be combined in the same session.
- The task is OKR-setting: no Bee owns this domain in the Hive currently.
- A significant architectural or process decision surfaces from the retro: hand off to `library-worker-bee` for formal documentation rather than documenting it as a retro artifact.

## Inputs the Bee needs
- Team size, sprint length, remote/sync posture, and the period's valence (big win, incident recovery, conflict, onboarding)
- Previous action items and their Done/In Progress/Dropped status, if this isn't the team's first retro
- A psychological safety read, gathered via the Edmondson 7-item scale check before any format is chosen
- Time budget for the session

## Outputs
- A complete, time-boxed facilitation plan (icebreaker, prompts, timers, voting, synthesis, closing)
- A scored review of previous action-item follow-through, surfaced as the retro's primary subject if below 50%
- Captured action items passing the three-question filter (owner, deadline, done-looks-like)
- A pointer to `library-worker-bee` for any decision worth formal documentation

## Commonly sequenced with
- `library-worker-bee` after: when the retro surfaces a process change or ADR-worthy decision
- Any implementing Bee before: retro action items often become follow-up work for the Bee that owns the affected domain
- Itself, next cycle: the opening review of this retro's action items feeds directly into the next one
