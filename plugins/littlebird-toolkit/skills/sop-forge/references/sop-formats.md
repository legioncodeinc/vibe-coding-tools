# SOP formats and output modes

How to render a confirmed, redacted reconstruction into a document someone can follow.
Format selection, required elements, step-writing rules, and the four output modes.

Everything here traces to `research/distilled-sop-craft.md`.

---

## Choosing the format

Two independent taxonomies in the archive converge on four formats
[research/distilled-sop-craft.md section 1]. Use the published selection matrix
[research/raw/sop--formats--psu-extension-writing-guide.md]:

| Condition | Format |
|---|---|
| 10 steps or fewer, few decisions | Simple step-by-step |
| More than 10 steps, few decisions | Hierarchical |
| Many decisions, any step count | Flowchart |

Add one rule the matrix does not cover, from the second taxonomy: where consistency between
two different people doing the task matters, use hierarchical even under 10 steps, because
the format lets an experienced user read only the main steps while a beginner opens the
substeps [research/raw/sop--formats--psu-extension-writing-guide.md].

**Where sources differ.** Penn State selects hierarchical on the consistency criterion;
Scribe selects it on complexity and length
[research/raw/sop--formats--scribe-sop-format.md]. Prefer the consistency reading. Length is
already handled by the step-count row [research/distilled-sop-craft.md section 1].

### What each format looks like here

**Simple step-by-step.** Numbered steps, linear, one path
[research/raw/sop--formats--scribe-sop-format.md]. The default for a reconstructed session
with no branches.

**Hierarchical.** Numbered main steps with lettered or decimal substeps under each. Main
steps are the phases of the session; substeps are the individual UI states
[research/raw/sop--formats--psu-extension-writing-guide.md]. This is usually the right
choice for a reconstructed session, because a session naturally clusters into phases and a
raw state list is too granular to skim.

**Flowchart.** Required when the reconstruction found real branches, meaning conditions
where the user did different things depending on what the screen showed
[research/raw/sop--formats--psu-extension-writing-guide.md]. Render as a decision tree in
text or as a Mermaid diagram, and keep the numbered steps alongside it. Do not ship a
diagram alone; the field values live in the steps.

**Checklist.** Checkboxes, one line per action. State whether the order is mandatory,
because a checklist has to say how it is meant to be used
[research/raw/sop--formats--scribe-sop-format.md]. A checklist reconstructed from a session
is ordered by construction, so say so.

**Graphic.** Penn State's fifth format, for long activities split into short subprocesses
[research/raw/sop--formats--psu-extension-writing-guide.md]. This skill cannot embed
screenshots, so it approximates the intent by emitting per-step timestamps the user opens in
the Littlebird app to see the original frame. See the timestamp anchor rule below.

---

## Required elements

From EPA QA/G-6 [research/raw/sop--official-standard--epa-qa-g6.md] and Penn State
[research/raw/sop--formats--psu-extension-writing-guide.md], reduced to what applies to a
reconstructed knowledge-work procedure. Every document this skill produces carries all of
these.

| Element | Content |
|---|---|
| Title | Clear, descriptive, names the outcome not the tool |
| Identification | Document ID and version, starting at 1.0 [research/raw/sop--maintenance--tracework-sop-review-update.md] |
| Date | Issue or revision date [research/raw/sop--official-standard--epa-qa-g6.md] |
| Owner | Named person. Operations-owned SOPs need an accountable individual [research/raw/sop--maintenance--glitter-why-docs-get-outdated.md] |
| Purpose and scope | What this procedure achieves and where it applies [research/raw/sop--official-standard--epa-qa-g6.md] |
| Prerequisites | Accounts, permissions, tools, and open windows. Maps to EPA's personnel qualifications and equipment and supplies subsections [research/raw/sop--official-standard--epa-qa-g6.md] |
| Values you will need | Every redaction placeholder, what it is, where to get it. See `redaction-pass.md` |
| Provenance | Source window, reconstruction counts, redaction counts. This skill's own addition |
| Gaps to fill | The gap list. See `gap-handling-and-confirmation.md` |
| Procedure | The numbered steps |
| Decision points | Branches and error handling |
| How you know it worked | The observable end state. Maps to EPA's QA/QC section [research/raw/sop--official-standard--epa-qa-g6.md] |
| Validation and review | The someone-else-runs-it instruction plus next review date |

