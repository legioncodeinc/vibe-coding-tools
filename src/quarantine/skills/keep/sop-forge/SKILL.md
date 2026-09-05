---
name: sop-forge
description: "Write an SOP, document how I did that, turn last Thursday into a procedure,
  make this repeatable, write it up so I can hand it off. Reconstructs a standard
  operating procedure from Littlebird screen capture of work the user already performed,
  with the actual screens, field values, UI labels, and timestamps that were on screen,
  plus a named gap list and a mandatory redaction pass. Use for documenting a task that
  was already done, not for writing a generic tutorial."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# sop-forge

Point this at something the user did. It writes the SOP, because Littlebird watched them
do it.

## Purpose

"Document how I built that GoHighLevel workflow last Thursday" returns a numbered
procedure with the actual screens, field names, triggers, and settings that were on
screen, each step carrying the timestamp the user can open in the Littlebird app to see
the original capture. Not a generic tutorial.

The published best practice for a first SOP draft is to observe the actual procedure being
performed and write down every step in order
[references/research/raw/sop--formats--psu-extension-writing-guide.md, via
references/research/distilled-sop-craft.md section 6]. This
skill runs that observation against capture instead of standing behind someone with a
clipboard.

## Littlebird MCP calls used

| Call | Used for |
|---|---|
| `search_user_context` | Steps A through D of the retrieval brief. Step A: `filters: {"data_source": "summaries"}`, `date_range` fixed to the target date, to find the session boundaries and the apps involved. Step B: one call per app, `filters: {"app": "the app", "data_source": "snapshots"}`, `date_range` narrowed to the session window, five narrow queries. Step C: no app filter, `date_range` widened two days either side of the session. Step D: `filters: {"data_source": "snapshots"}` from 30 minutes before the session, for prerequisites |
| `LB_INTERNAL_LIST_MEETINGS` | Step E only. Meeting lookup BY NAME, passing `name` with `start_date` and `end_date`. This is the right tool for a recurring session and its prior instances |
| `LB_INTERNAL_SEARCH_MEETINGS` | Step E only. Meeting lookup BY TOPIC, passing `query`. Using this where `LIST_MEETINGS` was wanted, or the reverse, is the most common retrieval mistake against this server |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Step E only, passing `meeting_id`, when the session was narrated. The transcript carries the spoken reasoning the pixels do not |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Capability gate when the plan gate is in doubt. No parameters |

No routine tools. See routine cadence below.

## Trigger

Invoke when the user says any of: write an SOP, document how I did that, turn last Thursday
into a procedure, make this repeatable, write it up so I can hand it off, document this
process, write the training script for this, turn this into a checklist.

The trigger has a shape: it points at work that was already performed on a specific day in
specific applications. A request for a generic tutorial is not this skill.

## Routine cadence

**None. On-demand only.** A routine is an unattended observer that produces one report in
one pass, and this skill has a mandatory human redaction gate and an `AskUserQuestion`
confirmation before it writes a file, neither of which a routine can do. The full reasoning
and the correct alternative shape are in the routine wiring section below.

---

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**. Before doing anything
else:

1. **List the tools actually available in this session.** Use the real tool names you find.
   Do not assume the names in `references/littlebird-mcp-reference.md` are still exact.
   That file is verified as of 2026-08-17 and is a starting point, not a contract.
2. If no Littlebird tools are present, **stop**. Tell the user this skill needs the
   Littlebird MCP connected, and that it cannot be run from memory or from a description
   of what they did.
3. If the plan gate is in doubt, call the subscription status tool to check before
   promising a reconstruction.

There is no degraded mode. A skill that writes an SOP without capture is writing fiction,
and the entire value of this one is that its steps were observed.

---

## Do this first, every time

Read these two, in this order, before you touch retrieval:

1. `references/evidence-standards.md` - the receipt format, the observed / inferred /
   external / unknown split, the attribution guardrail, and the confirmation gates.
