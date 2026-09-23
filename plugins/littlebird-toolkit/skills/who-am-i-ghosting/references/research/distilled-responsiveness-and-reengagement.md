# Distilled: responsiveness, silence, and reviving a cold thread

Written from a fresh read of `raw/` on 2026-08-17. Every claim below ends in a bracketed
citation to the raw file it came from. Nothing here comes from training data. Where the
archive is thin or the sources disagree, this file says so instead of smoothing it.

Thirteen sources archived. Nine academic, one practitioner press, one press column, and two
vendor or community pages kept specifically as negative findings. One of the nine academic
sources is archived for weak relevance, to document a gap rather than to support a claim,
and says so in its own header.

---

## 1. The base rate: silence is the default, not the exception

This is the first thing the skill has to internalize, because it destroys the naive design.

| Measure | Value | Source |
|---|---|---|
| Enterprise emails that never receive a reply | 92.30 percent | [raw/triage--enterprise-reply-features--yang-avocado.md] |
| Share of inbox messages a person replies to | about one third | [raw/triage--reply-prediction--dabbish-kraut-chi-2005.md] |
| Same, measured in logs | about 25 percent of a day's mail at low load | [raw/responsetime--reply-norms--kooti-www-2015.md] |
| Same, at roughly 100 messages a day | less than 5 percent | [raw/responsetime--reply-norms--kooti-www-2015.md] |
| Emails sent to more than one recipient besides the sender | 52.99 percent | [raw/triage--enterprise-reply-features--yang-avocado.md] |

**Consequence.** An unanswered message is the ordinary operation of email. A skill that
treats non-reply as evidence of a debt will produce a list the length of the inbox. The
debt has to be established by other means, and the volume has to be capped by design.

## 2. The base rate for reply timing, which makes "days cold" interpretable

| Measure | Value | Source |
|---|---|---|
| Most likely reply time | 2 minutes | [raw/responsetime--reply-norms--kooti-www-2015.md] |
| Median reply time | 47 minutes | [raw/responsetime--reply-norms--kooti-www-2015.md] |
| Mean reply time | 1157 minutes | [raw/responsetime--reply-norms--kooti-www-2015.md] |
| Replies happening within one day | more than 90 percent | [raw/responsetime--reply-norms--kooti-www-2015.md] |
| Median by age, teens to over 50 | 13, 16, 24, 47 minutes | [raw/responsetime--reply-norms--kooti-www-2015.md] |
| Threads lasting longer than one day | 22 percent | [raw/responsetime--reply-norms--kooti-www-2015.md] |
| Threads that are one message and one reply | more than 30 percent | [raw/responsetime--reply-norms--kooti-www-2015.md] |

**Consequence.** If more than 90 percent of replies land inside a day, then the difference
between 9 days cold and 30 days cold is not the interesting variable. Both are already far
outside the norm. Days cold is a poor primary sort key precisely because the distribution
is so compressed at the fast end and so long-tailed at the slow end. Use it to set
treatment, not rank.

## 3. What actually predicts a reply, measured

These are the variables the ranking model is built from. All measured, none assumed.

| Predictor | Measured effect | Source |
|---|---|---|
| Message contains an information request | reply probability +22 percent | [raw/triage--reply-prediction--dabbish-kraut-chi-2005.md] |
| Message is social in content | reply probability +23 percent | [raw/triage--reply-prediction--dabbish-kraut-chi-2005.md] |
| Rated importance | reply probability +7 percent | [raw/triage--reply-prediction--dabbish-kraut-chi-2005.md] |
| Many recipients | reply probability -18 percent | [raw/triage--reply-prediction--dabbish-kraut-chi-2005.md] |
| Action request present | rated importance +20 percent | [raw/triage--reply-prediction--dabbish-kraut-chi-2005.md] |
| More recipients | rated importance -10 percent | [raw/triage--reply-prediction--dabbish-kraut-chi-2005.md] |
| Social content | rated importance -32 percent | [raw/triage--reply-prediction--dabbish-kraut-chi-2005.md] |
| Prior pairwise interaction history | among the strongest features in the reply model | [raw/triage--enterprise-reply-features--yang-avocado.md] |
| Recipient count | top ten feature in the reply model | [raw/triage--enterprise-reply-features--yang-avocado.md] |
| Subject length | most important single feature for reply action | [raw/triage--enterprise-reply-features--yang-avocado.md] |

