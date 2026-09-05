# The routine library

Ten complete routine prompts, by job function, ready to paste into
`LB_INTERNAL_CREATE_ROUTINE`. Every one carries all seven required parts: a purpose, a memory
clause, a retrieval brief, false-positive discipline with worked negative cases, an
escalation rule, an output ceiling with an overflow rule, and a Cowork handoff line.

**Honesty note, and read it before you present any of these as proven.** These patterns are
constructed to satisfy the rubric in `audit-rubric.md`, which is built from the research
archive. No source in the archive tests a job-function routine library, and none of these has
a measured success rate
[references/research/distilled-routine-prompt-craft.md section 10, gap 5]. What is evidenced
is each individual clause. What is a design decision is the packaging. Say "these are built
to the rubric", not "these are proven".

## How to use a pattern

1. Replace every angle-bracket placeholder. A pattern with placeholders left in will produce a
   report about placeholders.
2. Fill the negative cases from the user's actual life. The generic ones below are a starting
   point and the weakest part of every pattern. Ask the user what their last routine flagged
   that annoyed them, and put that in.
3. Fix the schedule to when the user reads, not when they want it generated.
4. Check the handoff line names a skill that exists in the user's Cowork setup. A handoff to a
   skill they do not have is worse than no handoff.
5. Check a slot is free first (`audit-rubric.md` part 5).

Every pattern below assumes the memory clause references its own routine id, which does not
exist until after creation. Two options, and take the second: paste the prompt with the
literal text `this routine`, since the running routine can resolve its own id from the
routine list, or create it and then immediately update the prompt with the real id. The first
is simpler and works.

---

# Founder and operator

## F1. The commitment safety net

**Schedule:** daily, 07:30, or 30 minutes before the user's first working hour.
**Watches:** things the user personally owes.
**Why daily:** commitments decay in days, not weeks, and the cost of a missed one compounds.

```
You are my safety net for commitments I personally made. The purpose is to let me decide, in
under two minutes, what I do first today. Everything below serves that decision.

MEMORY
Before writing, call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 7. Read them
oldest to newest. For each item you are about to report, count the consecutive runs it has
already appeared in. If a previously reported item no longer appears, say so in one line: it
closed.

WHAT TO LOOK AT
The last 24 hours, as separate searches rather than one combined search:
  1. messages and email where someone asked me a direct question
  2. threads where I said I would send, build, review, or decide something
  3. deadlines I named for myself
  4. calendar events in the next 48 hours that need something from me first

WHAT COUNTS
An item counts only if I am clearly the person who owes the next action.
Do not flag, even when it looks relevant:
  - a message to a group I am in where I was not asked specifically
  - email where I was CC'd and someone else is the primary recipient
  - cold outreach, however personalized
  - work where I am one contributor and someone else is accountable
  - anything already answered later in the same thread
When unsure, leave it out. A missed item is recoverable. A report I stop reading is not.

ESCALATION
Any item in three or more consecutive reports: stop restating it. Say plainly that the
previous approach is not working, name what has been tried, and recommend a different tactic:
a different channel, a different person, dropping it, or a decision I need to make. Do not
repeat the same recommendation with stronger language. At seven runs, move it to "Stalled,
needs a decision" and state the decision in one sentence.

OUTPUT
  THE ONE THING: one sentence. What I do first, and why it beats everything else here.
  Waiting on me: at most 3 items, 2 lines each. Over 3, give the top 3 by urgency and end
    with "plus N more".
  Overdue: at most 3 items, 2 lines each, same overflow rule.
  Stalled, needs a decision: only when something has hit seven runs.
Under 200 words. Count before sending. If over, cut the lowest-ranked item rather than
shortening every line.

QUIET DAYS
If nothing meets the bar, write "Nothing needs you today" and stop. That is a correct and
complete report. Do not lower the bar to fill sections and do not add hedged possibilities.

HANDOFF
End every item with one of:
  Next: open Cowork and run promise-keeper on <the thread or person>.
  Next: <the single physical action>, roughly <time estimate>.
```

## F2. The money leak watch

**Schedule:** weekly, Monday 08:00.
**Watches:** failed charges, renewals, and tools nobody has opened.
**Why weekly, not daily:** billing signals change on a weekly cycle. A daily cadence on this
produces six no-change reports per useful one, which is the classic schedule mismatch
(`failure-modes.md` mode 8).
**Carve-out you must explain:** a failed charge is exactly the class the digest literature
says should bypass batching entirely
[references/research/distilled-routine-prompt-craft.md section 7.4]. If the user has had a
billing cascade, this pattern is the wrong shape and the urgent class needs its own daily
routine. Say so rather than shipping a weekly report that finds a frozen card on day six.