2. `references/littlebird-mcp-reference.md` - tool parameters, return shapes, and the
   known limitations you have to design around.

Then read `references/session-reconstruction.md` and follow it. The other three guides load
at the stage that needs them.

---

## Process

| Stage | Guide | Output |
|---|---|---|
| 1. Fix the window | `references/session-reconstruction.md` steps 1 to 2 | Session boundaries and the apps involved |
| 2. Three sweeps | `references/session-reconstruction.md` step 3 | Raw retrieval |
| 3. Sort and deduplicate | `references/session-reconstruction.md` steps 4 to 5, `scripts/dedupe_snapshots.py` | Distinct UI states in time order |
| 4. Split path from flailing | `references/session-reconstruction.md` steps 6 to 8 | On-path states, decision points, traps, gaps |
| 5. **Redaction pass** | `references/redaction-pass.md` | Redacted values, placeholders, rotation flags |
| 6. Confirm with the user | `references/gap-handling-and-confirmation.md` part 2 | Corrected reconstruction, chosen output mode |
| 7. Render | `references/sop-formats.md` | The deliverable |

Stage 5 runs before stage 6, so the read-back does not itself display secrets. Stage 5
never gets skipped, not for any output mode, not when the user says the session was
harmless.

---

## Retrieval brief

The exact queries. Full parameter shapes and the reasoning are in
`references/session-reconstruction.md` step 3.

**Step A. Session boundaries.** `search_user_context` with
`filters: {"data_source": "summaries"}`, `date_range` fixed to the target date. Queries:
`["work session on <artifact or task>", "what was worked on"]`. This is the cheapest way to
get the shape of the day and it supplies the apps for step B
(`references/littlebird-mcp-reference.md`, retrieval pattern 3).

**Step B. App time-window sweep.** One call per app, `filters: {"app": "<app>",
"data_source": "snapshots"}`, `date_range` narrowed to the session window found in step A.
Five narrow queries, not one broad one
(`references/littlebird-mcp-reference.md`, retrieval pattern 1):

1. `"<app> screen showing configuration settings"`
2. `"<app> form fields and input values"`
3. `"<app> navigation menu and page headers"`
4. `"<app> save publish or confirm action"`
5. `"<app> error message or validation warning"`

Query 5 is not optional. It is how the branches and the dead ends surface, and the branches
are half the value of the finished SOP.

Split windows longer than about two hours into sub-windows. A single sweep across a long
session exceeds the tool result limit and gets written to a file instead
(`references/littlebird-mcp-reference.md`, "Oversized results").

**Step C. Artifact topic sweep.** Not app-filtered. `date_range` widened two days either
side of the session, because work gets revisited and a later snapshot of the finished
artifact is the best evidence of the final configuration. Queries:
`["<artifact name>", "<artifact name> settings and configuration", "<artifact name> steps
or actions"]`.

**Step D. Prerequisites sweep.** `filters: {"data_source": "snapshots"}`, window starting
30 minutes **before** the session. Queries:
`["login screen or account selector", "settings integrations or connected accounts",
"permissions role or access denied", "browser tabs open before the task"]`. Setup happens
before the work.

**Step E, only if the session was a screen share or a call.** Meeting lookup by NAME uses
the list-meetings tool with `name`. Lookup by TOPIC uses the search-meetings tool with
`query`. Using the wrong one is the most common retrieval mistake against this server
(`references/littlebird-mcp-reference.md`, retrieval pattern 6). If the session was
narrated, pull the transcript: it carries the spoken reasoning the pixels do not.

**Then sort by timestamp.** Retrieval is relevance-ordered, not chronological
(`references/littlebird-mcp-reference.md`, known limitations). Sort before writing anything.

---

## Deduplicate before you count anything

Screen capture of one UI state produces many near-identical snapshots. A naive pass
produces an SOP with the same step eleven times. OCR of dense UI produces fragments,
duplicate lines, and interleaved chrome, and repeated identical lines are one observation
(`references/littlebird-mcp-reference.md`, known limitations).

