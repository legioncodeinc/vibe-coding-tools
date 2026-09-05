# weekly-review

One scorecard per week, composed from your other skills' own reports rather than re-derived, and willing to say plainly that the week was poor.

## What it does

Most weekly reviews are a blank page you never fill in. This one is generated for you, capped at 450 words, ending in three decisions.

It is the composition skill of the marketplace. Nearly everything on the scorecard was already produced by a sibling routine, so its job is reading their output: commitments closed and dropped, leads, money findings, receivables, content shipped, band changes. Only meetings and hours are retrieved fresh, so sections light up as you install more of the marketplace, and empty ones name the skill that fills them.

Reading rather than re-deriving matters: a recomputed number will eventually disagree with the sibling's published one, and one figure you cannot trust undermines the rest.

## When to use it

- Friday, and you cannot remember what moved.
- You want next week's three priorities chosen on consequence, not on who shouted.

Just ask for it. Trigger phrases include "weekly review", "weekly scorecard", "how was my week", "Sunday review", "next week's top three".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Weekly review | Weekly, Friday 16:30 by default | The scorecard as a routine report, under 450 words, ending in a SERIES line. |
| On demand | When you ask | The same scorecard as a file, plus an appendix. |

Friday late afternoon is the default, and Sunday evening is offered every time. No practice source has evidence for any slot, so the choice comes from recovery research: a notified Sunday-evening work report is boundary management run backwards, and a poor-week report would reach you when you can least switch off. The Friday objection, tired judgment, dissolves: the generator is a routine with no Friday afternoon.

The skill sets it up itself: it offers both slots with the tradeoff, shows you the prompt, and creates it on your approval.

## What you get

A report titled `Weekly review, week ending August 14, 2026`, led by whichever series is doing the most interesting thing, not by this week's counts. Then meetings and hours, commitments as a rate, leads, money, content shipped, what moved per project, the top three.

Each item runs four lines: the action, Because with the consequence and a receipt, By with the date and its source, Beat naming the runner-up. On demand it writes `weekly-review-YYYY-MM-DD.md` with the full series.

## What it needs

- The Littlebird MCP on a Power or Pro plan, plus a free routine slot.
- Sibling routines. With none installed it runs fallbacks, says every figure is a reduced check, and does not call itself a weekly review. It maps whichever siblings exist onto sections, nothing to configure.

## Limits worth knowing

**Trend language is gated by the history that exists.** Two weeks buys "up from", never trend. Five consecutive points one way buys trend, twelve buys shift, and no rule crosses a gap in the series. There is no composite score of your week, and a flat week is reported as flat.

**A missing section is never a zero.** Stale, paused and absent siblings each get their own line, and fallback figures are marked `(reduced check)`, so a rough number never hardens into a measurement.

**It is built to report a bad week.** The poor-week block prints at the top with no cushioning clause. A win counts only as a countable event with a receipt: shipped, closed, paid, signed, published. Effort and drafts are not. An item carried three weeks gets escalate-or-drop; at four it is dropped.

## Related skills

- [daily-brief](../daily-brief/README.md), for the day rather than the week.
- [commitment-tracker](../commitment-tracker/README.md), which owns the ledger behind those counts.
- [money-leak-auditor](../money-leak-auditor/README.md) and [invoice-chaser](../invoice-chaser/README.md), which own the money sections.
- [routine-architect](../routine-architect/README.md), when reports repeat or go unread.

## Under the hood

`SKILL.md` holds the nine steps and the routine prompt. Guides: `references/rollup-and-fallbacks.md`, `references/trend-construction.md`, `references/honest-scorekeeping.md`, `references/top-three-selection.md`, `references/evidence-standards.md`.

`references/research/` archives 17 primary sources. Every claim traces to one, including the monitoring effect that is this skill's warrant and is moderate, not transformative.