Add safety or caution notes wherever a step is destructive or irreversible
[research/raw/sop--formats--psu-extension-writing-guide.md,
research/raw/sop--official-standard--epa-qa-g6.md].

---

## Writing the steps

### Style rules

All five are testable against the finished draft
[research/distilled-sop-craft.md section 3].

1. **Active voice, present tense, step-by-step, easy to read.** EPA requires "active voice
   and present verb tense" [research/raw/sop--official-standard--epa-qa-g6.md].
2. **Imperative, action verb first.** "Record the weight of feed refusals in the feeder
   notebook", not "The weight of feed refusals should be recorded"
   [research/raw/sop--formats--psu-extension-writing-guide.md].
3. **Cut the padding.** "Empty all old grain from calf pails before feeding new grain",
   not "Make sure that you clean out all of the old grain from the calf pails before you
   put new grain in them" [research/raw/sop--formats--psu-extension-writing-guide.md].
4. **Acronyms only when genuinely common**, not to shorten your writing
   [research/raw/sop--formats--psu-extension-writing-guide.md].
5. **Remove ambiguity explicitly.** Information is conveyed "clearly and explicitly to
   remove any doubt as to what is required"
   [research/raw/sop--official-standard--epa-qa-g6.md].

### The detail test

An SOP contains "sufficient detail so that someone with limited experience ... but with a
basic understanding, can successfully reproduce the procedure when unsupervised"
[research/raw/sop--official-standard--epa-qa-g6.md]. That is the operational definition of
no implied context: the reader knows the domain and has never done this specific thing
[research/distilled-sop-craft.md section 4].

The pattern that passes the test: **a step names the control it acts on and the state it
leaves that control in.** "Predip all four teats with the green dip cup" fails; adding
"Squeeze dip up from bottom reservoir so that teat chamber is 3/4 full" passes
[research/raw/sop--formats--psu-extension-writing-guide.md].

Translated to a software UI, a step names:

- **Where.** The screen or page, by its captured name.
- **What.** The control, by its exact captured label.
- **With what.** The value entered, verbatim or as a typed placeholder.
- **Result.** What the screen shows after.

```
7. On the Workflow Builder canvas, click **Add Action** and select **Custom Code**
   from the action list. The action panel opens on the right with an empty code
   editor. [Thursday, August 13, 2026 14:12 EDT | chrome]
```

### Use the captured labels literally

The step text is only as good as the UI labels captured
[research/distilled-sop-craft.md section 7,
research/raw/sop--tooling--vidocu-tool-comparison-2026.md]. Do not paraphrase a captured
label into what you think it means. If capture reads "Add Action", the step says **Add
Action**. If capture reads "Add Act", that is a gap, not a label. See
`gap-handling-and-confirmation.md`.

Bold every literal UI label so the reader's eye finds the clickable thing.

### Carry the why where you have it

Detail does not replace training, and training should carry the reasoning: share the
reasons why procedures must be performed correctly, not just what to do
[research/raw/sop--formats--psu-extension-writing-guide.md]. Lack of context is one of the
four named failure modes of the curse of knowledge, because readers then copy without
understanding [research/raw/sop--tacit-knowledge--earthly-curse-of-knowledge.md].

This skill has one privileged source of the why: if the session was a narrated screen share
or a meeting, the transcript carries the spoken reasoning that the pixels do not. Pull it in
as a note under the step, attributed and receipted. Never invent a rationale. A missing why
is not a gap that blocks the SOP; it is simply absent.

### Timestamp anchors

Every step carries the receipt of its representative snapshot, in the canonical form
(`evidence-standards.md` rule 1):

```
[Thursday, August 13, 2026 14:12 EDT | chrome]
```

Tell the reader what it is for, once, in the provenance block: each timestamp is the moment
the step was captured, and it can be opened in the Littlebird app to see the original
screen. That is this skill's substitute for embedded screenshots, and it is the reason the
receipts belong inline rather than in an appendix.

---

## The provenance block

