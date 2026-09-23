# Distilled: client health, churn signals, scope creep, and the limits of automated sentiment

Written from a fresh read of `raw/` on 2026-08-17. Every claim below ends in a bracketed
citation to the raw file it came from. Nothing here is written from training data. Where the
archive is thin or the sources disagree, that is stated rather than smoothed.

Twelve sources archived. Three academic (all peer-reviewed or arXiv preprints from named
speech and NLP research groups), one professional-body publication, and eight vendor or
practitioner blogs, of which one is archived specifically as a negative finding about
evidence quality.

---

## 1. The evidence in this domain is lopsided, and that shapes the whole skill

The sentiment-limits half of this research question has real peer-reviewed literature with
measured numbers. The client-health half does not. Almost everything found on customer health
scoring, agency churn, and account cadence is vendor content, and the numbers in it circulate
at second and third hand.

| Claim as it circulates | Sourcing status |
|---|---|
| 73 percent of CS leaders say their health score does not reliably predict churn | attributed to a named ChurnZero study, no link on the page, primary not located [raw/health-score--failure-modes--vandfort-2026.md] |
| 27 percent lower gross churn with predictive vs rule-based scoring | attributed to Gainsight Pulse 2025, no link [raw/health-score--failure-modes--vandfort-2026.md] |
| 40 to 60 percent of SaaS cancellations in the first 90 days | attributed to CustomerScore.io, no link [raw/health-score--failure-modes--vandfort-2026.md] |
| 43 percent of agency client churn in the first 90 days | attributed to a GigRadar 2026 study, no link [raw/agency--month-six-churn--agencydashboard-2026.md] |
| Retainer agencies 18 percent annual churn, PPC 49 percent, and the rest of the benchmark table | no methodology, no sample size, no citations, self-generated [raw/agency--churn-benchmarks--focusdigital-2026.md] |
| Improving retention 5 percent raises profits 25 to 95 percent | cited to Forbes citing the original HBR work; a citation of a citation [raw/agency--retention-practice--parakeeto-2026.md] |
| 85 to 90 percent retention is the cross-industry benchmark | no study named [raw/agency--retention-practice--parakeeto-2026.md] |
| Clear onboarding reduces churn up to 67 percent | no source given [raw/agency--retention-practice--parakeeto-2026.md] |
| 37 percent of project failures come from undefined objectives | no source given [raw/scope--consultancy-margin--projectworks-2026.md] |
| B2B customers with strong executive engagement are 2.5 times more likely to renew | attributed to McKinsey, no link [raw/cadence--qbr-practice--gainsight-guide.md] |

The one number with a disclosed sample in the whole non-academic set is TSIA's "22% of
organizations are using AI for health scoring today", and TSIA does not publish the sample
size on that page either [raw/health-score--predictive-shift--tsia-2026.md].

**Consequence for the skill.** It quotes no external churn benchmark, no industry retention
average, and no percentage at the user. Every threshold in this skill is derived from the
user's own observed history with that specific client. The published material is used for
signal *shape*, never for signal *magnitude*.

## 2. Named gap: the health-score literature is SaaS-shaped and does not transfer cleanly

This is the single biggest limitation of the archive and it needs stating plainly.

Every customer-health-score source found is written for a subscription software vendor
[raw/health-score--predictive-shift--tsia-2026.md]
[raw/health-score--failure-modes--vandfort-2026.md]
[raw/cadence--qbr-practice--gainsight-guide.md]. The input list is "product usage data,
support tickets, engagement metrics, CSM sentiment" [raw/health-score--predictive-shift--tsia-2026.md],
and the canonical leading indicator is "declining login frequency relative to a customer's own
baseline over the past 14 days" [raw/health-score--failure-modes--vandfort-2026.md].

An agency, consultancy or freelancer has none of that. There is no product to log into, no
support ticket queue, no seat count, no feature adoption curve. The relationship is a series
of meetings, threads, deliverables and invoices. Net revenue retention as a frame
[raw/health-score--failure-modes--vandfort-2026.md] assumes a recurring subscription that can
expand or contract, which a project-based engagement does not have.

What does transfer, and only these:

