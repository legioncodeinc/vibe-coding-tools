# Distilled: personal knowledge capture for technical troubleshooting

Stage 3 of the forge pipeline. Written from a fresh read of `raw/`. Every claim below ends
in a bracketed citation to the raw file that supports it. Anything with no citation is not
in the archive and does not belong in this skill's guides as a fact.

13 sources, all fetched 2026-08-17. Mix: 3 academic, 2 official-docs, 4 vendor-blog,
4 community.

---

## 1. The demand side: what a developer actually goes looking for

Two of the most frequent web search tasks for developers are explanations for unknown
terminology and explanations for exceptions and error messages
[raw/kb--dev-search--springer-what-developers-search-web.md]. The taxonomy that study built
has seven dimensions, and "debugging and bug fixing" is one of them, alongside programming,
third-party code reuse, tools, database, and testing
[raw/kb--dev-search--springer-what-developers-search-web.md].

The hardest searches, by developer self-report, are concentrated in exactly the categories
that produce long walls: performance bugs, multi-threading bugs, security bugs, database
optimization, and software configuration bugs
[raw/kb--dev-search--springer-what-developers-search-web.md]. Those are the sessions worth
capturing, because they are the ones the user will not re-derive quickly next time.

Search did not go away when AI assistants arrived. A 2025 follow-up study with 1,945 survey
responses and usage statistics from over 100,000 users of a code search tool found that
search frequency "has not changed despite the introduction of AI-enhanced development
support", although example-seeking specifically declined and exploratory use rose
[raw/kb--dev-search--nsf-10-years-later-code-search.md].

**Consequence for this skill.** The retrieval key for an entry is the error message, because
that is what the user searched for the first time and what they will search for again
[raw/kb--dev-search--springer-what-developers-search-web.md]. Building a searchable local
artifact is not fighting a dying behavior
[raw/kb--dev-search--nsf-10-years-later-code-search.md].

### Named gap

Neither developer-search source supplies a rate for **re-finding**, meaning how often a
developer searches for something they personally already solved
[raw/kb--dev-search--springer-what-developers-search-web.md,
raw/kb--dev-search--nsf-10-years-later-code-search.md]. The premise that people re-debug
the same wall is this skill's design premise and is **not evidenced by this archive**. Label
it as a premise in the guides, never as a finding.

---

## 2. Why personal knowledge bases die

Three independent sources converge on the same mechanism under the same name.

| Source | The named failure | The mechanism |
|---|---|---|
| Zettelkasten.de | Collector's Fallacy | Collecting produces immediate psychological reward, compared to Skinner's pigeon experiments, so hoarding is conditioned even though it produces nothing [raw/kb--pkm-failure--zettelkasten-collectors-fallacy.md] |
| Keiffenheim | Collector's Fallacy | The bottleneck is "retrieving the right thing at the right moment", not storage [raw/kb--pkm-failure--keiffenheim-digital-graveyard.md] |
| Shevchenko | Over-collection plus wrong index | Base became unmanageable at roughly 2,000 notes; 80% was raw external material and 20% was processed personal thought [raw/kb--pkm-failure--shevchenko-deleted-1500-notes.md] |

The clinical statement of the outcome: "to know about something' isn't the same as 'knowing
something'", and unprocessed collections become "liabilities" that accumulate faster than
they can be engaged, become unmanageable, and are then ignored entirely
[raw/kb--pkm-failure--zettelkasten-collectors-fallacy.md]. Or, from the practitioner:
"My system wasn't a thinking partner but a beautiful, well-organized, time-consuming
digital graveyard" [raw/kb--pkm-failure--keiffenheim-digital-graveyard.md].

The only concrete counts in the archive: a base that grew to 4,500 notes, of which 1,500
were deleted or reorganized in a single cleanup, having become unmanageable at around 2,000
[raw/kb--pkm-failure--shevchenko-deleted-1500-notes.md].

### The repair that both traditions agree on

Index by future retrieval context, not by topic. The practitioner's fix was to stop grouping
by topic and instead ask "in what context might I refer to this note in the future?"
[raw/kb--pkm-failure--shevchenko-deleted-1500-notes.md]. The knowledge base literature states
the same rule from the other direction: "Use the reader's language. Titles and symptom
descriptions should use the exact error message text, the exact UI phrase, or the exact
phrasing readers use in support tickets"
[raw/kb--entry-structure--document360-troubleshooting-articles.md]. Two different domains,
independent sources, identical conclusion. Treat this as the archive's strongest finding.

The counter-practice from the Zettelkasten source is threefold: active processing in your
own words, short cycles rather than bulk collection, and hard limits, with everything
collected processed before new collection starts
[raw/kb--pkm-failure--zettelkasten-collectors-fallacy.md].

### The risk this creates for an automated capturer

