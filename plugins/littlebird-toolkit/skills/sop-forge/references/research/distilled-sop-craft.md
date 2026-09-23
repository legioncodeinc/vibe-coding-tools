# Distilled: SOP and process documentation craft

Written from a fresh read of the 12 files in `raw/` on 2026-08-17. Every claim below ends
in a bracketed citation to the raw file it came from. Nothing here is authored from
training data. Where the archive is thin or the sources disagree, that is stated as a gap
or a conflict, not smoothed over.

Research window: sources fetched 2026-08-17. Two are older than 12 months by publication
date and are used deliberately: EPA QA/G-6 (2007 revision of a 2001 guidance) is the
governing standard in the field and has not been superseded
[raw/sop--official-standard--epa-qa-g6.md], and the ACTA method dates to 1998
[raw/sop--tacit-knowledge--commoncog-acta.md]. Both are foundational rather than current
events. Everything else is 2024 or later.

---

## 1. Format selection

Two independent taxonomies in the archive converge on four formats.

| Format | Penn State framing | Scribe framing | Best fit |
|---|---|---|---|
| Simple / step-by-step | Routine, short, few decisions [raw/sop--formats--psu-extension-writing-guide.md] | Linear, chronological [raw/sop--formats--scribe-sop-format.md] | Under about 10 steps, one path |
| Hierarchical | Main steps plus substeps, so experts skim and beginners drill [raw/sop--formats--psu-extension-writing-guide.md] | Large headers with subtasks under each [raw/sop--formats--scribe-sop-format.md] | Long procedures, mixed audience skill |
| Flowchart | Required when there are many decisions [raw/sop--formats--psu-extension-writing-guide.md] | Multiple outcomes, path selection [raw/sop--formats--scribe-sop-format.md] | Branching, conditional work |
| Checklist | Not in this taxonomy | Checkboxes, order optional, must state whether order matters [raw/sop--formats--scribe-sop-format.md] | Recurring verification, no teaching burden |

Penn State also names a **graphic procedure** format for long activities split into short
subprocesses, on the reasoning that "Workers can learn several short subprocesses more
easily than one long procedure" [raw/sop--formats--psu-extension-writing-guide.md].

**The selection matrix**, from the more authoritative of the two sources:

| Condition | Format |
|---|---|
| 10 steps or fewer, few decisions | Simple steps |
| More than 10 steps, few decisions | Hierarchical or graphic |
| Many decisions, any step count | Flowchart |

[raw/sop--formats--psu-extension-writing-guide.md]

**Conflict on hierarchical format.** Penn State says use it "when consistency is critical"
[raw/sop--formats--psu-extension-writing-guide.md]. Scribe says it is for "complex,
lengthy processes" and requires "in-depth knowledge of the process"
[raw/sop--formats--scribe-sop-format.md]. These are compatible rather than contradictory,
but they point at different selection triggers. Prefer the Penn State reading: the
deciding factor is whether two people doing this task the same way matters, not raw
length. Length is already covered by the step-count row of the matrix.

**Checklist caveat.** A checklist SOP has to state whether its items are ordered. Quoted:
"When creating checklist guides, always specify how to use your SOP for clarity"
[raw/sop--formats--scribe-sop-format.md]. A checklist derived from an observed session is
ordered by construction, since it came from a timeline, so say so.

---

## 2. Required elements of a defensible SOP

EPA QA/G-6 is the only source in the archive that carries the weight of a published
standard. Its required text elements [raw/sop--official-standard--epa-qa-g6.md]:

- **Title page:** activity title, SOP identification number, issue or revision date,
  owning unit, dated signatures of preparer and approver.
- **Table of contents** for longer SOPs.
- **Procedures section:** purpose, applicable standards, scope, then logical steps,
  optionally covering scope and applicability, method summary, definitions, health and
  safety warnings, cautions, interferences, personnel qualifications, equipment and
  supplies, detailed procedures, data management requirements.
