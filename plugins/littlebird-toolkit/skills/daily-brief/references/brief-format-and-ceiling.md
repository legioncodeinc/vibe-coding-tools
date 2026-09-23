# Brief format and the length ceiling

One screen, hard ceiling. This file sets the number, explains where it comes from, gives the
template, and specifies how the ceiling is actually enforced rather than merely stated.

---

## 1. Where the number comes from

The only hard measurement in the archive is about how much of a text a scanning reader gets
through [research/distilled-daily-brief-design.md section 3]:

- Ceiling: "at most 28% of the words during an average visit; 20% is more likely".
- Time model: "a fixed time of about 25 seconds, plus an additional 4.4 seconds per 100
  words".
- Marginal words are read at roughly 18%.
- **The threshold: "users read half the information only on those pages with 111 words or
  less".**

That splits a brief into two budgets, not one.

| Budget | Size | Read at roughly | What belongs there |
|---|---|---|---|
| Block one | 111 words | 50% | Everything that must actually be read |
| Block two | the rest | 18% of marginal words | Everything the reader may skip without losing the day |

Words past block one are not free and not neutral. They dilute the share of attention block
one receives [research/distilled-daily-brief-design.md section 3].

## 2. The ceiling

**Block one: 110 words. Total: 220 words. Hard.**

Block one is the bottom line, the schedule compressed, and the one thing. Nothing else. It
is sized just under the 111-word threshold so the whole of it lands in the half-read band.

The 220 total is a design decision derived from the word budget, not an archive finding.
The archive does not measure the right number of items in a brief, which is named gap 4
[research/distilled-daily-brief-design.md section 9]. The reasoning: doubling block one buys
a second block read at roughly 18% of marginal words, which is enough for a reader who is
scanning for a specific item they half-remember, and past that the dilution cost is paid
without a corresponding gain. Say that if asked where 220 came from.

Scope caveat, stated because it matters: the 111-word threshold comes from web page
eyetracking and logging data, not from report or email reading
[research/distilled-daily-brief-design.md section 3]. Treat it as a well-grounded order of
magnitude.

## 3. Enforcement, which is a separate problem from the number

**A stated ceiling does not produce a ceiling.** This is a validated observation, not a
worry. In a live Littlebird account, a routine whose prompt says "Keep the total output
under 200 words" produced reports that run past it [routine-architect failure mode 7]. And
current model guidance says default response length is not reliably controlled and should be
prompted for explicitly [routine-architect failure mode 7].

So the ceiling is enforced by four mechanisms together, and all four are required.

**1. Per-section limits, not one global sentence.** A global number gives the model nothing
to trade against while it is writing a section. Per-section caps do.

**2. An overflow rule for every section.** A ceiling with no overflow rule tells the model to
truncate, and it truncates the end [routine-architect failure mode 7]. Every capped section
ends with `plus N more` rather than a silent cut.

**3. A count-and-cut step, stated as a numbered step in the routine prompt.** Not an
adjective. The instruction is: count the words in the finished draft, and if the number
exceeds the ceiling, delete whole lowest-ranked items until it does not.

**4. A named ban on fake compression.** The failure mode of a count-and-cut instruction is
that the model compresses instead of cutting: it drops receipts, strips dates, merges two
findings into one ambiguous sentence, or removes the beat clause from the one thing. All of
those trade the parts that carry the evidence for the parts that carry the volume. The rule:
**cut items, never cut evidence.** A brief with three fully receipted items beats a brief
with six stripped ones.

## 4. The template

Placeholders are in square brackets. Word budget for each part is given in parentheses and
is a target, not a suggestion.