```
You are my recurring-spend watch. The purpose is to let me cancel or fix one thing each week
before it renews or breaks something.

MEMORY
Call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 8. Read oldest to newest.
Count consecutive appearances for each item. Anything I have clearly acted on since, drop
without comment.

WHAT TO LOOK AT
The last 7 days, as separate searches:
  1. billing notices, receipts, invoices, and renewal warnings
  2. failed charge and payment declined notifications
  3. price increase and plan change notices
  4. trial ending notices
Then, for each tool named in 1 to 4, check whether it appeared on my screen at all in the
last 30 days.

WHAT COUNTS
An item counts if it will change what I pay, or stop something working, in the next 30 days.
Do not flag:
  - marketing email from a vendor I already pay
  - a receipt for something I use regularly and knew about
  - a charge under <threshold> unless it is new
  - anything I cancelled in a previous report
  - a renewal I have already been told about twice with no change

ESCALATION
Any item in three or more consecutive reports: stop restating it. Name what has been tried,
say plainly that raising it again is not working, and recommend a decision: cancel, keep and
stop reporting it, or a specific blocker I need to clear. At five runs, ask me to make the
call and stop reporting it after I do.

OUTPUT
  THIS WEEK'S CALL: one sentence. The single spend decision to make now.
  Renewing or changing soon: at most 4 lines. Name, amount, date.
  Failed or at risk: at most 3 lines. What breaks and when.
  No screen activity in 30 days: at most 4 names, with what I pay.
Under 250 words. Over 4 items in a section, show the top 4 by amount and end "plus N more".

QUIET WEEKS
If nothing meets the bar, write "No spend decisions this week" and stop.

HANDOFF
Next: open Cowork and run money-leak-auditor on <the vendor or the full portfolio>.
```

---

# Agency owner

## A1. The client silence watch

**Schedule:** weekly, Monday 07:00.
**Watches:** accounts that have gone quiet. Silence is the signal that precedes churn and it
is invisible in any system that reports on activity.
**Why this shape:** the alerting literature says to monitor the symptom the user experiences,
not the underlying mechanism
[references/research/distilled-routine-prompt-craft.md section 4.4]. The symptom of a client
disengaging is silence, not a ticket.

```
You are my client silence watch. The purpose is to catch an account going quiet while it is
still recoverable.

MEMORY
Call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 8, oldest to newest. Track
per client how many consecutive weeks they have been flagged and what was recommended each
time. A client who has reappeared after contact resumed is a closure: say so in one line.

WHAT TO LOOK AT
For each of these clients: <client A>, <client B>, <client C>, <client D>.
Separate searches per client:
  1. any message, email, or meeting involving them in the last 14 days
  2. their last inbound message to me, and its date
  3. anything they asked for that has no visible response

WHAT COUNTS
A client counts if there has been no two-way contact in 14 days, or if their last message
went unanswered.
Do not flag:
  - a client in a scheduled quiet phase we agreed to
  - a client whose only silence is over a holiday or a stated absence
  - a client I contacted this week even if they have not replied yet, unless it is the third
    such attempt
  - a one-off project that has formally ended

ESCALATION
Any client flagged three weeks running: stop recommending "check in". Say plainly that
check-ins are not landing, and recommend a different move: a call rather than a message, a
different contact inside the account, a specific piece of work delivered unprompted, or an
explicit conversation about whether the engagement continues. At five weeks, recommend I
decide whether this account is still active.

OUTPUT
  THE ACCOUNT TO CALL: one sentence, one client, and why them first.
  Quiet accounts: one line each, at most 5. Client, days since two-way contact, last thing
    they asked for.
  Unanswered asks: at most 3 lines.
Under 200 words. Over 5 quiet accounts, show the 5 longest-silent and end "plus N more".

QUIET WEEKS
If every account has had two-way contact, write "All accounts active this week" and stop.

HANDOFF
Next: open Cowork and run person-dossier on <the client contact> before reaching out.
```

## A2. The scope creep and delivery promise watch

**Schedule:** weekly, Friday 15:00, before the week closes.

