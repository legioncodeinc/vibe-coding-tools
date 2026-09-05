# Session reconstruction

How to turn a window of Littlebird capture into an ordered, deduplicated, honest sequence
of what actually happened. This runs before any SOP prose is written. Get this wrong and
every downstream stage inherits the error.

Read `littlebird-mcp-reference.md` for tool parameters and return shapes. This guide is
about query design and post-processing, not about the API.

---

## The problem this stage solves

Littlebird returns items ordered by relevance, not by time
(`littlebird-mcp-reference.md`, "Results are relevance-ordered, not chronological"). Screen
capture of a single UI state produces many near-identical snapshots. A real work session
contains dead ends, tab-switching, and retries. None of that is usable as an SOP until it
has been sorted, deduplicated, and split into the path that worked and the path that did
not.

The published best practice for a first SOP draft is to observe the actual procedure being
performed and document all steps in order
[research/raw/sop--formats--psu-extension-writing-guide.md]. This stage is that
observation, run against a recording instead of a person.

---

## Step 1: fix the window before you search

Never start with an unbounded search. Ask the user for the window if it is not already
stated, and convert their phrasing into a concrete date range.

| User says | Window to use |
|---|---|
| "last Thursday" | That single date, 00:00:00 to 23:59:59 local |
| "yesterday afternoon" | That date, 12:00:00 to 18:00:00, widened if the sweep comes back thin |
| "when I built the X workflow" | Unknown. Run the artifact sweep in step 3 first to find the date, then come back |
| "this week" | Seven days, but sweep day by day rather than as one range |

An unbounded search dilutes relevance and risks the oversized-result file dump
(`littlebird-mcp-reference.md`, "Window by date, always").

---

## Step 2: establish session boundaries from the daily summaries

Run this first. It is the cheapest way to see the shape of the day and it tells you where
the real work window sits inside the calendar day.

```
search_user_context(
  search_queries: ["work session on <artifact or task>", "what was worked on"],
  standalone_query: "Establish the boundaries of the work session on <date>: when it
    started, what applications were involved, and when it ended.",
  date_range: {"start": "<date>", "end": "<date>"},
  filters: {"data_source": "summaries"}
)
```

The summaries source is Littlebird's own compressed digest of a day
(`littlebird-mcp-reference.md`, retrieval pattern 3). Read it for:

- The rough start and end of the session.
- The applications involved, which feed the `app` filter in step 3.
- Any named artifact, workflow, record, or client that gives you a topic query.
- Whether the session was continuous or split across the day.

If the summaries come back empty for that date, say so and check whether the date is right
before running the expensive sweeps.

---

## Step 3: three sweeps, run in parallel

Prefer several narrow parallel queries over one broad one
(`littlebird-mcp-reference.md`, retrieval pattern 1). Run all three of these.

### Sweep A: the app time-window sweep

The spine of the reconstruction. One call per application identified in step 2.

```
search_user_context(
  search_queries: [
    "<app> screen showing configuration settings",
    "<app> form fields and input values",
    "<app> navigation menu and page headers",
    "<app> save publish or confirm action",
    "<app> error message or validation warning"
  ],
  standalone_query: "Everything that was on screen in <app> during the work session on
    <date>, in enough detail to reconstruct which screens were visited and what was
    entered.",
  date_range: {"start": "<date> <session start>", "end": "<date> <session end>"},
  filters: {"app": "<app>", "data_source": "snapshots"}
)
```

Five narrow queries covering screens, fields, navigation, commits, and errors. The error
query is not optional: it is how you find the branches and the dead ends, and the branches
are half the value of the finished SOP.

If the window is longer than about two hours, split it into sub-windows and run the sweep
per sub-window. A single broad sweep across a long session will exceed the tool result
limit and get written to a file instead
(`littlebird-mcp-reference.md`, "Oversized results").

### Sweep B: the artifact topic sweep

Not windowed by app. Finds the same artifact wherever it appeared, including in a browser
tab, a screen share, a message, or a later reference.

```
search_user_context(
  search_queries: [
    "<artifact name>",
    "<artifact name> settings and configuration",
    "<artifact name> steps or actions"
  ],
  standalone_query: "Every appearance of <artifact name> in captured context, to
    confirm its exact name, its final configuration, and any later edits.",
  date_range: {"start": "<date minus 2 days>", "end": "<date plus 2 days>"}
)
```

