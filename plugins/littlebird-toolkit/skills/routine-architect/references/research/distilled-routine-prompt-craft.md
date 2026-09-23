# Distilled: the craft of prompting an unattended recurring agent

Written from a fresh read of the 14 files in `raw/` on 2026-08-17. Every claim below ends in
a bracketed citation to the raw file it came from. Nothing here is authored from training
data. Where the archive is thin or the sources disagree, that is stated as a gap or a
conflict rather than smoothed into a single confident line.

**Research window.** Sources were swept on 2026-08-17. Ten are current: published inside the
last 12 months, or living vendor documentation fetched on that date. Four are deliberately
older and are used because they are foundational rather than current: two peer-reviewed
measurement studies from 2022 and 2009, the Google SRE alerting document, and the Army
writing regulation restated in a 2020 essay. Each of those four raw files states why it was
kept.

---

## 1. The one-sentence version

A recurring routine is an alert stream with a language model attached. The prompt-craft
literature tells you how to make a single run produce good output. The alert-fatigue
literature tells you what happens over hundreds of runs when that output is not worth
reading. A routine prompt that only obeys the first body of work produces a well-written
report the user stops opening.

---

## 2. What both vendors agree on

Where OpenAI and Anthropic independently give the same rule, treat it as a property of
language models rather than of one model family.

| Rule | Anthropic | OpenAI |
|---|---|---|
| Be explicit about what you want, not what you do not want | "Tell the model exactly what you want to see"; tell it what TO do instead of what NOT to do [raw/routine--prompt-craft--anthropic-best-practices-2026.md] | Instructions section covers both, but output format is specified positively and exactly [raw/routine--prompt-craft--openai-prompt-engineering-guide.md] |
| Specify output format and constraints precisely | Include word count, format, timeline [raw/routine--prompt-craft--anthropic-best-practices-2026.md] | "Only output a single word in your response with no additional formatting or commentary" [raw/routine--prompt-craft--openai-prompt-engineering-guide.md] |
| Give context and motivation for constraints | Explaining why a behavior matters helps the model handle unanticipated cases [raw/routine--prompt-craft--claude-platform-docs-prompting.md] | Prompt structure opens with identity and purpose before rules [raw/routine--prompt-craft--openai-prompt-engineering-guide.md] |
| Use a small number of concrete examples | 3 to 5, relevant, diverse, covering edge cases [raw/routine--prompt-craft--claude-platform-docs-prompting.md] | "a handful of input/output examples", positive and negative [raw/routine--prompt-craft--openai-prompt-engineering-guide.md] |
| Sequence the instructions | Numbered lists when order or completeness matters [raw/routine--prompt-craft--claude-platform-docs-prompting.md] | Decompose into sub-tasks, confirm each is completed [raw/routine--prompt-craft--openai-prompt-engineering-guide.md] |
| Name the edge cases explicitly | Give permission to express uncertainty rather than speculate [raw/routine--prompt-craft--anthropic-best-practices-2026.md] | "Capture edge cases... such as how to proceed when a user provides incomplete information" [raw/routine--agent-design--openai-practical-guide-agents.md] |

**The clarity test**, and the most useful single sentence in the archive for auditing
somebody else's prompt: "Show your prompt to a colleague with minimal context on the task
and ask them to follow it. If they'd be confused, Claude will be too."
[raw/routine--prompt-craft--claude-platform-docs-prompting.md] The same source frames the
model as "a brilliant but new employee who lacks context on your norms and workflows".

**Permission to find nothing.** The worked example is directly transferable: "Analyze this
financial data and identify trends. If the data is insufficient to draw conclusions, say so
rather than speculating", with the stated effect of reducing hallucination
[raw/routine--prompt-craft--anthropic-best-practices-2026.md]. A routine with no such clause
has been given an implicit quota to fill.

---

## 3. Conflict: XML tags

Two first-party Anthropic sources disagree.

- The 2026 best-practices blog post lists **XML tags and heavy role-prompting among
  "outdated techniques"** to stop relying on
  [raw/routine--prompt-craft--anthropic-best-practices-2026.md].
- The platform documentation **actively recommends XML tags** for structuring complex
  prompts, with worked examples, and recommends setting a role in the system prompt
  [raw/routine--prompt-craft--claude-platform-docs-prompting.md].
- The context-engineering post splits the difference, recommending prompts "organized into
  distinct sections using XML tags or Markdown headers"
  [raw/routine--agent-design--anthropic-context-engineering.md].
