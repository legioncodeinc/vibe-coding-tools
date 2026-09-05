---
name: who-am-i-ghosting
description: 'Finds the conversations you left hanging. Trigger on "who am I ghosting",
  "who am I leaving hanging", "what have I not replied to", "unanswered messages",
  "did I forget to reply to anyone", "cold threads", "who is waiting on me", "unreplied
  DMs", "weekly ghosting check". Sweeps Littlebird message capture and inbox snapshots
  for threads where you are the party who owes a response, ranks them on how directly
  the person addressed you, how much the relationship is worth, and what they were
  waiting for rather than on days elapsed, drafts a re-engagement line for each, and
  separates out the ones where the ball is actually in their court and the ones you
  should consciously write off.'
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Who Am I Ghosting

## Purpose

Surface the threads, DMs and emails the user has left hanging across everything Littlebird
sees, ranked by how much the silence actually costs, with a drafted re-engagement line for
each. Separate out the ones where the user is the one waiting, and give explicit permission
to drop the ones that are genuinely dead.

Three things make this different from sorting unread messages by date.

1. **The ranking model.** Days cold alone produces a list topped by newsletters, cold
   outbound and a recruiter from March. This skill ranks on directness of address,
   relationship weight inferred from interaction history, and what the person was actually
   waiting for. Days cold sets the treatment, not the rank. Full model in
   `references/importance-ranking.md`.
2. **Precision over completeness.** Four hard gates run before anything is scored, and
   anything that fails is dropped rather than downgraded. The output is capped at seven
   items. **A short high-confidence list beats a long complete one**, and the reason is in
   the next section.
3. **Three lists, not one.** What the user owes, what the user is owed, and what should be
   written off. Half of what feels like ghosting is the reverse, and conflating the two
   produces false guilt and messages sent to people who owe the user.

### Why precision is the whole design

This skill's failure mode is a list of false positives that trains the user to ignore it.
Observed in production: a general safety-net routine flagged the identical blocked contact
for 16 consecutive days without ever changing its approach, and the user never acted on it
once.

The base rates make over-flagging the default outcome of a naive design. 92.30 percent of
enterprise emails never receive a reply, roughly half of all traffic goes to more than one
recipient besides the sender, and people reply to about a third of their inbox at low load
and under 5 percent of it near 100 messages a day
(`references/research/distilled-responsiveness-and-reengagement.md`, section 1). Non-reply
is the ordinary operation of the medium. The debt has to be proven item by item.

Not distinct from this skill by accident: `commitment-tracker` tracks promises made in
meetings. This skill tracks unanswered conversations, including ones where nothing was ever
promised. A person who asked a question three weeks ago and got silence is this skill's
subject even though no commitment exists.

## Capability gate

This skill requires the Littlebird MCP on a Power or Pro plan.

Before anything else:

1. **List the tools actually available in this session** and use the real tool names. Do not
   assume a tool exists because it is named in `references/littlebird-mcp-reference.md`.
2. If no Littlebird MCP tools are present, stop and tell the user the skill needs the
   Littlebird MCP connected. Do not attempt a partial run from memory or from other sources.
3. **Check the same tool list for a mail connector.** Gmail, Outlook, or any other mail MCP
   server. These are separate connectors, not Littlebird, and they may or may not be
   present. If one is present it materially improves this skill and the process below says
   where to use it. If none is present, degrade gracefully and say so in the coverage
   section. Never assume a specific connector exists.
4. Check whether a personal voice skill is installed. Drafts go through it if so.
5. If routine creation is part of the request, call `LB_INTERNAL_GET_SUBSCRIPTION_STATUS`
   first to confirm the plan supports another routine.

Read `references/evidence-standards.md` before writing any output. Every line is observed,
inferred, external, or unknown, and the kind is visible to the reader.

## Littlebird MCP calls used

