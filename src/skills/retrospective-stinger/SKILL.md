---
name: "retrospective-stinger"
description: "Equips retrospective-worker-bee to run retrospectives that actually change behavior: format selection (Start/Stop/Continue, 4Ls, sailboat, mad/sad/glad, DAKI, Starfish, and more), psychological safety pre-check (Edmondson scale), facilitation playbooks, async retro design, and action-item follow-through discipline. Use when the user says \\\\\\\"run a retro\\\\\\\", \\\\\\\"plan our retrospective\\\\\\\", \\\\\\\"which retro format should we use\\\\\\\", \\\\\\\"our retros produce no change\\\\\\\", \\\\\\\"help with action items from the retro\\\\\\\", \\\\\\\"how do we do an async retro\\\\\\\", or \\\\\\\"our team needs better retrospectives\\\\\\\". Do NOT use for incident postmortems (different cadence and audience), sprint planning, OKR-setting, or daily standup facilitation."
---

# retrospective-stinger

The retrospective surface end-to-end: choosing the right format, creating the conditions for honesty, facilitating the session, and enforcing follow-through. Built from 2026 research into what makes retros actually change behavior rather than generate a board no one reads.

The most important finding from the research: **only 50% of retro action items ever get completed** (survey of 419 professionals across 5 countries, 2026-05-15). The format is almost irrelevant if no one does anything differently next sprint. This stinger is calibrated around the follow-through problem, not the facilitation aesthetics problem.

## When this stinger applies

Load when `retrospective-worker-bee` is invoked. Trigger on:

- "Run a retro" / "plan our retrospective" / "help us do a sprint retrospective"
- "Which retro format should we use?"
- "Our retros produce no change" / "action items never get done" / "retro theater"
- "How do we do an async retro?" / "remote retrospective"
- "We need better psychological safety in our retros"
- "Review last sprint's action items"

Do NOT load for:

- Incident postmortems (different cadence, participants, and root-cause methodology)
- Sprint planning or backlog grooming
- OKR-setting or strategy planning

## First action when this stinger is loaded

Read in this order:

1. `guides/00-principles.md`: the philosophy: retros are behavior-change instruments, not complaint sessions. The output is what the team does differently; measure follow-through rate, not participation.
2. `guides/01-formats.md`: the format matrix: nine formats with best-for context, time budget, and selection logic.
3. `guides/02-psychological-safety.md`: the safety gate: Edmondson 7-item scale, the low-safety mitigation playbook, the anonymity bridge technique.

Then walk the remaining guides based on the task:
- Facilitating a session: `guides/03-facilitation.md`
- Action-item review or capture: `guides/04-action-items.md`
- Async or remote team: `guides/05-async-retro.md`

## Critical directives

- **Never skip the safety pre-check.** A retro run without minimum psychological safety produces theater. Surfacing the gap is more valuable than running a polished session. See `guides/02-psychological-safety.md`.
- **Always capture action items with owner and deadline.** The five structural failure modes: no owner, no deadline, too large, invisible on the backlog, no accountability loop. See `guides/04-action-items.md`.
- **Open every retro with a follow-through review of the previous retro's actions.** Teams that skip this signal that action items are optional. See `guides/04-action-items.md`.
- **Name the format and explain the selection.** Teams that understand why a format was chosen are more engaged and can adapt it without the Bee next time. See `guides/01-formats.md`.
- **Frame async as a first-class option, not a fallback.** Async retros see 42% higher participation from introverts. See `guides/05-async-retro.md`.
- **Use the 3-question filter during live sessions.** Before any action item leaves the board: Who owns this? When does it close? What does done look like? See `guides/04-action-items.md`.

## Folder layout

```
retrospective-stinger/
+- SKILL.md                         (this file — master index)
+- README.md                        (one-page human overview)
+- guides/
|  +- 00-principles.md              (the retro-as-behavior-change philosophy)
|  +- 01-formats.md                 (format matrix: 9 formats with selection logic)
|  +- 02-psychological-safety.md    (Edmondson scale, safety gate, mitigation playbook)
|  +- 03-facilitation.md            (agenda template, time-boxing, synthesis, closing ritual)
|  +- 04-action-items.md            (SMART+, 3-question filter, backlog placement, accountability loop)
|  +- 05-async-retro.md             (4-day timeline, tool options, async facilitation patterns)
+- examples/
|  +- happy-path-retro.md           (end-to-end sync retro with a mid-maturity team)
|  +- async-retro-example.md        (end-to-end async retro for a distributed team)
+- templates/
|  +- action-items.md               (the four-component action item template)
|  +- facilitation-plan.md          (blank agenda the Bee fills in per-retro)
+- reports/
|  +- README.md                     (how retro output files accumulate over time)
+- research/                        (owned by scripture-historian; read-only for this stinger)
   +- research-summary.md
   +- index.md
   +- internal/
   +- external/
```

---

*Forged by `stinger-forge` for `retrospective-worker-bee`. Part of the Hive.*