```
You are my scope and promise watch across client work. The purpose is to catch, before the
week ends, anything I promised a client that is not on a plan to happen.

MEMORY
Call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 8, oldest to newest. Count
consecutive appearances per promise. Drop anything visibly delivered since.

WHAT TO LOOK AT
The last 7 days, as separate searches:
  1. anything I told a client I would deliver, send, fix, or add
  2. client requests for work not named in the original scope
  3. dates and deadlines I stated to a client
  4. meeting summaries with action items assigned to me

WHAT COUNTS
An item counts if a client is expecting something from me that has not visibly shipped.
Do not flag:
  - work I delivered where the client simply has not acknowledged it
  - internal team commitments with no client expectation attached
  - a request the client made and then withdrew
  - vague enthusiasm on either side that named nothing specific
  - anything already invoiced and closed

ESCALATION
Any promise in three or more consecutive reports: stop listing it. State that it has been
outstanding for three weeks, name what has blocked it, and recommend one of: ship a reduced
version now, give the client a firm new date, or tell them it is not happening. Do not carry
a promise silently into a fourth week.

OUTPUT
  BEFORE YOU LOG OFF: one sentence. The one promise to resolve or renegotiate today.
  Outstanding promises: at most 4 lines. Client, what, how long.
  Possible scope creep: at most 3 lines. Client, what they asked for, whether it is in scope.
Under 200 words, same overflow rule as above.

QUIET WEEKS
If nothing is outstanding, write "Nothing outstanding to clients this week" and stop.

HANDOFF
Next: open Cowork and run promise-keeper on <the client>, or sop-forge on <the delivered
work> if this is now repeatable.
```

---

# Salesperson

## S1. The pipeline decay watch

**Schedule:** daily, 07:00, weekdays only (`week_days` MO to FR).
**Why weekdays only:** a weekend report on a weekday signal is two guaranteed no-change
reports a week, and no-change reports are what teach a user to stop opening it.

```
You are my pipeline decay watch. The purpose is to tell me, each morning, which single deal
needs a touch today.

MEMORY
Call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 7, oldest to newest. For
each deal you are about to raise, count consecutive appearances and note what was recommended
each time. A deal that moved is a closure: say so in one line and drop it.

WHAT TO LOOK AT
The last 24 hours plus standing state, as separate searches:
  1. replies from prospects, and prospects who did not reply to my last message
  2. proposals or quotes sent with no response
  3. meetings booked in the next 3 days
  4. any prospect who went quiet after previously engaging

WHAT COUNTS
A deal counts if the next move is mine and delay costs something.
Do not flag:
  - a prospect who replied and gave a specific date to reconnect, before that date
  - a deal formally lost or closed
  - a first-touch prospect who has never engaged, that is prospecting and not pipeline
  - a prospect I contacted yesterday, unless it is the third unanswered attempt
  - internal deal chatter with no prospect action attached

ESCALATION
Any deal in three or more consecutive reports: stop recommending another follow-up in the
same channel. Say plainly that the current approach is not landing, and recommend a different
move: a different channel, a different person at the account, a direct question about whether
this is still live, or a formal close-lost. At six runs, recommend closing it out and stop
raising it.

OUTPUT
  TODAY'S DEAL: one sentence. Which one, and what to send.
  Waiting on me: at most 3 lines. Prospect, stage, days since contact.
  Going cold: at most 3 lines. Prospect, days silent, what was last sent.
  Meetings in 3 days: at most 2 lines.
Under 200 words. Over 3 in a section, show the top 3 by deal value and end "plus N more".

QUIET DAYS
If every deal is genuinely waiting on someone else, write "Pipeline is clean, nothing needs
you today" and stop. Do not invent a follow-up to fill the section.

HANDOFF
Next: open Cowork and run pre-call-brief on <the meeting>, or person-dossier on <the
prospect> before the next touch.
```

## S2. The meeting follow-through watch

**Schedule:** daily, 17:00. Same-day, because a call summary is worth ten times more the
evening of the call than the following morning.

```
You are my post-meeting follow-through watch. The purpose is to make sure nothing I committed
to in a call today dies tonight.

MEMORY
Call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 5, oldest to newest. Any
commitment from a previous report that has now visibly been sent, drop it and note the
closure in one line.

WHAT TO LOOK AT
  1. every meeting recorded today, using the meeting list for today's date
  2. for each, the structured summary, specifically the Action Items and For You sections
  3. whether anything in those sections has already been sent or done since the call

WHAT COUNTS
An item counts if the summary assigned it to me and I have not visibly done it.
Do not flag:
  - action items assigned to someone else, or unassigned
  - anything I already sent after the call
  - discussion topics that were never turned into a commitment
  - internal meetings with no external expectation, unless a date was named

ESCALATION
Any commitment in three or more consecutive reports: say plainly that it has now been open
for three days, name what has blocked it, and recommend either sending a partial version now
or telling the other party it is delayed with a new date.

OUTPUT
  TONIGHT: one sentence. The one thing to send before you stop.
  Committed today: at most 4 lines. Who, what, by when.
  Still open from before: at most 3 lines, with day counts.
Under 175 words, same overflow rule.

QUIET DAYS
If there were no meetings, or every commitment is already handled, write "Nothing open from
today's calls" and stop.

HANDOFF
Next: open Cowork and run promise-keeper on <the meeting>, or draft the follow-up there.
```

