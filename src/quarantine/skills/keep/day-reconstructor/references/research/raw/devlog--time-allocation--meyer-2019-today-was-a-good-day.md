# Today was a Good Day: The Daily Life of Software Developers

Meyer, Barr, Bird, Zimmermann. IEEE Transactions on Software Engineering, 2019 (preprint,
Microsoft Research).

- **URL:** https://www.microsoft.com/en-us/research/wp-content/uploads/2019/04/devtime-preprint-TSE19.pdf
- **Fetched:** 2026-08-17
- **Source type:** academic (peer-reviewed, IEEE TSE, author preprint)
- **Why archived:** Two things. It is the largest published breakdown of how a developer's
  workday actually divides across activities, and it is an explicit, methodologically
  careful example of a study built on developer self-report, with the authors' own account
  of what self-report costs. Both matter to a skill whose entire job is to replace
  self-report with capture.

## Study design

- **Responses:** 5,971 from professional developers at Microsoft, of which 5,928 were used
  for the time-allocation analysis.
- **Invitations:** 37,792 sent over roughly 4 months, about 500 per day, 15.5% response
  rate.
- **Population:** 59.1% junior, 40.5% senior. Mean experience 10.0 years, standard
  deviation 7.48.
- **Method:** self-report only, no automated tracking. Developers reported, in minutes, how
  they spent the previous workday across categories derived from preliminary interviews.
  Median survey completion time was over 7 minutes.
- The authors chose self-report because self-reports "scale better than observations" and
  give "a more holistic view compared to using time tracking software."
- Respondents were told to use "email clients, calendars, task lists, diaries etc. as
  'cues'" to improve recall.

## The workday breakdown

Average total workday: **9.08 hours**.

| Activity | Share | Minutes |
|---|---|---|
| Meetings | 15% | 85 |
| Coding | 15% | 84 |
| Bugfixing | 14% | 74 |
| Email | 10% | 53 |
| Testing | 8% | 41 |
| Breaks | 8% | 44 |
| Other | 6% | |
| Helping others | 5% | 26 |
| Learning | 3% | 17 |
| Administrative | 2% | 12 |

Coding is about 15 percent of a self-reported workday. Coding plus bugfixing plus testing
is about 37 percent.

## Interruption and fragmentation

- Developers reported **4.66 interruptions** on an average day.
- Good workdays had about **one interruption fewer** than bad ones, p less than 0.001.
- Average **longest uninterrupted coding stretch: 47.3 minutes.** On good and typical
  workdays these stretches were significantly longer.
- Reported time to resume after an interruption: "respondents self-reported it took them on
  average less than ten minutes", which the authors note is shorter than the roughly 15
  minutes suggested by prior work.

## What the authors say about self-report accuracy

The paper is candid about the method's limits. Recorded here because this is the closest
this archive gets to a published treatment of self-reported versus observed developer
activity.

- **Recency by design.** They asked about the *previous* workday specifically, because
  "the longer the interval between the time of the event and the time of the interview...
  the less likely that a person will remember it."
- **Acknowledged scope limit:** "we studied developers' workdays based on their
  self-reports and only on one day (and in a few cases two days) per developer."
- **Named biases:** well-being on the preceding day can carry into the reported day;
  survey responders skew conscientious and agreeable and may not represent the population;
  stereotype threat from demographic questions placed early; framing effects from asking
  whether the day was good or typical *after* the time allocation was reported.
- **Convergent validity, not direct comparison:** the authors note their results
  "replicate comparable findings...from previous work that applied differing methods
  (e.g. observations, tracking)." They do not run a within-study comparison of self-report
  against logged data.

## Named gap

This source does not quantify the error between what a developer says they did and what a
logger recorded. It supports the weaker claim that self-report is recall-limited and
bias-prone, and that researchers reduce the damage by shortening the recall interval and
supplying cues. It does not support a claim of the form "developers misremember N percent
of their day."

## Note on retrieval fidelity

Fetched through a summarizing reader against the authors' preprint PDF. Quoted strings are
reported as verbatim by that reader. The minute figures and percentages are from the
reader's extraction of the paper's time-allocation table.