| Tool | Used for |
|---|---|
| `search_user_context` | The main sweep. `data_source: messages` for thread traffic, `data_source: snapshots` for inbox and notification screens, `data_source: summaries` for a cheap compressed day view. Also the per-person enrichment queries behind the relationship axis. |
| `LB_INTERNAL_LIST_MEETINGS` | Recurring meetings with a candidate person, which is the strongest evidence for relationship weight. Name lookup uses this tool. |
| `LB_INTERNAL_SEARCH_MEETINGS` | Whether an unanswered question was already answered in a meeting. Topic lookup uses this tool. Using the wrong one of these two is the most common mistake against this server. |
| `LB_INTERNAL_GET_MEETING` | Confirming a person actually attended, because the `attendees` filter is OR and best-effort and cannot prove attendance. |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Read first on every run. Supplies the carry-forward list, the per-item flag counts that drive escalation, and everything the user already wrote off. |
| `LB_INTERNAL_CREATE_ROUTINE` | Offering to stand up the weekly routine. Works from an interactive session. Blocked only from inside a running routine. |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` and `LB_INTERNAL_UPDATE_ROUTINE` | Editing an existing routine. `UPDATE` replaces the whole prompt and the whole schedule, so always `GET` first. |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Confirming the plan supports another routine before creating one. |

There is no Littlebird tool that searches past Littlebird chat conversations. Where a
conversation history is needed, `search_user_context` is the tool.

## Trigger

Ask for it: "who am I ghosting", "who am I leaving hanging", "what have I not replied to",
"did I forget to get back to anyone", "unanswered messages", "who is waiting on me", "cold
threads", "unreplied DMs".

Scheduled: the weekly routine below.

## Routine cadence

Weekly. Default Monday 07:30 local. A daily version of this skill is wrong: the Live band
starts at 4 days cold, so a daily run would surface the same items with a one day age
change and be ignored inside a fortnight.

The routine observes and reports. The deep run in Cowork does the enrichment, the drafting,
and the approval gates. A routine cannot hold an approval gate open and cannot create or
update routines (`references/littlebird-mcp-reference.md`).

## Process

### 1. Read your own history first

`LB_INTERNAL_GET_ROUTINE_REPORTS` on this skill's routine, `limit` 5. Build three lists
before retrieving anything:

- Items already reported, with how many consecutive reports each has appeared in.
- Items the user marked held, closed, or written off. **These never come back.**
- Named relationship overrides the user set in a previous run.

Skipping this step is what produced the 16 day repeat described above.

### 2. Fix the window

Default 45 days. Range 30 to 60. First run on a new account may use 60. Do not widen past
60 silently, and if a wider window is used, say so in the coverage section.

### 3. Sweep

Run the retrieval brief below. Several narrow queries in parallel, never one broad one: a
broad query returns 70,000 plus characters and gets dumped to a file
(`references/littlebird-mcp-reference.md`).

If a mail connector is present, enumerate actual unreplied threads through it and use that
as the spine, with Littlebird capture enriching it. If none is present, the capture sweep is
the spine and the coverage section says the list is a floor rather than a census.

### 4. Gate

`references/owed-response-detection.md`, in full, in order. Four gates: participation,
human and replyable, the user is the party who owes, still actionable. Plus a natural close
check.

Anything failing any gate is dropped and counted in the suppression tally by reason, with no
names and no content.

### 5. Detect natural closes

`references/natural-close-detection.md`. Six close patterns, three verdicts, and a default
of `AMBIGUOUS` rather than `OPEN` when the evidence is thin. Scheduled forwards whose resume
date is coming up get their own short Upcoming section rather than being suppressed.

### 6. Enrich, then score

Run the per-person enrichment queries over a 12 month window for every surviving candidate,
capped at 12 people. Scoring relationship weight from the thread alone systematically
underrates long relationships whose recent traffic is thin, which is the exact case this
skill exists to catch.

Then score with `references/importance-ranking.md`. Three axes, 0 to 3 each. Surface at 7
and above, fill to the cap from 5 and 6, drop 4 and below. Days cold picks the staleness
band, which picks the message form.

### 7. Draft

`references/re-engagement-drafting.md`. Three-part shape, one question, one to one, capped
by length, no apology opener, through a voice skill if one is installed.

### 8. Split into three lists and write

Owed, ball in their court, write off. Plus Upcoming, ambiguous, and the suppression tally.

### 9. Hold every draft at the approval gate

Nothing is sent. `AskUserQuestion` per item: send as written, edit first, hold, or close and
write off. Record every write-off.

## Retrieval brief

The actual calls. Substitute the window.

### Direct questions put to the user

```
search_user_context
  search_queries_messages: ["direct question addressed to me waiting for an answer",
                            "what do you think about", "can you confirm whether"]
  standalone_query:        "messages where someone asked me a specific question and
                            I have not answered"
  date_range:              {start: window start, end: "now"}
  filters:                 {data_source: "messages"}
