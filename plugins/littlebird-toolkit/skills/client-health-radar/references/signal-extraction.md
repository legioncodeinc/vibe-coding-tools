# Signal extraction

The per-client retrieval procedure and the five signal families. Run this once per active client
on the roster. Do not run one broad sweep across all clients: broad queries return oversized
results that get dumped to a file, and narrow parallel queries score better and return more
diverse items (`references/littlebird-mcp-reference.md`).

## The window

| Mode | Window | Reason |
|---|---|---|
| Weekly routine | Last 7 days for new signal, plus whatever carry-forward the past reports name | The routine reports change, not standing state |
| Deep dive on one client | Last 90 days, extended to 180 on a first run for that client | A cadence baseline needs enough instances to be a baseline |
| First full roster run | Last 90 days per client | Long enough for a baseline, short enough to finish |

Always window. An unbounded search dilutes relevance (`references/littlebird-mcp-reference.md`).
Sweep month by month when building anything comprehensive.

## Retrieval brief, per client

Substitute the client's aliases and contacts from `client-roster.md`.

### 1. Recurring client calls, by name

Name lookup uses `LIST_MEETINGS`. Topic lookup uses `SEARCH_MEETINGS`. Using the wrong one is
the most common retrieval mistake against this server
(`references/littlebird-mcp-reference.md`).

```
LB_INTERNAL_LIST_MEETINGS
  name:       the recurring meeting title, one call per known title
  start_date: window start
  end_date:   today
  limit:      50
```

Run this once per recurring title associated with the client. The result gives the instance
series, which is what a cadence baseline is computed from. Split the result into recorded
meetings, which carry an id, and unrecorded calendar events, which do not, are not searchable,
and count as a coverage gap.

Run it once more with `end_date` in the future to pick up scheduled upcoming instances. Upcoming
events are never recorded and carry no id or summary
(`references/littlebird-mcp-reference.md`), but their presence or absence answers a real
question: is the next one on the calendar at all.

### 2. Topic searches across the client's meetings

Run these as separate narrow calls, not one combined query.

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      one of the topic queries below
  attendees:  the client's contact names
  start_date: window start
  end_date:   today
  limit:      10
```

Topic queries to run per client, one call each:

| Query theme | What it is hunting |
|---|---|
| client name plus "scope" or "additional" or "also need" | Scope creep asks |
| client name plus "invoice" or "payment" or "billing" | Commercial signals |
| client name plus "renewal" or "contract" or "next phase" | Renewal proximity and postponement |
| client name plus "budget" or "cut" or "pause" or "reduce" | Downgrade discussion |
| client name plus "waiting on" or "blocked" or "still need" | Unmet promises, both directions |
| client name plus "procurement" or "legal" or "MSA" or "security review" | Process escalation |
| client name plus a competitor or in-house alternative | Comparison shopping |
| client name plus "access" or "export" or "handover" or "asset list" | Exit preparation |

The last two matter disproportionately. Requests for account access, exports or asset
inventories, and comparisons to internal alternatives or competitors, are both on the
practitioner warning list (`references/research/distilled-client-health.md`, section 4).

**On `attendees`.** It is an OR filter and best-effort over the top candidates only, so a
matching meeting can be missed entirely (`references/littlebird-mcp-reference.md`). If an
expected meeting does not appear, reword `query` rather than trusting the filter. Never use
`attendees` alone to prove someone attended.

### 3. Structured summary blocks, per recorded meeting

```
LB_INTERNAL_GET_MEETING
  meeting_id: each recorded id from steps 1 and 2
```

This returns the linked calendar event with its attendees, plus a structured summary containing
`## Executive Summary`, `## For You`, `## Topics Discussed`, `## Decisions`, `## Action Items`
with owner tags, and `## Risks / Open Questions`
(`references/littlebird-mcp-reference.md`).

This is the single most underused asset in the MCP surface and it is where most of this skill's
evidence comes from. Build on it rather than re-deriving from transcript.

