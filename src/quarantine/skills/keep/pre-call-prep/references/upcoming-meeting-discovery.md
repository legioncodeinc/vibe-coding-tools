# Upcoming meeting discovery

How this skill finds the calls it is about to brief. Read this before writing any brief.

## The mechanic

`LB_INTERNAL_LIST_MEETINGS` returns BOTH recorded meetings and unrecorded calendar
events. Give it a FUTURE `end_date` and it returns upcoming calendar events
[littlebird-mcp-reference.md]. Upcoming events are never recorded, so they
come back as bare calendar entries: title, time, attendees, sometimes a description, and
**no id, no summary, no transcript** [littlebird-mcp-reference.md].

That is not a limitation. A bare calendar entry with attendees is precisely the input a
brief needs. Everything else in the brief is retrieved from elsewhere using those
attendees and that title as keys.

This is also what makes the routine schedulable with no user input. The routine does not
need to be told which meetings exist. It asks.

## The discovery call

Evening-before routine mode, run the evening of day N for day N plus 1:

```
LB_INTERNAL_LIST_MEETINGS
  start_date: <tomorrow, YYYY-MM-DD>
  end_date:   <tomorrow, YYYY-MM-DD>
  limit:      50
```

Early-morning routine mode, run the morning of day N for day N:

```
LB_INTERNAL_LIST_MEETINGS
  start_date: <today, YYYY-MM-DD>
  end_date:   <today, YYYY-MM-DD>
  limit:      50
```

On-demand single meeting mode, when the user asks about the next call:

```
LB_INTERNAL_LIST_MEETINGS
  start_date: <today, YYYY-MM-DD>
  end_date:   <today plus 2 days, YYYY-MM-DD>
  limit:      25
```

Then pick the earliest entry whose start time is after the current time, or the entry the
user named.

Confirm the parameter names against the live tool schema before the first call. The
reference was verified on 2026-08-17 against a Pro account, and the contract still
requires listing available tools and using real names rather than assuming
[littlebird-mcp-reference.md].

## Reading what comes back

For each returned entry, record these fields before doing anything else:

| Field | Use |
|---|---|
| Title | Key for the recurring prior-instance lookup. See `history-retrieval.md`. |
| Start time and duration | Ordering, and the duration is a strong signal of meeting type. |
| Attendee list, emails and any display names | Key for attendee resolution. See `attendee-resolution.md`. |
| Attendee count | Selects the brief shape. See `brief-formats-by-meeting-type.md`. |
| Description or notes field | Often carries a booking form answer stating why the person booked. Treat this as high value. See below. |
| Presence of an id | If an id is present the entry is a RECORDED PAST meeting, not an upcoming event. Drop it from the upcoming set. |

**The id check is not optional.** `LIST_MEETINGS` mixes recorded and unrecorded entries
[littlebird-mcp-reference.md]. A boundary date or a timezone edge can pull a
past recorded meeting into the window. Anything with an id and a start time in the past
is history, not an upcoming call.

## The booking description is gold

When a meeting was booked through a scheduling link, the calendar description frequently
carries the booker's own answer to "what would you like to discuss". That answer is a
first person statement of intent from the other side, and for a first meeting it is
usually the single most useful line available.

Rules for it:

- Quote it verbatim in the brief. Do not paraphrase a stated intent.
- Mark it **Observed** with a receipt naming the calendar event and its date
  [evidence-standards.md].
- Do not extrapolate from it. "They wrote that they want to discuss X" is supportable.
  "They are looking to buy X" is not.
- If the description contains only conferencing boilerplate, a dial-in, or an agenda
  template, say the description carried nothing and move on.

## Classifying each meeting

Run this in order. First match wins.

1. **Attendee count above 7.** Large multi-attendee call. Decision effectiveness declines
   with each attendee past seven [research/distilled-call-preparation.md section 6], so
   this is not a decision forum and the brief is scoped to the user's own slice.
2. **Title matches a prior instance found by `LIST_MEETINGS` with `name`.** Recurring
   instance. The brief leads with the delta.
3. **Exactly one external attendee plus the user, 25 to 60 minutes, no prior record
   found.** First meeting.
4. **Prior record found for at least one attendee.** Continuing relationship.
5. **Everything else.** Unknown shape. Use the continuing relationship shape and say
   which parts came back empty.

Classification drives the brief shape. See `brief-formats-by-meeting-type.md`.

## Zero meetings

If the window returns no upcoming entries, the routine writes a one line report saying so
and stops. It does not search for something else to talk about. It does not summarize
yesterday. Exact text:

```
No calls on the calendar for <date>. Nothing to brief.
```

That is the whole report. A routine that manufactures content on an empty day trains the
user to stop reading it.

## Meetings the record knows nothing about

An upcoming event with an attendee who returns nothing from every retrieval path is a
legitimate and common case. The brief for it is short and honest:

```
### 2:00 PM  Intro call  (30 min)
**With:** jordan.reyes@northgate.io  (no internal record found)
**First meeting.** Nothing in the record for this address or this domain.
**Calendar says:** "<verbatim description, or: description was empty>"
**External:** <findings, or: no external research tool available this run>
**Not to forget:** You are going in cold. Open by asking what prompted the booking.
```

Do not pad it. Do not infer a role from an email domain and present it as fact. Do not
generate plausible talking points for a person the record has never seen. A brief that
says "the calendar says this and nothing else" is an honest brief and the contract
requires it [evidence-standards.md].

## Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Upcoming events missing entirely | `end_date` was not in the future | Set `end_date` to the target day, not to today |
| Past recorded meetings mixed into the brief set | Did not filter on the id check | Drop every entry that has an id and a past start time |
| Only some of the day's meetings appear | `limit` too low | Raise `limit`; a heavy day can exceed a small default |
| Recurring instance not linked to its history | Looked up by topic instead of by name | Use `LIST_MEETINGS` with `name`. See `history-retrieval.md`. |
| Same brief regenerated identically each week | Routine did not read its own past reports | See the routine wiring section in SKILL.md |