- **QA/QC section:** how you know the work was done right, acceptance criteria, monitoring
  frequency, corrective action.
- **References section:** interfacing documents, related SOPs, published methods.

Penn State's lighter list agrees on the core and adds a materials or tools list and safety
precautions where the procedure is hazardous
[raw/sop--formats--psu-extension-writing-guide.md].

**Prerequisites are a named element, not an optional courtesy.** EPA lists personnel
qualifications and equipment and supplies as procedure subsections
[raw/sop--official-standard--epa-qa-g6.md], and the curse-of-knowledge literature names
"missing prerequisites" as a distinct failure mode where "content assumes foundational
knowledge readers lack" [raw/sop--tacit-knowledge--earthly-curse-of-knowledge.md].

---

## 3. Writing style: the rules that are actually testable

| Rule | Source phrasing |
|---|---|
| Active voice, present tense, step-by-step, easy to read | "concise, step-by-step, easy-to-read format" using "active voice and present verb tense" [raw/sop--official-standard--epa-qa-g6.md] |
| Imperative, action verb first | "The weight of feed refusals should be recorded" is poor; "Record the weight of feed refusals in the feeder notebook" is strong [raw/sop--formats--psu-extension-writing-guide.md] |
| Cut hedging and padding | "Make sure that you clean out all of the old grain from the calf pails before you put new grain in them" becomes "Empty all old grain from calf pails before feeding new grain" [raw/sop--formats--psu-extension-writing-guide.md] |
| Acronyms only when genuinely common | "Use acronyms only when they are commonly understood, not just to shorten your writing" [raw/sop--formats--psu-extension-writing-guide.md] |
| Remove ambiguity explicitly | "information should be conveyed clearly and explicitly to remove any doubt as to what is required" [raw/sop--official-standard--epa-qa-g6.md] |

---

## 4. The detail-level test, and the "no implied context" principle

The archive supplies one crisp, quotable standard for how much detail is enough. An SOP
must contain "sufficient detail so that someone with limited experience ... but with a
basic understanding, can successfully reproduce the procedure when unsupervised"
[raw/sop--official-standard--epa-qa-g6.md].

That is the operational definition of no implied context: the target reader has a basic
understanding of the domain and no experience of this specific procedure.

The worked example of a step that fails the test: "Predip all four teats with the green dip
cup" is too vague; adding "Squeeze dip up from bottom reservoir so that teat chamber is
3/4 full" supplies the precision that removes variation
[raw/sop--formats--psu-extension-writing-guide.md]. The pattern is that a step names the
control it acts on and the state it leaves that control in.

**Why writers fail the test.** The curse of knowledge is "the cognitive bias in which an
individual assumes that their audience possesses the prior knowledge necessary to
understand a concept, leading to ineffective communication," introduced by Camerer,
Loewenstein, and Weber, whose finding was that "better-informed parties are unable to
ignore their better information"
[raw/sop--tacit-knowledge--earthly-curse-of-knowledge.md]. Its four named failure modes in
procedural writing are unexplained jargon, missing prerequisites, skipped explanatory
steps, and lack of context (instructions without the why, so readers copy without
understanding) [raw/sop--tacit-knowledge--earthly-curse-of-knowledge.md].

**The counterweight.** Detail does not replace instruction: "Highly detailed procedures
cannot take the place of training" [raw/sop--formats--psu-extension-writing-guide.md]. And
training should carry the reasoning: "share the reasons why procedures must be performed
correctly, not just what to do or how to do it"
[raw/sop--formats--psu-extension-writing-guide.md].

---

## 5. Why asking the expert produces a bad SOP

This is the single strongest argument in the archive for deriving procedures from
observation rather than from an interview.

Cognitive task analysis is "a collection of interview-based, qualitative methods ... used
to identify the cognitive processes and skills required to perform complex tasks," and it
exists because "experts often find it difficult to reflect upon their own cognitive
processes" and existing elicitation techniques inadequately capture unarticulated
knowledge [raw/sop--tacit-knowledge--brown-power-gore-cta-2024.md]. The practitioner
restatement is blunter: experts answer direct questions with "I just know what to do" or
"I just do what feels right" [raw/sop--tacit-knowledge--commoncog-acta.md].

