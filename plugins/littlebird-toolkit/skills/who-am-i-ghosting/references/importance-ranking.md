# The ranking model

This page is the skill. Everything else supports it.

Sorting unanswered conversations by how long they have been unanswered produces a useless list. The top of that list is newsletters, cold outbound, a recruiter from March, and one person who said "thanks!" in June. The genuinely costly item, the client who asked a direct question eleven days ago, sits at position forty.

The model here ranks on what the evidence says predicts both a reply and a cost of silence, and it shows its arithmetic per item so the user can disagree with a specific number rather than with the list as a whole.

## What the evidence says to rank on

Every input below is measured somewhere in the archive. None is invented.

Every row's third column points into `research/distilled-responsiveness-and-reengagement.md`,
which cites the raw source for each figure.

| Signal | Measured effect | Where |
|---|---|---|
| Explicit information request | reply probability plus 22 percent, the largest single positive predictor | section 3 |
| Action request present | rated importance plus 20 percent | section 3 |
| Many recipients | reply probability minus 18 percent, rated importance minus 10 percent | section 3 |
| Prior pairwise interaction history | among the strongest features in a reply-prediction model over 938,035 emails | section 3 |
| Human rather than system sender | 0.849 against 0.744 in deferred versus non-deferred | section 4 |
| Few recipients | 3.9 against 7.0 in deferred versus non-deferred | section 4 |
| The waiting party has a live stake | silence dropped a recommendation rate from 57 percent to 19 percent for high-stake senders, and cost nothing at all for low-stake ones | section 5 |
| Work relationship with the sender | rated importance plus 23 percent, reply probability **minus** 9 percent | section 3 |

That last row is the whole problem in one line. Important work mail is postponed **more**, not less. The messages a person most needs to answer are, measurably, the ones most likely to sit. A ranking model that does not correct for this is just re-sorting the inbox.

## What the evidence says NOT to rank on

**Elapsed time as the primary key.** More than 90 percent of all replies land within one day of receipt, the median is 47 minutes and the most likely reply time is 2 minutes (`research/distilled-responsiveness-and-reengagement.md`, section 2). The distribution is compressed at the fast end and long-tailed at the slow end. By the time a thread is nine days cold it is already an extreme outlier, and 30 days cold is not meaningfully more of an outlier than 9. The marginal information in the extra 21 days is close to zero.

**How guilty the user feels.** Receivers systematically overestimate how quickly senders expected a response, across eight pre-registered studies with 4,004 participants (`research/distilled-responsiveness-and-reengagement.md`, section 6). The feeling of owing is a biased estimator of owing.

**The importance-and-urgency quadrant.** Both its axes are properties of the message as read by the recipient. Neither encodes who is waiting, how directly they addressed the reader, or what the relationship is worth, so a no-deadline message from a long-term client lands in the low-priority half and is postponed indefinitely (`research/distilled-responsiveness-and-reengagement.md`, section 12). That is the failure this skill exists to catch, so the model that causes it is not the model that fixes it.

## The model

Only items that passed every gate in `owed-response-detection.md` reach this page. Gating is binary and happens first. Scoring never rescues a gate failure.

Three additive axes, 0 to 3 each. Total 0 to 9.

### Axis A: directness, 0 to 3

How specifically did this person put the question to this user.

| Score | Condition |
|---|---|
| 3 | One to one. A DM, a text, or an email with the user as sole recipient, carrying an explicit question or request. |
| 2 | The user is named or at-mentioned in a group thread and the ask attaches to that mention. |
| 1 | Two or three people in To, an unassigned ask, nobody else has answered. |
| 0 | Would have been gated out. If a candidate scores 0 here, it failed gate 2 and should not be on this page. |

### Axis B: relationship weight, 0 to 3

Inferred from interaction history and context, never from the user's contact list alone, and never from a job title.

| Score | Condition | Typical evidence |
|---|---|---|
| 3 | Live commercial or working relationship. Paying client, active deal, current partner, close collaborator, someone the user meets recurringly. | Recurring meetings together in `LB_INTERNAL_LIST_MEETINGS`, invoices or payments visible in capture, a shared active project, sustained two-way traffic across months |
| 2 | Established counterpart with a real history. Sustained prior exchange, past work together, a warm introduction that went somewhere. | Multiple prior threads across more than one month, at least one meeting together, mutual replies in both directions |
| 1 | One real prior interaction. A single meeting, a single genuine exchange, a referred contact who engaged. | One thread, one meeting, or a named referral |
| 0 | No prior relationship. Cold inbound, first contact from a stranger. | Nothing before this thread |