Note the counter-intuitive one: a **work relationship with the sender lowered** reply
probability by 9 percent while **raising** rated importance by 23 percent
[raw/triage--reply-prediction--dabbish-kraut-chi-2005.md]. Important work mail gets
postponed more, not less. That is the ghosting mechanism stated in a table.

## 4. Deferral is the observable behavior this skill is actually detecting

| Measure | Value | Source |
|---|---|---|
| Active users deferring at least one message per day | 16 percent | [raw/triage--deferral-behavior--sarrafzadeh-wsdm-2019.md] |
| All messages that get deferred | 3 percent | [raw/triage--deferral-behavior--sarrafzadeh-wsdm-2019.md] |
| Triage sessions containing a deferral | at least 12 percent | [raw/triage--deferral-behavior--sarrafzadeh-wsdm-2019.md] |
| Messages needing a reply that get deferred (prior work, cited in that paper) | 37 percent | [raw/triage--deferral-behavior--sarrafzadeh-wsdm-2019.md] |
| Reply, ReplyAll or Forward actions taken at a later time | 26 percent | [raw/triage--deferral-behavior--sarrafzadeh-wsdm-2019.md] |
| Deferral probability at low versus high unhandled backlog | about 3 percent rising to about 14 percent | [raw/triage--deferral-behavior--sarrafzadeh-wsdm-2019.md] |

The measured profile of a deferred message:

| Feature | Deferred | Not deferred | Source |
|---|---|---|---|
| Mean recipient count | 3.9 | 7.0 | [raw/triage--deferral-behavior--sarrafzadeh-wsdm-2019.md] |
| Action-request signal | 0.075 | 0.034 | [raw/triage--deferral-behavior--sarrafzadeh-wsdm-2019.md] |
| Human rather than system sender | 0.849 | 0.744 | [raw/triage--deferral-behavior--sarrafzadeh-wsdm-2019.md] |

**Consequence.** Three of the skill's four hard gates are confirmed against three million
logged actions: few recipients, an explicit action request, a human sender. Deferral is
also enacted through Flag and MarkAsUnread, both of which are visible on screen
[raw/triage--deferral-behavior--sarrafzadeh-wsdm-2019.md], which is why the retrieval brief
sweeps inbox and notification snapshots and not only message threads.

## 5. What silence costs, and when it costs nothing

Experimental evidence, small sample, one study.

| Finding | Value | Source |
|---|---|---|
| Normative expectation in the study population | one day | [raw/silence--chronemic-violation--kalman-rafaeli-2011.md] |
| Silence over a month, high-stake sender: recommend | dropped from 57 percent to 19 percent | [raw/silence--chronemic-violation--kalman-rafaeli-2011.md] |
| Same: would not recommend | rose from 43 percent to 81 percent | [raw/silence--chronemic-violation--kalman-rafaeli-2011.md] |
| Main effect of latency | Wilks lambda = .45, p = .003 | [raw/silence--chronemic-violation--kalman-rafaeli-2011.md] |
| Latency by valence interaction | Wilks lambda = .54, p = .03 | [raw/silence--chronemic-violation--kalman-rafaeli-2011.md] |
| Low-stake sender, long pause | not perceived as an expectancy violation at all | [raw/silence--chronemic-violation--kalman-rafaeli-2011.md] |

**The load-bearing result is the interaction, not the main effect.** Silence damaged the
evaluation only where the waiting party had a live stake in the answer. Where they had
already discounted the sender, the same silence cost nothing
[raw/silence--chronemic-violation--kalman-rafaeli-2011.md].

