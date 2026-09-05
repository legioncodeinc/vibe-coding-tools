# Customer Health Scoring: The Shift Toward Predictive Models (TSIA)

- **Title:** Customer Health Scoring: The Shift Toward Predictive Models, TSIA blog
- **URL:** https://www.tsia.com/blog/customer-health-scoring-predictive-models
- **Fetched:** 2026-08-17
- **Source type:** vendor research (Technology and Services Industry Association, a
  membership research body serving technology services organizations)

## Why this source matters for client-health-radar

TSIA is the closest thing the customer health score has to an industry research body. This
piece names the standard failure modes of the conventional score, including the one that
matters most to a skill built on a human's own captured impressions of their clients.

## Extracted claims

- **What a conventional health score is built from:** "Product usage data", "support tickets",
  "engagement metrics", and "CSM sentiment".
- **The lagging indicator problem:** traditional models are "telling you what already
  happened, not what's about to happen." Consequences named: "You're identifying churn risk
  after the customer has already disengaged" and "You're reacting to problems instead of
  preventing them."
- **The single-score problem, named the Swiss Army knife problem:** a score "trying to measure
  everything, but accurately predicting almost nothing."
- **Subjectivity bias in the human-supplied input, which is the important finding here.** When
  CSM sentiment carries weight in the score, "retention rates tend to decline" and "churn
  rates tend to increase." The stated mechanism is that CSMs "naturally want to believe
  they've stabilized a risky account after a positive interaction."
- **The actionability gap:** scores commonly fail to answer "What's causing the issue. Who
  should take action. What the next best step is."
- **One TSIA statistic:** "22% of organizations are using AI for health scoring today."
  Organizations using machine learning report "significantly higher accuracy" than manual
  models, presented as a chart without stated percentages. Sample size and methodology are not
  disclosed on the page.
- **Recommendations:** audit inputs for subjective bias; reduce manual effort; replace the
  single score with "multiple focused models" (churn risk, expansion, outcome) rather than one
  composite; pilot one use case before a full rebuild.

## Direct implication for the skill

The subjectivity finding is the sharpest one and it cuts against the naive design. A health
signal derived from how the relationship owner felt after the last good call systematically
under-predicts churn, because a good call is exactly when the owner relaxes. That is an
argument for behavioral signals with dates attached rather than impressions, and for making
the evidence visible so the user can disagree with the reading.

The "multiple focused models" recommendation is the argument against one composite number.
The domain is telling the skill to produce separate named signals, not a single score.