```

### Requests and asks

```
search_user_context
  search_queries_messages: ["asked me to send something", "could you take a look at this",
                            "would you be able to", "please let me know", "I need from you"]
  standalone_query:        "messages containing a request or action item directed at me"
  date_range:              {start: window start, end: "now"}
  filters:                 {data_source: "messages"}
```

### Waiting language

```
search_user_context
  search_queries_messages: ["still waiting to hear back", "any update on this",
                            "haven't heard from you", "blocked until you confirm",
                            "waiting on your answer"]
  standalone_query:        "messages where someone says they are waiting on me"
  date_range:              {start: window start, end: "now"}
  filters:                 {data_source: "messages"}
```

### Follow-up chasing

The highest-value query in the brief. A second attempt is the most reliable evidence that
the other party still wants the answer, and it moves the stake axis to 3 on its own.

```
search_user_context
  search_queries_messages: ["bumping this up", "following up on my last message",
                            "did you get a chance to look", "circling back on this",
                            "gentle reminder", "just checking in on"]
  standalone_query:        "messages where someone is chasing me for a second time"
  date_range:              {start: window start, end: "now"}
  filters:                 {data_source: "messages"}
```

### Unread state from screens

Deferral is enacted through flagging and marking unread, and both are visible on screen
(`references/research/distilled-responsiveness-and-reengagement.md`, section 4). This is why
snapshots are swept and not only threads.

```
search_user_context
  search_queries: ["inbox showing unread messages", "unread notification badge count",
                   "message thread list with unread previews", "flagged or starred email",
                   "chat sidebar with unread conversations"]
  date_range:     {start: window start, end: "now"}
  filters:        {data_source: "snapshots"}
```

Repeat with `filters: {app: "gmail"}`, then `{app: "slack"}`, then the other messaging apps
the user actually runs, one call each. Using `filters.app` this way also proves absence,
which is a real finding.

### Compressed day view

```
search_user_context
  search_queries: ["messages I did not reply to", "conversations left open"]
  date_range:     {start: window start, end: "now"}
  filters:        {data_source: "summaries"}
```

### Per-person enrichment, for the relationship axis

One call per candidate person, capped at 12 people, run only after the candidate list
exists.

```
search_user_context
  search_queries:          [person full name, person name plus their company]
  search_queries_messages: [person full name]
  standalone_query:        "everything establishing my working relationship with this
                            person, how often we interact and in what capacity"
  date_range:              {start: 12 months ago, end: "now"}
```

Then, for the same person:

```
LB_INTERNAL_LIST_MEETINGS
  start_date: 12 months ago
  end_date:   today
  limit:      50
```

and scan the returned titles for recurring meetings involving them. Recurring meetings
together are the strongest single signal for relationship weight.

Where a question may already have been answered in a meeting:

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      the subject of the unanswered question, stated as a noun
  start_date: the day the question was asked
  end_date:   today
  limit:      10
```

Do not add `attendees`. That filter is OR and best-effort and can miss a matching meeting
entirely. Reword `query` instead, then confirm attendance with `LB_INTERNAL_GET_MEETING`.

Read the relevance scores on everything. Items scoring 3 are maybes and never close a
thread or establish a relationship on their own.

## Known limitations, stated honestly in every report

These belong in the coverage section of the artifact, not buried here.

| Limitation | Consequence |
|---|---|
| Capture shows message threads as they appeared on screen | **A thread the user never opened may be entirely invisible to this skill.** The list is a floor, not a census. This is the single most important caveat and it goes in the output verbatim. |
| Unread state read from an inbox screenshot is a point-in-time observation | It is not a live mailbox query. A message shown unread at 09:14 may have been read at 09:15. Never present an unread count as current. |
| Collection time and send time are different values | Days cold is computed from the **send** timestamp of the other party's last message. Using collection time understates the age of an old thread recaptured recently. |
| Thread lists in capture are collapsed previews | The full last message may never have been captured. A preview is not the message. |
| OCR of dense UI produces fragments and duplicates | Deduplicate before counting anything. Repeated identical lines are one observation. |
| A reply may have been sent through a channel Littlebird never saw | Phone, in person, another device. Every item is provisional. Confirm before encoding. |
| Retrieval returns relevance order, not chronological | Sort by timestamp before presenting anything as a sequence. |