**Consequence.** This is the empirical case for ranking on stake and relationship rather
than on elapsed time. Identical silence, different cost, and the difference is what the
waiting person had riding on it.

Sample caveat: N = 55 MBA students in a hiring vignette. Directionally useful, not a
calibrated effect size for professional correspondence generally.

## 6. Conflict: is the felt urgency real

The archive disagrees with itself here and both readings are kept.

| Reading | Claim | Source |
|---|---|---|
| Silence is costly and is read as a status move | response time is "a subtle status marker"; recipients supply a reason for silence and it is rarely a charitable one | [raw/silence--workplace-reading--laker-forbes-2026.md] |
| The felt urgency is inflated | receivers systematically overestimate how quickly senders expect a response to non-urgent mail; eight pre-registered studies, N = 4,004 | [raw/responsetime--urgency-bias--giurge-bohns-obhdp-2021.md] |

**Preferred reading, and why.** Giurge and Bohns, on evidentiary grounds. Eight
pre-registered studies with 4,004 participants against an unsourced contributor column
with no data in it at all [raw/silence--workplace-reading--laker-forbes-2026.md]. The
Kalman and Rafaeli interaction reconciles the two: silence costs something real, but only
where the other party had a stake, and the person who went silent is a poor judge of which
case they are in [raw/silence--chronemic-violation--kalman-rafaeli-2011.md].

**Consequence.** The user's guilt is not a reliable ranking signal. The skill ranks on
observable stake, not on how bad the user feels, and it does not manufacture urgency in
its own copy.

Caveat on the Giurge and Bohns entry: both full-text hosts refused automated fetch, so this
archive holds the abstract-level statement and the study count only, with no effect sizes
[raw/responsetime--urgency-bias--giurge-bohns-obhdp-2021.md]. Do not quote a magnitude.

## 7. Reviving a cold thread: what the evidence supports

The strongest evidence in the archive, and it points somewhere non-obvious.

| Finding | Value | Source |
|---|---|---|
| Executives before reconnecting | "initially reluctant to reconnect" | [raw/revival--dormant-ties--levin-walter-murnighan-2011.md] |
| Executives after reconnecting | "overwhelmingly positive about the effects of reconnecting" | [raw/revival--dormant-ties--levin-walter-murnighan-2011.md] |
| Reported experience of the reconnection | "as if we had been talking regularly for the past seven years" | [raw/revival--dormant-ties--levin-walter-murnighan-2011.md] |
| Trust, dormant strong versus current strong | 5.47 versus 5.86, decayed "somewhat" but far above weak ties at 4.17 | [raw/revival--dormant-ties--levin-walter-murnighan-2011.md] |
| Shared perspective, dormant strong | 5.51, "just about as much as current strong ties" | [raw/revival--dormant-ties--levin-walter-murnighan-2011.md] |
| Novelty, dormant strong versus current strong | 5.72 versus 5.07, p less than 0.001 | [raw/revival--dormant-ties--levin-walter-murnighan-2011.md] |
| Time cost, dormant strong versus current strong | significantly lower, coefficient -0.022, p less than 0.001 | [raw/revival--dormant-ties--levin-walter-murnighan-2011.md] |
| Usefulness of knowledge received, dormant strong | 5.70, the highest of the four cells | [raw/revival--dormant-ties--levin-walter-murnighan-2011.md] |
| Depth of the pool | the tenth reconnection choice was "about as useful as his or her first choice" | [raw/revival--dormant-ties--levin-walter-murnighan-2011.md] |

Design: 129 executives completing both surveys, 57.6 percent response rate, plus a
second study of 95 at 81.9 percent [raw/revival--dormant-ties--levin-walter-murnighan-2011.md].

**Three consequences.**

1. The dread is miscalibrated in a measurable direction. Reluctance before, overwhelming
   positivity after. The skill can tell the user that reaching out is less awkward than it
   feels and cite a study for it.