Automation makes collection free. The Collector's Fallacy is a reward loop attached to the
act of collecting [raw/kb--pkm-failure--zettelkasten-collectors-fallacy.md], and a skill
that appends entries without the user's engagement removes the only step the archive says
produces knowledge, which is effortful engagement
[raw/kb--pkm-failure--keiffenheim-digital-graveyard.md]. This is why the confirmation gate
exists and why the weekly routine proposes rather than writes.

### Named gap

**No source in this archive supplies an abandonment rate for personal knowledge bases.**
The Keiffenheim piece explicitly contains no empirical data, statistics, or survey research
on abandonment [raw/kb--pkm-failure--keiffenheim-digital-graveyard.md], and the Shevchenko
counts are a single person's [raw/kb--pkm-failure--shevchenko-deleted-1500-notes.md]. The
mechanism is well attested across three sources; the prevalence is not measured anywhere
here. Never write a percentage for how many knowledge bases die.

---

## 3. The structure of a good troubleshooting entry

The canonical section order, from platform documentation
[raw/kb--entry-structure--document360-troubleshooting-articles.md]:

1. Title, naming the symptom
2. Symptom description, 1 to 2 sentences
3. Cause, where known
4. Resolution, numbered steps or split by cause
5. If the issue persists, escalation guidance
6. Related articles

Mandatory versus optional in that template: title and symptom are essential, resolution is
mandatory, and **cause is included "where known" and omitted if unknown**
[raw/kb--entry-structure--document360-troubleshooting-articles.md]. The template tolerates
a missing cause rather than forcing a guess, which is the direct license for this skill's
"cause never established, fix was empirical" marker.

Symptom text should use "concrete, observable terms": what the reader sees, the specific
error message, or the missing result
[raw/kb--entry-structure--document360-troubleshooting-articles.md]. Titles should "name the
symptom or error the reader is experiencing", with worked examples including "Import fails
with 'Invalid file format' error"
[raw/kb--entry-structure--document360-troubleshooting-articles.md].

Additional writing rules from the same source: order resolutions by likelihood with the most
common fix first, flag irreversible or risky steps, end each resolution with an explicit
expected outcome, and keep a blame-free tone
[raw/kb--entry-structure--document360-troubleshooting-articles.md].

### What this entry is NOT

A knowledge base article and a runbook are different artifacts: "A knowledge base helps
people find, understand, and reuse information. A runbook tells someone exactly how to
perform a known operational task"
[raw/kb--entry-structure--knowledge-base-vs-runbook.md]. Knowledge base content carries
context, symptoms, causes, related issues, and links; runbooks carry exact ordered steps,
prerequisites, validation checks, rollback instructions, and escalation criteria
[raw/kb--entry-structure--knowledge-base-vs-runbook.md]. Selection rule: knowledge base
article when "someone needs to understand or find an answer", runbook when "someone needs to
do something safely and repeatably"
[raw/kb--entry-structure--knowledge-base-vs-runbook.md].

A personal debugging entry is the first kind. Do not pad it with rollback paths and
escalation criteria.

### The metadata that keeps an entry alive

From runbook practice: version number, last reviewed date, next review date, and a **named
individual owner rather than team ownership**, with version control and named ownership
identified as what separates a maintained document from an abandoned one
[raw/kb--entry-structure--checkflow-it-runbook-template.md].

Eight named failure modes for operational documentation, of which four transfer directly to
a personal knowledge base: written once and never updated, too long and too explanatory,
commands requiring manual variable substitution with no guidance on what to substitute, and
never tested by anyone except the author
[raw/kb--entry-structure--checkflow-it-runbook-template.md].

That third one is worth pausing on. It is the redaction problem stated as a usability
problem: an entry whose commands contain placeholders the reader cannot resolve is a dead
entry [raw/kb--entry-structure--checkflow-it-runbook-template.md].

---

## 4. Incident-note practice, applied to one person

The required elements of a postmortem are a written record of the incident and its impact,
the actions taken to mitigate or resolve it, the root cause or causes, and follow-up actions
to prevent recurrence [raw/kb--postmortem--google-sre-postmortem-culture.md]. Note that
impact, actions taken, and root cause are three separate fields, not one narrative
[raw/kb--postmortem--google-sre-postmortem-culture.md]. That separation is the source of
this skill's rule that Symptom and Root cause are distinct fields.

**Define the trigger in advance.** "It is important to define postmortem criteria before an
incident occurs so that everyone knows when a postmortem is necessary"
[raw/kb--postmortem--google-sre-postmortem-culture.md]. The published criteria are all
threshold-based: user-visible degradation past a threshold, any data loss, an on-call
intervention, resolution time above a threshold, or a monitoring failure meaning the
incident was found by hand [raw/kb--postmortem--google-sre-postmortem-culture.md]. A
personal capture skill needs the same thing: a written definition of what counts as a
solve, decided before the sweep runs, not case by case.

