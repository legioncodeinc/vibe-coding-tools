# Scoring and segmentation

How to rank hand-raisers so the operator works the list in the right order.

## What this model is, and what it is not

This is a PRIORITIZATION model. It decides who to talk to first. It is not a qualification
model and it does not decide who is a real buyer.

The distinction is load-bearing. A hand-raiser from a keyword campaign is a
Marketing-Qualified Lead by the standard definition, a prospect showing engagement
interest with no direct sales involvement, and becomes a Sales-Qualified Lead only after a
conversation confirms need, timing, and authority
[research/raw/leadharvest--scoring--lead-qualification-frameworks-highspot-2026.md].
BANT, CHAMP, MEDDIC and SPICED all qualify on facts a comment cannot carry
[research/raw/leadharvest--scoring--lead-qualification-frameworks-highspot-2026.md]. Do
not let a high signal score be reported as a qualified lead.

The published warrant for stacking signals is engagement recency and frequency scoring, a
named mainstream dimension in which "recent repeated actions score higher than isolated
historical touches"
[research/raw/leadharvest--scoring--lead-qualification-frameworks-highspot-2026.md].

**Honest caveat, state it to the user once.** No source in the research archive gives
validated point values for social hand-raise signals
[research/raw/leadharvest--scoring--lead-qualification-frameworks-highspot-2026.md]. The
weights below are a defensible construction from the recency and frequency principle plus
the effort each signal costs the person. They are a starting point the user should adjust,
not a validated instrument. Say that in the deliverable.

## The scoring model

### Base signal points

Points reflect what the action cost the person, in effort and in social exposure.

| Signal | Points | Reasoning |
|---|---|---|
| Unprompted DM or message request | 5 | Moved to a private channel on their own initiative. Nothing on the list beats it. |
| Comment containing the campaign keyword | 4 | Did the requested action publicly, in front of their own network. |
| Comment not containing the keyword, but on-topic ("yes please", "me", "interested") | 4 | Same public act. The keyword filter is the tool's constraint, not a measure of intent. Do not discount these. |
| Friend or connection request | 3 | Wants ongoing access, not just the resource. Ambiguous in isolation, strong in combination. |
| Reply inside a comment thread, beyond a first comment | 3 | Sustained engagement. Invisible to comment automation, which fires only on a user's first comment [research/raw/leadharvest--automation-tools--manychat-ig-comment-trigger-help.md]. |
| Reaction of any kind | 1 | Lowest cost. Rarely meaningful alone, meaningful as a multiplier. |
| Follow or page like inside the window | 1 | Same. |

### Combination bonus

This is where the money is, and it is the reason the skill exists. Sum the base points,
then add:

| Condition | Bonus |
|---|---|
| Two distinct signal TYPES from the same person | +3 |
| Three or more distinct signal types | +6 |
| Any combination that includes an unprompted DM plus any public signal | +3 additional |

A person who commented, then DM'd, then sent a friend request scores 4 + 5 + 3 = 12 base,
plus 6 for three types, plus 3 for the DM combination, for 21. A person who reacted once
scores 1. That gap is the correct shape: they are not comparable leads and the list should
not pretend they are.

Distinct TYPES is the operative word. Three reactions on three posts is one type and gets
no combination bonus.

### Recency modifier

Recency is a published scoring dimension
[research/raw/leadharvest--scoring--lead-qualification-frameworks-highspot-2026.md], and
the platform windows give it a hard mechanical edge. Apply to the total, using the time
since the person's MOST RECENT signal:

| Age of most recent signal | Multiplier |
|---|---|
| Under 24 hours | 1.3 |
| 1 to 3 days | 1.15 |
| 4 to 7 days | 1.0 |
| 8 to 14 days | 0.85 |
| Over 14 days | 0.7 |

The 7-day boundary is not arbitrary. Meta's Private Replies eligibility runs 7 days from
the comment [research/raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md]
and the human agent tag also runs 7 days
[research/raw/leadharvest--platform-rules--meta-messenger-policy-2026.md]. Past day 7 the
reachable channel on Meta platforms has closed, which is a mechanical fact independent of
any conversion research.