## Output

A deep run writes one file:

```
ghosting-review-YYYY-MM-DD.md
```

in the working directory, or the directory the user names. Sections in this order.

**1. Coverage and confidence.** Window swept, queries run, whether a mail connector was
available and which, apps covered, and the capture limitations above stated plainly.

**2. You owe them.** Maximum 7, sorted by score descending. Each item carries:

| Field | Content |
|---|---|
| Person | Name |
| Channel | The app and thread |
| Last contact | Date of their last message, from the send timestamp |
| Days cold | Integer, plus the staleness band |
| What they said | Short quote with a receipt in the canonical format, both collection and send times |
| Why they matter | The relationship inference, the observations it rests on, and a confidence rating |
| Score | A, B and C broken out with a one-line reason each, and the total |
| Draft | The full re-engagement text, verbatim, held for approval |

**3. Ball in their court.** Maximum 7. Person, channel, what the user sent and when, days
since, whether a nudge is warranted, and a drafted nudge where it is. No apologies in this
section.

**4. Write off.** Each with a one-line permission statement telling the user it is closed
and nothing is owed. Where the relationship axis scored 2 or 3, add the line that writing
off the thread is not writing off the person.

**5. Upcoming.** Scheduled forwards whose agreed resume date falls in the next 14 days,
with the date. Calendar items in disguise.

**6. Ambiguous.** Maximum 3. Items where the natural close check could not decide.
Presented as "worth a look, I could not tell". Never drafted for.

**7. Suppressed.** Counts and reasons only. No names, no subjects, no content. A run that
suppressed 79 items and surfaced 5 did its job, and this line is what proves it.

**8. Method note.** The thresholds and overrides applied on this run, so the user can
change them.

Raw retrieved capture is working data and does not ship in the artifact
(`references/evidence-standards.md`, rule 7).

## Empty retrieval

If the message sweep returns nothing for the window, report the window, the queries run, and
the apps covered, and stop.

If items are retrieved but every one fails a gate, that is a legitimate and good result.
Report the suppression tally with its reasons and say the user is not ghosting anyone this
week. Do not lower a gate to produce a list.

Do not widen the window silently. Do not substitute plausible examples. Do not reason from
what was probably in an inbox that was never captured
(`references/evidence-standards.md`, rule 9).

## Guardrail

**Never surface the contents of conversations the user is not a participant in.** Littlebird
captures whatever pixels were on screen, and that includes other people's inboxes during a
screen share, a colleague's Slack seen in passing, a support queue, a demo account. Those
threads look identical to the user's own in retrieval. The participation test in
`references/owed-response-detection.md` gate 0 is absolute: excluded entirely, not counted
with identifying detail, not mentioned by subject or by person. This is the hard exclusion
in this skill and it is a privacy rule, not a relevance rule.

**The false-positive tax.** Every wrong item costs more than it appears to. It costs the
seconds to dismiss, it costs confidence in the items around it, and once the user has
dismissed the same wrong item three weeks running they stop opening the report. The cap of
seven, the gates that drop rather than downgrade, and the escalation rule that forbids a
fourth identical bullet all exist to pay that tax down. Do not relax any of them because a
particular week looked heavy.

**False guilt is a real harm.** The ball-in-their-court split is not a nicety. Receivers
systematically overestimate how quickly senders expected a response, across eight
pre-registered studies with 4,004 participants
(`references/research/distilled-responsiveness-and-reengagement.md`, section 6). A skill
that presents everything unanswered as the user's debt manufactures anxiety and sends
apologetic messages to people who owe the user. Keep the lists separate and never write copy
that inflates the stake.

**Do not tell the user how someone feels.** Never write "they are probably annoyed" or "this
has damaged the relationship" as an inference from silence alone. Silence had a measured
cost only where the waiting party had a live stake, and none at all where they did not
(same file, section 5).

## Routine wiring

Offer to create the weekly routine. Show the user the exact prompt text and schedule below,
get approval through `AskUserQuestion`, then call `LB_INTERNAL_CREATE_ROUTINE`. Creating it
generates a first report immediately, then it runs on schedule. Do not tell the user to go
set it up by hand.

```
title:    Weekly ghosting check
schedule: {"frequency": "weekly", "time": "07:30", "week_days": ["MO"]}
notifications_enabled: true
email_notifications_enabled: true
```