- OpenAI recommends both Markdown headers for sections and XML tags for content boundaries
  [raw/routine--prompt-craft--openai-prompt-engineering-guide.md].

**Preferred reading, and why.** The disagreement is about elaborate XML scaffolding as a
default technique, not about section structure. Three of the four sources endorse sectioned
structure in some markup. For routine prompts specifically, prefer Markdown headers and
numbered sections: a routine prompt is entered into a small product text box, is read and
edited by the user in that box, and the platform docs' own advice to match prompt style to
desired output style [raw/routine--prompt-craft--claude-platform-docs-prompting.md] points
the same way, since routine reports render as Markdown. This is a preference between
defensible options, not a resolved fact.

---

## 4. Alert fatigue is the governing constraint

This is the richest vein in the archive and the one that should carry the most weight.

### 4.1 The measured damage

In an emergency department medication alert system, 382 sampled alerts reviewed by a
clinician panel [raw/routine--alert-fatigue--jmir-alert-appropriateness-2022.md]:

| Measure | Value |
|---|---|
| Alerts overridden | 92.9% |
| Alerts judged clinically appropriate | 7.3% |
| Justifiable overrides (bad alert, correct human response) | 89% |
| Successfully triggered (good alert, correct response) | 3.4% |

The system was wrong and the human was right to ignore it in 89 cases out of 100. The
authors' conclusion: "Alert fatigue is unavoidable when a large number of irrelevant alerts
are generated in response to a small number of useful alerts."
[raw/routine--alert-fatigue--jmir-alert-appropriateness-2022.md]

The identified cause is worth reading twice, because it is exactly the failure of a vague
routine prompt: the algorithm "operates as a rule base without reflecting the individual
condition of the patient"
[raw/routine--alert-fatigue--jmir-alert-appropriateness-2022.md]. It applies a general rule
without the specific context that would tell it whether the rule matters here.

### 4.2 Fatigue is a trend, not a level

The 2026 JAMIA systematic review of 22 systematic reviews proposes measuring alert fatigue
as "a statistically significant, sustained decrease in appropriate response rates over time
relative to a previously established baseline"
[raw/routine--alert-fatigue--jamia-systematic-review-2026.md]. The one explicit definition
found among the included studies: alert fatigue occurs when "excessive and/or irrelevant
alerts lead recipients to ignore, overlook, or override alerts"
[raw/routine--alert-fatigue--jamia-systematic-review-2026.md].

**Consequence for auditing a routine.** The diagnostic signal is engagement declining over
the report history, not any single bad report. This is why an audit must read the reports
in sequence, and it is why a paused-on-unread routine is a measured fatigue event rather
than an administrative detail.

### 4.3 The field measures proxies, and says so

Across 22 reviews: alert quantity reported by 54.5%, override rate by 45.5%, acceptance
rate by 45.5%, appropriateness or positive predictive value by only 31.8%, and appropriate
versus inappropriate override split by only 13.6%
[raw/routine--alert-fatigue--jamia-systematic-review-2026.md]. The review warns that
interventions "directed toward proxies of alert fatigue may be ineffective if alert fatigue
is not actually present" [raw/routine--alert-fatigue--jamia-systematic-review-2026.md].
Study quality was medium in 81.8% of cases.

**Consequence.** Do not treat "the user ignored it" as automatically proving the routine is
bad. Distinguish an inappropriate finding from an appropriate finding the user chose not to
act on. That distinction is the one the literature itself reports least often, and it is
the one an audit has to make.

### 4.4 The operations rule set

The SRE framing gives the crispest actionable rules
[raw/routine--alert-fatigue--ewaschuk-philosophy-on-alerting.md]:

- "Pages should be urgent, important, actionable, and real."
- "Every page should be actionable; simply noting 'this paged again' is not an action."
- "Every page should require intelligence to deal with: no robotic, scriptable responses."
- "I can only do this a few times a day before I get fatigued."
- "Err on the side of removing noisy alerts, over-monitoring is a harder problem to solve
  than under-monitoring."
- "Alerts that are less than 50% accurate are broken; even those that are false positives
  10% of the time merit more consideration."

The five pre-writing questions transfer to routine design almost unchanged: is the
condition urgent and actionable, will you ever legitimately ignore it, is it definitely
hurting the user with edge cases filtered, can urgent action be taken, and is someone else
already handling it
[raw/routine--alert-fatigue--ewaschuk-philosophy-on-alerting.md].