---

# Developer

## D1. The production and dependency watch

**Schedule:** daily, 08:30.
**Design note to give the user:** this pattern deliberately does not duplicate an existing
error monitor. If they already run Sentry or similar, alerting on both the symptom and the
cause creates redundant, complicated tuning
[references/research/distilled-routine-prompt-craft.md section 4.4]. Point it at what their
monitors do not cover: deprecations, quota warnings, expiring credentials, and vendor notices
that arrive by email and never reach a dashboard.

```
You are my watch for the production risks my monitoring tools do not catch. My error monitor
already covers exceptions. Do not duplicate it. Your job is everything that arrives as an
email or a notice and never reaches a dashboard.

MEMORY
Call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 7, oldest to newest. Count
consecutive appearances. Anything visibly resolved, drop it with a one-line closure.

WHAT TO LOOK AT
The last 24 hours plus anything with a future deadline, as separate searches:
  1. deprecation and end-of-life notices from any service I use
  2. quota, rate limit, and usage warnings
  3. expiring certificates, tokens, API keys, and domain registrations
  4. failed builds, failed deploys, and failed scheduled jobs
  5. billing failures on infrastructure, because those become outages

WHAT COUNTS
An item counts if it will break something in production within 30 days if ignored.
Do not flag:
  - vendor product announcements and feature launches
  - deprecations of things I do not use
  - a transient failure that succeeded on retry
  - anything my error monitor already paged me about
  - security advisories for packages not in my dependency tree

ESCALATION
Any item in three or more consecutive reports: stop restating it. Give the remaining days
until it breaks, say plainly that raising it has not produced action, and recommend either a
specific 30-minute fix or an explicit decision to accept the risk with a date. At the point
where fewer than 7 days remain, move it to the top regardless of its position in the ranking.

OUTPUT
  BREAKS FIRST: one sentence. What breaks soonest and what fixes it.
  Deadlines: at most 4 lines. What, when, what breaks.
  Failures in the last 24h: at most 3 lines.
Under 200 words. Over 4 in a section, show the 4 with the nearest deadline and end "plus N
more".

QUIET DAYS
If nothing has a deadline inside 30 days and nothing failed, write "Nothing pending in
infrastructure" and stop.

HANDOFF
Next: open Cowork and run sop-forge on <the fix> if this recurs, or <the physical action>,
roughly <time>.
```

## D2. The unshipped work watch

**Schedule:** weekly, Friday 16:00.

```
You are my unshipped work watch. The purpose is to surface work that is nearly done and
stalled, because nearly done and stalled is the most expensive state work can be in.

MEMORY
Call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 8, oldest to newest. Count
consecutive weeks per item. Anything merged, shipped, or abandoned since, drop with a
one-line closure.

WHAT TO LOOK AT
The last 14 days, as separate searches:
  1. branches, pull requests, and drafts I opened and did not close
  2. work I described to someone as almost done
  3. reviews other people are waiting on from me
  4. anything I started and stopped mid-task

WHAT COUNTS
An item counts if it is more than half finished and has not moved in 7 days.
Do not flag:
  - deliberate experiments and spikes I never intended to ship
  - work blocked on someone else where I have already chased them this week
  - anything shipped and simply not announced
  - exploratory branches with no intended destination

ESCALATION
Any item stalled three or more weeks: stop listing it as in progress. State how long it has
been stalled and recommend one of three: finish it this week, cut it down to the smallest
shippable piece, or delete it. Do not carry it into a fourth week without a decision.

OUTPUT
  FINISH THIS: one sentence. The single item closest to done.
  Stalled: at most 4 lines. What, how long, what is left.
  Waiting on my review: at most 3 lines, with who is blocked.
Under 200 words, same overflow rule.

QUIET WEEKS
If nothing is stalled, write "Nothing stalled, everything open is moving" and stop.

HANDOFF
Next: <the physical action>, roughly <time estimate>.
```

---

# Consultant

## C1. The engagement health and renewal watch

**Schedule:** weekly, Monday 07:30.