Build a timestamp-sorted JSON timeline and run:

```
python3 scripts/dedupe_snapshots.py timeline.json --scan-secrets --json states.json
```

It groups frames into distinct UI states on three signals (text similarity, time adjacency,
app continuity), emits the frame with the most extracted text as each state's
representative, and flags states worth checking by hand. `--scan-secrets` runs a structural
credential scan and never prints a matched value.

Read the output. Do not trust it blindly. Two states the script merged can be two real
steps on a screen that barely changed. See `references/session-reconstruction.md` step 5.

---

## Evidence standards

Apply `references/evidence-standards.md` in full. The four that bite hardest here:

- **Every step carries a receipt**, in the canonical form
  `[Thursday, August 13, 2026 14:12 EDT | chrome]` (rule 1). In this skill the receipt is
  also a navigation aid: the user opens that timestamp in the Littlebird app to see the
  original screen. Say so once in the provenance block.
- **Observed, inferred, external, unknown are visibly different** (rule 2). A step
  reconstructed from a clear snapshot is observed. A step whose result you concluded from
  the next screen is inferred and says so. A step you could not resolve is unknown and gets
  a gap marker.
- **Rate what a reader will act on** (rule 3). A Low-rated step that deletes, sends,
  publishes, or charges gets a stop marker telling the reader to verify before executing.
- **Attribution guardrail** (rule 4). Screen OCR captures what was being viewed. For this
  skill that lands in one specific place: a screen share shows someone else's computer. The
  procedure is still valid. The attribution of who performed it is not. State whose screen
  it was, or state that it is unknown.

---

## Never invent a step

An honest gap marker is worth more than a plausible fabrication, because a fabricated step
in an SOP gets followed. The reader is not evaluating the claim, the reader is executing
it, usually without the context to notice it is wrong.

Rules, in full in `references/gap-handling-and-confirmation.md`:

- If states N and N+2 are captured and the action between them is not, the SOP says so. It
  does not write "click Save" because that is usually what happens there.
- If capture reads "Add Act", the SOP reports it as captured and marks it a gap. It does
  not silently write "Add Action".
- `[GAP: ...]` means the reconstruction could not resolve it. `[YOUR_API_KEY]` means it was
  resolved and deliberately removed. Never use the same marker for both. A reader who
  confuses them goes looking for a secret in a screenshot.
- Count the gaps in the provenance block. Three named gaps that the user fills in five
  minutes beat forty invented steps.

---

## The redaction pass is mandatory

This is the highest-risk skill in the marketplace for accidental secret disclosure. Screen
capture of real work routinely contains credentials, API keys, client names, and account
identifiers, and an SOP is a document specifically built to be handed to someone who did
not previously have access.

`references/redaction-pass.md` is not optional reading and the pass is not optional
execution. Its shape:

1. **Pattern sweep** for credential-shaped strings, via `--scan-secrets`.
2. **Semantic sweep** by reading the values, because a client name is just a normal word
   and no pattern finds it.
3. **Context sweep** for what was around the work: tab strips, notification toasts,
   calendar sidebars, participant lists.
4. **Placeholder replacement**, not blanket blurring. The governing test is that the step
   stays followable after the value is removed. `[YOUR_STRIPE_SECRET_KEY, from Stripe
   dashboard, Developers, API keys]`, never `[REDACTED]`.
5. **Rotation flag.** Anything matching an authentication pattern was on screen, which is
   exposure. The deliverable carries a security notice naming the field and the step, never
   the value.
6. **Disclosure with a count.** The provenance block states how many values were redacted
   and in which categories, so the reader can tell a removal from a gap.

Automated redaction is a first pass, not a guarantee. The archive puts state-of-the-art
automated redaction at a 79.1% zero-leak rate, which is roughly one document in five still
leaking [references/research/distilled-sop-craft.md section 8]. The human confirmation gate
is what closes that.