Rules for this axis:

- **Enrich before scoring.** Run the per-person enrichment queries in the SKILL.md retrieval brief over a 12 month window before assigning B to anyone. Scoring B from the thread alone will systematically underrate a long relationship whose recent traffic is thin, which is exactly the case this skill is meant to catch.
- **Prior interaction history is a measured predictor, not a proxy for liking.** It ranked among the strongest features in a reply model over 938,035 emails (`research/distilled-responsiveness-and-reengagement.md`, section 3). Score history, not warmth.
- **A B score of 0 is not a reason to be cruel, it is a reason to be honest.** A stranger's cold inbound is not a debt. It caps out below the surfacing threshold on its own and that is correct.
- **The dark side case applies.** Reconnection value depends on relevance to a live purpose, not on how good the relationship felt: one documented reconnection was emotionally positive and "ultimately unhelpful" because the benefits were personal rather than relevant to the work (`research/distilled-responsiveness-and-reengagement.md`, section 7). Score the live purpose.

### Axis C: what they were waiting for, 0 to 3

The stake. This axis carries the most weight in practice because it is the one the evidence ties most directly to the cost of silence.

| Score | Condition |
|---|---|
| 3 | They are blocked. They cannot proceed without the user, or they asked for a decision, a date, a price, an approval, or a go or no-go. Also: they have chased at least once already. |
| 2 | A substantive answer was requested. A real question requiring the user's knowledge or judgment, a document sent for review, a proposal awaiting a response. |
| 1 | A soft ask. An introduction request, an open-ended offer, a scheduling feeler, a question the user's answer would be nice to have on. |
| 0 | Pleasantry or FYI with a rhetorical question. Would normally have been gated out by the ask test. |

The chase signal is worth calling out separately. A second attempt ("bumping this", "following up", "any update", "did you get a chance") is the single most reliable evidence in the whole retrieval that the other party still wants the answer. It moves C to 3 on its own. A person does not chase a thing they stopped caring about.

The stake interaction is the empirical basis for this axis. Silence dropped a recommendation rate from 57 percent to 19 percent where the waiting party had a live stake, and produced no measurable expectancy violation at all where they did not (`research/distilled-responsiveness-and-reengagement.md`, section 5). Same silence, same duration, entirely different cost, and the difference was the stake.

### Total and thresholds

Score = A + B + C, from 0 to 9.

| Score | Treatment |
|---|---|
| 7 to 9 | Surface. Top of the list. |
| 5 to 6 | Surface only if fewer than 7 items scored 7 or above. Fill up to the cap. |
| 4 and below | Do not surface. Add to the suppression tally as "scored below threshold". |

Sort descending by score. Break ties with days cold descending, then with axis C descending.

The hard cap of 7 in `owed-response-detection.md` applies after sorting and does not bend.

## Staleness: a band, not a score

Days cold does not enter the score. It sets the **treatment**, because what a thread needs at 5 days and what it needs at 70 days are different actions, not different priorities.

Compute days cold from the **send timestamp** of the other party's last message, never from the Littlebird collection timestamp. Those are different values on every message item (`littlebird-mcp-reference.md`).

| Band | Days cold | What it means | Treatment |
|---|---|---|---|
| **Fresh** | 0 to 3 | Inside ordinary human latency. More than 90 percent of replies land in a day, but a three day gap is unremarkable in professional correspondence. | Do not surface at all unless the score is 8 or 9 and axis C is 3. Most of these are not ghosting, they are Tuesday. |
| **Live** | 4 to 21 | The norm is broken and the thread is still warm. The reply lands in-thread and needs no framing. | Reply in thread. Highest expected yield. This is where the skill earns its keep. |
| **Cooling** | 22 to 45 | The thread is stale but the context is still shared. A bare reply now reads as odd without one line acknowledging the gap. | Reply in thread with a brief gap acknowledgment. See `re-engagement-drafting.md`. |
| **Cold** | 46 to 90 | The thread is over as a thread. Trust and shared perspective survive, and dormant strong ties retained 5.51 on shared perspective against 5.86 for current strong ties (`research/distilled-responsiveness-and-reengagement.md`, section 7). | Open fresh with a new subject that references the old one. Do not resurrect the original thread. |
| **Dormant** | 91 and over | Not a reply situation. A reconnection situation, and the evidence on those is good. | Route to `re-engagement-drafting.md` reconnection form, or to write-off. See below. |