**Blamelessness.** A blameless record "must focus on identifying the contributing causes of
the incident without indicting any individual or team", assuming everyone "had good
intentions and did the right thing with the information they had", because where blame
culture prevails "people will not bring issues to light for fear of punishment"
[raw/kb--postmortem--google-sre-postmortem-culture.md]. For a single-user knowledge base the
target of blame is the user themselves, and the failure mode is the same: an entry that
reads as self-indictment will not get written next week.

**An unreviewed record is worthless.** "An unreviewed postmortem might as well never have
existed" [raw/kb--postmortem--google-sre-postmortem-culture.md]. Google's own practice
pairs this with regular review sessions and with automated trend analysis across many
postmortems, meaning recurrence across records is itself treated as a signal
[raw/kb--postmortem--google-sre-postmortem-culture.md]. That is the evidence for this
skill's recurrence escalation.

---

## 5. Staleness: the best-measured risk in this archive

A personal fix record is structurally the same artifact as a Stack Overflow answer, and the
obsolescence of those has been measured. From a study of 52,177 answer threads, 58,201
obsolescence-mentioning comments, and 12,629 tags
[raw/kb--staleness--arxiv-obsolete-stackoverflow-answers.md]:

| Finding | Value |
|---|---|
| Obsolete answers already obsolete when first posted | 58.4% |
| Obsolete answers ever updated after being flagged | 20.5% |
| Cases where a new answer was added instead | 6.3% |
| Average time for users to react after obsolescence is observed | 118 days |
| Average time to actually update | 119 days |
| Observations that included supporting evidence | 78.6% |
| Links inside answers that were inaccessible, of 5.5 million | 11.9% |

Who notices: outsiders never previously involved, 38.2%; the original answerer, 24.3%; the
question asker, 20.5% [raw/kb--staleness--arxiv-obsolete-stackoverflow-answers.md]. For a
personal knowledge base there are no outsiders, which removes 38.2% of the observation
capacity that the public platform has. This is an inference from the data, not a finding in
the paper; label it as such.

Why answers go stale, ranked: third-party libraries 31.7%, programming languages 30.9%,
obsolete references and dead links 15.5%, tools 12.9%, mobile operating systems 11.4%,
non-mobile operating systems 2.1%, protocols 1.0%
[raw/kb--staleness--arxiv-obsolete-stackoverflow-answers.md]. Roughly 63% of staleness comes
from the two fastest-moving dependency categories.

Most obsolescence-prone tags: node.js 0.36%, ajax 0.34%, android 0.32%, objective-c 0.32%
[raw/kb--staleness--arxiv-obsolete-stackoverflow-answers.md].

**The authors' recommendation to users is the rule this skill implements: include version
and time information when answering**, and read the comments for obsolescence indicators,
especially in web and mobile tags
[raw/kb--staleness--arxiv-obsolete-stackoverflow-answers.md].

Review cadence from the operational side: quarterly for frequently changed systems,
annually for stable procedures, immediately after any change affecting the procedure, plus
an annual library-wide audit flagging anything not reviewed in 12 or more months
[raw/kb--entry-structure--checkflow-it-runbook-template.md].

---

## 6. The AI-assisted solve is a distinct category

Two independent 2025 and 2026 sources:

| Measure | Value | Source |
|---|---|---|
| Developers who say they use AI-generated code they do not fully understand | 59% (n=800, fielded June 2025) | [raw/kb--ai-solves--clutch-devs-dont-understand-ai-code.md] |
| Developers who trust AI tools, 2023 | 40% | [raw/kb--ai-solves--stackoverflow-trust-gap.md] |
| Developers who trust AI tools, 2025 | 29% | [raw/kb--ai-solves--stackoverflow-trust-gap.md] |
| Developers who use or plan to use AI tools, 2025 | 84% | [raw/kb--ai-solves--stackoverflow-trust-gap.md] |

**Conflict handling.** These two do not measure the same thing. One is stated trust, the
other is reported behavior, and the gap between them is itself the finding
[raw/kb--ai-solves--stackoverflow-trust-gap.md]. Do not merge them into a single claim such
as "most developers distrust and misuse AI code". State them separately.

Supporting security data reported in the Clutch piece: 38.8% of 1,689 analyzed Copilot
programs contained security flaws, 32.8% of 452 Python snippets, and 24.5% of 452
JavaScript snippets [raw/kb--ai-solves--clutch-devs-dont-understand-ai-code.md]. The 59%
figure is self-reported [raw/kb--ai-solves--clutch-devs-dont-understand-ai-code.md].

On what verification actually costs: "When every piece of AI-generated code requires
verification, you can't just accept it and move on. Instead, you have to read it carefully,
understand what it's doing, test it thoroughly, and check for edge cases"
[raw/kb--ai-solves--stackoverflow-trust-gap.md].