### Content modifiers

Apply after the multiplier, as flat adjustments, only where the verbatim text supports it:

| Condition | Adjustment |
|---|---|
| Verbatim text names a specific problem, timeline, budget, or role | +3, and flag the row for a bespoke first touch rather than a segment template |
| Verbatim text asks a direct question | +2 |
| Person has appeared in prior campaigns without a reply (carry-forward) | +2, and tag as carry-forward |
| Row is an organization page rather than a person | Score it, but exclude it from personal first-touch drafting |
| Verbatim text is hostile, sarcastic, or a complaint | Score to zero and route to the exclusions list. Do not draft outreach. |

### Confidence gate on the score

A score built entirely on Low-confidence rows is itself Low confidence
(`references/evidence-standards.md`, rule 3). Carry the confidence forward and show it
next to the score. A Low-confidence high score means "this looks like your hottest lead,
and I am not certain the name is right." That is a useful thing to tell someone and a
dangerous thing to hide.

## Segments

Bucket by score, because the operator works buckets, not a continuous ranking.

| Segment | Score | What it means | Action |
|---|---|---|---|
| **Hot** | 12 and above | Multi-signal, recent. Usually includes a DM. | Reply first, today, individually written. |
| **Warm** | 6 to 11 | Clear public hand-raise, possibly with a second signal. | Reply today or tomorrow, segment template with one specific detail. |
| **Light** | 3 to 5 | Single meaningful public signal. | Batch. Segment template. |
| **Ambient** | 1 to 2 | Reaction or follow only. | Do not DM individually. This segment is where unsolicited outreach looks most like spam and buys the least. Consider a public thank-you or nothing. |
| **Carry-forward** | any | Prior campaign, never got a reply. | Separate list, separate message, see `references/first-touch-drafting.md`. |
| **Excluded** | zero | Hostile, organizational, or a bad merge that could not be resolved | Named in the report with the reason. Never silently dropped. |

Order inside each segment by score descending, then by recency descending.

## Why order matters at all

The conversion curve for lead response is steep and front-loaded, at 21% inside 5 minutes
falling to 2.3% past 24 hours
[research/raw/leadharvest--speed-to-lead--artemis-benchmark-2026.md], and the canonical
figure, cited secondhand because the primary is paywalled, is 21 times better odds of
qualifying at 5 minutes versus 30
[research/raw/leadharvest--speed-to-lead--leadresponse-statistics-2026.md].

**Do not quote those numbers at the user as if they describe their campaign.** No source
in the archive isolates conversion data for inbound SOCIAL leads; every figure describes
form-fill leads worked by phone
[research/raw/leadharvest--speed-to-lead--artemis-benchmark-2026.md]
[research/raw/leadharvest--speed-to-lead--leadresponse-statistics-2026.md]. Magnitudes
across sources disagree substantially, spanning 7x, 8x, 21x and 391%
[research/raw/leadharvest--speed-to-lead--leadresponse-statistics-2026.md]. Use the
direction, which is unanimous, and the platform window, which is certain.

The defensible framing for the deliverable: work the Hot segment first because response
speed reliably helps and because the Meta reply window closes at 7 days
[research/raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md].

## Presenting the ranked roster

Each row shows, in order: rank, name, segment, score, signal list with timestamps, the
verbatim that matters most, the receipt, and the confidence. Something like:

```
#1  Dani Thompson   HOT   21   High confidence
    comment "SYSTEM please!"  Aug 4 09:07 EDT
      [Monday, August 4, 2026 09:12 EDT | chrome]
    DM "hey did you get my comment"  Aug 4 14:22 EDT
      [collected Monday, August 4, 2026 15:01 EDT | messenger | Dani Thompson]
      (sent Aug 4, 2:22 PM)
    friend request  Aug 4 14:25 EDT
      [Monday, August 4, 2026 15:01 EDT | chrome]
    3 signal types, most recent 6 hours ago
```

Show the arithmetic somewhere in the deliverable. A score the user cannot audit is a score
the user will not trust, and this model is explicitly a starting point they should tune.