**Named methods and what each contributes:**

| Method | Structure | Reusable part |
|---|---|---|
| Critical Decision Method | Four sweeps: incident identification, timeline verification, deepening probes, hypothetical "what if?" [raw/sop--tacit-knowledge--brown-power-gore-cta-2024.md] | Sweep two, timeline read-back, is a confirmation gate |
| Applied Cognitive Task Analysis | Task diagram (3 to 6 steps, flagging cognitively demanding ones), knowledge audit, simulation interview, cognitive demands table [raw/sop--tacit-knowledge--commoncog-acta.md] | The task diagram and the knowledge-audit probes |

**CDM probe topics:** basis of choice, goals, information and cues, uncertainty, decision
barriers [raw/sop--tacit-knowledge--brown-power-gore-cta-2024.md].

**ACTA knowledge-audit probes:** past and future thinking, big picture, noticing patterns,
job smarts (efficiency), opportunities and improvising, self-monitoring. Optional probes
cover anomalies and equipment difficulties [raw/sop--tacit-knowledge--commoncog-acta.md].
ACTA table 3 probes in the academic source cover situational awareness, pattern
recognition, workarounds, improvisation, anomaly detection
[raw/sop--tacit-knowledge--brown-power-gore-cta-2024.md].

**Validation method.** CDM validates by having the interviewer narrate the reconstructed
account back to the participant for correction
[raw/sop--tacit-knowledge--brown-power-gore-cta-2024.md]. That is the academic warrant for
a mandatory confirm-the-reconstruction step.

**Named gap.** No source in the archive quantifies how many steps an expert omits when
self-describing a procedure. The academic source explicitly does not carry a figure
[raw/sop--tacit-knowledge--brown-power-gore-cta-2024.md] and the practitioner source
declines to quantify it [raw/sop--tacit-knowledge--commoncog-acta.md]. Any specific
percentage claim about omitted steps is unsupported by this archive and must not be
asserted.

---

## 6. Validation: someone else runs it

Two independent sources converge on the same validation mechanism, and it is the strongest
consensus in the archive.

- EPA: "draft SOPs are actually tested by individuals other than the original writer"
  before finalization [raw/sop--official-standard--epa-qa-g6.md].
- Penn State step 5: an unfamiliar person follows the procedure exactly, and "Any steps
  that cause confusion or hesitation for the test worker should be revised"
  [raw/sop--formats--psu-extension-writing-guide.md].
- Curse-of-knowledge countermeasure: "User testing with the target audience," plus
  reviewing your own draft after several days to spot overlooked assumptions
  [raw/sop--tacit-knowledge--earthly-curse-of-knowledge.md].

Penn State's full seven-step cycle: plan for results, first draft **by observing the actual
procedure being performed**, internal review by the workers, external review by technical
advisers, testing by an unfamiliar person, post, train
[raw/sop--formats--psu-extension-writing-guide.md]. Step 2 is worth naming: the published
best practice for a first draft is observation, not recollection.

Internal review also carries a buy-in argument: "People are much more likely to accept and
use the SOP if they feel a sense of ownership"
[raw/sop--formats--psu-extension-writing-guide.md].

---

## 7. What capture-based documentation tools actually produce, and where they break

| Tool | Capture | Output |
|---|---|---|
| Scribe | Browser extension, click capture | Text SOP with annotated screenshots, no video [raw/sop--tooling--vidocu-tool-comparison-2026.md] |
| Tango | Browser extension, click capture | Lightweight guides, in-app walkthroughs, no video [raw/sop--tooling--vidocu-tool-comparison-2026.md] |
| Guidde | Browser extension plus desktop app, records in its own tool | AI-narrated video plus step docs; cannot process video recorded elsewhere [raw/sop--tooling--vidocu-tool-comparison-2026.md] |
| Vidocu | Accepts any existing video including Loom exports and Zoom calls | Video walkthroughs, written guides, subtitles, voiceover [raw/sop--tooling--vidocu-tool-comparison-2026.md] |