| Transferable idea | Source | Why it survives the move |
|---|---|---|
| Compare a client to their own baseline, not to a fixed threshold | [raw/health-score--failure-modes--vandfort-2026.md] | The mechanism is relative change, which does not depend on the signal being product usage |
| Do not build one composite score, build several focused signals | [raw/health-score--predictive-shift--tsia-2026.md] [raw/health-score--failure-modes--vandfort-2026.md] | The Swiss Army knife failure is about score design, not about SaaS |
| The relationship owner's own sentiment is a biased input | [raw/health-score--predictive-shift--tsia-2026.md] | Applies harder to a solo operator than to a CSM, because there is nobody to check them |
| Cadence and depth should be tiered, not uniform | [raw/cadence--qbr-practice--gainsight-guide.md] | Tiering is about attention allocation, which is the same problem |
| The score must land in a workflow, not a dashboard | [raw/health-score--failure-modes--vandfort-2026.md] | Directly argues for a routine plus notification over a file |

What does not transfer, and must not be imported: usage-based scoring of any kind, seat and
license signals, NPS and CSAT survey machinery, subscription expansion and contraction
mechanics, and every published churn percentage.

The gap this leaves: there is no found research measuring which signals predict churn *in a
project-based professional services relationship specifically*. The agency sources
[raw/agency--why-clients-fire--almcorp-2026.md] [raw/agency--month-six-churn--agencydashboard-2026.md]
[raw/agency--retention-practice--parakeeto-2026.md] are practitioner assertion, not
measurement. The skill treats their signal list as a hypothesis worth checking against
evidence, not as an established predictor.

## 3. What the health-score literature says goes wrong, and the one finding that matters most

Five failure modes, stated in almost the same terms by two independent sources:

| Failure | Statement | Sources |
|---|---|---|
| Lagging, not leading | Traditional models are "telling you what already happened, not what's about to happen"; "You're identifying churn risk after the customer has already disengaged" | [raw/health-score--predictive-shift--tsia-2026.md]; echoed as "You're measuring what happened, not what's about to happen" [raw/health-score--failure-modes--vandfort-2026.md] |
| One score doing everything | The "Swiss Army knife" problem: "trying to measure everything, but accurately predicting almost nothing" | [raw/health-score--predictive-shift--tsia-2026.md]; "One score is trying to do everything" [raw/health-score--failure-modes--vandfort-2026.md] |
| Stale weights | "Your weights were set once and never recalibrated" | [raw/health-score--failure-modes--vandfort-2026.md] |
| Uniform treatment | "You're treating all customers the same" | [raw/health-score--failure-modes--vandfort-2026.md] |
| No route to action | Scores fail to answer "What's causing the issue. Who should take action. What the next best step is."; "The score lives on a dashboard nobody checks" | [raw/health-score--predictive-shift--tsia-2026.md]; [raw/health-score--failure-modes--vandfort-2026.md] |

**The most important finding in this entire archive for a solo or small-shop user.** When the
relationship owner's own read on the account carries weight in the score, "retention rates tend
to decline" and "churn rates tend to increase", because owners "naturally want to believe
they've stabilized a risky account after a positive interaction"
[raw/health-score--predictive-shift--tsia-2026.md].

Read that against the skill's actual user. A freelancer or agency owner has no CSM. They *are*
the CSM, and they have more financial reason than any employee to believe the account is fine.
The skill is therefore built to argue with its user, not to agree with them: it shows dated
behavioral evidence rather than an impression, and it makes the evidence checkable so a wrong
reading can be rejected on the spot.

## 4. Why agency clients actually leave: a signal list, not a statistic

The strongest practitioner list found. Twelve stated reasons, and none of the top ones is
output quality [raw/agency--why-clients-fire--almcorp-2026.md]: "The agency sold one thing and
delivered another", "Communication became a source of anxiety", "The agency became an
order-taker", "Reporting proved activity, not value", "Scope, pricing, and delivery drifted out
of balance", "Small issues accumulated into a trust deficit".

A separate source ranks stated departure reasons with price sixth: "a lack of proactive
strategic guidance" 68 percent, "poor communication" 57 percent, "the agency could not clearly
demonstrate its own value" 53 percent, price 37 percent
[raw/agency--month-six-churn--agencydashboard-2026.md]. The study behind that ranking is not
named on the page, so the ordering is a hypothesis, not a measurement. Both sources point the
same direction, which is why it is recorded here despite the sourcing.

The behavioral warning list, verbatim [raw/agency--why-clients-fire--almcorp-2026.md]:

