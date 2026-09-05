# Sales pipeline win propensity prediction: a regression approach (Yan et al., 2015)

- **Title:** Sales pipeline win propensity prediction: a regression approach
- **Authors:** Junchi Yan, Min Gong, Changhua Sun, Jin Huang, Stephen M. Chu
- **URL:** https://arxiv.org/abs/1502.06229
- **Fetched:** 2026-08-17
- **Source type:** academic (arXiv preprint, IBM authors, enterprise case data)
- **Date:** February 22, 2015

## Window note

Outside the 6-month window. Retained because it is one of very few papers modelling a real
enterprise B2B pipeline end to end, and because its stated obstacles are exactly the
obstacles a capture-derived board faces.

## Extracted content, abstract quoted in full

"Sales pipeline analysis is fundamental to proactive management of an enterprize's sales
pipeline and critical for business success. In particular, win propensity prediction,
which involves quantitatively estimating the likelihood that on-going sales opportunities
will be won within a specified time window, is a fundamental building block for sales
management and lays the foundation for many applications such as resource optimization and
sales gap analysis. With the proliferation of big data, the use of data-driven predictive
models as a means to drive better sales performance is increasingly widespread, both in
business-to-client (B2C) and business-to-business (B2B) markets. However, the relatively
small number of B2B transactions (compared with the volume of B2C transactions), noisy
data, and the fast-changing market environment pose challenges to effective predictive
modeling. This paper proposes a machine learning-based unified framework for sales
opportunity win propensity prediction, aimed at addressing these challenges. We
demonstrate the efficacy of our proposed system using data from a top-500 enterprize in
the business-to-business market."

## Access limitation, stated

Only the abstract page was retrieved. The full paper's treatment of stage features,
time-in-stage features, and rep subjectivity was not accessible in this sweep. No claim in
the distillation attributes a finding on those topics to this paper.

## Claims this source supports

1. Three named obstacles to modelling a B2B pipeline quantitatively, from a peer-facing
   academic source: LOW TRANSACTION VOLUME, NOISY DATA, and a FAST-CHANGING ENVIRONMENT.
   All three are worse, not better, for a solo operator with a handful of live deals.
2. Direct consequence for this skill: a single operator's deal history is far too small to
   fit any win-probability model on. The skill must not attach a probability figure to a
   stage. It can only place the deal and show the evidence.
3. Win propensity is defined in the literature as an estimate over a SPECIFIED TIME WINDOW,
   not as a property of the deal. A board without a time window attached to any forecast
   claim is under-specified.