**The category's quality ceiling, quoted:** "The step text is only as good as the UI labels
they capture," and for extension tools the advice is to "plan for a human cleanup pass
either way" [raw/sop--tooling--vidocu-tool-comparison-2026.md].

**Two structural gaps in the incumbent tools that matter here:**

1. **They require you to know in advance that you are documenting.** Every extension tool
   captures during an active recording session
   [raw/sop--tooling--vidocu-tool-comparison-2026.md]. Work already done is not
   recoverable by any of them except Vidocu, and only if a video happens to exist
   [raw/sop--tooling--vidocu-tool-comparison-2026.md].
2. **They infer steps from clicks, not from intent.** Vidocu's own pitch against the
   click-capture model is that "the expert's spoken explanation becomes the written step"
   [raw/sop--tooling--vidocu-tool-comparison-2026.md]. Take the self-favorable framing with
   salt; take the underlying criticism of click-inferred step text seriously, since the
   competitor comparison and the quality-ceiling quote agree with each other.

**Bias note.** The comparison source is published by one of the four vendors compared
[raw/sop--tooling--vidocu-tool-comparison-2026.md]. Its descriptions of competitor capture
mechanisms are checkable and consistent; its ranking is not evidence.

**Coverage gap.** The comparison source does not discuss screenshot noise, redaction, or
duplicate frames at all [raw/sop--tooling--vidocu-tool-comparison-2026.md]. The archive
has no source on deduplicating near-identical capture frames. That technique is
unsupported by research here and is treated in the skill as an engineering decision, not
as a documented best practice.

---

## 8. Redaction: the highest-risk area, and the evidence for treating it as mandatory

**What appears incidentally in screen capture**
[raw/sop--redaction--supportbench-screenshot-pii.md]:

| Category | Examples |
|---|---|
| Identifiers | Names, emails, phone numbers, addresses |
| Financial | Card numbers, CVVs, billing records, transaction detail |
| Authentication | Session tokens, API keys, bearer tokens, passwords |
| Technical | User IDs, internal subdomains, IP addresses |
| Health | PHI under HIPAA |
| Contextual | Browser tabs showing logged-in services, notification previews, calendar events |

The contextual row is the one people miss: the exposure is often not the window being
worked in but the tab strip, a notification toast, or an adjacent calendar entry
[raw/sop--redaction--supportbench-screenshot-pii.md].

**Documented incident.** One SaaS company's audit found 847 Jira tickets containing
unredacted PII including user emails and partial payment data, accessible to 200 staff
including contractors without Data Processing Agreements, accumulated over 18 months
[raw/sop--redaction--supportbench-screenshot-pii.md]. Quoted: "recordings capture more than
anyone intended" [raw/sop--redaction--supportbench-screenshot-pii.md].

**Automation is not sufficient.** Advanced AI redaction engines are cited at a 79.1%
zero-leak rate versus 38.6% for general text models
[raw/sop--redaction--supportbench-screenshot-pii.md]. At the state of the art that is
roughly one document in five still leaking. A human confirmation gate is required, not
optional.

**The incumbent tools gate redaction behind enterprise pricing.** Scribe's Smart Privacy
Screen is "a powerful screenshot redaction feature included in Enterprise plans"; its
documentation does not state whether redaction runs at capture time or after, publishes no
limitations section, and does not instruct users to verify redactions manually
[raw/sop--tooling--scribe-smart-privacy-screen.md]. Treat that last item as a documented
absence, not as evidence that verification is unnecessary.

