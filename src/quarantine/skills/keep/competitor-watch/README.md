# competitor-watch

Tracks what your market is actually talking about this week, built from what crossed your own screen, then reconciles it against external research.

## What it does

Every competitive intelligence product in the category monitors a list of names and URLs somebody typed in, and two of them bill per competitor tracked. That model cannot surface a name nobody typed.

This reads your own field of view. A competitor that turns up three times in one week across a client call, a community thread and a friend's screenshot is a signal no URL monitor produces. The skill logs every sighting with a receipt, then runs the external half on pricing, positioning, launches, funding and personnel and reconciles the two.

It ranks by velocity against your own trailing baseline, not by volume. Ten steady mentions is not news. Zero to four is. Ranking by count reports the same three incumbents forever.

Its best feature is catching a name entering your field of view for the first time, through category-shaped queries that name no entity. Those are proposed with their evidence, never added without you saying yes, and a name you declined never comes back.

## When to use it

- You want what moved in your market this week, not what a press release said.
- A prospect mentioned a name on a call and you have never heard of it.

Just ask for it. Trigger phrases include "what are our competitors doing", "weekly competitive digest", "what moved in the market this week", "deep dive on COMPETITOR", "add this to the watchlist".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Weekly digest | Monday 07:30 local | What moved, what is new in your field of view, the sightings log, escalations. Observes only |
| Deep dive | On demand | One entity or one question, full history, external profile, reconciliation |

Take the weekly routine. It is a standing beat and it lands before the week's calls. The archive supports a weekly cadence but not a specific weekday, so the day is yours. The skill sets it up: it shows you the prompt and schedule, you approve, it creates it. A quiet week gets one line, because manufactured analysis is how a digest earns its way into the ignored pile.

## What you get

`competitor-watch/digests/YYYY-MM-DD-competitor-watch.md` each week, `competitor-watch/deep-dives/` on demand, plus the watchlist file.

A sightings log row reads: date, entity, source app, context type, whose screen it was, a one-line summary, a receipt, and a confidence rating. Around it sits the velocity table, names proposed for the watchlist, what changed externally with a URL and date on every claim, the reconciliation, and a so-what section of three points at most, fenced as inference with what would make each wrong.

## What it needs

- The Littlebird MCP on a Power or Pro plan. Without the internal half this is a web search with extra ceremony, and the skill says so rather than shipping one.
- Web search and fetch tools, expected but not required. Without them the external and reconciliation sections are marked unrun.
- A watchlist you name once: market frame, tier one and tier two names, aliases, domains, topics. Without it retrieval degrades into an unbounded sweep.

## Limits worth knowing

The velocity threshold is a working convention, not a researched constant, and the digest says so. The weak-signals literature is explicit that no formula separates signal from noise.

Absence is absence. "No sightings of X this window" is supportable. "X went quiet" is not.

The ethics line sits in the skill body rather than in a guide. Noticing is not collecting: intelligence from what you legitimately saw in the ordinary course of business is normal competitive awareness. Deliberately mining a partner's screen share for confidential data is a different thing, and the skill refuses it. NDA material stays out entirely, and anything captured from another person's screen stays internal.

## Related skills

[research-synthesizer](../research-synthesizer/README.md), for one topic answered once and deeply.
[content-repurposer](../content-repurposer/README.md), when a positioning finding becomes outbound material.
[weekly-review](../weekly-review/README.md), the operational weekly beat this one sits alongside.
[pre-call-prep](../pre-call-prep/README.md), when the competitor turns up in a specific deal.

## Under the hood

`SKILL.md` has the full instruction set. `references/` holds `watchlist-setup.md`, `sighting-extraction.md`, `new-entrant-detection.md`, `external-monitoring.md` and `ethics-and-boundaries.md`.

`references/research/` archives 17 primary sources, including the SCIP code of ethics and the enforcement case record. Every domain claim traces to one.