Take from each meeting:

- The attendee list from the linked calendar event. This drives the room-composition signal.
- Every `## Action Items` line with its owner tag. This is the promise ledger, both directions.
- Every `## Risks / Open Questions` line. These are the client's stated concerns, already
  extracted, already worded by the summarizer rather than by a sentiment model.
- Every `## Decisions` line with its decider tag.
- The `## For You` section, which is what the user specifically is expected to do.

### 4. Transcript, only where a quote is required

```
LB_INTERNAL_GET_MEETING_TRANSCRIPT
  meeting_id: the specific meeting containing the moment
```

Pull a transcript only when the report needs the exact wording of a specific moment: the line
where the out-of-scope ask happened, or the sentence the user should read for themselves.
Transcripts can be very long (`references/littlebird-mcp-reference.md`).

**The attribution rule.** Raw transcript chunks are weakly diarized and frequently tagged
`[Others]` rather than by name (`references/littlebird-mcp-reference.md`). Quote transcript for
WORDING only, never to prove who said it. Attribution comes from the summary's Action Items and
Decisions blocks, which carry owner tags. If the report needs to say who said something and only
the transcript has it, write "a client-side participant said" and label it Low confidence
(`references/evidence-standards.md`, rule 3).

### 5. Message threads

```
search_user_context
  search_queries_messages: [client name plus a contact name,
                            project codename plus "update",
                            contact name plus "waiting"]
  standalone_query:        a one sentence statement of what a thread with this client
                           in this window would contain
  date_range:              {start: window start, end: "now"}
  filters:                 {data_source: "messages"}
```

Message items carry per-message send timestamps that are DIFFERENT from the collection time
(`references/littlebird-mcp-reference.md`). The send time governs the timeline; the collection
time appears in the receipt (`references/evidence-standards.md`, rule 8).

Only a message tagged `(From:[user])` is the user's own
(`references/evidence-standards.md`, rule 4). Everything else is somebody else's words, and
response latency in either direction depends on getting that right.

### 6. Screen snapshots, for dashboards and invoices

```
search_user_context
  search_queries: [client dashboard identity plus the tool name,
                   client name plus "invoice",
                   client name plus "overdue" or "past due"]
  date_range:     {start: window start, end: "now"}
  filters:        {data_source: "snapshots"}
```

Billing notices, failed charge alerts, balance warnings and named vendor amounts appear in
ordinary capture without any finance integration
(`references/littlebird-mcp-reference.md`). This is how the commercial signal family gets
evidence.

OCR of dense UI produces fragments, duplicate lines and interleaved chrome. Deduplicate before
counting anything, and treat repeated identical lines as one observation
(`references/littlebird-mcp-reference.md`).

### 7. Daily activity summaries, the cheap pass

```
search_user_context
  search_queries: [client name, project codename]
  date_range:     {start: window start, end: "now"}
  filters:        {data_source: "summaries"}
```

The summaries source is the cheapest way to get a compressed view of a day
(`references/littlebird-mcp-reference.md`). Use it to fill gaps in the timeline between meetings.

### 8. Prove absence deliberately

```
search_user_context
  search_queries: [client name, contact names, project codename]
  date_range:     {start: the suspected quiet period, end: "now"}
```

A negative answer is a real finding and it is how the silence gap gets its receipt. Report the
window and the queries alongside it. "No evidence of contact in the last 24 days" and "there was
no contact" are different claims and only the first is supportable
(`references/evidence-standards.md`, rule 2).

## Read the scores

Retrieval returns a table of contents scored 0 to 5 by a small digest model, and items scoring
below 3 are omitted entirely (`references/littlebird-mcp-reference.md`). Anything scored 3 is a
maybe. Never build a client-level finding on a single 3-scored item without corroboration
(`references/evidence-standards.md`, rule 3).

Results are relevance-ordered, not chronological. Sort by timestamp before presenting any
trajectory (`references/evidence-standards.md`, rule 8).

