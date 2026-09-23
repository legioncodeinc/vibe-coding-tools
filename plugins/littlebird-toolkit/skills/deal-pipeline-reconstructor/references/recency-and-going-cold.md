# Recency and the going-cold list

Last touch per deal, and how to rank what is dying. This is the part of the board the user
acts on Monday morning.

---

## 1. Last touch: define it precisely

**Last touch is the most recent observed interaction between the user and the prospect, in
EVENT time.**

| Counts as a touch | Does not count |
|---|---|
| A message sent or received in the thread | The user viewing an old thread |
| A meeting held with the prospect | A meeting scheduled but not yet held (that is a future hold, see section 4) |
| A document visibly sent to the prospect | A document about the prospect on the user's own screen |
| An email observed in either direction | A CRM record or note edited |

The distinction in the last row matters and it is the skill's edge. A CRM last-modified
date measures when the SELLER typed something. A last-touch date measures when the BUYER
was actually contacted. Those diverge, and the divergence is the documented failure mode:
reps "mark deals as healthy in the CRM long after buyer engagement signals have gone cold"
(`research/distilled-b2b-pipeline-management.md`, section 3).

For comparison, the shipped product precedent resets its staleness timer on any recorded
activity including "Adding notes and files to a deal"
(`research/distilled-b2b-pipeline-management.md`, section 5), which means a seller can
reset it without contacting anyone. This skill does not do that. Only contact counts.

### Event time, not collection time

Sort by EVENT time. Retrieval returns relevance order (`evidence-standards.md`, rule 8), and
for messages the collection time and the send time are different values, both of which
appear in the receipt (`littlebird-mcp-reference.md`).

### Direction matters, so record it

Record whether the last touch was OUTBOUND (user to prospect) or INBOUND (prospect to
user). Fourteen days of silence after the user sent something is a prospect who has not
replied. Fourteen days after the prospect sent something is the user dropping the ball.
Those are different problems with different next actions, and the board must not blur them.

### Where the last touch is unknown

If no interaction can be dated, last touch is `Unknown` and the deal goes in a separate
"undated" group rather than at the top or bottom of the going-cold list. An unknown is not
a zero and it is not an infinity (`evidence-standards.md`, rule 2).

---

## 2. Why the threshold varies by stage

**The same silence duration means different things at different stages.** This is the
central claim of this file and it has direct support.

Typical stage durations, from the archive
(`research/distilled-b2b-pipeline-management.md`, section 5):

| Stage | Typical duration reported |
|---|---|
| Discovery | 7 to 14 days to confirm |
| Demo | 7 to 21 days after discovery |
| Technical evaluation | 7 to 14 days after demo |
| Proposal | 7 to 14 days for a reply |
| Negotiation | 14 to 30 days |
| Closing | 7 to 21 days |

The two shortest expected windows are discovery response and proposal reply. So fourteen
days of silence sits at the FAR END of the expected proposal reply window, and well INSIDE
the expected negotiation window. A single global threshold would flag them identically,
which is wrong in both directions.

Two further supports:

- Per-stage staleness thresholds are shipped product practice, not an invention. Pipedrive
  configures its rotting period individually per pipeline stage, with stages able to carry
  different thresholds or opt out entirely
  (`research/distilled-b2b-pipeline-management.md`, section 5).
- A proposal-stage signal appears to decay fast: a claimed 42.5% of closed-won proposals
  close within 24 hours of first being opened, attributed to Proposify over 1.3 million
  proposals with no year stated
  (`research/distilled-b2b-pipeline-management.md`, section 5). Directional only, but it
  points the same way.

---

## 3. The threshold model, and how to state it honestly

### Use the relative rule as the primary

**Flag a deal as going cold when days since last touch exceeds twice the typical duration
of its current stage.** The "2x the average stage duration" rule comes from the archive
(`research/distilled-b2b-pipeline-management.md`, section 5), where it is stated with no
source cited, so treat it as a heuristic rather than a finding.

The reason to prefer a relative rule over an absolute day count is concrete: reported cycle
lengths differ by nearly an order of magnitude across segments, from SMB at roughly 30 to
45 days up to strategic deals at 9 to 18 months
(`research/distilled-b2b-pipeline-management.md`, section 5). No single day count can be
right across that range.

### Starting thresholds, to be tuned

Derived from the stage durations in section 2 by applying the 2x rule and rounding. These
are a STARTING POINT, and the board must say so. No vendor publishes a recommended default
day count; the shipped product explicitly leaves it to the user because the right timeframe
depends on their own workflow
(`research/distilled-b2b-pipeline-management.md`, section 5).

| Stage | Going cold at | Cold at |
|---|---|---|
| Lead | 14 days | 30 days |
| Qualified | 14 days | 28 days |
| Proposal | 10 days | 21 days |
| Negotiation | 14 days | 30 days |
| Closing | 7 days | 14 days |

Proposal is TIGHTER than Negotiation on purpose. Negotiation is reported as the longest
single stage at 14 to 30 days, while a proposal reply is expected within 7 to 14 days
(`research/distilled-b2b-pipeline-management.md`, section 5).

Closing is tightest of all. A deal that is verbally agreed and then goes quiet for a week
is the most recoverable and the most urgent thing on the board.

### Calibrate to the user's own cycle when possible

If the board has enough Won and Lost history to estimate the user's own typical time in
stage, use THAT rather than the imported numbers, and say which one is in force. The
imported figures describe a mid-market and enterprise population, and the SMB segment cycle
is reported at roughly 30 to 45 days
(`research/distilled-b2b-pipeline-management.md`, section 5). If the user's cycle is
shorter than the benchmark, every threshold above is too slow for them.

