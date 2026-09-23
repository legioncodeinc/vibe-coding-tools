# Solve detection

How to tell, from screen capture, that the user hit a wall and got past it.

**Status: this whole guide is a design decision, not researched practice.** The archive
contains no source on detecting a solve from observational data of any kind
[research/distilled-personal-knowledge-capture.md section 8]. The method below is derived
from how periodic screen capture behaves. Treat every threshold in it as a starting point
to be tuned against the user's actual capture, and never present a detection as certain
when it rests on the shape alone.

What the archive does support: the trigger has to be **defined in writing before the sweep
runs**, not judged case by case. "It is important to define postmortem criteria before an
incident occurs so that everyone knows when a postmortem is necessary"
[research/distilled-personal-knowledge-capture.md section 4]. This file is that written
definition.

---

## 1. The shape

A solved problem leaves a three-phase signature in capture.

| Phase | Name | What it looks like in snapshots |
|---|---|---|
| **A** | **Surface** | An error string appears. Terminal output, a red banner, a stack trace in the editor gutter, a 4xx or 5xx body in devtools, a failed CI run, a migration failure. |
| **B** | **Grind** | The same error or a close variant recurs across multiple snapshots while the surrounding context churns: search results pages, documentation, issue trackers, an assistant chat panel, config files being edited, repeated runs of the same command. |
| **C** | **Cessation and resumption** | The error string stops appearing, AND the original artifact reappears advancing. New output, a passing build, a served page, a commit, a moved-on task in the same project. |

**Both halves of C are required.** Cessation on its own is not a solve. It is the single
most important discrimination in this guide, because cessation alone is exactly what
abandonment looks like too.

### Minimum bar for a candidate

Do not propose an entry unless all of these hold:

- Phase A has at least one snapshot with legible error text, or a legible failure state.
- Phase B spans at least two distinct snapshots. A single-snapshot error that never recurs
  is noise, a transient, or something the user already knew how to fix.
- Phase C has at least one snapshot showing the original work advancing without the error.

Anything below the bar goes in the sweep report as a weak signal with its receipts, never
as a drafted entry.

---

## 2. Reading each phase from real capture

### Phase A: finding the surface

Error text in capture is OCR output from dense UI, so it arrives fragmented, duplicated,
and interleaved with chrome (`littlebird-mcp-reference.md`, known limitations).
Consequences:

- **Take the longest legible run of the error, not the whole snapshot.** The retrievable
  key is the message, not the traceback frames around it.
- **Expect character-level corruption.** `ECONNREFUSED` may arrive as `ECONNREFU5ED`. Do
  not silently repair it. Record what capture showed, and mark the repaired reading as an
  inference (`evidence-standards.md` rule 2). If the corruption makes the string unusable
  as a search key, that is a gap to raise with the user, not a blank to fill.
- **Deduplicate before counting.** Repeated identical lines are one observation
  (`littlebird-mcp-reference.md`, known limitations). An error that "appeared 40 times" may
  be one terminal scrollback captured 40 times.

Failure states without text also count as Phase A: a spinner that never resolves across
many snapshots, an empty result grid where results were expected, a deploy dashboard
sitting on a failed status. The Symptom for these is written as the observable, since
symptom descriptions should use "concrete, observable terms": what the reader sees, the
specific error message, or the missing result
[research/distilled-personal-knowledge-capture.md section 3].

### Phase B: reading the grind

Grind markers, in rough order of how strongly they indicate a real wall:

| Marker | Why it counts |
|---|---|
| A search engine results page whose query contains the error string | The user went looking. Highest-value marker; the query is often a better Symptom phrasing than the raw error, because it is literally how they searched. |
| Q and A or issue-tracker pages open | Same signal, one step further in. |
| Official documentation for the failing library or service | Reading rather than guessing. |
| An assistant chat panel with code in the reply | See the AI-assisted branch in section 4. |
| The same command re-run with small argument or config deltas between snapshots | Empirical iteration. Strong predictor that Root cause will end up unestablished. |
| A config, env, or lockfile open in an editor with changing content | Where the fix usually lands. |
| Version pins, changelogs, or release pages open | The user suspected a version problem. Feeds the Context field directly. |

**Capture the search queries verbatim where they are legible.** The Grind phase is where
the Symptom phrasing comes from. Developers most frequently search for explanations of
error messages [research/distilled-personal-knowledge-capture.md section 1], so the query
the user typed is the closest available proxy for the query they will type next time.

### Phase C: cessation and resumption

Cessation is easy and untrustworthy on its own. Establish it by absence: run a targeted
retrieval for the error string over the window **after** the last Phase B snapshot and get
nothing. Remember that "no evidence of X" and "X did not happen" are different claims and
only the first is supportable (`evidence-standards.md` rule 2).

Resumption is the load-bearing half. Accept any of:

- A success state in the same tool: build passed, tests green, server listening, deploy
  succeeded, the page rendering.
- A commit, push, or pull request whose message names the problem area, timestamped after
  Phase B.
- The original artifact back on screen and further along than it was at Phase A: more code,
  a next step, a different file in the same project.
- The user telling someone it worked, in a message thread or a meeting.

Sort everything by timestamp before you judge any of this. Retrieval is relevance-ordered,
not chronological (`littlebird-mcp-reference.md`, known limitations).

---

## 3. The four outcomes, and what each one produces

Every candidate resolves to exactly one of these. The classification goes in the sweep
report and is confirmed by the user before anything is written.

| Outcome | Signature | What gets filed |
|---|---|---|
| **Solved** | A, B, then both halves of C | A full entry. |
| **Abandoned** | A, B, cessation, no resumption. Or: resumption of a *different* task, the app closing, or a route-around visible in capture | An `open-walls.md` line. **Never a fix entry.** |
| **Solved by someone else** | The fix arrives from a person: a message thread, a meeting, a screen share, a pasted block whose provenance is another human | A full entry with `solved-by: other`. |
| **Solved by an assistant, not understood** | A short Phase B dominated by an assistant UI, a wholesale paste or applied diff, then C, with no evidence the user read documentation or explained the fix | A full entry with `solved-by: ai-assistant` and `understood: no`. See section 4. |

### Abandonment is filed differently, or not at all

An abandoned problem is not a fix. Writing it into the knowledge base as one is the exact
mechanism that produces a base full of entries that do not work, and unprocessed material
in a knowledge archive becomes a liability that accumulates faster than it can be engaged
[research/distilled-personal-knowledge-capture.md section 2].

Abandonment tells:

- Cessation with no advance on the original artifact.
- Capture shows a route-around: a different library installed, a feature commented out, a
  manual workaround performed, a step skipped.
- The user says so, in a thread or a meeting: some version of "I gave up on it", "we will
  do it the other way".
- Long gap, then the same error surfaces again later untouched.

File abandoned walls as one line each in `knowledge-base/open-walls.md`: date, symptom,
what was tried, receipt. No fix field, because there is no fix. These are still worth
having, because a wall hit three times and abandoned three times is a stronger argument for
spending a day on it properly than any single occurrence is.

**If it is ambiguous between solved and abandoned, it is abandoned.** The asymmetry is
deliberate: a missing entry costs one re-debug, a wrong entry costs a re-debug plus the
time spent trusting the wrong record.

### Solved by someone else

The procedure the person supplied is valid; the attribution of who derived it is not the
user. Screen capture shows what the user was **viewing**, not what they wrote
(`evidence-standards.md` rule 4), and a screen share shows someone else's machine entirely.

Rules:

- Name the person only where they are material, and apply the same evidence standards to
  them (`evidence-standards.md` rule 10).
- Where the fix came from a meeting, take attribution from the summary's Action Items and
  Decisions blocks, not from raw transcript, which is weakly diarized and frequently tagged
  as unattributed (`littlebird-mcp-reference.md`, known limitations).
- The entry still records the fix in full. The `solved-by` field records that the user did
  not derive it, which changes how much they should trust their own memory of why it works.

### The false solve

Watch for cessation caused by something other than a fix:

- A restart, a cache clear, a machine reboot, a service that came back on its own.
- A rebuild that happened to succeed once.
- The user switching to a different environment where the problem does not occur.

If Phase B contains no change to code, config, or dependencies and Phase C follows a
restart, the honest entry says so: the Root cause is unestablished and the Fix is "restart,
cause unknown, may recur". That is a real and useful entry. It is not a solved root cause,
and dressing it up as one is how a knowledge base starts lying.

---

## 4. The AI-assisted solve, which is the most valuable entry type

**Why it matters most.** 59% of developers report using AI-generated code they do not fully
understand, from a survey of 800 professionals fielded in June 2025
[research/distilled-personal-knowledge-capture.md section 6]. Separately, stated trust in
AI tools fell from 40% in 2023 to 29% in 2025 while adoption ran at 84%
[research/distilled-personal-knowledge-capture.md section 6]. Those two measure different
things, stated trust and reported behavior, and the gap between them is the finding; do not
merge them [research/distilled-personal-knowledge-capture.md section 6].

The consequence for capture is direct. A fix the user accepted without understanding is the
one they have no memory of, because no memory was formed. Every other entry type competes
with the user's recall. This one does not.

### Detecting it

The signature is a **compressed Phase B**:

- The dominant app or panel in Phase B is an assistant interface, not a browser search.
- Few or no documentation pages, few or no search result pages.
- A block of code or config appears in the assistant reply and then appears in the editor,
  largely unchanged, within a small number of snapshots.
- Phase C follows quickly.