---

## Confirm before you finalize

Read the reconstructed sequence back to the user with `AskUserQuestion` before rendering.
This mirrors the validated method in the cognitive task analysis literature, where the
interviewer narrates the reconstructed account back to the participant for correction
[references/research/distilled-sop-craft.md section 5].

The user knows which steps were incidental. Recognition is easier than recall: shown a
sequence, they will immediately tell you that step 4 was them checking something unrelated
and step 9 only happened because of a stale cache.

Confirm the session boundary, the steps you classified as incidental or abandoned, the
Low-confidence readings, the fragmentary labels, the traps, and the output mode. Do not
confirm every High-confidence step individually, which is just asking the user to write the
SOP themselves. Full question set in
`references/gap-handling-and-confirmation.md` part 2.

---

## Output

One markdown file, written to the working directory, named by mode:

| Mode | Filename | Audience |
|---|---|---|
| Internal SOP (default) | `sop-<slug>-v1.md` | A colleague who knows the business and not this task |
| Training script | `training-script-<slug>-v1.md` | The user, reading it aloud while re-performing on camera |
| Client-facing deliverable | `<client-slug>-procedure-v1.md` | Someone outside the business |
| Checklist | `checklist-<slug>-v1.md` | Someone who knows the task and must not skip a step |

`<slug>` is a kebab-case name for the procedure, taken from the artifact or outcome, not
from the tool. `build-tag-triggered-nurture-workflow`, not `gohighlevel-stuff`.

Every mode contains, in this order: title, provenance block with counts, security notice if
credentials were found, values you will need, gaps to fill, prerequisites, the procedure,
decision points, traps where they earned a place, how you know it worked, and the validation
and review block with owner, version, and next review date. Structures and worked examples
in `references/sop-formats.md`.

Format selection follows the published matrix: 10 steps or fewer with few decisions goes
step-by-step, longer goes hierarchical, many decisions goes flowchart, and consistency
between two different people doing the task pushes toward hierarchical regardless of length
[references/research/distilled-sop-craft.md section 1].

Delete the working timeline and the raw retrieval once the deliverable is written. Raw
capture never ships (`references/evidence-standards.md` rule 7).

---

## Empty retrieval

| Situation | Action |
|---|---|
| No Littlebird tools in session | Stop at the capability gate. |
| Summaries empty for the date | Report it. Ask the user to confirm the date. Do not run the expensive sweeps blindly. |
| Summaries present, app sweep empty | Report that the day is captured but the application is not. Name the apps that did appear. Stop. |
| Fewer than about 5 distinct on-path states after dedup | Too thin for an SOP. Report what was found, name it as a fragment rather than a procedure, and ask whether to widen the window. Do not pad it. |
| Everything scored 3 | Anything scored 3 is a maybe (`references/littlebird-mcp-reference.md`, retrieval pattern 5). Report low confidence across the board and confirm heavily. |

A failed or empty retrieval ends the run. Never fabricate to fill a gap
(`references/evidence-standards.md` rule 9). A skill that reports "I found nothing for this
window" is doing its job correctly.

---

## Guardrail

This skill carries two risks that no other skill in the marketplace carries in this
combination, and both come from the same fact: an SOP is written to be handed to someone who
did not previously have access, and it is executed rather than evaluated.

**Risk one: the deliverable discloses what was on screen.** Screen capture of real work
routinely contains API keys, session tokens, passwords in plain fields, client names, account
identifiers, invoice numbers, and whatever sat in the tab strip, the notification toasts, and
the calendar sidebar around the work. A client-facing procedure that names a different client
is a breach of one relationship and an embarrassment in the other. The redaction pass is the
control, it runs at stage 5 before the read-back so the confirmation itself does not display
secrets, and it never gets skipped, not for any output mode and not when the user says the
session was harmless. Automated redaction is a first pass and not a guarantee: the archive
puts state-of-the-art automated redaction at a 79.1% zero-leak rate, roughly one document in
five still leaking [references/research/distilled-sop-craft.md section 8]. The human gate is
what closes it. Anything matching an authentication pattern was on screen, which is exposure,
so it also raises a rotation flag naming the field and the step and never the value. Full
procedure in `references/redaction-pass.md`.

