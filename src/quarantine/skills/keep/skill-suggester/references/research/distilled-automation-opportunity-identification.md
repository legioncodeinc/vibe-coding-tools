# Distilled: automation opportunity identification

Stage 3 of the forge pipeline. Written from a fresh read of the nine files in `raw/`. Every
claim below ends in a bracketed citation to the raw file it came from. A claim with no
citation is not in this file.

Section numbers are stable. The skill's guides cite them.

---

## 1. The field already has a name for this problem, and a pipeline for it

Robotic process mining is defined as techniques and tools to analyze data collected during
the execution of user-driven tasks, in order to support the identification and assessment of
candidate routines for automation, and the discovery of routine specifications executable by
bots [raw/automation--task-mining--leno-rpm-vision-and-challenges.md].

Two verbs are held apart in that definition and they should stay apart in any suggester:
**identification and assessment** of candidates is one problem, **discovery of the
specification** is a second one [raw/automation--task-mining--leno-rpm-vision-and-challenges.md].

The published pipeline has seven stages
[raw/automation--task-mining--leno-rpm-vision-and-challenges.md]:

| # | Stage | What it does |
|---|---|---|
| 1 | Recording | Capture low-level UI events: field selection, text editing, page opens |
| 2 | Noise filtering | Drop events that do not contribute to the task |
| 3 | Segmentation | Split a continuous log into distinct task traces, one per execution |
| 4 | Simplification | Drop redundant events, aggregate low-level actions into semantic ones |
| 5 | Candidate routine identification | Extract repetitive sequences across traces, assess feasibility |
| 6 | Executable routine discovery | Derive activation conditions and routine logic |
| 7 | Compilation | Emit an executable script for a specific tool |

The commercial equivalent is task mining, defined as the process of capturing and analyzing
how users interact with software applications and web pages, for the stated purpose of
identifying process inefficiencies and automation opportunities
[raw/automation--task-mining--celonis-docs-task-mining.md].

The division of labour between the two commercial categories is worth carrying: process
mining extracts business data from transactional systems, task mining generates detailed
data from user actions [raw/automation--task-mining--celonis-docs-task-mining.md]. The
vendor's own framing of why the second category exists is that desktop capture picks up all
the steps that happen outside the major systems, such as checking emails or consulting
spreadsheets [raw/automation--task-mining--celonis-insights-what-is-task-mining.md].

---

## 2. What the field considers a detectable signal

A commercial task mining product captures user interaction data such as clicks, copy and
pastes, and time spent per application, and then reasons about application usage and user
behavior across applications
[raw/automation--task-mining--celonis-insights-what-is-task-mining.md].

The named indicator classes on that page
[raw/automation--task-mining--celonis-insights-what-is-task-mining.md]:

| Indicator | Framing |
|---|---|
| Copy and paste operations | A first-class captured metric |
| Application switching | Part of understanding how work executes across applications |
| Manual data entry | Illustrated with filling a purchase order and checking amounts in a spreadsheet |
| Repetitive patterns | Framed as non-value-adding activity |

That list is vendor marketing, and its efficiency claims are not carried forward. The
indicator taxonomy is retained because it is consistent with the academic pipeline's stage 5
[raw/automation--task-mining--leno-rpm-vision-and-challenges.md].

---

## 3. What counts as an automatable routine, formally

The formal definition: the first action is always triggered when a condition is met, the
routine's activation condition, and the value of each parameter of each action can be
computed from the values of parameters of previous actions
[raw/automation--task-mining--leno-discovering-automatable-routines.md].

Two independent tests are embedded there and both must pass:

1. **Determinate trigger.** Something reliably starts it.
2. **Determinate data.** Every input is either constant or derivable from earlier steps in
   the same run.

A sequence that repeats but whose inputs arrive from outside the observed trace fails test 2
and is not automatable under this definition
[raw/automation--task-mining--leno-discovering-automatable-routines.md].

### 3.1 The threshold question, and what the literature actually supplies

The method retains only learned substitution rules with **confidence 1.0**, on the stated
grounds that only such rules can be considered deterministic
[raw/automation--task-mining--leno-discovering-automatable-routines.md].

That is an absolute threshold on determinism, not a tuned frequency threshold. **No source
in this archive supplies a researched constant for how many recurrences justify calling a
pattern a candidate.** This is a named gap, restated in section 9. Any recurrence threshold
used downstream is a convention.

---

## 4. What breaks a detector, stated by the people who built one

These are the reasons a repeated-work detector reports garbage, taken from authors who
measured it rather than from intuition.

