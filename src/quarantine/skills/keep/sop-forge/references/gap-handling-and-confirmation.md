# Gap handling and confirmation

Two rules govern this stage. Never invent a step to bridge a gap, and never finalize a
reconstruction the user has not confirmed.

A fabricated step in an SOP gets followed. That is the difference between this document and
most AI output: the reader is not evaluating the claim, the reader is executing it, often
without the context to notice it is wrong.

---

## Part 1: gaps

### The gap is the product

An SOP with three honest blanks and thirty-seven verified steps is a forty-step SOP the
user finishes in five minutes. An SOP with forty plausible steps, three of which are
invented, is worse than nothing, because the user has no way to know which three.

Name the gaps precisely. "Some steps could not be determined" is not a gap marker, it is an
apology. "Step 12: the value entered in the Webhook URL field was not resolvable from
capture; the field label and its position are confirmed" is a gap marker, and the user
fills it in fifteen seconds.

### Gap taxonomy

Each gap gets a type, because the type tells the user what to do about it.

| Type | What happened | Marker | What the user does |
|---|---|---|---|
| **Value not resolved** | The field and its label are captured, the entered value is not readable | `[GAP: value not captured]` on the field | Fills in the value from memory or from the live system |
| **Label fragmentary** | OCR produced a partial or garbled control label | `[GAP: control label partial, captured as "Add Act..."]` | Confirms the label |
| **Transition unexplained** | State N and state N+2 are clear, the action between them is not captured | `[GAP: the action between step N and step N+1 was not captured. Screen N showed X, screen N+1 showed Y.]` inserted as its own numbered step | Describes the missing action |
| **Coverage hole** | A time span inside the session with no snapshots | `[GAP: no capture between HH:MM and HH:MM. Work may have occurred here.]` | Says whether anything happened |
| **Ambiguous branch** | An error occurred and the recovery is not clearly attributable | `[GAP: an error appeared at HH:MM. The subsequent action is not clearly linked to it.]` | Explains the fix |
| **Off-screen action** | Evidence that something happened outside the captured surface, for example a mobile approval or a phone call | `[GAP: step appears to require an action outside the captured screen.]` | Documents the external step |

Every gap marker carries a receipt for the states on either side of it. The reader has to be
able to see the boundary of what is known.

### Rules

1. **Never bridge a gap with a plausible step.** If states N and N+2 are captured and the
   action between them is not, the SOP says so. It does not write "click Save" because that
   is usually what happens there.
2. **Never promote a fragmentary label to a clean one.** If capture reads "Add Act", the
   SOP says the label was captured as "Add Act" and marks it as a gap. It does not silently
   write "Add Action". Inference never gets promoted to observation by dropping the hedge
   (`evidence-standards.md` rule 2).
3. **A gap is not an absence of evidence about the world.** "No capture between 14:20 and
   14:35" and "nothing happened between 14:20 and 14:35" are different claims and only the
   first is supportable (`evidence-standards.md` rule 2).
4. **Distinguish gaps from redactions visually.** `[GAP: ...]` means the reconstruction
   could not resolve it. `[YOUR_API_KEY]` means it was resolved and deliberately removed.
   Never use the same marker for both. A reader who confuses them will go looking for a
   secret in a screenshot. See `redaction-pass.md`.
5. **Count the gaps in the header.** The SOP's provenance block states how many steps were
   reconstructed and how many gaps remain. A reader deciding whether to trust the document
   needs that ratio up front.

### The gap list section

Every SOP this skill produces carries a **Gaps to fill** section, positioned immediately
after the provenance block and before the steps, not buried at the end.

```
## Gaps to fill (3)

Three items could not be resolved from capture. Everything else in this document was
observed. Fill these in and the SOP is complete.

1. **Step 7, Webhook URL field.** The field and its label are confirmed
   [Thursday, August 13, 2026 14:22 EDT | chrome]. The entered value was not readable.
   Type: value not resolved.
2. **Between steps 11 and 12.** Screen at 14:31 showed the action list with 3 actions;
   screen at 14:33 showed 4 actions [Thursday, August 13, 2026 14:31 EDT | chrome],
   [Thursday, August 13, 2026 14:33 EDT | chrome]. The action that added the fourth item
   was not captured. Type: transition unexplained.
3. **Step 15, confirmation.** An error toast appeared at 14:40 and the next captured state
   at 14:44 shows the item saved [Thursday, August 13, 2026 14:40 EDT | chrome]. What
   resolved the error is not captured. Type: ambiguous branch.
```

Three named gaps beat forty invented steps. Say that plainly in the section intro so the
user reads it as a short task, not as a failure report.

### Confidence on steps that are not gaps

Not every non-gap step is equally solid. Rate the ones a reader will act on
(`evidence-standards.md` rule 3):

| Rating | In this skill's terms |
|---|---|
| **High** | Multiple snapshots of the state agree, or one unambiguous snapshot with a legible label and value, and the resulting state is visible in the next snapshot |
| **Medium** | One clear snapshot, no corroboration, result inferred from a later state |
| **Low** | A single item the retrieval scored 3, or a reading that depends on interpreting fragmentary UI |

Mark Low-rated steps inline. A Low-rated claim never drives an irreversible action
(`evidence-standards.md` rule 3), and in an SOP an irreversible action is any step that
deletes, sends, publishes, or charges. A Low-rated step of that kind gets a stop marker
telling the reader to verify before executing.