**Risk two: a fabricated step gets followed literally.** The reader of an SOP is not
weighing the claim, they are executing it, usually without the context to notice that step 7
is wrong. A plausible invention is therefore worse than an honest hole, which is why an
unresolved action becomes a `[GAP: ...]` marker rather than the step that usually goes there,
why a fragmentary OCR label like "Add Act" is reported as captured and marked a gap rather
than silently completed, and why the gap count appears in the provenance block. A Low-rated
step that deletes, sends, publishes, or charges carries a stop marker telling the reader to
verify before executing [references/evidence-standards.md rule 3].

The two markers are never interchangeable. `[GAP: ...]` means the reconstruction could not
resolve it. `[YOUR_API_KEY]` means it was resolved and deliberately removed. A reader who
confuses them goes looking for a secret in a screenshot.

---

## Routine wiring

**None. This skill is on-demand only.**

Stated explicitly rather than left as an omission, because the reason is a real constraint.
A routine is an unattended observer that produces one report in one pass. This skill runs
multi-sweep retrieval, a mandatory human redaction gate, and an `AskUserQuestion`
confirmation before it produces a file deliverable. Routines cannot do approvals and cannot
write file deliverables (`references/littlebird-mcp-reference.md`, "Do not ask a routine to
do work it cannot finish unattended in one pass").

If the user wants recurring documentation coverage, the correct shape is the
Routines-observe, Cowork-acts pattern: a separate routine watches for undocumented recurring
work and writes a report naming it, then the user opens Cowork and runs `sop-forge` against
the session the routine flagged. That routine is not part of this skill and is not created
by it.

---

## Related skills

| Skill | Relationship |
|---|---|
| `skill-suggester` | Finds the repeated manual work worth documenting in the first place. Run it when the user knows they repeat themselves but not which procedure to write up. This skill then documents the one they pick |
| `day-reconstructor` | Rebuilds the same captured session as a narrative dev log of what was done and why. Reach for it when the user wants a record of the day, not a procedure someone else will follow |
| `learning-capturer` | Logs a single hard-won fix so the same wall is not hit twice. Reach for it when the output is one lesson rather than a repeatable end-to-end task |
| `knowledge-base-builder` | Builds a whole project documentation pack from meetings, threads and artifacts. Reach for it when the unit is a project rather than one procedure. Finished SOPs belong inside that pack |

Ship Gate removed, research-only skill, produces no committable code.

---

## Reference map

| File | Load it when |
|---|---|
| `references/session-reconstruction.md` | Always, at stage 1. Query design, sorting, deduplication, path classification. |
| `references/redaction-pass.md` | Always, at stage 5, before any prose is written. |
| `references/gap-handling-and-confirmation.md` | Stage 6. Gap taxonomy and markers, the confirmation question set. |
| `references/sop-formats.md` | Stage 7. Format selection, required elements, step-writing rules, the four output modes. |
| `references/evidence-standards.md` | Always, first. |
| `references/littlebird-mcp-reference.md` | Always, first. |
| `references/research/distilled-sop-craft.md` | When you need the citation behind a rule, or want to check whether a claim is evidenced at all. |
| `references/research/README.md` | Source inventory and the archive's named gaps. |
| `scripts/dedupe_snapshots.py` | Stage 3, and again at stage 5 with `--scan-secrets`. |

Three of this skill's design decisions are **not** evidenced by the research archive and are
labelled as design decisions rather than researched practice: frame deduplication, the
happy-path-versus-flailing split, and the premise that documentation cost is what stops
small operators from delegating. See `references/research/distilled-sop-craft.md` section 11.