**Symptoms over causes.** Alert on what the user experiences rather than the underlying
mechanism, because "You're going to have to catch the symptom anyway"
[raw/routine--alert-fatigue--ewaschuk-philosophy-on-alerting.md].

**Sub-critical alerts.** Things that need timely response but not interruption belong in
tickets, daily reports, or email, "but only with clear accountability systems"
[raw/routine--alert-fatigue--ewaschuk-philosophy-on-alerting.md]. A daily report with no
owner and no named next action is not a control. This is the archive's own argument for the
handoff line.

### 4.5 Conflict: does a high false-positive rate actually cause people to ignore alerts?

The clinical literature says yes. A 2009 Human Factors study of air traffic control conflict
alerts says not necessarily [raw/routine--alert-fatigue--wickens-atc-cry-wolf-2009.md]:

- 45% of alerts were false, with per-center rates from 0.28 to 0.58.
- Investigators found "no evidence that these were nonresponses to true alerts or that
  response times were delayed in those centers."
- Controllers instead showed "desirable anticipatory behavior by issuing trajectory changes
  prior to the alert", meaning the alert was often redundant because the expert had already
  acted.
- Conclusion: "The high false-alarm rate does not appear to induce cry wolf behavior in the
  context of en route ATC conflict alerts."

**Both readings, stated.** A 45% false rate did not degrade expert response in ATC; a 92.7%
inappropriate rate coincided with a 92.9% override rate in the ED. The studies are not
directly comparable and the raw file names the differences: operator expertise, stakes,
whether the underlying condition was independently visible, and how the response was
measured.

**Preferred reading for this domain, with reasoning.** Take the pessimistic clinical
reading for routine design. Three reasons drawn from the archive. First, the ATC finding
depends on the operator already watching the underlying condition independently and acting
before the alert fires; a routine user is not monitoring their own inbox continuously, which
is the entire reason the routine exists. Second, the ATC alerts were high-stakes and
unambiguous, whereas routine findings are low-stakes and ambiguous, which is the regime
where "will you ever legitimately ignore this rule knowing it's benign"
[raw/routine--alert-fatigue--ewaschuk-philosophy-on-alerting.md] answers yes. Third, the
asymmetry argument stands regardless: over-monitoring is the harder problem to fix
[raw/routine--alert-fatigue--ewaschuk-philosophy-on-alerting.md], so the cheaper error is to
be too quiet.

The honest statement of this is that the ATC result narrows the claim rather than
overturning it: high false-positive rates are dangerous for a non-expert recipient who is
not independently monitoring the signal, which is the routine case.

---

## 5. Memory across runs is a mechanism, not a model property

The clearest first-party statement is that agents keep coherence across context resets by
consulting **their own written notes**, not by remembering
[raw/routine--agent-design--anthropic-context-engineering.md]. The named techniques are
compaction, structured note-taking to external memory, and sub-agents returning distilled
summaries. The described results, agents maintaining "precise tallies across thousands of
game steps" and resuming "multi-hour training sequences" after a reset, are attributed to
the agent reading back its record
[raw/routine--agent-design--anthropic-context-engineering.md].

The platform docs say the same thing from the other direction: when a context window is
cleared, be prescriptive about how the next session starts, with worked instructions like
"Review progress.txt, tests.json, and the git logs"
[raw/routine--prompt-craft--claude-platform-docs-prompting.md].

**Consequence, and this is the load-bearing inference of the whole archive.** Every routine
run is a fresh context window. The routine's past reports are its external memory. A prompt
that does not instruct the run to read them has not given the agent amnesia by accident, it
has declined to build the memory mechanism at all. Continuity across runs is a prompt
feature, not a model capability.

**Observed confirmation.** In the live account, the active routine's prompt contains no
memory instruction. Some of its reports reference earlier ones and some do not, run to run
[raw/routine--grounding--littlebird-live-account-2026-08-17.md]. Uninstructed memory is
non-deterministic memory.

**Named gap.** No source in the archive measures how much a read-your-own-history
instruction improves recurring agent output. The mechanism is documented; the effect size is
not. Do not claim a number.

---

## 6. Escalation has to be a stated rule

Two independent sources put an explicit failure threshold in the design.

- OpenAI's agent guide names failure thresholds as a human-in-the-loop trigger: "If the
  agent exceeds these limits (e.g., fails to understand customer intent after multiple
  attempts), escalate to human intervention"
  [raw/routine--agent-design--openai-practical-guide-agents.md]. A core agent property is
  that "In case of failure, it can halt execution and transfer control back to the user"
  [raw/routine--agent-design--openai-practical-guide-agents.md].