Exact `prompt` text to pass:

```
You are running a weekly check for conversations the user has left unanswered.

STEP 1. MEMORY FIRST. Before retrieving anything, call
LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 5 and read every past
report. Build three lists. First, every item you have already reported, with the
number of consecutive reports it has appeared in. Second, every item the user
marked held, closed, or written off, which must never be reported again. Third,
any named people the user told you always matter or never matter. You need all
three in step 5. Do not skip this step. A report that repeats last week's list
unchanged is a failed report.

STEP 2. SWEEP. Call search_user_context several times with narrow queries rather
than once with a broad one, over the last 45 days, with filters data_source set
to messages. Run separate calls for direct questions addressed to the user, for
requests and asks, for waiting language such as still waiting to hear and any
update on this, and for follow-up chasing such as bumping this and did you get a
chance and circling back. Then run one more call with data_source set to
snapshots for inbox screens, unread badges and flagged messages. Read the
relevance scores. Anything scored 3 is a maybe.

STEP 3. GATE HARD. Drop an item completely if any of these is true. Do not keep
it at a lower priority, drop it.
  The user is not a participant in the conversation. Littlebird captures other
    people's screens, screen shares and inboxes seen in passing. If the user is
    not the sender of a message in the thread and is not an addressed recipient,
    the conversation does not exist for this report. Never describe it, never
    name the people in it.
  The sender is automated. No-reply addresses, newsletters, platform
    notifications, receipts, calendar system mail, bots and app integrations,
    marketing sequences, broadcast channels.
  The user is not the party who owes. A group thread of four or more where the
    user was not named does not count. Being in CC while someone else is in To
    never counts, whatever the message says. If another named participant already
    answered the question, it does not count.
  There is no ask. If the last message from the other party contains no question,
    no request, no proposal awaiting an answer and no stated dependency, it is not
    owed.
  The user spoke last. Those items go in a separate section, see step 6.

STEP 4. CHECK FOR A NATURAL CLOSE. A conversation that ended because it was
finished is not ghosting and must not be reported as one. Treat as closed: a last
message that is only thanks or an acknowledgment with no new ask; an explicit
resolution such as no longer needed or we went another way or never mind; an
informational message that expected nothing back; an agreement to pick it up at a
later date that has not arrived yet; a promise by the user to reply by a date that
has not arrived yet. Also check whether the question was answered somewhere else,
using LB_INTERNAL_SEARCH_MEETINGS with the subject of the question as the query
and a start_date after the message date. If you cannot tell, put the item in a
short section called Not sure, capped at three items, rather than reporting it as
ghosting.

STEP 5. RANK, AND DO NOT RANK BY DATE. Score each surviving item on three things,
zero to three each.
  Directness. Three for a one to one message with a direct question. Two for a
    group thread where the user was named and the ask attached to that mention.
    One for two or three recipients with an unassigned ask nobody has answered.
  Relationship. Three for a live client, active deal, current partner or someone
    the user meets recurringly. Two for an established counterpart with real
    history across more than one month. One for a single prior interaction. Zero
    for a stranger. Check LB_INTERNAL_LIST_MEETINGS over the last twelve months
    for recurring meetings with the person before you score this.
  Stake. Three if they are blocked, asked for a decision or a date, or have
    already chased once. Two for a substantive question or a document sent for
    review. One for a soft ask. A second chase moves this to three on its own.
Add the three. Report only items scoring seven or above. Report at most five
items. Sort by score, then by days cold. Show the three numbers and a one line
reason for each so the user can disagree with a number instead of the list.
Compute days cold from the send time of their last message, not from the time
Littlebird collected it. Those are different values.

STEP 6. THE BALL IS IN THEIR COURT. Separate section. Items where the user spoke
last, the user's message contained an ask, and the other party has not replied.
Maximum five. This section exists because about half of what feels like ghosting
is the reverse, and mixing the two produces guilt the user has not earned. Do not
apologize on the user's behalf anywhere in this section.

STEP 7. ESCALATE OR WRITE OFF. Apply this rule exactly.
  Reported once or twice before with no action: report it again, and change the
    suggested approach. If a reply in the thread was suggested before, suggest a
    different channel, or a shorter message, or a specific question with a date
    attached instead of an open one.
  Reported three or more times before with no action: do NOT write a fourth
    identical bullet. Either state a changed tactic explicitly, meaning a
    different channel and a different framing, or move the item to the write-off
    list. After three passes with no action from the user, write-off is the
    honest default.
  Ninety-one days cold or more and scoring six or below: write it off.
  The ask is moot because the deadline passed, the event happened or the role was
    filled: write it off.
  The user has already followed up twice with no reply: write it off.
Every write-off item gets one line telling the user plainly that nothing is owed
and they can stop carrying it. Where the relationship scored two or three, add
that writing off the thread is not writing off the person.

STEP 8. WRITE. Sections in this order. First, any item at three or more reports,
under a heading called CHANGED APPROACH or moved to write-off. Then You owe them,
maximum five, with the score breakdown and a short quote of what they said with
its date. Then Ball in their court, maximum five. Then Write off, with the
permission line. Then Not sure, maximum three. Then one line of coverage giving
the window swept and how many items were suppressed and why, as counts only with
no names.

RULES.
Never describe or name a conversation the user is not a participant in.
Quote what the other person said, do not paraphrase it.
Every item carries the channel and the date of their last message.
Do not open with a statistic about how many messages people fail to answer.
Do not tell the user that anyone is annoyed or that a relationship is damaged.
  You cannot observe that from silence.
Do not draft or send any message to anyone. Name the item and stop there.
If the sweep returns nothing, or everything fails a gate, say so and stop. Do not
widen the window, do not lower a gate, do not invent items. A week with nothing to
report is a correct report.
End with one line naming the deep run that resolves this: open Cowork and run
who-am-i-ghosting for the ranked list, per-person relationship enrichment and
drafted re-engagement lines.
```