```
[Weekday, Month D, YYYY]

[Bottom line: one sentence, the single most important thing about today.] (up to 20)

Schedule: [N] meetings, [H.H] hours, first [HH:MM], last free block [HH:MM to HH:MM]. (up to 20)
  [HH:MM] [title]. [One clause on why it matters.] Depth: pre-call-prep. (up to 12 each, max 5 lines)
  plus [N] more.

The one thing: [action, with a window from today's actual calendar]. (up to 25)
Why: [the deadline or the blocked person] [receipt].
Beat: [runner-up] because [the comparison that decided it].

--- block one ends here, at or under 110 words ---

Due today (max 3, 2 lines each)
  [item], owed to [person], from [source] [receipt]. ACTION
  Next: [handoff line].
  plus [N] more.

Went cold (max 2, 1 line each)
  [thread or account], quiet since [date], [what was pending] [receipt]. INFO

Needs a reply (max 3, 1 line each)
  [person] asked [the dated ask] on [date] [receipt]. REQUEST

Changed since yesterday (max 4 lines)
  New: [item]
  Closed: [item], [evidence]
  Moved: [item], [old] to [new]
  or: Nothing material changed since yesterday.

Stalled, needs a decision (only when an item has run 7 or more times)
  [item], open [N] runs. Decision needed: [one sentence].

Total: 220 words.
```

**The all-caps keyword on each item is deliberate.** ACTION, REQUEST, INFO tells the reader
what is demanded of them before they read the item, which is the transferable mechanic from
Army Regulation 25-50 [research/distilled-daily-brief-design.md section 4]. It lets a reader
skip cleanly instead of reading defensively, which is worth its three characters.

**Bottom line first is not a style choice.** Both briefing traditions in the archive converge
on it: the bottom line belongs "within the first sentence of your document, not buried later
in your piece" [research/distilled-daily-brief-design.md section 4].

## 5. Detail scaling

Detail scales down as item count rises. This is how a section stays inside its cap without
losing the important item.

| Items in a section | Shape |
|---|---|
| 1 to 3 | Full detail: item, receipt, handoff line. |
| 4 to 10 | Headlines only for all but the top 3. Top 3 keep receipts. |
| 11 or more | Top 3 with receipts, then a single count line. Do not list the rest. |

## 6. Section suppression

An empty section is not printed. No heading, no "nothing here", no placeholder. Printing
empty headings is how a two-line quiet day becomes a full-length brief that says nothing,
which is exactly the failure the quiet-day rule exists to prevent
[earning-the-open.md section 4].

The two exceptions, both of which are content rather than scaffolding:

- `The one thing` always prints, even when the content is "nothing that needs today
  specifically" [the-one-thing.md section 6].
- `Changed since yesterday` always prints, even when the content is "Nothing material
  changed since yesterday" [earning-the-open.md section 1]. Its absence would be read as a
  retrieval failure.

## 7. The two short forms

**Quiet day, two lines** [earning-the-open.md section 4]:

```
Quiet day. [N] meetings, nothing due, nothing cold, no urgent threads.
The one thing: [item] because [reason]. / nothing that needs today specifically.
```

**Low novelty, four lines** [earning-the-open.md section 2], used when fewer than two items
are New, Resolved, or Moved:

```
Mostly unchanged from yesterday.
Schedule: [N] meetings, first [HH:MM].
The one thing: [item] because [reason].
[Delta line, or "Nothing material changed since yesterday."]
```

## 8. Things that never appear, at any length

- A meeting list with no reason attached to each meeting.
- Inlined pre-call briefing content [rollup-composition.md section 6].
- Any line with no receipt behind it [evidence-standards.md].
- A closing summary. The brief was the summary.
- A count with no items behind it.
- Advice about focus, energy, or how to have a good day.
- Health, financial detail, legal history, family circumstances, protected characteristics,
  or precise home location, even where the capture contains them
  [evidence-standards.md].

## 9. On-demand mode differs in one way only

On-demand mode may go past 220 words, because the reader asked for it and is in a session
rather than glancing at a notification. It does this by adding an appendix below the brief,
never by expanding block one or the capped sections. The brief above the appendix is byte
for byte what the routine would have produced. Nothing in the appendix is required reading.