- The SRE rule is the same idea stated as a prohibition: "simply noting 'this paged again'
  is not an action"
  [raw/routine--alert-fatigue--ewaschuk-philosophy-on-alerting.md].

**Consequence.** Repetition is itself a finding, and the prompt has to say what to do with
it. Without a threshold, a model that notices repetition has nowhere to go but louder.

**Observed confirmation, and the sharpest single receipt in the archive.** The live
routine's reports self-report the repetition without changing behavior: "It's been the #1
item for three days straight", then the next day, "This has been the #1 item for four
straight days and it's now at the point of actual data loss". The section heading escalated
to "CRITICAL". The recommended action never changed
[raw/routine--grounding--littlebird-live-account-2026-08-17.md]. Awareness without a rule
produces volume, not a change of tactic.

---

## 7. Report structure: what a good recurring digest looks like

### 7.1 Lead with the decision

Army Regulation 25-50 requires "the main point at the beginning of the correspondence
(bottom line up front)"; Air Force Handbook 33-337 says "state your bottom line early in the
message" [raw/routine--digest-design--bluf-strom-awn.md]. The distinction that matters: a
bottom line is not a summary. A summary recaps content; a bottom line captures "the decisive
moment of your argument" in one or two sentences and lets the reader respond immediately
[raw/routine--digest-design--bluf-strom-awn.md]. The technique is noted as working best in
asynchronous, high-information settings, which is exactly a scheduled report
[raw/routine--digest-design--bluf-strom-awn.md].

### 7.2 Scale the detail to the item count

Concrete tiered rendering [raw/routine--digest-design--suprsend-batching-digests-2026.md]:

| Items | Rendering |
|---|---|
| 1 to 3 | Full detail |
| 4 to 10 | Headlines with links |
| 11 or more | Top 3 to 5 by priority or recency, then a count |

### 7.3 Group by entity, not globally

Group by the thing the item belongs to, because "5 comments on your post" is useful and "47
updates across your account" is not
[raw/routine--digest-design--suprsend-batching-digests-2026.md].

### 7.4 Some things must not wait for the digest

Critical items bypass batching entirely, and the vendor stresses this is "not an edge case"
[raw/routine--digest-design--suprsend-batching-digests-2026.md]. Named examples include
payment failures and account lockouts.

**Consequence for schedule selection.** If a routine's most valuable finding is one that
cannot wait for the next scheduled run, the schedule is wrong, or the finding belongs to a
different routine with a tighter cadence.

### 7.5 The framing claim

"The problem is not notification volume. It is notification interrupt volume." A single
email summarizing 15 updates is useful; fifteen separate notifications over three hours is
not [raw/routine--digest-design--suprsend-batching-digests-2026.md].

### 7.6 Flagged as marketing

The same source's claim that fewer batched notifications increased open rates carries no
study, sample, or method [raw/routine--digest-design--suprsend-batching-digests-2026.md].
Its fatigue figures (46 push notifications daily per average US user; 3 to 6 weekly
notifications causing 40% of users to disable) are attributed second-hand to Business of
Apps and are not independently verifiable from the archive. Use the mechanism, not the
numbers.

---

## 8. What scheduled-agent products actually do

Two vendors, documented behavior, useful because it shows which constraints are structural
rather than Littlebird quirks.

| Property | ChatGPT scheduled tasks | Gemini scheduled actions |
|---|---|---|
| Active limit | 3 (Go), 5 (Plus), 10 (Business and Edu), 15 (Pro and Enterprise) [raw/routine--scheduled-agents--openai-chatgpt-scheduled-tasks.md] | 10 [raw/routine--scheduled-agents--google-gemini-scheduled-actions.md] |
| Minimum interval | Cannot run more than once per hour [raw/routine--scheduled-agents--openai-chatgpt-scheduled-tasks.md] | Not stated |
| Auto-pause | May auto-pause after inactivity [raw/routine--scheduled-agents--openai-chatgpt-scheduled-tasks.md] | Pauses automatically after inactivity; does not expire [raw/routine--scheduled-agents--google-gemini-scheduled-actions.md] |
| Change-detection as a task type | Supported and named [raw/routine--scheduled-agents--openai-chatgpt-scheduled-tasks.md] | Suited to summaries, rollups, topic tracking [raw/routine--scheduled-agents--google-gemini-scheduled-actions.md] |
| Unsuited workloads | Not stated | Rapidly changing data such as stock prices and crypto [raw/routine--scheduled-agents--google-gemini-scheduled-actions.md] |
| Freshness caveat | Not stated | Content is pre-prepared before delivery and may not reflect the latest information [raw/routine--scheduled-agents--google-gemini-scheduled-actions.md] |
| Prompt-writing guidance published | None [raw/routine--scheduled-agents--openai-chatgpt-scheduled-tasks.md] | Only "provide details about when and how often" [raw/routine--scheduled-agents--google-gemini-scheduled-actions.md] |