Note what this band structure does that a recency sort cannot: a 6 day old question from a client outranks a 70 day old one from an acquaintance, **and** they receive different message forms. One number cannot do both jobs.

## The write-off list

Threads that are genuinely finished and should be dropped on purpose rather than carried as background guilt. Giving the user permission to close a loop is real output, not filler.

An item goes to write-off when any of these holds:

1. **Dormant and low value.** Days cold 91 or more and score 6 or below.
2. **Three strikes.** The item has appeared in three or more consecutive reports from this skill or its routine, and the user has not acted on any of them. Do not write a fourth identical bullet. Either the tactic changes or the item is written off, and after three passes the honest default is write-off.
3. **Overtaken.** The ask is moot. The deadline passed, the event happened, the role was filled, the deal closed elsewhere.
4. **Two unanswered chases from the user.** The user has already followed up twice with no reply. Note that this is a judgment threshold, not an evidence-based one. The entire recent literature on follow-up counts is vendor content marketing citing other vendor content marketing, on the wrong population and in the wrong direction (`research/distilled-responsiveness-and-reengagement.md`, section 11). Two is a house default and the skill says so rather than dressing it as a finding.
5. **Unreachable.** The person left, the account closed, the channel is dead.

Every write-off item carries one line of explicit permission, phrased so the user can stop carrying it:

```
Marcus Webb, intro request, 104 days cold. He asked for an intro to a design
contractor in April. You never sent it, the project he needed it for shipped in
June. Nothing is owed. Close it.
```

There is no evidence-based expiry date for a professional relationship and the skill does not pretend there is one. The nearest measurement, in a 25 person longitudinal panel of non-professional ties, found roughly half of close friendships had left the inner network layer inside 18 months absent deliberate effort (`research/distilled-responsiveness-and-reengagement.md`, section 10). Directional only. Do not transfer the numbers, and do not tell the user a relationship expires on a date.

Writing off the thread is not writing off the person. Say that explicitly where axis B was 2 or 3. A dormant strong tie is a genuine asset: reconnected dormant strong ties scored 5.70 on usefulness of knowledge received, the highest of the four cells tested, and beat current strong ties on novelty at 5.72 against 5.07 (`research/distilled-responsiveness-and-reengagement.md`, section 7). The correct move on a high-B write-off is to close the stale thread and start a fresh purposeful one, not to file the person away.

## Show the arithmetic

Every surfaced item displays its score breakdown. This is not decoration. It is what lets the user correct the model instead of abandoning it, and it is what makes a wrong item cheap to dismiss.

```
Priya Raghavan  |  email  |  last message 27 Jul  |  21 days cold  |  score 8

  A directness    3   sole recipient, direct question in the body
  B relationship  3   client since Feb, six recurring meetings, invoice
                      activity visible in capture
  C stake         2   asked for a scope answer, not blocked, no chase yet
  band            Live (21 days), reply in thread

  Her last message: "Before we lock the Q4 scope, can you confirm whether the
  migration piece is in or out?"
  [collected Wednesday, July 29, 2026 09:14 EDT | gmail | Priya Raghavan]
  (sent Jul 27, 4:41 PM)

  Why she matters: inferred from six meetings together since February and
  sustained two-way traffic. Confidence: high.
```

Mark the kind of every line as observed, inferred, external, or unknown (`evidence-standards.md`, rule 2). Axis A is observed. Axis C is usually observed, from the words in the message. **Axis B is almost always inferred**, and it is the axis most likely to be wrong, so it always shows the observations it rests on and carries a confidence rating.

Confirm before encoding anything durable about a person (`evidence-standards.md`, rule 6). If a run is about to record that someone is a client and the evidence is one ambiguous invoice fragment, ask.

## Tuning

Offer the user two adjustments at the end of a deep run, through `AskUserQuestion`, and record the answers so the next run applies them:

1. **The threshold.** Default surfaces at 7. Offer 6 for a fuller list or 8 for the ruthless version.
2. **Named relationship overrides.** Ask which people should always score B = 3 and which should never surface at all. A user-supplied override beats an inference every time, and this is the single fastest way to stop the same false positive recurring.

Do not offer to raise the cap. The cap is the design.