| Failure | Source statement |
|---|---|
| Noise assumption | The approach assumes user tasks are performed without noise [raw/automation--task-mining--leno-discovering-automatable-routines.md] |
| Fragmentation from one variation | A non-deterministic event breaks the polygon capturing a routine into two flat polygons, preventing discovery of the complete routine [raw/automation--task-mining--leno-discovering-automatable-routines.md] |
| Loops | The automaton representation does not capture loops, and activation conditions after a loop exit cannot be determined, particularly where the condition depends on execution count [raw/automation--task-mining--leno-discovering-automatable-routines.md] |
| Segmentation without case ids | Identifying task boundaries without explicit case identifiers is an open challenge, especially across multiple applications and when tasks execute in batches [raw/automation--task-mining--leno-rpm-vision-and-challenges.md] |
| Noise filtering | Distinguishing noise from legitimate task events is an open challenge, particularly when noise clusters near specific states [raw/automation--task-mining--leno-rpm-vision-and-challenges.md] |
| Semantics from pixels | Accessing semantic-level UI element information rather than pixel coordinates is an open recording challenge [raw/automation--task-mining--leno-rpm-vision-and-challenges.md] |
| Variants | Handling multiple execution variants is an open discovery challenge [raw/automation--task-mining--leno-rpm-vision-and-challenges.md] |

The fragmentation entry is the operationally important one. One deviation in the middle of
an otherwise identical sequence makes the detector see two short patterns instead of one
real one [raw/automation--task-mining--leno-discovering-automatable-routines.md]. Real human
work is full of such deviations, so a detector systematically **under-counts** long
routines and over-counts short fragments.

### 4.1 How far the evaluation actually goes

The method was evaluated on nine synthetic UI logs generated from Colored Petri Nets. On the
simplest log it discovered all 13 automatable actions, 92.9% of the total, in 3.0 seconds.
On the most complex it discovered 24 of 24 automatable actions but took 935.2 seconds with
data-transformation discovery enabled, up to 50 times slower. Without that component,
complex transformations were missed on five of the nine logs
[raw/automation--task-mining--leno-discovering-automatable-routines.md].

Synthetic logs with injected routines. It demonstrates re-discovery of a known answer, not
performance on messy real capture
[raw/automation--task-mining--leno-discovering-automatable-routines.md].

---

## 5. What makes a task a good automation candidate

The practitioner checklist, seven positive criteria
[raw/automation--candidate-criteria--enterbridge-seven-criteria.md]:

| # | Criterion | As stated |
|---|---|---|
| 1 | Time-consuming | Requires large amounts of time, framed as hours out of the day |
| 2 | High volume | Must be done over and over, multiple times daily or continuously |
| 3 | Repetitive | Stable, does not change often, runs at a regular cadence |
| 4 | Well defined | A clear map where every situation is defined |
| 5 | Prone to error | Human errors are common or costly |
| 6 | Multiple employees | Affects several people rather than one |
| 7 | Disparate systems | Requires multiple systems, which automation can bridge |

## 6. What makes a task a bad candidate

From the same checklist [raw/automation--candidate-criteria--enterbridge-seven-criteria.md]:

- **Too simple.** A process taking 15 minutes weekly is difficult to justify automating.
- **Not rules-based.** Tasks requiring decision-making or adaptation are unsuitable.
- **Too complex.** Where most transactions need human intuition it is not feasible, though
  partial automation may work.

The source states that human judgment and nuance are the key limitation, and that automation
cannot handle unpredictable situations or edge cases without manual intervention
[raw/automation--candidate-criteria--enterbridge-seven-criteria.md].

Independently, the failure literature names automating a non-optimized process, or one with
a high exception rate stated as exceeding 40 percent, as a distinct cause of failure, and
prescribes optimizing the process before automating it
[raw/automation--failure-rates--uipath-why-rpa-deployments-fail.md].

### 6.1 The calibration conflict, stated rather than smoothed

Criteria 1 and 2 and the too-simple exclusion assume a project-sized build cost: development,
testing, governance, maintenance
[raw/automation--candidate-criteria--enterbridge-seven-criteria.md, provenance note]. The bar
for "worth automating" moves with the cost of building. The criteria transfer. The volume
thresholds attached to them do not transfer to an artifact that costs one working session to
produce. This distinction is flagged in the raw file itself and is not a claim the vendor
page makes.

---

## 7. Why automation projects fail

The most-cited figure is that 30 to 50 percent of RPA projects initially fail, attributed on
a vendor page to an Ernst and Young report
[raw/automation--failure-rates--uipath-why-rpa-deployments-fail.md].