---

## Part 2: confirmation

### Why confirmation is structural, not polite

Two independent lines of evidence:

- **Read-back is the validation method in the CTA literature.** The Critical Decision
  Method validates a reconstructed account in its second sweep, where the interviewer
  narrates the account back to the participant for correction
  [research/raw/sop--tacit-knowledge--brown-power-gore-cta-2024.md]. That is exactly this
  step: the skill narrates the reconstructed session back and the user corrects it.
- **The user knows which steps were incidental.** Experts often cannot articulate their own
  process from scratch [research/raw/sop--tacit-knowledge--brown-power-gore-cta-2024.md,
  research/raw/sop--tacit-knowledge--commoncog-acta.md], which is why observation beats
  interview for the draft. But recognition is easier than recall. Shown a reconstructed
  sequence, the user can immediately tell you that step 4 was them checking something
  unrelated and step 9 only happened because of a stale cache.

The repo's own rule agrees: anything written down as durable fact gets confirmed first
(`evidence-standards.md` rule 6).

### What to confirm, and what not to

Do not read forty steps back one at a time. Confirm the decisions that change the document.

**Confirm these:**

1. **The session boundary.** "I reconstructed the session as 13:45 to 15:10 on Thursday
   August 13, in GoHighLevel and Chrome. Is that the work you mean?"
2. **The steps you classified as incidental or abandoned.** This is the highest-value
   question, because these are the ones the user has private knowledge about. List them
   compactly with timestamps.
3. **Steps rated Low confidence.** Present the reading and ask whether it is right.
4. **Fragmentary labels.** Batch them into one question.
5. **The traps.** "This branch cost about 8 minutes and ended in an error. Include it as a
   warning, or drop it?"
6. **Redaction scope.** See `redaction-pass.md`. Run this before confirmation of the
   sequence, so the read-back does not itself display secrets.
7. **Output mode.** Which of the four deliverables, and who the audience is. This changes
   format, detail level, and redaction floor.

**Do not confirm these:**

- Every High-confidence step individually. That is asking the user to write the SOP.
- The gaps. Gaps are reported, not negotiated. The user fills them after the document
  exists.
- Anything the redaction pass already decided is a credential.

### Running the confirmation

Use `AskUserQuestion`. Batch questions. Present a compact numbered read-back of the
reconstructed sequence first, then the questions against it.

Format the read-back as one line per step so the user can scan it fast:

```
Reconstructed sequence, Thursday August 13, 13:45 to 15:10:

 1. 13:47  GoHighLevel  Automation, Workflows, Create Workflow
 2. 13:49  GoHighLevel  Start from Scratch
 3. 13:52  GoHighLevel  Add trigger: Contact Tag Added
 ...
 9. 14:05  Chrome       (classified incidental: docs tab, 4 min)
10. 14:12  GoHighLevel  Add action: Custom Code
```

Then ask the batched questions. Suggested groupings for `AskUserQuestion`, one question per
group, options as concrete choices rather than open prose where possible:

| Question | Options |
|---|---|
| Session boundary correct? | Yes / Started earlier / Ended later / Wrong day |
| Items 9 and 14 classified as incidental. Correct? | Both incidental / 9 belongs in the SOP / 14 belongs in the SOP / Both belong |
| Output mode | Internal SOP / Training script / Client deliverable / Checklist |
| Include the trap at 14:33 that cost 8 minutes? | Include as warning / Include as decision point / Drop |

### After confirmation

Apply the corrections to the reconstruction, then render. Do not re-confirm the rendered
document line by line. One read-back gate, then produce the artifact.

If the user's corrections contradict the capture, the user wins on intent and the capture
wins on detail. If they say step 9 belongs in the SOP, include it. If they say the field
value was X and the capture clearly shows Y, present both: "captured as Y, user states X"
and ask once. Where internal evidence and a person's account disagree, present both
readings rather than resolving it by picking one (`evidence-standards.md` rule 10).

### The validation instruction that ships with the document

Confirmation by the author is not the same as validation. The archive is unanimous that an
SOP is validated by someone else executing it:

- EPA: "draft SOPs are actually tested by individuals other than the original writer"
  before finalization [research/raw/sop--official-standard--epa-qa-g6.md].
- Penn State: an unfamiliar person follows the procedure exactly, and "Any steps that cause
  confusion or hesitation for the test worker should be revised"
  [research/raw/sop--formats--psu-extension-writing-guide.md].
- The curse-of-knowledge countermeasure is user testing with the target audience
  [research/raw/sop--tacit-knowledge--earthly-curse-of-knowledge.md].

Every SOP this skill produces ends with a validation block telling the user what to do
next, naming the mechanism rather than gesturing at it:

```
## Before you rely on this

This SOP was reconstructed from capture and confirmed by <user>. It has not been executed
by anyone else. Published practice is to have someone other than the author run the
procedure exactly as written before it is treated as final. Any step that causes confusion
or hesitation for that person is a step to rewrite.

Owner: <name>          Next review: <date>          Version: 1.0
```

Owner, review date, and version are required elements, not decoration
[research/raw/sop--maintenance--glitter-why-docs-get-outdated.md,
research/raw/sop--official-standard--epa-qa-g6.md]. See `sop-formats.md` for the
provenance and maintenance blocks in full.