---

# The five signal families

Each family produces items with a receipt, a date, and a confidence rating. None of them
produces a number on its own. Assembly into bands happens in
`references/scoring-and-reporting.md`.

## Family 1: unmet promises, both directions

The strongest signal a service business has, and the cheapest to extract, because the summaries
already did the work.

Build two columns from the `## Action Items` blocks across the window, using the owner tag on
each line, never a guess from transcript:

| Column | Contents |
|---|---|
| **The user owes the client** | Items tagged with the user, plus everything in `## For You` |
| **The client owes the user** | Items tagged with a client-side named person |

Items tagged `Unassigned` go in a third short list and are never assigned by inference.

For each open item record: the verbatim text, the meeting name, the meeting date, the age from
the date it was FIRST committed rather than last restated, and how many times it has been
restated across meeting instances. Restatement count is a signal in itself: a promise restated
three times and still open is a different item from a fresh one.

**What the client owes the user is the higher-signal column** and it is the one users under-watch,
because chasing feels impolite. The specific items that matter most, all on the practitioner
warning list (`references/research/distilled-client-health.md`, section 4): assets, approvals,
access, and payment. "Client delays feedback, approvals, or payment" is a named warning sign.

Before recording an item as closed, look for the artifact it would have produced, not for the
commitment text again. Absence of evidence is not evidence of absence: write "no evidence it was
delivered", never "it was not delivered"
(`references/evidence-standards.md`, rule 2).

## Family 2: silence gaps, measured against a derived baseline

The health-score literature's transferable instruction is to compare a client to their own
baseline, not to a fixed threshold, and its worked example is explicitly relative: "declining
login frequency relative to a customer's own baseline"
(`references/research/distilled-client-health.md`, section 2). The cadence literature says the
same thing from the other direction: "not every customer requires the same cadence or depth of
engagement" (`references/research/distilled-client-health.md`, section 7).

**Deriving the baseline.**

1. Assemble every substantive contact for this client in the window, sorted by event time:
   recorded meetings, message threads with actual back-and-forth, and dated deliverable
   evidence. Sort by timestamp, not by relevance
   (`references/evidence-standards.md`, rule 8).
2. Compute the gap in days between consecutive contacts.
3. The baseline is the median gap. Use the median, not the mean, because one holiday shutdown
   drags a mean and leaves a median alone.
4. Record the number of intervals the median was computed from. This is the baseline's
   reliability and it goes in the report.

**Reading the gap.**

| Condition | Reading |
|---|---|
| Fewer than 4 intervals available | Baseline is not derivable. Say so. Do not substitute a published cadence and call it a baseline |
| Current gap at or below baseline | Normal. Not reported |
| Current gap above baseline but below twice baseline | Watch. Reported in the client's own section only |
| Current gap at or above twice baseline | Flag. Reported in the ranked list |
| Current gap at or above three times baseline, or a recurring call skipped twice consecutively | Escalate |

Two important qualifications.

**Substantive is doing work in that definition.** A one-line acknowledgement is not contact. A
calendar invite is not contact. Count a contact only where there is content: a recorded meeting,
or a thread exchange with a real question or answer in it. State the definition used in the
report so the number is checkable.

**A missing capture is not a missing conversation.** Littlebird records what it recorded.
Unrecorded calendar events appear with no id and no summary
(`references/littlebird-mcp-reference.md`), and a phone call in a car is invisible entirely.
Present every silence gap as "no captured substantive contact in N days" with the queries run,
and offer the user the option to mark it as a false positive. Every false positive the user
marks goes in the roster file so the next run does not repeat it.

**When there is no derivable baseline.** Fall back to the published default shape only as a
labeled fallback, never as a finding: proactive updates roughly every two weeks, a full reporting
session monthly, a milestone review quarterly
(`references/research/distilled-client-health.md`, section 7). Label it "published default,
not this client's baseline" every time it is used.

## Family 3: room composition and register change