Goes immediately under the title. This is what separates a reconstructed SOP from an
invented one, and a reader deciding whether to trust the document reads it first.

```
## Provenance

Reconstructed from Littlebird capture of the session on Thursday, August 13, 2026,
13:45 to 15:10 EDT, in GoHighLevel (Chrome).

- 41 snapshots retrieved, deduplicated to 22 distinct UI states
- 18 states on the successful path, 2 abandoned branches, 2 incidental
- 18 steps written, 3 gaps remaining (see below)
- Redaction: 6 values redacted across 4 steps (2 credentials, 3 client identifiers,
  1 account ID)
- Confirmed with <user> on 2026-08-17

Each step carries the timestamp of the screen it was reconstructed from. Open that
timestamp in the Littlebird app to see the original capture.
```

Counts, not adjectives. "Reconstructed with high fidelity" tells the reader nothing.
"18 steps, 3 gaps" tells them exactly what they are holding.

---

## Decision points and branches

Where the reconstruction found an error, a retry, or a conditional, the SOP carries it as a
decision point rather than folding it into the linear steps. Procedures requiring many
decisions belong in a flowchart [research/raw/sop--formats--psu-extension-writing-guide.md],
but a mostly-linear procedure with two branches does not need to become a diagram.

```
### Decision point after step 11

If the **Save** action returns "Trigger requires at least one filter", the workflow was
saved before a filter was added. Return to step 9, add the filter, and save again.
[Thursday, August 13, 2026 14:40 EDT | chrome]
```

Name the observed error text verbatim where it was captured. That is what the reader will
see, and matching on the exact string is how they know they are in this branch.

### Traps

An optional section, included only where an abandoned branch cost real time or ended in an
error. Frame it as a warning, not as narration of the author flailing.

```
## Traps

**Do not configure the trigger filter after adding actions.** The captured session added
three actions first, then had to reopen the trigger to add a filter, which reset the
action order. About 8 minutes lost.
[Thursday, August 13, 2026 14:33 EDT | chrome] to [Thursday, August 13, 2026 14:41 EDT | chrome]
```

Drop anything that did not cost time and did not error. A trap list of every stray tab is
noise. See `session-reconstruction.md` step 6.

---

## Output modes

Ask the user which one before rendering. See `gap-handling-and-confirmation.md`.

### 1. Internal SOP (default)

The full document, all required elements, hierarchical or step-by-step by the matrix.
Audience is a colleague who knows the business and not this task. Redaction floor:
credentials, financial, health always; everything else confirmable
(`redaction-pass.md`).

Filename: `sop-<slug>-v1.md`

### 2. Training script for a recording

A speaking script for the user to read while re-performing the task on camera, so the
recording matches the SOP exactly. Same steps, different surface.

Structure per step:

```
### Step 7 of 18  (about 20 seconds)

**On screen:** Workflow Builder canvas, action list open

**Say:** "Now I'll add the custom code action. Click Add Action, and pick Custom Code
from this list. The panel opens on the right."

**Do:** Click Add Action, select Custom Code

**Pause here** if you need to explain why this action comes before the notification step.
```

Rules specific to this mode:

- Spoken register, contractions allowed, still imperative in the Do lines.
- Estimated duration per step, so the user can budget the recording.
- Explicit pause markers where a step needs explanation.
- **Redaction floor is total.** Everything in the `redaction-pass.md` table goes, because
  the recording will be replayed, paused, and shared. Add an on-screen warning list at the
  top: which screens to avoid showing, which tabs to close, which notifications to silence
  before recording. That list comes directly from the contextual-leakage row
  [research/raw/sop--redaction--supportbench-screenshot-pii.md].

Filename: `training-script-<slug>-v1.md`

### 3. Client-facing deliverable

Same procedure, rewritten for someone outside the business.

- Strip internal tooling names, internal process names, and colleague names that do not
  need to be there.
- Strip the Traps section unless the trap is something the client will hit too.
- Keep the gap list, but reframe it as inputs required from the client rather than as
  reconstruction failures.
- Keep prerequisites. A client needs them more than an employee does.
- Keep the provenance counts but drop the Littlebird timestamps, since the client cannot
  open them. Replace with a plain "documented from a working session on <date>".