| Warning sign | Retrievable from capture |
|---|---|
| Client stops asking strategic questions, focuses only on deliverables | Yes, from transcript content over time |
| Fewer or more stakeholders suddenly attend calls | Yes, from the calendar event attached to each meeting |
| Email tone becomes shorter, more formal, approval-heavy | Partially, from message threads; register change, not polarity |
| Reporting questions repeat monthly | Yes, from recurring meeting instances |
| Client delays feedback, approvals, or payment | Yes, as unmet promises in the client's direction |
| Client requests documentation not previously needed | Yes, explicit ask in transcript or thread |
| Client seeks account access, exports, or asset inventories | Yes, explicit ask; among the strongest single signals |
| Renewal discussions get postponed | Yes, explicit |
| Client compares work to internal alternatives or competitors | Yes, named entity in transcript |
| A new executive joins and schedules a partner review | Yes, from attendees plus meeting title |
| Client says performance is "fine" but engagement drops sharply | Yes, and this is the case that breaks sentiment scoring |

**The timing argument.** "Clients who cancel at month six or later usually made their real
decision back in month two or three" [raw/agency--month-six-churn--agencydashboard-2026.md].
That attribution is unverified, but it is the premise a leading-indicator radar rests on: by
the time the renewal conversation is unpleasant, the decision is old.

**The abandonment diagnosis.** "Once we're pursuing clients they're relentless, attentive and
amazing. But once the client signs the contract, we kinda forget about them", and the specific
failure "The client should never feel like they have to check in or ask to know what you've
done" [raw/agency--retention-practice--parakeeto-2026.md]. That second sentence is directly
detectable: a client asking for a status update is evidence that the proactive update did not
happen.

## 5. Scope creep: mechanism, and why a dated record is the only defense

Definition used in the professional services case: "the gradual, uncontrolled expansion of a
project's original requirements without a corresponding adjustment in budget, timeline, or
resource allocation", showing up as unbilled "favor-based" work
[raw/scope--consultancy-margin--projectworks-2026.md].

The mechanism is accumulation below the escalation threshold. Changes start as "a project
sponsor asking for 'one more feature'" and then "quietly accumulate and disrupt a project's
progress" because boundaries expand "slowly, often unnoticed"
[raw/scope--consultancy-margin--projectworks-2026.md]. It is called "the silent killer of
consultancy profitability" and it turns "a high-margin engagement into a pro-bono nightmare"
[raw/scope--consultancy-margin--projectworks-2026.md].

Causes, from the professional body, split by origin [raw/scope--change-control--pmi-abramovici-2000.md]:

| External to the delivery team | Internal to the delivery team |
|---|---|
| Customer requirement changes | Engineers' inclination to improve the product |
| Environment and platform changes | Team desire to exceed the minimum requirement |
| Poor initial understanding of requirements | No change control procedure |
| Vague specifications and statements of work | Undocumented modifications with no impact assessment |

The internal column matters as much as the external one, which means a detector that only
looks for client demands will miss half the problem
[raw/scope--change-control--pmi-abramovici-2000.md].

The control that transfers directly into a capture-based tool: "Maintain separate cost accounts
for out-of-scope work" [raw/scope--change-control--pmi-abramovici-2000.md]. An accumulated
out-of-scope tally is exactly that, kept in a report instead of in an accounting system. The
companion discipline is "no freebies" [raw/scope--change-control--pmi-abramovici-2000.md].

The five-question triage for an individual change, minus the one a capture tool cannot answer
[raw/scope--consultancy-margin--projectworks-2026.md]: does it align with the original goals;
what is the impact on schedule, budget and resources; is it necessary for the core
deliverables; are there alternatives.

**Sourcing caveat.** The PMI article is from January 2000, twenty-six years outside the default
window, and it cites no empirical study, arguing instead from a hypothetical case
[raw/scope--change-control--pmi-abramovici-2000.md]. It is retained because it is the
professional-body statement of the mechanism and because the recent-window search returned only
vendor content restating it. Its age is a real limitation.

## 6. The limits of automated sentiment: this is where the real numbers are

Three peer-reviewed or preprint sources, all with measured results. This section is the reason
the skill refuses to output a sentiment score.

### 6.1 Sentiment classification is not a solved problem even on clean written text

Four models (BERT, ELMo, BiLSTM, bag-of-words) on six English sentiment datasets. Best-model
accuracy [raw/sentiment--classifier-failure-modes--barnes-oslo-2019.md]:

| Dataset | Best model accuracy (BERT) |
|---|---|
| MPQA | 62.3 |
| OpeNER | 84.2 |
| SemEval | 75.1 |
| SST | 53.0 |
| Tackstrom | 60.2 |
| Thelwall | 63.9 |

"The error rates range between 8.3 on OpeNER and 20.5 on SST"
[raw/sentiment--classifier-failure-modes--barnes-oslo-2019.md]. Note that the best of those is
hotel reviews, a genre written to express polarity. The worst are the harder, more naturalistic
sets.