**Consequence for this skill.** A fix the user accepted without understanding is the entry
they are least able to reconstruct from memory later, because there is no memory to
reconstruct from. That makes it the highest-value capture and it needs its own entry type,
with the Root cause field usually honestly empty
[raw/kb--ai-solves--clutch-devs-dont-understand-ai-code.md,
raw/kb--entry-structure--document360-troubleshooting-articles.md].

---

## 7. On-disk format for a personal technical knowledge base

The only concrete layout in the archive: root `index.md` entry point, one directory per
major topic each with its own `index.md`, individual `.md` files inside, optional further
nesting, aiming to be "just organised enough without having a crazy directory tree
structure" [raw/kb--structure--devto-personal-git-repo-wiki.md].

The argument for plain markdown in version control over a hosted tool: portability, since
"This approach removes the reliance on proprietary sites"; durability, since "each copy of
the repo is just the same as any other"; freedom from any particular standard; and low
formatting effort for code snippets, links, and tables
[raw/kb--structure--devto-personal-git-repo-wiki.md]. Markdown is chosen because it "is
familiar to a large proportion of developers, is easy to write, and widely-supported"
[raw/kb--structure--devto-personal-git-repo-wiki.md].

### Named gap

That source **does not solve search**. Its layout is browsable, not indexed, and it offers
no answer to finding an entry by a remembered error string months later
[raw/kb--structure--devto-personal-git-repo-wiki.md]. This skill's greppable symptom line
and generated index are a **design decision filling that gap**, not researched practice.

---

## 8. What the archive does not cover

Named honestly rather than padded from training data.

| Gap | Consequence |
|---|---|
| No re-finding rate for developers re-solving their own past problems | The skill's founding premise is a premise. Say so. |
| No abandonment rate for personal knowledge bases | Mechanism is well attested, prevalence is not. Never cite a number. |
| No research on deduplicating entries in a personal knowledge base | The dedupe design, similarity thresholds, and merge rules are design decisions. |
| No research on estimating time cost from periodic screen capture | The bounded-range method is a design decision derived from how snapshot capture works, not from a study. |
| No source on solve detection from observational data of any kind | The entire detection method in `solve-detection.md` is a design decision. It is the largest unevidenced piece of this skill and is labelled as such there. |
| No source on secret scrubbing in this archive | Deliberate. That method is inherited by reference from the `sop-forge` skill, which carries its own archive for it. Nothing about redaction is claimed as evidenced here. |

---

## 9. Source inventory and reliability

| File | Type | Reliability note |
|---|---|---|
| `raw/kb--staleness--arxiv-obsolete-stackoverflow-answers.md` | academic | Strongest source here. Peer-reviewed, large corpus, explicit 75% detection accuracy caveat. |
| `raw/kb--dev-search--springer-what-developers-search-web.md` | academic | Solid method, but the fetched content carries no per-task percentages. Ordinal only. |
| `raw/kb--dev-search--nsf-10-years-later-code-search.md` | academic | Large sample. Findings are qualitative in the fetched content. |
| `raw/kb--postmortem--google-sre-postmortem-culture.md` | official-docs | Practice owner, widely adopted. Prescriptive, not measured. |
| `raw/kb--entry-structure--document360-troubleshooting-articles.md` | official-docs | Product documentation. Prescriptive. The searchability rule is corroborated independently by the Shevchenko source. |
| `raw/kb--entry-structure--checkflow-it-runbook-template.md` | vendor-blog | Expert opinion, no measurements. |
| `raw/kb--entry-structure--knowledge-base-vs-runbook.md` | vendor-blog | Commercial interest in both categories. Distinction is internally consistent, unevidenced. |
| `raw/kb--ai-solves--clutch-devs-dont-understand-ai-code.md` | vendor-blog | Self-reported survey, n=800, disclosed date. Usable. |
| `raw/kb--ai-solves--stackoverflow-trust-gap.md` | vendor-blog | Vendor reporting its own survey; sample size not published in fetched content. |
| `raw/kb--pkm-failure--zettelkasten-collectors-fallacy.md` | community | Practitioner essay. Mechanism by analogy, untested. |
| `raw/kb--pkm-failure--keiffenheim-digital-graveyard.md` | community | Practitioner essay. Explicitly zero data. |
| `raw/kb--pkm-failure--shevchenko-deleted-1500-notes.md` | community | Single-person counts. Existence proof, not a rate. |
| `raw/kb--structure--devto-personal-git-repo-wiki.md` | community | Single practitioner layout. Does not solve search. |

Official docs and academic sources carry sections 1, 3, 4, and 5. Sections 2 and 7 rest on
community practitioner writing, which is the weakest part of the archive and is flagged
wherever it is used.