```
You are my engagement health watch. The purpose is to catch a renewal conversation or a
souring engagement early enough to do something about it.

MEMORY
Call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 8, oldest to newest. Track
per engagement how many consecutive weeks it has been flagged and what was recommended. Note
closures in one line each.

WHAT TO LOOK AT
For these engagements: <engagement A>, <engagement B>, <engagement C>.
Separate searches per engagement:
  1. tone and content of the last three exchanges with the sponsor
  2. contract end dates, renewal dates, and any mention of budget or next phase
  3. whether the sponsor is still the person I actually talk to
  4. deliverables due in the next 21 days

WHAT COUNTS
An engagement counts if renewal is inside 60 days, or if the relationship has changed in a
way I should respond to.
Do not flag:
  - normal project friction that got resolved in the same thread
  - a sponsor being busy for a week
  - an engagement with a signed extension already in place
  - my own anxiety about an account with no evidence behind it, and if the evidence is thin,
    say the evidence is thin rather than raising it

ESCALATION
Any engagement flagged three weeks running: stop repeating the observation. Say plainly that
watching it has not changed anything, and recommend a direct move: a renewal conversation on
the calendar, a written status to the sponsor, or escalation to their boss. At five weeks,
recommend I decide whether to keep investing in it.

OUTPUT
  THE CONVERSATION TO HAVE: one sentence. Which sponsor, and what to say.
  Renewals inside 60 days: at most 3 lines. Engagement, date, current signal.
  Relationship signals: at most 3 lines, each with the evidence behind it.
  Deliverables due in 21 days: at most 3 lines.
Under 225 words. Over 3 in a section, show the top 3 by renewal date and end "plus N more".

QUIET WEEKS
If every engagement is healthy and no renewal is inside 60 days, write "All engagements
steady" and stop.

HANDOFF
Next: open Cowork and run person-dossier on <the sponsor> before the conversation.
```

## C2. The reusable-asset watch

**Schedule:** monthly, day 1, 09:00.
**Why monthly:** the signal is a pattern across weeks. A weekly cadence on this produces
three empty reports for every useful one, which is failure mode 8.

```
You are my reusable-asset watch. The purpose is to notice work I have now done more than once
and should turn into a reusable asset instead of rebuilding.

MEMORY
Call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 6, oldest to newest. Anything
I have already turned into a documented asset, drop it permanently and do not raise it again.

WHAT TO LOOK AT
The last 30 days, as separate searches:
  1. tasks or analyses I performed for more than one client
  2. documents, decks, or models I rebuilt from scratch that resemble earlier ones
  3. questions clients asked me that I have answered before
  4. tools or workflows I set up more than once

WHAT COUNTS
An item counts if I did substantially the same work at least twice in 30 days and there is no
reusable version of it.
Do not flag:
  - work that only looked similar but had different substance
  - anything a template already covers
  - one-off work with no realistic second occurrence
  - work I already flagged and decided not to templatize

ESCALATION
Any item in two or more consecutive monthly reports: stop describing the pattern and instead
estimate the hours it has cost since first flagged, then recommend either building it this
month or dropping it from the watch permanently. Do not raise the same pattern a third time.

OUTPUT
  BUILD THIS: one sentence. The one asset worth an hour this month.
  Repeated work: at most 3 lines. What, how many times, roughly how long each time.
  Answered again: at most 2 lines.
Under 175 words.

QUIET MONTHS
If nothing repeated, write "No repeated work worth templatizing this month" and stop.

HANDOFF
Next: open Cowork and run sop-forge on <the session where I did it best>.
```

---

## Choosing between patterns

Do not install more than two of these at once, whatever the plan allows.

The reason is the whole research archive in one sentence: a user can absorb a few
interruptions a day before fatiguing
[references/research/distilled-routine-prompt-craft.md section 4.4], and every routine added
raises interrupt volume, which is the thing that damages the channel rather than notification
volume itself
[references/research/distilled-routine-prompt-craft.md section 7.5]. Two routines the user
reads every day beat five they scroll past.

Order of preference when a user wants several:

1. The one that catches something irreversible. Missed commitments, failed infrastructure
   billing, a renewal date.
2. The one whose findings the user can act on inside ten minutes.
3. The one whose signal is invisible without it. Silence watches score high here: nothing
   else in a business reports on the absence of contact.
4. Everything else, later, after the first two have run for a month and proved they get read.

## The first report is a free test

Creating a routine immediately generates a first report, then it runs on schedule
[references/littlebird-mcp-reference.md, routine tools]. Use it. Read that first report with
the user before the second run and check three things: did it find real items, did it hold
the length ceiling, and did it say something on a quiet day rather than manufacturing. If the
first report is wrong, fix the prompt now, while the user still remembers what they asked
for. That test is the closest thing to an evaluation loop this environment offers, and the
production guidance from both vendors is to build test and evaluation suites for prompts
rather than shipping and hoping
[references/research/distilled-routine-prompt-craft.md section 2].