2. Trust and shared perspective survive dormancy. The draft should not perform a
   relationship rebuild that is not needed.
3. Reconnection value is roughly flat across the candidate pool and depends on relevance
   to a live purpose, not on which contact went cold most recently. That is an argument
   against a recency sort and for a purpose weight.

The authors also record the dark side case: a reconnection that felt good and was
"ultimately unhelpful" because "the benefits were personal rather than relevant to his
work project" [raw/revival--dormant-ties--levin-walter-murnighan-2011.md]. Warmth is not
the outcome measure.

## 8. The shape of the message

From the one credibly edited practitioner source located
[raw/revival--reconnect-practice--zucker-hbr-2018.md]:

- Do not apologize extensively. Acknowledge the lapse briefly and early, then move to
  substance. Normalize the silence rather than express regret about it.
- Subject line: "Reconnecting" for a formal relationship, "Blast from the past" for an
  informal one.
- Do not fail to acknowledge the gap at all either. Both extremes are named as errors.
- Sound confident that they can help and acknowledge that they are busy. Avoid sounding
  "desperate or demanding."
- Reduce the cost of replying: "Please let me know how I can make it easier for you."
- Give an exit: "I completely understand if this isn't a good time."
- Offer reciprocity, and research what specific help you could offer before asking.

The same page claims this approach produces "over 90% response rate." That figure has no
study behind it and is not quoted anywhere in this skill
[raw/revival--reconnect-practice--zucker-hbr-2018.md].

**Length.** Median reply length is 43 words and the most likely reply length is 5 words;
30 percent of emails run past 100 words [raw/responsetime--reply-norms--kooti-www-2015.md].
A long re-engagement message is atypical of the medium and imposes the reply cost the
Zucker guidance says to reduce.

**One question.** An information request raised reply probability by 22 percent, the
largest single positive predictor in the model
[raw/triage--reply-prediction--dabbish-kraut-chi-2005.md]. One specific answerable question
is the highest-yield component available.

**One to one.** Many recipients cut reply probability by 18 percent and rated importance by
10 percent [raw/triage--reply-prediction--dabbish-kraut-chi-2005.md]. Never revive in a
group thread.

## 9. NAMED GAP: does apologizing for the delay help or hurt

No located study answers this directly.

What exists is adjacent and does not transfer cleanly: research on organizations
apologizing to consumers after a service failure, where projecting lower competence in a
non-core domain raises apology effectiveness through perceived costliness and sincerity,
subject to boundary conditions including that the failure must not be "relevant to the core
business" [raw/apology--competence-signal--jams-2022.md]. The unit is an organization and a
consumer, not two professionals and a slow reply, and the core-business boundary condition
could be read either way here.

**What the no-apology-opener rule actually rests on.** Two properly sourced things, neither
of which is the apology literature:

1. Practitioner guidance from an edited business publication against apologizing
   extensively, in favour of a brief acknowledgment followed by substance
   [raw/revival--reconnect-practice--zucker-hbr-2018.md].
2. The pre-registered finding that receivers overestimate how urgently the sender wanted a
   reply, which means the delay the user is apologizing for may not have been experienced
   as one [raw/responsetime--urgency-bias--giurge-bohns-obhdp-2021.md].

State the rule as a defensible default, not as a proven optimum.

## 10. NAMED GAP: how long a professional relationship survives without contact

No located study measures this for professional ties. The nearest evidence is a
longitudinal panel of 25 young people across a school-to-work transition, tracking 1,291
network members over 18 months [raw/decay--relationship-decay--roberts-dunbar-2015.md].