Widen the range slightly past the session. Work gets revisited. A later snapshot of the
finished artifact is the single best source for the final configuration, and it confirms
whether what you reconstructed is what actually shipped.

### Sweep C: the prerequisites sweep

Prerequisites are a required SOP element, not a courtesy
[research/distilled-sop-craft.md section 2]. Find what was already open, logged in, and
configured before the work started.

```
search_user_context(
  search_queries: [
    "login screen or account selector",
    "settings integrations or connected accounts",
    "permissions role or access denied",
    "browser tabs open before the task"
  ],
  standalone_query: "What accounts, tools, permissions, and open windows were in place
    immediately before the work session on <date> started.",
  date_range: {"start": "<date> <session start minus 30 minutes>",
               "end": "<date> <session start plus 15 minutes>"},
  filters: {"data_source": "snapshots"}
)
```

The window deliberately starts before the session. Setup happens before the work.

### If the session was a screen share

Screen shares are captured. A Zoom screen share has been captured down to individual
workflow builder steps including trigger names, a custom code action, a GPT note step, and
a LinkedIn update action (`littlebird-mcp-reference.md`, "Step-level app UI capture").

Add a meeting lookup:

- Known meeting title: `LB_INTERNAL_LIST_MEETINGS` with `name`.
- Topic only: `LB_INTERNAL_SEARCH_MEETINGS` with `query`.

Using the wrong one is the most common retrieval mistake against this server
(`littlebird-mcp-reference.md`, retrieval pattern 6). If the session was narrated,
`LB_INTERNAL_GET_MEETING_TRANSCRIPT` gives you the spoken reasoning that the pixels do not
carry, which is the closest this skill gets to the expert's own explanation of why a step
exists.

---

## Step 4: sort by timestamp

Before writing anything. Retrieval is relevance-ordered
(`littlebird-mcp-reference.md`, known limitations table). Any deliverable presenting a
sequence sorts by timestamp first (`evidence-standards.md` rule 8).

Extract from every returned item:

- The collection timestamp from the `[Time collected | App]` prefix.
- The app.
- The relevance score from the table of contents line.
- The item body.

Sort ascending by timestamp. This is the raw timeline. It is not the SOP and it is not
deduplicated yet.

For messages, collection time and send time are different values and both matter
(`littlebird-mcp-reference.md`). Event time governs the timeline, collection time appears
in the receipt (`evidence-standards.md` rule 8).

---

## Step 5: deduplicate

Screen capture of a single UI state produces many near-identical snapshots. A naive pass
produces an SOP with the same step eleven times. OCR of dense UI produces fragments,
duplicate lines, and interleaved chrome, and repeated identical lines are one observation,
not many (`littlebird-mcp-reference.md`, known limitations table).

**Note on evidence.** The research archive contains no source on deduplicating
near-identical capture frames [research/distilled-sop-craft.md section 11, gap 2]. The
method below is an engineering decision made for this skill, not a documented industry
practice. It is stated as such.

Run `scripts/dedupe_snapshots.py` over the sorted timeline. It groups snapshots into
**UI states** using three signals:

1. **Text similarity.** Normalized token-set overlap between consecutive snapshot bodies.
   Above the threshold, same state.
2. **Time adjacency.** Snapshots within a short gap of each other are candidates for
   merging. A large gap forces a new state even when text is similar, because returning to
   the same screen later is a real, separate event.
3. **App continuity.** An app change always starts a new state.

The script emits one representative per state: the snapshot with the most extracted text,
because that one has the most field values in it. It also emits the state's first and last
timestamps and its member count.

**Read the output, do not trust it blindly.** Two states the script merged may be two
genuinely different steps on a screen that barely changed, for example the same form
before and after one field was filled. Where a merged state spans a long duration or a
large member count, open the members and check whether a value changed inside it.

**Never deduplicate away a state change that carries a value.** If two snapshots of the
same screen show different field contents, they are two states. The script's similarity
threshold is tuned to keep those apart, but verify on anything that matters.

---

## Step 6: split the happy path from the flailing

A real work session includes dead ends, retries, and tab-switching. The SOP documents the
path that worked. The traps get a separate, optional section.

**Note on evidence.** No archived source covers separating a successful path from failed
attempts inside a single observed session
[research/distilled-sop-craft.md section 11, gap 3]. This is a design decision, evidenced
only indirectly by the published practice of drafting from observation
[research/raw/sop--formats--psu-extension-writing-guide.md].