Two of the practitioner warning signs are about who is in the room and how they talk, and both
are retrievable (`references/research/distilled-client-health.md`, section 4): "Fewer or more
stakeholders suddenly attend calls" and "A new executive joins and schedules a partner review".

**Room composition.** Take the attendee list from the calendar event returned by
`LB_INTERNAL_GET_MEETING`, never from the transcript. Track across the instance series of a
recurring meeting:

| Change | Reading |
|---|---|
| A regular attendee stops appearing across two or more consecutive instances | Flag. Name who, and from which date |
| A new name appears who has not appeared before | Flag. Name them, and quote what they came to discuss from `## Topics Discussed` |
| Headcount on the client side drops | Flag as reduced engagement |
| A more senior name appears, especially alongside a title change in the meeting name | Flag. Escalation or review |

The senior-attendance reading rests on combining a warning-sign list with an unlinked McKinsey
figure on executive engagement and renewal
(`references/research/distilled-client-health.md`, section 7). That is an inference across two
sources, one unverified. Rate it Medium at best and always show the attendee change itself
rather than the interpretation.

**Register change.** "Email tone becomes shorter, more formal, approval-heavy" is on the warning
list (`references/research/distilled-client-health.md`, section 4). This is a change in how
somebody writes, not a polarity, which is exactly why it survives when sentiment scoring does
not. Observe it as concrete, countable, quotable properties across time:

- Message length in the thread, earliest third of the window vs latest third
- Presence or absence of greetings, sign-offs and first names
- Ratio of questions asked to statements made
- Whether the client is asking strategic questions or only about deliverables, which is itself a
  named warning sign (`references/research/distilled-client-health.md`, section 4)
- Whether the user or the client initiates

Report each as a pair of dated quotes, one early and one late, side by side. Never as a tone
score. The reasoning is in `references/sentiment-limits.md`.

## Family 4: scope creep

Full procedure in `references/scope-creep-detection.md`. It is a family of its own because it
needs its own quoting discipline and its own accumulation arithmetic.

## Family 5: commercial and payment signals

Captured wherever the evidence exists, reported as unknown where it does not. Never inferred.

| Signal | Where it comes from | Notes |
|---|---|---|
| Late or unpaid invoice | Snapshot capture of billing UI, or an invoice-chasing thread | Billing notices and failed charge alerts appear in ordinary capture (`references/littlebird-mcp-reference.md`) |
| Downgrade or budget-reduction discussion | `SEARCH_MEETINGS` on budget and pause language | Quote the line. Do not summarize a budget conversation |
| Renewal or contract checkpoint approaching | The roster's `next commercial checkpoint`, plus any meeting where renewal was discussed | Compute days remaining. This is arithmetic, not inference |
| Renewal conversation postponed | A renewal meeting rescheduled or removed, visible via `LIST_MEETINGS` with `name` | On the practitioner warning list (`references/research/distilled-client-health.md`, section 4) |
| Procurement, legal, or security review entering | Attendee names and titles, plus topic search | Can be routine renewal process or can be exit process. Say which readings are possible, do not pick one |
| Access, export or asset-inventory requests | Explicit ask in transcript or thread | Among the strongest single signals on the practitioner list |

An invoice amount, a calendar invite, or a transcript quote is an unambiguous primary
observation and rates High (`references/evidence-standards.md`, rule 3). An OCR fragment of a
billing dashboard rates Low. Never let a Low-rated commercial claim drive an irreversible action
such as sending a chase message.

## Empty retrieval per client

If every query for a client returns nothing across the window, that is a legitimate and
important result, not a failure. Report: the client, the window, the queries run, the aliases
used, and the conclusion that no captured contact exists in the window. That is itself the
largest possible silence gap and it goes at the top of the ranked list with the caveat that
missing capture and missing contact are different things.

Do not widen the window silently. Do not substitute plausible examples. Do not reason from what
was probably discussed (`references/evidence-standards.md`, rule 9).