Where there is not enough history, say that plainly and use the defaults.

---

## 4. Upcoming holds suppress the cold flag

Before flagging a deal cold, check for a SCHEDULED future meeting with that prospect. Use
`LB_INTERNAL_LIST_MEETINGS` with a future `end_date`, which returns upcoming calendar
events (`littlebird-mcp-reference.md`).

A deal with a call booked for next Tuesday is not going cold, it is waiting. Flagging it
cold is the fastest way to make the user stop trusting the list.

Note the limitation: upcoming events appear as bare calendar entries with no id, no summary
and no transcript, and they are not searchable (`littlebird-mcp-reference.md`). Match them
to deals by attendee name and title text only, and mark the match as an inference.

Suppress the cold flag, keep the deal in the board, and show the hold date in its own
column.

---

## 5. Ranking the going-cold list

Rank by SEVERITY, not by raw days. Severity combines three things:

1. **How far past the stage threshold the silence has run.** Express it as a ratio (days
   since last touch divided by the stage threshold), not as raw days, so stages compare
   fairly.
2. **How far along the deal is.** Later stage means more sunk work and more recoverable
   value, so a proposal-stage silence outranks a lead-stage silence at the same ratio.
3. **Direction of the last touch.** An unanswered INBOUND message from the prospect
   outranks everything at the same ratio. The prospect reached out and got nothing back.

Do not compute a composite score and present it as a number. A score implies a precision
this evidence does not have. Rank the list, and show the three inputs per row so the user
can see why a deal is where it is.

Deals with an upcoming hold are excluded from the ranking entirely, per section 4.

---

## 6. What a cold deal means, and what it does not

**Silence is not a decision.** Every stated cause of a prospect going quiet, across two
independent sources in the archive, is about the buyer's own situation rather than a
decision against the seller. HubSpot's six causes are decision paralysis, competing
priorities, lack of perceived urgency, unclear workflow fit, incomplete discovery, and
information overload (`research/distilled-b2b-pipeline-management.md`, section 6). The
proposal-side source agrees that silence "often signals internal committee dynamics,
overwhelm, internal politics, price shock, or fear of delivering bad news"
(`research/distilled-b2b-pipeline-management.md`, section 6).

**So a going-cold list is a WORK QUEUE, not a write-off list.** Not one archived cause of
silence is "they chose someone else"
(`research/distilled-b2b-pipeline-management.md`, section 6). Present it that way.

**Silence can also be diagnostic of an earlier defect.** One of the six causes is
incomplete discovery, meaning a deal that went quiet after a proposal may be a deal that was
never properly qualified (`research/distilled-b2b-pipeline-management.md`, section 6). This
is why the board shows the whole evidence trail per deal and not just the last touch. When
a proposal-stage deal goes cold and the qualification evidence is thin, say so in the next
action.

**Absence of evidence is not evidence of absence.** "No contact observed in 21 days" and
"no contact happened in 21 days" are different claims and only the first is supportable
(`evidence-standards.md`, rule 2). The user may have called them from a phone Littlebird
never saw. Word every cold flag as an observation about the CAPTURE, and invite the
correction.

---

## 7. The next action line

One line per deal. Concrete, specific to the evidence, and executable today.

Rules:

- **Name the specific thing.** "Send Dani the revised scope she asked about on Jul 23", not
  "follow up with Dani".
- **Pull from the meeting summary where one exists.** The `## For You` and `## Action Items`
  sections already carry owner-attributed next steps
  (`littlebird-mcp-reference.md`). Use them rather than inventing a step.
- **Do not phrase it as a complaint about being ignored.** Saying "I never heard back" is
  claimed to DECREASE meetings booked by 14%, attributed to Gong over 304,174 emails
  (`research/distilled-b2b-pipeline-management.md`, section 6). It is a large-sample,
  negatively-signed finding, which is the kind least likely to be publication-biased, so it
  is worth respecting even though the year is unstated.
- **Where the deal is cold and the qualification was thin, the next action is a
  re-qualification, not a nudge.**
- **Where the last touch was inbound and unanswered, the next action is to reply**, and it
  outranks everything else.
- **Where the amount is unknown and the stage is Proposal or later, one next action is to
  find out.** An unknown amount at negotiation stage is its own problem.

### Do not encode a follow-up cadence

The archive contains a direct, unresolved conflict on tempo
(`research/distilled-b2b-pipeline-management.md`, section 6):

| Reading | Prescription |
|---|---|
| Slow (HubSpot) | Let them be for "a few weeks or months", then re-approach with value, do not escalate |
| Fast (HummingDeck) | A dense multi-touch, multi-channel cadence over roughly 18 days after a proposal |

Both are vendor sources, both have a commercial interest, and the two prescriptions differ
by roughly an order of magnitude in tempo. **Do not smooth this into one recommended
cadence.** Where the user asks how often to chase, present both readings, say they conflict,
and let them choose. Record their choice so the next run uses it.

---

## 8. Columns this file contributes to the board

| Column | Content |
|---|---|
| Last touch | Date in event time, with its receipt |
| Direction | Inbound or outbound |
| Days silent | Integer, or `Unknown` |
| Stage threshold | The threshold in force for this deal's stage, and whether it came from the defaults or from the user's own history |
| Status | Active, Going cold, Cold, or Waiting (upcoming hold on DATE) |
| Next action | One line, per section 7 |