The 836 sentences every model failed, annotated by phenomenon
[raw/sentiment--classifier-failure-modes--barnes-oslo-2019.md]: incorrect gold label 277, no
sentiment 214, mixed 185, non-standard spelling 180, desirable element 144, idioms 132, strong
122, negation 97, world knowledge 81, amplifier 79, comparative 68, sarcasm and irony 58,
shifter 50, emoji 46, modality 38, morphology 31, reducer 13.

Findings that matter for reading a client call:

- **Negative is the hard class.** "the strong negative is the most difficult and least common
  class, while positive is the easiest to classify"
  [raw/sentiment--classifier-failure-modes--barnes-oslo-2019.md]. The direction of error is
  therefore biased toward missing the thing the skill exists to catch.
- **Modality defeats every model tested.** The modality section opens "None of the
  state-of-the-art sentiment [classifiers]", and the guideline example is "I would have loved
  the room if it been bigger" [raw/sentiment--classifier-failure-modes--barnes-oslo-2019.md].
  That construction is how a professional client complains.
- **Mixed sentiment in one utterance is structural.** "Nearly a third of the errors contain
  'but' clauses" [raw/sentiment--classifier-failure-modes--barnes-oslo-2019.md]. Client
  feedback is almost always a but-clause.
- **Shifters flip polarity quietly.** Words like "abandon", "lessen", "reject", and most
  commonly "miss", "normally move positive polarity words towards a more negative sentiment"
  [raw/sentiment--classifier-failure-modes--barnes-oslo-2019.md].
- **Twenty percent of the failures were annotation disagreement, not model failure.** "nearly
  20% of the examples (34), where the annotator found the original label to be completely
  incorrect", plus 277 sentences carrying the incorrect-label annotation
  [raw/sentiment--classifier-failure-modes--barnes-oslo-2019.md]. Trained humans do not agree
  on the sentiment of a fifth of the hard cases.
- **More data does not fix the hard categories.** Ten times the training data raised SST
  accuracy from 53.0 to 55.1 and made irony and shifters *worse*
  [raw/sentiment--classifier-failure-modes--barnes-oslo-2019.md].

### 6.2 Transcription corrupts the specific words sentiment depends on

The measured mechanism [raw/sentiment--asr-word-substitution--wu-hit-2022.md]:

| Measurement | Value |
|---|---|
| Utterances with a sentiment-word substitution error (MOSI-IBM) | 17.6 percent |
| Misclassification rate, utterances WITH a substitution error | 29.9 percent |
| Misclassification rate, utterances WITHOUT one | 15.8 percent |

Worked example: "The gold text is 'And I was really upset about it', but the ASR model
(SpeechBrain) recognizes the sentiment word 'upset' wrongly as 'set'"
[raw/sentiment--asr-word-substitution--wu-hit-2022.md].

Roughly one utterance in six loses its sentiment-bearing word, and those utterances are
misclassified at nearly double the rate. The published fix requires the face and the voice: the
model recovers by spotting "a mismatch between the negative word 'cruel' and either the smile or
the excited tone", and the ablation confirms "the model benefits from the visual and acoustic
features" [raw/sentiment--asr-word-substitution--wu-hit-2022.md]. A text transcript has neither.

### 6.3 How much accuracy the transcription step costs: the sources disagree, and both readings are recorded

| Reading | Evidence |
|---|---|
| Small cost | "a WER of approximately 12% has minimal impact on SER performance compared to ground-truth transcripts"; and prior work found "a WER of over 30% resulted in an SER accuracy drop of less than 3%" on one corpus [raw/sentiment--asr-wer-benchmark--li-edinburgh-2025.md] |
| Large cost | "there is nearly a 10% accuracy decrease with WERs around 40%"; and prior work "reported a nearly 10% accuracy drop with a 30% WER on IEMOCAP" [raw/sentiment--asr-wer-benchmark--li-edinburgh-2025.md] |

**Which reading this skill prefers, and why.** The optimistic reading. It is qualified by three
things in the same paper that push it back toward caution for this use case.

1. **The corpora that behave well are not conversations.** MELD, the one corpus of real
   multi-speaker dialogue, was excluded from the study because "its WERs are nearly double those
   of the other three corpora, ranging from 30% to 65%. Given that conducting SER using
   transcripts with such poor ASR performance is impractical in real-world scenarios, we decided
   to focus on the other three corpora"
   [raw/sentiment--asr-wer-benchmark--li-edinburgh-2025.md]. A recorded client call with
   crosstalk, jargon and phone audio is closer to MELD than to a lab recording.