Two properties of that prompt are load-bearing and must survive any edit. It reads its own
past reports before writing, and at three or more repeats it is forbidden from writing a
fourth identical bullet. A routine without both was observed in production flagging the
identical blocked contact for 16 consecutive days without ever changing its approach.

`UPDATE_ROUTINE` replaces the whole prompt and the whole schedule. Always call
`LB_INTERNAL_GET_ROUTINE_CONFIG` first (`references/littlebird-mcp-reference.md`).

### Handoff to Cowork

The routine ends by naming this skill. The deep run calls
`LB_INTERNAL_GET_ROUTINE_REPORTS` before sweeping, so it inherits the carry-forward list,
the per-item flag counts that drive escalation, and every item the user already closed.
Items the user wrote off are never resurfaced.

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

## Related skills

| Skill | Boundary |
|---|---|
| `commitment-tracker` | Tracks promises made in meetings, harvested from meeting summary Action Items. This skill tracks unanswered conversations, including ones where nothing was promised. Where a promise to reply by a date was made **in a meeting**, that item is `commitment-tracker`'s, because the meeting summary carries better attribution than a message thread. |
| `said-it-already` | Repetition across channels. Useful before drafting, to avoid re-asking something already asked. |
| `client-health-radar` | Account-level relationship health. This skill feeds it: a client in the owed list is a health signal. |
| `pre-call-prep` | Reads the same per-person history for a different purpose. |
| `routine-architect` | Auditing and tuning the user's whole routine set, including this one. |
| `littlebird-voice-creator`, `combined-voice-creator`, `facebook-voice-creator` | Build the personal voice skill the drafts should run through. Point the user here when no voice skill is installed. |

## Reference map

| File | Read it for |
|---|---|
| `references/owed-response-detection.md` | The four gates, the direct-address ladder, the CC rule, the ask test, the ball-in-their-court mirror, the cap and the suppression tally |
| `references/importance-ranking.md` | The three-axis model, thresholds, staleness bands, the write-off rules, how to show the arithmetic, tuning |
| `references/natural-close-detection.md` | The named function, the six close patterns, the three verdicts, what is not a close |
| `references/re-engagement-drafting.md` | The apology rule and its evidence, the ban list, the three-part shape, length caps, form by band, the approval gate |
| `references/littlebird-mcp-reference.md` | Tool names, parameters, return shapes, known limitations |
| `references/evidence-standards.md` | Receipts, the four kinds, confidence ratings, confirmation gates |
| `references/research/distilled-responsiveness-and-reengagement.md` | Every domain claim in this skill, cited to a raw source |
| `references/research/README.md` | The archive index, the three named gaps, the window note |