Contrast with an understood solve, where Phase B carries documentation reading, multiple
sources, and edits that diverge from anything a single reply contained.

### Grading understanding, honestly

You are inferring a mental state from pixels. Use three levels and mark the level, never
assert the state:

| Level | Evidence in capture |
|---|---|
| `understood: yes` | The user read docs about the mechanism, modified the suggestion substantially, or explained it to someone afterward in a thread or meeting. |
| `understood: partial` | Some reading or some modification, but the core of the fix is the assistant's. |
| `understood: no` | Wholesale acceptance, no reading, no modification, no later explanation. |

`understood: no` is an inference, always, and it is marked as one
(`evidence-standards.md` rule 2). It is also not a criticism, and the entry does not read
as one. Blameless framing is the published rule for incident records, and the reason given
is that blame culture stops people surfacing issues at all
[research/distilled-personal-knowledge-capture.md section 4]. For a single-user knowledge
base the person being blamed is the user, and an entry that reads as self-indictment simply
stops getting written.

### What the entry says differently

- **Root cause is usually honestly empty.** The template this skill follows includes cause
  "where known" and omits it if unknown
  [research/distilled-personal-knowledge-capture.md section 3]. Write
  `Root cause: not established. Fix supplied by an assistant and accepted as-is.`
- **The fix is recorded verbatim and completely.** This is the field the user will need
  most and remember least.
- **Add a `Verify next time` line.** What the user should check about this fix when they
  reuse it, given nobody verified it the first time. The cost of verification is real:
  "you have to read it carefully, understand what it's doing, test it thoroughly, and check
  for edge cases" [research/distilled-personal-knowledge-capture.md section 6]. The entry
  is where that cost gets paid later instead of never.
- **Confidence on the fix is capped at Medium** unless Phase C independently confirms it
  worked in a durable way (a passing test suite, a successful deploy, the feature used
  afterward). An assistant's assertion that a fix is correct is not an observation.

---

## 5. Recurrence detection during the sweep

Before proposing any candidate as new, search the user's **whole capture history** for the
same error string, not just the sweep window. Use `search_user_context` with the literal
error text as `standalone_query` and a `date_range` ending where the current window begins.

Three outcomes:

- **Nothing.** Genuinely new. Propose as a new entry.
- **Prior occurrences, and an entry already exists in the knowledge base.** This is an
  update, not a new entry. Hand off to `kb-structure-and-dedupe.md`.
- **Prior occurrences, and no entry exists.** The wall predates the knowledge base. Propose
  a new entry whose occurrence list is backfilled with the historical receipts, and say in
  the sweep report that this one has been hit before.

Recurrence is a finding in its own right. Google's postmortem practice runs automated trend
analysis across many postmortems specifically so that recurrence across records becomes
visible [research/distilled-personal-knowledge-capture.md section 4]. The personal version
of that is the escalation rule in `kb-structure-and-dedupe.md` section 5.

---

## 6. Bounding the time cost honestly

**Design decision, not researched practice**
[research/distilled-personal-knowledge-capture.md section 8].

Screen capture is periodic. It does not measure duration; it samples it. So the honest
output is an interval, not a number.

```
Lower bound  = timestamp of last Phase B snapshot minus timestamp of first Phase A snapshot
Upper bound  = timestamp of first Phase C snapshot minus timestamp of the last clean
               snapshot before Phase A
```

Report both, plus the count of snapshots the estimate rests on:

```
Time cost: between 35 minutes and 1h50m (14 snapshots, 2026-08-11 13:20 to 15:10 EDT)
```

Never report a single figure. Never report a figure at all when the phases span a gap of
more than a few hours with no snapshots in it, because the user may have gone to lunch, or
gone to bed, and capture cannot tell you which. In that case write:

```
Time cost: unbounded. Phases span a 14-hour gap with no capture. Ask the user.
```

Time cost is the field most likely to be quietly wrong and least likely to be checked, so
it defaults to the widest honest interval and to admitting ignorance.

---

## 7. Confidence, applied to detection

Rate every candidate before it reaches the user
(`evidence-standards.md` rule 3):

| Rating | When |
|---|---|
| **High** | All three phases legible, error text clean, resumption independently confirmed by a success state or a commit. |
| **Medium** | Three phases present but one is thin: a single Phase C snapshot, partially corrupted error text, or resumption inferred from the artifact rather than from an explicit success state. |
| **Low** | Any phase resting on a single item that retrieval scored 3, heavy OCR fragmentation, or a resumption that could equally be the user moving on to something else. |

Anything scored 3 by retrieval is a maybe and does not carry a claim on its own
(`littlebird-mcp-reference.md`, retrieval pattern 5). Low-confidence candidates are still
worth showing the user, labelled Low, because recognition is cheap for them and recall is
not. They are never drafted as entries without the user saying yes.
