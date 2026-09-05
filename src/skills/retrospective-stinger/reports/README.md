# Reports

This folder accumulates dated retro output files authored by `retrospective-worker-bee` during live facilitation cycles.

## Naming convention

```
YYYY-MM-DD-retro-<sprint-or-period-label>.md
```

Examples:
- `2026-05-15-retro-sprint-42.md`
- `2026-06-01-retro-q2-kickoff.md`
- `2026-05-20-retro-postlaunch.md`

## File contents

Each file is a completed version of `templates/facilitation-plan.md` plus the filled `templates/action-items.md`, combined into one document:

1. Agenda (what was planned + what actually happened)
2. Themes surfaced (top 3-5 with vote counts)
3. Action items (owner, due, done-looks-like, status)
4. Follow-through review from previous retro
5. Retro health score (follow-through rate trend over last 3 retros)

## Usage

The primary consumer is the team's next retro: the facilitator opens the most recent file to run the action-item review ritual. Secondary consumers are team leads and Scrum Masters reviewing retro health trends over time.

Reports are not created unless the user asks `retrospective-worker-bee` to write the output to disk. By default, the Bee delivers the facilitation plan inline.

## Lifecycle

Reports are append-only. Do not edit past reports; create a new one for each cycle.