2. **Most of the robustness comes from the audio, which Littlebird does not hand over.** "The
   decrease in Acc4 based on WER reaches 10% without fusion on IEMOCAP, but only 4% with fusion"
   [raw/sentiment--asr-wer-benchmark--li-edinburgh-2025.md]. Text-only is the worse number.
3. **Valence, the dimension that is actually sentiment, is the one that tracks transcription
   error.** "valence is more influenced by textual content, whereas arousal and dominance are
   more influenced by audio cues", and valence's error pattern mirrors the categorical accuracy
   pattern [raw/sentiment--asr-wer-benchmark--li-edinburgh-2025.md].

Even at the ceiling, the numbers are four-class accuracy in the seventies on curated corpora
[raw/sentiment--asr-wer-benchmark--li-edinburgh-2025.md]. That is a research result, not a
basis for telling somebody their client is unhappy.

**Consequence for the skill, stated once and enforced everywhere.** Do not emit a sentiment
score. Emit dated quotes and let the user read the tone. Where the skill does characterize
direction, it characterizes *change in observable behavior over time* (who attends, what is
asked for, how fast people reply, whether meetings get cancelled) rather than *polarity of
language*, because every measurement above says polarity of transcribed conversational language
is the weakest available signal.

## 7. Cadence: tiered, and derived per client rather than fixed

The tiering principle: "not every customer requires the same cadence or depth of engagement",
with strategic accounts high-touch, growth accounts digital-first, SMB light-touch, and at-risk
accounts getting targeted intervention [raw/cadence--qbr-practice--gainsight-guide.md].

One published default shape for an agency engagement
[raw/agency--month-six-churn--agencydashboard-2026.md]: week one onboarding summary; proactive
updates every two weeks; a full reporting session monthly; a milestone review quarterly. The
competing practitioner position declines to name any frequency: "The cadence should match the
speed of the work and the importance of decisions. Clients should know when they will get
updates, what those updates will cover, and how urgent issues will be escalated"
[raw/agency--why-clients-fire--almcorp-2026.md].

**Which this skill prefers.** The second, plus a derived baseline. The published four-tier shape
is used only as a fallback when a client has too little history to derive a cadence from. The
primary method is the one the health-score literature independently recommends: compare against
"a customer's own baseline" [raw/health-score--failure-modes--vandfort-2026.md].

What belongs in a review, useful because Littlebird meeting summaries already produce most of it
[raw/cadence--qbr-practice--gainsight-guide.md]: performance against goals, ROI with concrete
metrics, "progress on previous commitments", benchmarking, a health update, and "clear action
items with owners and deadlines".

The one senior-engagement data point: "B2B customers who have strong executive engagement are
2.5 times more likely to renew", attributed to McKinsey without a link
[raw/cadence--qbr-practice--gainsight-guide.md]. Combined with the observation that changes in
who attends are a warning sign [raw/agency--why-clients-fire--almcorp-2026.md], this supports
watching attendee seniority over time. That combination is an inference across two sources, one
of them unverified, and it is labeled Medium confidence wherever the skill uses it.

## 8. Named gaps in this archive

1. **No measurement of churn prediction in project-based professional services.** Everything
   quantitative is SaaS subscription work. Section 2.
2. **No verified agency churn benchmark.** The most-cited benchmark table in the sweep discloses
   no methodology at all [raw/agency--churn-benchmarks--focusdigital-2026.md].
3. **No study of sentiment analysis on business meeting transcripts specifically.** The academic
   corpora are acted dialogue (IEMOCAP), YouTube monologue (CMU-MOSI), podcasts (MSP-Podcast),
   sitcom dialogue (MELD), reviews and tweets
   [raw/sentiment--asr-wer-benchmark--li-edinburgh-2025.md]
   [raw/sentiment--classifier-failure-modes--barnes-oslo-2019.md]. None is a client call. Every
   transfer to this use case is an extrapolation and the direction of the extrapolation is
   toward *worse*, not better.
4. **No research on response-latency as a churn signal in a services relationship.** The latency
   idea is taken from the general leading-indicator argument
   [raw/health-score--failure-modes--vandfort-2026.md] and the practitioner warning list
   [raw/agency--why-clients-fire--almcorp-2026.md], neither of which measured it.
5. **The scope creep source of record is twenty-six years old and cites no study**
   [raw/scope--change-control--pmi-abramovici-2000.md].
6. **No source found on out-of-scope work valuation method.** The skill therefore counts and
   dates out-of-scope asks and reports the user's own rate applied to their own estimate, rather
   than modelling a cost.
