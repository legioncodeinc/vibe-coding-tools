# Watchlist setup and maintenance

The watchlist is the only configuration this skill has. It is user-defined, user-confirmed,
and it never grows without permission. Everything downstream (sighting extraction,
frequency counting, external monitoring, reconciliation) reads from it.

Domain claims in this guide trace to
`references/research/distilled-competitive-intelligence.md`.

## Why the watchlist stays small

70 percent of competitive intelligence teams track 30 or fewer competitors, and the
largest single group tracks 11 to 30 (distillation section 6, vendor-surveyed figure, use
directionally). Poor competitor identification, meaning no infrastructure to say who the
competitors actually are, is one of four named causes of competitive intelligence program
failure (distillation section 8.1).

A watchlist of 60 names is not a more thorough version of a watchlist of 15. It is a
watchlist that produces a digest nobody reads.

## The setup interview

Run this once, on first use, with `AskUserQuestion`. Ask in this order. Do not skip to
retrieval before the watchlist exists, because sighting extraction with no entity list
degrades into an unbounded sweep, which is the failure mode described in
`references/new-entrant-detection.md`.

### Question 1. What market are you in

Get one sentence naming the category and the buyer. Example shape: "AI-assisted internal
tooling for small services businesses, sold to owner-operators." This sentence becomes the
category frame for new-entrant detection, so it needs to be specific enough to constrain a
search and broad enough to include a competitor who describes themselves differently.

If the user gives a vague answer, ask a follow-up naming two candidate framings and let
them pick.

### Question 2. Who do you lose deals to, or expect to

These are Tier 1. The source tiering is Tier 1 primary and Tier 2 secondary or emerging,
based on deal impact (distillation section 6). Ask for names, not descriptions.

### Question 3. Who is adjacent but not yet head to head

These are Tier 2. Includes companies moving toward the category, tools the user's buyers
also evaluate, and anyone the user has a nagging feeling about.

### Question 4. Aliases, product names, and spellings

This is the question most setups skip and it is the one that determines recall. For every
name on the list, collect:

| Field | Why it matters |
|---|---|
| Legal or brand name | The obvious query term |
| Product names distinct from company name | Screen capture shows the product UI, not the incorporation certificate |
| Common shortenings and misspellings | OCR of dense UI produces fragments and errors (`references/littlebird-mcp-reference.md`) |
| Domain | Distinguishes a company from a common word |
| Founder or public face name | People say "the guy from X" and post about founders |
| Handle on the platforms the user uses | Facebook, LinkedIn, X, Slack, Discord |

Ask the user to fill gaps rather than guessing aliases yourself. An invented alias
generates false sightings, and a false sighting in a frequency count is worse than a
missed one, because it fabricates velocity.

### Question 5. Topics and shifts, not just companies

Competitive intelligence tracks three categories: product, pricing, and positioning
(distillation section 1). Ask what market shifts matter independent of any single company:
a pricing model spreading across the category, a platform change, a regulatory move, a
capability becoming table stakes.

These become topic entries on the watchlist and they are tracked exactly like company
entries.

### Question 6. Ambiguity traps

For each name, ask whether the term has a common non-competitive meaning. A competitor
called "Ramp", "Notion", "Linear", or "Anthropic" will collide with ordinary language and
with the user's own tooling. Record a disambiguation note for each trap, and record it as
a required co-occurrence term rather than as a rule you will remember.

## The watchlist file

Write it to `competitor-watch/watchlist.md` in the user's working directory. Confirm the path
with the user before writing, per the confirm-before-you-encode gate in
`references/evidence-standards.md`.

Shape:

```markdown
# Market radar watchlist
Last confirmed: YYYY-MM-DD

## Market frame
One sentence naming category and buyer.

## Tier 1 competitors
### Acme Corp
- Aliases: Acme, AcmeHQ
- Products: AcmeFlow, Acme Studio
- Domain: acme.example
- People: Jane Roe (founder)
- Handles: @acmehq
- Disambiguation: require co-occurrence with "workflow" or the domain
- Added: 2026-08-17 (user, setup)

## Tier 2 adjacent and emerging
### ...

## Tracked topics and shifts
### Usage-based pricing in the category
- Query terms: usage-based pricing, credit pricing, per-seat to per-usage
- Added: 2026-08-17 (user, setup)

## Proposed, awaiting confirmation
### Newname Inc
- First seen: 2026-08-14
- Proposed on: 2026-08-17
- Evidence: three independent sightings, see digest 2026-08-17
- Status: awaiting user decision

## Declined
### Othername Co
- Proposed 2026-07-20, declined by user 2026-07-21, reason: not a competitor, a supplier
```

The `Declined` section is not optional. Without it, new-entrant detection re-proposes the
same rejected name every week, which is exactly the repetition that makes a recurring
digest get ignored (distillation section 8.3, presented there as a design choice rather
than a measured finding).

## Maintenance rules

1. **The skill proposes, the user disposes.** New names found by new-entrant detection go
   into `Proposed, awaiting confirmation` with their evidence. They are never promoted to
   Tier 1 or Tier 2 without an explicit user decision. Never silently expand the watchlist.
2. **Promotion is a user decision with three outcomes:** promote to a tier, decline with a
   reason, or defer, meaning keep watching without tracking. A deferred name stays in
   `Proposed` with a note, and stops being re-proposed as new.
3. **Demotion happens too.** If a Tier 1 name has produced zero internal sightings and zero
   external changes for two consecutive quarters, propose demotion to Tier 2 and say why.
   Absence of evidence is reported as absence of evidence, not as a claim the competitor
   is gone (`references/evidence-standards.md`, rule 2).
4. **Confirm the whole list quarterly.** Present it, ask what is missing and what is stale,
   update `Last confirmed`.
5. **Aliases get added when a sighting reveals one.** If a sighting shows the user's market
   calling a competitor something the watchlist does not list, propose the alias with its
   receipt. Same confirmation gate.

## Empty or refused setup

If the user will not or cannot name competitors, do not proceed to retrieval with an empty
watchlist and do not invent a list from the market frame. Say that the skill needs at least
one tracked entity to produce a sightings log, offer to run a one-time category scan per
`references/new-entrant-detection.md` to propose candidate names, and stop there until the
user confirms some.