**Confidence: low, and the chain matters.** This is a vendor blog citing a consultancy, with
no linked methodology, no sample size, and no definition of "initially fail". It is widely
repeated, which is not the same as verified. Report it with its chain named, never as
"studies show" [raw/automation--failure-rates--uipath-why-rpa-deployments-fail.md].

The four named causes [raw/automation--failure-rates--uipath-why-rpa-deployments-fail.md]:

1. Forgetting business and IT collaboration, producing weak governance.
2. Relying on weak governance, because post-implementation maintenance is underestimated and
   processes, interfaces and data formats change regularly.
3. Automating in a non-efficient way: the wrong process, a non-optimized process, or one
   with a high exception rate.
4. Building on bad design: rushed, unstable, no roadmap.

Causes 2 and 3 transfer to a single operator. Causes 1 and 4 are organizational and do not
[raw/automation--failure-rates--uipath-why-rpa-deployments-fail.md, transferable-causes
note].

---

## 8. What happens after you automate the routine part

This is the section that argues against the naive inference "it repeats, therefore automate
it".

### 8.1 The residual task

Quoted: "the designer who tries to eliminate the operator still leaves the operator to do
the tasks which the designer cannot think how to automate"
[raw/automation--irony--bainbridge-1983-ironies-of-automation.md]. The stated consequence is
that the operator is left with an arbitrary collection of tasks, with little thought given to
supporting them [raw/automation--irony--bainbridge-1983-ironies-of-automation.md].

Automating the mechanical portion does not leave a smaller version of the same task. It
leaves the part that resisted automation
[raw/automation--irony--bainbridge-1983-ironies-of-automation.md].

### 8.2 The monitoring paradox

Quoted: "the automatic control system has been put in because it can do the job better than
the operator, but yet the operator is being asked to monitor that it is working effectively"
[raw/automation--irony--bainbridge-1983-ironies-of-automation.md]. Bainbridge's judgment is
that the monitor has been given an impossible task
[raw/automation--irony--bainbridge-1983-ironies-of-automation.md].

### 8.3 Designer error becomes systematic error

Quoted: "designer errors can be a major source of operating problems"
[raw/automation--irony--bainbridge-1983-ironies-of-automation.md]. A wrong model of the task,
once automated, produces the same wrong output every time rather than occasionally.

### 8.4 Skill decay and the skill inversion

Quoted: "physical skills deteriorate when they are not used, particularly the refinements of
gain and timing", and "a formerly experienced operator who has been monitoring an automated
process may now be an inexperienced one"
[raw/automation--irony--bainbridge-1983-ironies-of-automation.md]. The inversion: "one can
argue that the operator needs to be more rather than less skilled, and less rather than more
loaded, than average" [raw/automation--irony--bainbridge-1983-ironies-of-automation.md].

**Scope caveat, from the raw file.** The paper is about industrial process control. Transfer
to knowledge work is by analogy, not measurement. Strongest for the residual task and the
monitoring paradox, weakest for physical skill decay, which is literally about hand-eye
control loops [raw/automation--irony--bainbridge-1983-ironies-of-automation.md].

### 8.5 The measured version: complacency and bias

Automation complacency is reduced monitoring vigilance, and the condition is specific,
quoted: it "occurs under conditions of multiple-task load, when manual tasks compete with the
automated task for the operator's attention"
[raw/automation--irony--parasuraman-manzey-complacency-2010.md].

Automation bias is acceptance of automated suggestions regardless of accuracy, producing
"both omission and commission errors when decision aids are imperfect"
[raw/automation--irony--parasuraman-manzey-complacency-2010.md]. Omission errors are the
harder class, because nothing appears in the output to inspect
[raw/automation--irony--parasuraman-manzey-complacency-2010.md].

Two findings turn this into a design rule rather than a warning
[raw/automation--irony--parasuraman-manzey-complacency-2010.md]:

- Both phenomena occur across expertise levels.
- Both resist simple training interventions.

So telling the user to stay vigilant does not work. A proposal whose safety depends on the
user checking every output is a proposal that will fail in the specific way the review
describes.

---

## 9. People cannot report their own repeated work accurately

Three independent sources, two of them primary measurements against logs, one a
meta-analysis. All three point the same direction.

### 9.1 The 401-professional study

Self-assessed computer usage against computer-monitored use for 401 managers and
professionals [raw/automation--self-knowledge--collopy-1996-retrospective-time-use.md]:

| Comparison | Result |
|---|---|
| Self-assessed vs logged interactive use | 32% difference in average amount, 3.9 vs 2.7 hours per day |
| Self-assessed vs total connect time | Averages similar, 3.9 vs 4.0 hours |
| Individual level, vs logged connect time | Median absolute percentage difference of 47% |