Classify each deduplicated state:

| Class | Signals | Goes in the SOP as |
|---|---|---|
| **On path** | Leads forward to the state that follows in the final configuration. Values it sets survive to the end. | A numbered step |
| **Abandoned** | A screen visited, then left, whose values do not appear in the final artifact. A settings page opened and closed. A tab switched to and back. | Omitted, or noted in Traps if it cost real time |
| **Retry** | The same screen reached twice with an error state between the visits. | One step, plus a decision point describing the error and the correction |
| **Error and recovery** | An explicit error message, validation warning, or failure toast, followed by a different action. | A decision point or branch |
| **Incidental** | Email, chat, notification, unrelated app. | Omitted entirely |

The test for **on path**: does the value or state set here still exist in the final
artifact as observed in sweep B? Sweep B exists to answer this question. If a field was set
and then changed later, the SOP documents the final value and may note the change as a
decision point.

The test for **trap worth reporting**: did the abandoned branch consume more than a few
minutes of wall clock time, or did it end in an error message? Timestamps answer the first
question. If neither, drop it. A trap section listing every stray tab is noise.

---

## Step 7: extract the specifics from each on-path state

For each state that will become a step, pull:

| Field | Where it comes from | If missing |
|---|---|---|
| Screen or page name | Page header, breadcrumb, tab title in the OCR | Gap marker |
| Control acted on | Button label, menu item, field label as literally captured | Gap marker |
| Value entered | The literal string in the field | Gap marker, or redaction placeholder |
| Result | The state visible in the next snapshot | Gap marker |
| Timestamp | The collection time of the representative snapshot | Never missing |

Use the **exact UI labels as captured**. The step text is only as good as the UI labels
captured [research/distilled-sop-craft.md section 7]. Do not paraphrase a button label into
what you think it means. If the capture reads "Add Action", the step says Add Action, not
"add a new action".

Where a label is fragmentary, that is a gap. See `gap-handling-and-confirmation.md`.

---

## Step 8: attribution check

Screen OCR captures what the user was VIEWING, not what they WROTE
(`littlebird-mcp-reference.md`, known limitations table;
`evidence-standards.md` rule 4).

For an SOP this matters in one specific way: **a screen share shows someone else's
computer**. If the session was a Zoom screen share, the person performing the steps may not
be the user. The SOP is still valid as a procedure. The attribution of who performed it is
not. State whose screen it was, or state that it is unknown.

Within the user's own capture, text in a compose box or a form field is probably theirs;
text in a feed or a read-only view is probably not (`evidence-standards.md` rule 4).

---

## Step 9: what the reconstruction hands off

A structure like this, held in working memory or a temp file, never shipped as-is
(`evidence-standards.md` rule 7):

```
Session: <date>, <start time> to <end time> local
Apps: <list>
Source: own screen | screen share by <name> | unknown
Boundary evidence: <summary receipts>

Prerequisites observed: [ordered list with receipts]
On-path states:      [ordered list, each with receipt, screen, control, value, result]
Decision points:     [errors and branches, each with receipt]
Traps:               [abandoned branches that cost time, each with receipt and duration]
Gaps:                [each with position in the sequence and what is unresolved]
Redaction queue:     [every candidate value flagged by the redaction pass]
```

Run `redaction-pass.md` on this structure **before** any prose is written. Then
`gap-handling-and-confirmation.md`. Then `sop-formats.md` to render it.

---

## Empty and thin retrieval

| Situation | Action |
|---|---|
| Summaries empty for the date | Report it. Ask the user to confirm the date. Do not sweep blindly. |
| Summaries present, app sweep empty | Report that the day is captured but the application is not. Name the apps that did appear. Stop. |
| Fewer than about 5 distinct on-path states after dedup | Too thin for an SOP. Report what was found as a fragment, name it as a fragment, and ask whether to widen the window. Do not pad it into a procedure. |
| Everything scores 3 | Anything scored 3 is a maybe, and a claim should not rest on a single 3-scored item without corroboration (`littlebird-mcp-reference.md`, retrieval pattern 5). Report low confidence across the board and confirm heavily. |

A failed or empty retrieval ends the run. Never fabricate to fill a gap
(`evidence-standards.md` rule 9).