**Technique that preserves usability.** Placeholder replacement substitutes labels such as
`[EMAIL]` or `[PHONE]` so the surrounding context still reads, versus blanket blurring
[raw/sop--redaction--supportbench-screenshot-pii.md]. Selective redaction targets
high-risk fields while preserving non-sensitive elements such as navigation paths
[raw/sop--redaction--supportbench-screenshot-pii.md]. For a written SOP this is the
governing technique: the step must stay followable after the value is removed.

**Retention** [raw/sop--redaction--supportbench-screenshot-pii.md]:

| Artifact | Retention |
|---|---|
| Original media | 30 to 90 days |
| Redacted output | 1 to 3 years per policy |
| Intermediate artifacts | Delete immediately after export |
| Audit logs | 5 to 7 years |

**Regulatory frames.** GDPR Article 5 treats unredacted media as a processing event
requiring lawful basis and technical safeguards. CCPA/CPRA carries fines up to $7,500 per
violation. HIPAA applies where PHI is captured. PCI-DSS classifies card capture as a
storage event triggering incident reporting. None of these laws name screenshots
explicitly; they treat any personal data capture as regulated activity
[raw/sop--redaction--supportbench-screenshot-pii.md].

**Evidence that a cheap intervention works.** After a 15-minute training module and
mandatory PII checks, the company in the incident above reported a 90% reduction in
screenshot PII incidents within 90 days
[raw/sop--redaction--supportbench-screenshot-pii.md]. A mandatory check step is
disproportionately effective relative to its cost.

---

## 9. Staleness and maintenance

**Review cadence, two sources, partly conflicting:**

| Class | Glitter AI | Tracework |
|---|---|---|
| Critical | Quarterly minimum [raw/sop--maintenance--glitter-why-docs-get-outdated.md] | Quarterly [raw/sop--maintenance--tracework-sop-review-update.md] |
| High-traffic or fast-changing | Monthly [raw/sop--maintenance--glitter-why-docs-get-outdated.md] | Quarterly [raw/sop--maintenance--tracework-sop-review-update.md] |
| Core operational | Annual audit of all materials [raw/sop--maintenance--glitter-why-docs-get-outdated.md] | Annual [raw/sop--maintenance--tracework-sop-review-update.md] |
| Stable, low risk | Not addressed | Biennial [raw/sop--maintenance--tracework-sop-review-update.md] |
| Governing standard | Not addressed | EPA: "every 1-2 years" systematic review [raw/sop--official-standard--epa-qa-g6.md] |

Tracework's own tiers are internally inconsistent, listing high-risk procedures at both
1-to-3-year cycles and quarterly in different places
[raw/sop--maintenance--tracework-sop-review-update.md]. Prefer the EPA baseline of a
systematic review every 1 to 2 years [raw/sop--official-standard--epa-qa-g6.md] with
tightening to quarterly where the underlying system changes often
[raw/sop--maintenance--glitter-why-docs-get-outdated.md]. Do not present a single confident
number.

**Out-of-cycle triggers** [raw/sop--maintenance--tracework-sop-review-update.md]: process,
technology, equipment, or facility change; regulatory update; audit finding or
non-conformance; customer complaint; near-miss, deviation, or incident; organizational
restructuring that moves responsibility.

**Why capture-based docs go stale faster.** The friction mechanism is specific and named:
retaking screenshots and re-annotating can turn a five-minute change into a 45-minute
project, so the update gets postponed
[raw/sop--maintenance--glitter-why-docs-get-outdated.md]. The other three causes are a
change process disconnected from documentation, diffuse ownership, and no staleness
detection [raw/sop--maintenance--glitter-why-docs-get-outdated.md].

**Ownership.** Domain-based, not a central documentation team: operations managers own
process SOPs; every document carries an owner, an accountable party, and review dates
[raw/sop--maintenance--glitter-why-docs-get-outdated.md]. Tracework's role split assigns
the SOP owner scheduling, input-gathering, and drafting
[raw/sop--maintenance--tracework-sop-review-update.md].