| Finding | Value | Source |
|---|---|---|
| Emotional closeness to kin over 18 months | significant increase, b = 0.27, p less than 0.001 | [raw/decay--relationship-decay--roberts-dunbar-2015.md] |
| Emotional closeness to friends over 18 months | significant decrease, b = -0.62, p less than 0.001 | [raw/decay--relationship-decay--roberts-dunbar-2015.md] |
| Close friendships still in the inner network layer at 18 months | 48.6 percent | [raw/decay--relationship-decay--roberts-dunbar-2015.md] |
| Kinship ties still in the inner layer | 70.3 percent | [raw/decay--relationship-decay--roberts-dunbar-2015.md] |
| What arrested the decline | invested effort; contact frequency for women, shared activities for men | [raw/decay--relationship-decay--roberts-dunbar-2015.md] |
| Effect of adding new friends | greater decrease in closeness to old friends, months 9 to 18 | [raw/decay--relationship-decay--roberts-dunbar-2015.md] |

**Do not transfer the effect sizes.** N = 25, non-professional ties, a single life
transition. What transfers is the shape: non-kin ties decay without deliberate effort,
roughly half of close ones left the inner layer inside 18 months, and effort arrests it
[raw/decay--relationship-decay--roberts-dunbar-2015.md]. Read alongside the dormant ties
result, decay is real but recoverable
[raw/revival--dormant-ties--levin-walter-murnighan-2011.md].

**Consequence.** There is no evidence-based number of days at which a thread is dead. The
write-off list cannot be built on a decay deadline and has to be built on observable
relevance.

## 11. NAMED GAP: when to stop following up

The recent-window sweep for this returned only vendor content marketing. The representative
page carries 17 statistics, every one attributed, and every attribution points at another
sales-tool vendor's blog rather than at a study, a dataset, or a methodology
[raw/followup--unsourced-stats--leadresponse-2026.md]. The population is also wrong twice
over: cold outreach to strangers rather than warm threads, and a seller pursuing a buyer
rather than a person who owes a reply
[raw/followup--unsourced-stats--leadresponse-2026.md].

**Consequence.** No follow-up count threshold is quoted anywhere in this skill. The
write-off rule uses inputs the skill can observe directly.

## 12. Why the standard triage model is not used here

The dominant frame for inbox prioritization is the importance-and-urgency quadrant
[raw/triage--quadrant-model--superhuman-2026.md]. Both of its axes are properties of the
message as read by the recipient. Neither encodes who is waiting, how directly they
addressed the reader, or what the relationship is worth. A message from a long-term client
that carries no deadline lands in the low-priority half and gets postponed indefinitely,
which is the exact failure this skill exists to catch
[raw/triage--quadrant-model--superhuman-2026.md].

The measured predictors are different variables: explicit information request, recipient
count, prior pairwise interaction history, human versus system sender
[raw/triage--reply-prediction--dabbish-kraut-chi-2005.md]
[raw/triage--enterprise-reply-features--yang-avocado.md]
[raw/triage--deferral-behavior--sarrafzadeh-wsdm-2019.md]. The ranking model is built from
those.

That page also carries an unsourced research claim, that "only 40% of emails need to be
seen by the end of the day, and more than a third don't need to be seen at all," with no
author or venue [raw/triage--quadrant-model--superhuman-2026.md]. Not quoted in this skill.

## 13. Window note

The default sweep window for this repo is six months. Ten of the thirteen sources sit
outside it: 2005, 2011, 2011, 2015, 2015, 2018, 2019, 2021, 2022, and one undated
information retrieval paper on a corpus from a company that no longer exists. Each raw file
carries its own window note explaining the retention. The pattern behind all ten is the
same. The recent-window literature on responsiveness and follow-up is almost entirely
vendor content marketing with blog-to-blog citation chains, and the measured work on reply
behavior, silence interpretation, relationship decay, and reconnection was done earlier and
has not been superseded by anything the sweep located.

Three in-window sources were archived. All three are low trust and all three are labelled
as such [raw/silence--workplace-reading--laker-forbes-2026.md]
[raw/followup--unsourced-stats--leadresponse-2026.md]
[raw/triage--quadrant-model--superhuman-2026.md]. That is itself the finding about this
domain's recent literature, and it is why the skill's guides cite 2005 and 2011 papers for
claims a marketing page would have been happy to supply a rounder number for.