Three conclusions.

1. **Slot scarcity is the norm, not a Littlebird limitation.** Both products cap active
   tasks in the single digits to low teens. Treating a slot as a scarce resource is
   standard, and a dead routine is a real opportunity cost.
2. **Auto-pause on inactivity is a shipped product pattern in both.** Both vendors built a
   circuit breaker for disengagement. That is the alert-fatigue definition in section 4.2
   implemented in product code, and a paused routine is that circuit breaker having fired.
3. **The vendors publish essentially no guidance on how to write a recurring prompt.** This
   is the archive's largest gap, and it is what makes a rubric worth building from the alert
   and digest literature instead.

---

## 9. Traceable claim map for the skill's guides

Every domain claim the guides make traces here.

| Claim in the guides | Section | Primary source |
|---|---|---|
| Vague scope produces unusable output | 2 | Both vendor prompt guides |
| A routine must be told it may find nothing | 2 | Anthropic uncertainty example |
| Prefer Markdown sections over heavy XML in a routine prompt | 3 | Stated as a preference between defensible options |
| Low precision drives habitual override | 4.1 | JMIR 382-alert study |
| Fatigue is measured as declining engagement over time | 4.2 | JAMIA 2026 review |
| An ignored finding is not proof the finding was wrong | 4.3 | JAMIA 2026 review |
| Every finding must be actionable, and "it happened again" is not an action | 4.4 | SRE alerting document |
| Under-alerting is the cheaper error | 4.4 | SRE alerting document |
| A report with no owner or next action is not a control | 4.4 | SRE alerting document |
| High false-positive tolerance depends on expertise and independent visibility | 4.5 | ATC study, stated as a conflict |
| Memory across runs is a written-record mechanism | 5 | Anthropic context engineering |
| Escalation needs an explicit numeric threshold | 6 | OpenAI agent guide, SRE document |
| Lead with the decision, not a recap | 7.1 | Army Regulation 25-50 via BLUF essay |
| Detail scales down as item count rises | 7.2 | Digest design source |
| Urgent items should not wait for the next scheduled run | 7.4 | Digest design source |
| Plan slots are scarce by design across products | 8 | ChatGPT and Gemini docs |
| Auto-pause on unread is a disengagement circuit breaker | 8 | ChatGPT and Gemini docs |

---

## 10. Named gaps in this archive

State these rather than filling them.

1. **No published guidance from any vendor on writing a recurring or scheduled agent
   prompt.** Both scheduled-agent products document scheduling mechanics and say nothing
   about prompt content [raw/routine--scheduled-agents--openai-chatgpt-scheduled-tasks.md,
   raw/routine--scheduled-agents--google-gemini-scheduled-actions.md]. The rubric in this
   skill is constructed by transferring the alert and digest literature, which is a
   defensible construction and not a documented standard.
2. **No measured effect size for a read-your-own-history instruction.** The mechanism is
   documented [raw/routine--agent-design--anthropic-context-engineering.md]; nothing
   measures the improvement.
3. **No study of alert fatigue in a personal-productivity setting.** All fatigue evidence
   is clinical or operational, with expert operators and institutional stakes. The transfer
   to a founder reading a daily digest is an inference, and the ATC result
   [raw/routine--alert-fatigue--wickens-atc-cry-wolf-2009.md] is direct evidence that
   context changes the answer.
4. **The specific escalation threshold of three occurrences is not evidenced.** OpenAI names
   failure thresholds as a design element without prescribing a number
   [raw/routine--agent-design--openai-practical-guide-agents.md]. Three is a design decision
   in this skill, labelled as such wherever it appears.
5. **The routine library patterns are not empirically validated.** They are constructed to
   satisfy the rubric, which is built from this archive. No source in the archive tests a
   job-function routine library.
6. **Digest fatigue statistics are second-hand vendor marketing.**
   [raw/routine--digest-design--suprsend-batching-digests-2026.md] The mechanism claims are
   usable; the numbers are not cited to a primary study.