**Version control.** v1.0 at initial approval, minor changes v1.1 and v1.2, major
revisions v2.0 and v3.0, with a version history table recording number, date, change
summary, and approver [raw/sop--maintenance--tracework-sop-review-update.md]. EPA requires
per-page control notation carrying short title and identification number, revision number
and date, and "page X of Y," and states this "is critical when the need for evidentiary
records is involved" [raw/sop--official-standard--epa-qa-g6.md]. EPA also requires a master
SOP list with number, version, issuance date, title, author, status, division, and history
of previous versions [raw/sop--official-standard--epa-qa-g6.md].

**Maintenance budget.** One source suggests allocating roughly 10% of team capacity weekly
to documentation maintenance [raw/sop--maintenance--glitter-why-docs-get-outdated.md].
Single-source, no methodology, treat as a rule of thumb.

---

## 10. Delegation

The six levels, which give an SOP a way to state how much authority travels with the task
[raw/sop--delegation--foundr-six-levels.md]:

| Level | Name | Authority |
|---|---|---|
| 1 | Do as I say | Specific instructions, no judgment |
| 2 | Look into this for me | Gather information, principal decides |
| 3 | Give me your advice, and I'll decide | Research and narrow, principal chooses |
| 4 | Explore, decide, and check back with me | Decide, report before executing |
| 5 | Explore and decide, within these limits | Bounded authority, e.g. under $100 |
| 6 | Just get it done | Full trust, no check-ins |

Prioritization exercise offered: list 10 tasks you dislike or should not be handling,
assign each a level, identify who to hire
[raw/sop--delegation--foundr-six-levels.md]. Judgment rule: weigh "the balance between the
gravity of the project at hand and the expertise of the person"
[raw/sop--delegation--foundr-six-levels.md].

**Named gap, and it is the commercially important one.** The delegation source contains no
guidance on documenting a process before handing it off, and offers no quantitative data
linking delegation to business growth or founder time recovered
[raw/sop--delegation--foundr-six-levels.md]. The delegation literature in this archive
assumes the procedure already exists in writing. The archive contains no source measuring
what it costs a small operator to document a task, or how often documentation is skipped
because of that cost. That premise is the skill's commercial thesis and it is **not
evidenced by this archive**. Do not state it as a researched fact.

---

## 11. Gaps in this archive, stated plainly

1. **No quantification of expert step omission.** Both tacit-knowledge sources decline to
   put a number on it [raw/sop--tacit-knowledge--brown-power-gore-cta-2024.md,
   raw/sop--tacit-knowledge--commoncog-acta.md].
2. **No source on deduplicating near-identical capture frames.** The tooling source does
   not touch it [raw/sop--tooling--vidocu-tool-comparison-2026.md]. Treat frame
   deduplication as an engineering decision documented in the skill, not as a cited
   practice.
3. **No source on distinguishing a successful path from a failed attempt within a single
   observed work session.** The CTA literature handles retrospective incident accounts
   [raw/sop--tacit-knowledge--brown-power-gore-cta-2024.md], not continuous observation.
   The happy-path-versus-flailing separation in this skill is a design decision, evidenced
   only indirectly by the observation-first drafting step
   [raw/sop--formats--psu-extension-writing-guide.md].
4. **No cost-of-documentation study.** See section 10.
5. **Vendor-heavy tooling and maintenance sections.** Four of the twelve sources are
   published by vendors selling into this category
   [raw/sop--formats--scribe-sop-format.md, raw/sop--tooling--vidocu-tool-comparison-2026.md,
   raw/sop--tooling--scribe-smart-privacy-screen.md,
   raw/sop--maintenance--glitter-why-docs-get-outdated.md,
   raw/sop--maintenance--tracework-sop-review-update.md]. Their mechanism descriptions are
   usable; their effectiveness figures are marketing.
6. **Effectiveness claims with no methodology.** "Reduce the time teams spend documenting
   ... by 93%" and "Save 20+ hours a month" are vendor marketing figures with no published
   method [raw/sop--formats--scribe-sop-format.md]. Never repeat them as findings.