Two further findings [raw/automation--self-knowledge--collopy-1996-retrospective-time-use.md]:

- Individual estimates regressed toward the population mean: light users overestimated their
  use, heavy users underestimated theirs.
- Testing the satisfaction-and-usage relationship gave a non-significant result on
  self-reports and a significant result on logs. Same people, same period, different answer.

The first row and the second row together are the important pair: a group average that
matches the log is not evidence that any individual's estimate matched
[raw/automation--self-knowledge--collopy-1996-retrospective-time-use.md].

**Age caveat, from the raw file.** 1996, mainframe connect time. Retained because the claim
is about human retrospective estimation, and two later independent sources agree
[raw/automation--self-knowledge--collopy-1996-retrospective-time-use.md].

### 9.2 The same-day replication

Same-day self-reports, roughly four per day, 2,132 reports, 30 participants, against
keyboard and mouse activity recorded by software
[raw/automation--self-knowledge--daily-selfreport-vs-software-recorded-computer-use.md]:

- Median self-reported duration exceeded software-recorded duration by 1.9 hours.
- Quoted: "self-reports generally overestimated computer use when software-recorded durations
  were less than 3.6 hr, and underestimated when above 3.6 hr."
- Fitted relationship: Difference = 2.26 hr minus 0.63 times software-recorded duration.
- Spearman correlations within participants ranged 0.22 to 0.8, median 0.53. Cross-sectional
  comparison on per-participant medians: 0.33.

The same regression-to-the-middle pattern as section 9.1, on a different population two
decades later, with a same-day recall window rather than a long one
[raw/automation--self-knowledge--daily-selfreport-vs-software-recorded-computer-use.md].

One second-order finding that matters here specifically: "Experiencing symptoms was related
to a 0.15-hr increase in self-reported duration after controlling for software-recorded
duration"
[raw/automation--self-knowledge--daily-selfreport-vs-software-recorded-computer-use.md]. How
the person felt changed their reported duration independently of the actual duration.

**Caveat, from the raw file.** 30 undergraduates in a single dormitory. Corroboration of a
direction, not an effect size for working professionals
[raw/automation--self-knowledge--daily-selfreport-vs-software-recorded-computer-use.md].

### 9.3 The meta-analysis

106 effect sizes comparing self-reported and logged digital media use
[raw/automation--self-knowledge--nature-2021-logged-vs-selfreport-meta.md]. Quoted:
"Self-reported media use correlates only moderately with logged measurements, that
self-reports were rarely an accurate reflection of logged media use"
[raw/automation--self-knowledge--nature-2021-logged-vs-selfreport-meta.md]. The authors state
that the findings raise concerns about the validity of findings relying solely on
self-reported measures
[raw/automation--self-knowledge--nature-2021-logged-vs-selfreport-meta.md].

**Two limits declared in the raw file.** The pooled correlation coefficient was not present
in the accessible portion of the page, so no number is attributed to this source. And the
domain is digital media use rather than work tasks, so what transfers is the measurement
claim, not a claim about work specifically
[raw/automation--self-knowledge--nature-2021-logged-vs-selfreport-meta.md].

### 9.4 What follows for a suggester

Two operational rules follow from 9.1 to 9.3 together:

1. **Do not ask the user how often they do it and use the answer as the count.** Their
   frequency estimate regresses toward their own average and the direction of the error is
   predictable from how much they actually do
   [raw/automation--self-knowledge--collopy-1996-retrospective-time-use.md]
   [raw/automation--self-knowledge--daily-selfreport-vs-software-recorded-computer-use.md].
2. **Do not ask how long it takes and print the answer as an hour figure.** Median absolute
   individual error of 47% against a log
   [raw/automation--self-knowledge--collopy-1996-retrospective-time-use.md], and an
   annoyance-linked upward bias in the same-day study
   [raw/automation--self-knowledge--daily-selfreport-vs-software-recorded-computer-use.md].

The user's estimate is still worth collecting. It is worth collecting as a separate, labelled
line, not as the number.

---

## 10. Privacy and consent, as a production system handles it

A commercial task mining product treats these as mandatory controls
[raw/automation--task-mining--celonis-docs-task-mining.md]:

- Sensitive data redacted and pseudonymized before it leaves the desktop, with the
  organization controlling what is sent.
- Explicit user consent to capture, and the ability to turn capture off at any time.
- Allowlisting or denylisting of specific applications and URLs.
- Access limited to approved individuals.

