# 73% of Health Scores Can't Predict Churn, How to Fix Yours

- **Title:** 73% of Health Scores Can't Predict Churn, How to Fix Yours (Vandfort)
- **URL:** https://vandfort.com/health-scores-cant-predict-churn-how-to-fix-yours/
- **Fetched:** 2026-08-17
- **Source type:** vendor-blog (customer success consultancy). **Second-hand statistics
  throughout.** Every number on this page is attributed to a named third-party study, but no
  page on it links to the study. Treat every figure as unverified at one remove.

## Why this source matters for client-health-radar

It is the most complete statement found of the five failure modes of the conventional health
score, and its stat block is a useful worked example of how customer-health numbers circulate
in this domain: attributed, plausible, and unlinked.

## Extracted claims

**The headline number:** "73% of CS leaders say their current health score doesn't reliably
predict churn." Attributed to ChurnZero's 2025 Customer Revenue Leadership Study, described as
"based on a survey of nearly 800 customer and post-sales leaders." No URL given on the page. A
follow-up search for the primary study did not surface a page carrying this specific figure,
so the 73 percent is recorded here as a claim about a study rather than as a verified finding.

**Other statistics on the page, all second-hand:**

| Claim | Attributed to | Link on page |
|---|---|---|
| Median B2B SaaS net revenue retention 101 percent, "down from 110%+ in 2021" | Pavilion 2025 B2B SaaS Performance Benchmarks | none |
| "27% Lower gross churn with predictive vs. rule-based scoring" | Gainsight Pulse 2025 | none |
| "40-60% of SaaS cancellations happen within the first 90 days" | CustomerScore.io | none |
| "86% of customers are more likely to stay when onboarding is clear" | OnRamp 2026 State of Onboarding Report | none |
| "60-70% of all payment failures" are soft declines | no attribution given | none |

**The five named failure modes, quoted:**

1. "You're measuring what happened, not what's about to happen." Over-reliance on lagging
   indicators such as historical NPS and past renewal rates.
2. "Your weights were set once and never recalibrated." Signal weights go stale as the
   product and the customer base change.
3. "One score is trying to do everything." A single score attempting to predict churn and
   expansion at once.
4. "You're treating all customers the same." Segment and lifecycle-stage differences are
   ignored.
5. "The score lives on a dashboard nobody checks." The prediction is disconnected from any
   workflow.

**Recommendations:**

- Use leading indicators, and specifically **relative to that customer's own baseline**. The
  worked example given is "declining login frequency relative to a customer's own baseline
  over the past 14 days."
- Segment-specific scoring by customer size and lifecycle stage.
- Backtest the score against historical churn at 60, 180 and 270 days before the actual churn
  event.
- Route the prediction into a workflow (CRM, Slack, in-app alert) rather than a dashboard.

## Direct implication for the skill

The per-customer-baseline instruction is the transferable one and it is the design the skill
adopts for silence gaps: compare a client against their own normal cadence, not against a
fixed threshold. Failure mode 3 is the argument against a single composite number. Failure
mode 5 is the argument for a routine that pushes a notification rather than a file that sits
somewhere.

The stat block is also a caution. This whole subject area circulates numbers that are
attributed but not linkable. The skill does not quote any of them at the user.