- Redaction floor is total, plus the internal-identity items above.

Filename: `<client-slug>-procedure-v1.md`

### 4. Checklist

One line per action, checkboxes, no prose. For a task the reader already knows how to do
and needs to not forget a step in.

```
## Pre-flight
- [ ] Logged in to GoHighLevel, correct sub-account selected
- [ ] Workflow Builder open

## Build
- [ ] Trigger added: **Contact Tag Added**
- [ ] Trigger filter set before adding any actions
- [ ] Action: **Custom Code** added
```

State whether the order is mandatory, because a checklist has to say how it is meant to be
used [research/raw/sop--formats--scribe-sop-format.md]. A checklist derived from an observed
session is ordered by construction, so the default line is "Steps are in the order they were
performed. The Build section must run in order."

Keep the gap list. Drop the provenance detail down to one line.

Filename: `checklist-<slug>-v1.md`

---

## The closing blocks

Every mode ends with these two.

### How you know it worked

EPA's QA/QC section, translated
[research/raw/sop--official-standard--epa-qa-g6.md]: what the reader should see when the
procedure has succeeded, and what to do if they do not see it. Take the success state from
the final captured snapshot of the session, or from the artifact sweep. Receipt it.

### Validation and review

```
## Before you rely on this

Reconstructed from capture and confirmed by <user>. Not yet executed by anyone else.
Have someone other than the author run this procedure exactly as written before treating
it as final. Any step that causes confusion or hesitation for that person is a step to
rewrite.

Owner: <name>
Version: 1.0
Next review: <date>
Review sooner if: the tool's interface changes, the process changes, or someone following
this hits a step that does not match what they see.
```

The review date follows the archive's cadence guidance, which is not unanimous
[research/distilled-sop-craft.md section 9]. Use:

| Situation | Next review |
|---|---|
| Tool the procedure runs in ships frequent UI changes | 3 months [research/raw/sop--maintenance--glitter-why-docs-get-outdated.md] |
| Ordinary business process, stable tooling | 12 months [research/raw/sop--official-standard--epa-qa-g6.md] |
| Stable, low risk, rarely used | 24 months [research/raw/sop--maintenance--tracework-sop-review-update.md] |

Do not present a single confident number as if the field agreed on one. EPA's baseline is a
systematic review "every 1-2 years"
[research/raw/sop--official-standard--epa-qa-g6.md], tightened where the underlying system
changes often.

The out-of-cycle triggers list is worth including verbatim in the review block for
procedures that matter: process, technology, or equipment change; regulatory update; audit
finding; customer complaint; near-miss or incident; reorganization that moves responsibility
[research/raw/sop--maintenance--tracework-sop-review-update.md].

### Why the review block is load-bearing here

Capture-derived documentation goes stale faster than hand-written documentation for a
specific reason: retaking screenshots and re-annotating can turn a five-minute change into a
45-minute project, so the update gets postponed
[research/raw/sop--maintenance--glitter-why-docs-get-outdated.md]. This skill's answer is
that re-running it is cheap, because the source is ambient capture rather than a fresh
recording session. Say so in the review block:

```
To update: rerun sop-forge against a session where the changed part of this procedure was
performed. Steps that did not change do not need re-recording.
```

---

## Delegation level

Optional block, useful when the SOP exists to hand a task to someone. State the authority
travelling with the task using the six-level vocabulary
[research/raw/sop--delegation--foundr-six-levels.md]:

| Level | Meaning |
|---|---|
| 1 | Do as I say. Follow exactly, no judgment calls. |
| 2 | Look into this for me. Gather, I decide. |
| 3 | Give me your advice, I decide. |
| 4 | Explore, decide, check back before executing. |
| 5 | Explore and decide within these limits. |
| 6 | Just get it done. |

```
## Delegation level

Level 5. Run this procedure without checking in, except for step 14, which sends
external email. Bring that one to me until you have run it three times.
```

The judgment rule from the source: weigh the gravity of the task against the expertise of
the person [research/raw/sop--delegation--foundr-six-levels.md]. That source offers no
guidance on documenting a process before delegating it, which is a documented gap in the
delegation literature rather than a settled practice
[research/distilled-sop-craft.md section 10].