Quoted: "Advanced privacy features ensure only relevant user interaction data is captured,
sensitive data is hidden and only approved individuals can view this information"
[raw/automation--task-mining--celonis-docs-task-mining.md].

The transferable point is that pseudonymization before analysis is the industry default for
this data class, not an optional courtesy
[raw/automation--task-mining--celonis-docs-task-mining.md].

---

## 11. Where sources conflict

**Conflict 1: is a failed automation project a loss or a learning investment?** The vendor
page carrying the 30 to 50 percent failure figure also carries a Genpact view that such
failures lead to greater learning for the enterprise's digital transformation journey
[raw/automation--failure-rates--uipath-why-rpa-deployments-fail.md]. Preferred reading: the
failure figure, treated as low confidence, and the learning reframe treated as vendor
positioning rather than a counter-measurement, because it offers no measurement at all
[raw/automation--failure-rates--uipath-why-rpa-deployments-fail.md]. Both are recorded.

**Conflict 2: volume thresholds.** The practitioner checklist wants hours out of the day and
multiple executions daily, and excludes a 15-minute-weekly task as too small to justify
[raw/automation--candidate-criteria--enterbridge-seven-criteria.md]. Nothing in the academic
sources sets any frequency bar at all; the only threshold stated anywhere in the archive is a
determinism threshold of confidence 1.0
[raw/automation--task-mining--leno-discovering-automatable-routines.md]. Preferred reading:
the practitioner criteria describe the shape of a good candidate and the numbers attached to
them describe a build cost that does not apply here. Use the criteria, discard the numbers,
and say which is which.

**Conflict 3: direction of self-report bias.** Two primary studies find a regression pattern,
overestimation at low actual use and underestimation at high
[raw/automation--self-knowledge--collopy-1996-retrospective-time-use.md]
[raw/automation--self-knowledge--daily-selfreport-vs-software-recorded-computer-use.md]. The
meta-analysis reports systematic directional bias without resolving a single uniform
direction across study types
[raw/automation--self-knowledge--nature-2021-logged-vs-selfreport-meta.md]. Preferred
reading: the regression pattern, because it comes from the two studies that measured
individuals against their own logs, and it is stable across a 25-year gap and two very
different populations. Held with medium confidence, not high.

---

## 12. Named gaps in this archive

Say these out loud rather than filling them.

1. **No researched recurrence threshold exists.** Nothing in the archive states how many
   times a task must recur before it is worth automating. The only published threshold is on
   determinism, at confidence 1.0
   [raw/automation--task-mining--leno-discovering-automatable-routines.md]. Every recurrence
   count used by this skill is a convention.
2. **No source covers detection from periodic screen snapshots.** Every detection source in
   the archive assumes a UI event log with element identifiers and ordered actions
   [raw/automation--task-mining--leno-rpm-vision-and-challenges.md]
   [raw/automation--task-mining--leno-discovering-automatable-routines.md]. Sampled snapshots
   are a strictly weaker input, and no source measures what that costs.
3. **No source covers the natural-language repeat request.** A person asking an assistant for
   the same thing again is not a signal class anywhere in this archive. It is the strongest
   signal available in message capture and it is entirely unevidenced as a detection method.
4. **No evaluation on real messy logs.** The one quantitative evaluation is on nine synthetic
   logs with injected routines
   [raw/automation--task-mining--leno-discovering-automatable-routines.md].
5. **No source measures automation candidate proposals made to individuals.** The whole
   candidate-assessment literature here is enterprise process selection
   [raw/automation--candidate-criteria--enterbridge-seven-criteria.md]
   [raw/automation--failure-rates--uipath-why-rpa-deployments-fail.md]. A single operator
   choosing what to automate for themselves is not a studied case in this archive.
6. **The Celonis documentation does not state how tasks are identified from the raw event
   stream** [raw/automation--task-mining--celonis-docs-task-mining.md]. The commercial
   segmentation method is not public in what was fetched.

---

## 13. Claim map

Where each of the skill's guides gets its evidence.

| Guide | Sections it draws on |
|---|---|
| `references/pattern-signatures.md` | 1, 2, 3, 4, 12 gap 2, 12 gap 3 |
| `references/threshold-and-ranking.md` | 3.1, 5, 6.1, 9, 11 conflict 2, 12 gap 1 |
| `references/dedupe-against-existing-skills.md` | 6, 7 cause 3 |
| `references/skill-md-drafting.md` | 3, 4 (fragmentation and variants shape what a drafted skill must handle) |
| `references/when-not-to-automate.md` | 5, 6, 7, 8 in full, 9 |
| SKILL.md guardrail | 8.5, 10 |
