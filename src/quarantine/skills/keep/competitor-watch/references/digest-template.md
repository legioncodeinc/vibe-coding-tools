# Output shape

Two artifacts. The weekly digest, and the on-demand deep dive. Both follow the same
evidence rules and both separate observation from inference.

Domain claims trace to `references/research/distilled-competitive-intelligence.md`.

## Why the shape is opinionated

Measured audit data on why competitive deliverables go unread: only 43 percent of audited
battlecards included talk tracks and only 19 percent included supporting evidence, while
100 percent of the highest-retention ones had both (distillation section 8.2). The named
prescription is "Know, Say, Show": context, talking points, proof (distillation section
8.2). Marketing filler language, with "robust" and "seamless" named explicitly, is the
symptom of a deliverable written without field input (distillation section 8.2).

So: every section carries its evidence inline, and the inference is fenced off where a
reader can see it.

## Artifact 1: the weekly digest

Path: `competitor-watch/digests/YYYY-MM-DD-competitor-watch.md` in the user's working directory.
Confirm the directory once, on first run.

```markdown
# Market radar, week ending YYYY-MM-DD

Window: YYYY-MM-DD to YYYY-MM-DD
Watchlist: N Tier 1, N Tier 2, N topics, last confirmed YYYY-MM-DD
Sightings this window: N deduplicated, across N context types

## What moved
Three items maximum, ranked by velocity, not volume. Each one line plus its receipt.
If nothing moved, one line saying so, and skip to Sightings log.

## New in your field of view
### First appearance
Names with no prior occurrence on record. Each with first sighting, receipt, and the
frame it appeared in.
### Recurring but untracked
Names present in prior periods that were never added to the watchlist. Each with the
earliest date found.
### Proposed for the watchlist
The candidates that cleared the threshold, with evidence, presented for a promote,
decline, or defer decision.

## Frequency and velocity
| Entity | This period | Prior | Baseline (3-period mean) | Velocity | Contexts |
|---|---|---|---|---|---|

One line beneath the table stating the counting convention and that it is a convention,
not a researched constant.

## Sightings log
Chronological. Every sighting: date, entity, source app, context type, whose screen,
one-line summary, receipt, confidence.

## What changed externally
Per Tier 1 entity with a change. Pricing, positioning, launches, funding, personnel,
public claims. Every line cited to a URL with a date. Baseline runs labeled as baseline,
not as change.

## Internal versus external
Per entity with both halves. What they say about themselves, what your market says about
them, where the two agree, where they diverge, and the possible readings of each
divergence marked as inference.

## So what
Marked as inference. Three points maximum. Each names the observations it rests on and
what would make it wrong. A quiet week gets one line.

## Gaps
What was searched and not found. What could not be checked and why. Anything the
retrieval could not resolve.

## Provenance
Queries run, windows, tools used, and the count of items reviewed.
```

## Artifact 2: the on-demand deep dive

Path: `competitor-watch/deep-dives/YYYY-MM-DD-<entity-or-question>.md`.

Same evidence rules, different emphasis. One competitor or one question, full history
rather than one window.

```markdown
# Deep dive: NAME or QUESTION
Prepared YYYY-MM-DD. Window swept: YYYY-MM-DD to YYYY-MM-DD.

## The short answer
Three sentences. What the evidence supports, and how confident.

## Full sighting history
Every appearance on record, chronological, with receipts. The section no monitoring
tool can produce.

## Trajectory
Sightings per period across the full window. Where the velocity changed and when.
Context spread over time: did it move from one context type to several.

## External profile
What they say about themselves now. Pricing, positioning, product, funding, personnel,
public claims. Cited and dated.

## What changed over the window
External timeline, cited. Held against the internal trajectory above.

## Reconciliation
Where the two records agree and where they do not, with possible readings of each
divergence, marked as inference.

## Where they show up against you
Deals, calls, and threads where the entity appeared alongside the user or their
category. Buyer-sourced mentions first, since those expose the positioning that never
appears publicly.

## So what
Marked as inference. What this means for positioning or roadmap, with the disconfirming
evidence named.

## Gaps
Named explicitly.

## Provenance
```

## Rules that apply to both artifacts

1. **Observation and inference never share a voice.** Every line is observed, inferred,
   external, or unknown, and the kind is visible (`references/evidence-standards.md`,
   rule 2).
2. **Receipts on internal claims, URLs on external claims.** No exceptions.
3. **Chronological ordering in any sequence.** Retrieval returns relevance order
   (`references/evidence-standards.md`, rule 8).
4. **Partial rosters reported as partial.** Social and app UIs collapse lists. Report the
   named set and the size of the unnamed gap (`references/evidence-standards.md`, rule 5).
5. **Vendor survey figures are directional.** Everything quantitative in the research
   archive is vendor-published (distillation section 10, gap 5). Do not quote a vendor
   percentage to the user as a measured fact.
6. **The digest is internal.** It contains material derived from other people's screens.
   `references/ethics-and-boundaries.md`, rule 5, governs what leaves the building, which
   is nothing.
7. **No filler.** If a section has nothing in it, write one line saying so and move on.
   Padding a recurring digest is what gets it ignored.
