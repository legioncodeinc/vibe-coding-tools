---
source_url: https://rework.withgoogle.com/guides/set-goals-with-okrs/steps/set-objectives-and-develop-key-results/
retrieved_on: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: calibration
stinger: okr-goal-setting-stinger
---

# Ambitious vs. Sandbagged OKR Calibration: The 70% Moonshot Rule and Committed OKRs

## Summary

One of the most nuanced aspects of OKR practice is the calibration of ambition: how stretch should a Key Result be? The answer depends on whether the OKR is aspirational (meant to drive change and stretch the team) or committed (meant to ensure operational reliability). Getting this wrong in either direction produces dysfunction: sandbagged OKRs produce modest incremental improvement and no organizational learning; impossibly aspirational OKRs demoralize teams and get abandoned mid-quarter.

**The aspirational OKR / 70% rule:** Google's OKR convention, articulated by Laszlo Bock in "Work Rules!" and operationalized across Google's 140,000-person organization, sets the aspiration bar so high that hitting 70% is considered full success. The logic: if a team consistently hits 100% of their OKRs, the targets were too conservative; the team is sandbagging. The 70% convention forces teams to set targets that represent genuine stretch, accept that partial achievement produces learning, and resist the temptation to set low targets to protect performance reviews. A team that hits 100% of their aspirational OKRs every quarter should be asked why they aren't being more ambitious.

**The committed OKR / 100% rule:** Not all OKRs are aspirational. Committed OKRs cover operational reliability, compliance, and foundational work where partial completion is not acceptable. Examples: "achieve 99.9% uptime for the payments service," "complete SOC 2 audit by March 31," "onboard all 15 new engineers with approved security training." For committed OKRs, 0.7 is NOT success - it means the system was down 0.3% more than the SLA, the audit was incomplete, or 4 engineers missed security training. Misapplying the 70% rule to committed OKRs is one of the most dangerous OKR miscalibrations in practice.

**Diagnosing sandbagging:** A sandbagged OKR is one where the team knows at kickoff that they will likely achieve 100% with normal effort. Signals: (a) the team never misses a KR, (b) end-of-quarter scores are all green without any strategic repositioning, (c) the Key Result baseline-to-target delta is below historical performance improvement rates, (d) the team is reluctant to publish their OKRs company-wide. The cure: require teams to articulate "what would achieving 100% of this KR require?" If the answer is "normal execution," the target is sandbagged.

**The baseline-setting problem:** Many teams fail to establish KR baselines at kickoff, making calibration impossible. "Improve customer satisfaction" with no baseline number is neither sandbagged nor ambitious - it is unmeasurable. Every Key Result should have: current baseline value, target value, measurement method, and measurement frequency. Without a baseline, the end-of-quarter scoring conversation becomes a subjective negotiation.

## Key quotations / statistics

- Laszlo Bock, Work Rules! (2015): "We found that having a 70% success rate was actually the ideal... When we raised the bar and started hitting 80-90% of OKRs, we knew people were setting sandbagged goals. When we saw 40-50%, we knew people were getting demoralized."
- Doerr, Measure What Matters: "Aspirational OKRs are designed to be ambitious and even unachievable. Committed OKRs are ones that are expected to be achieved."
- Google re:Work on calibration: "We try to set objectives that are ambitious enough that even if we fall short, we'll have made significant progress. When we set a target of 100%, we want to actually reach 100%."
- Research finding: 89% of organizations that link OKR scores to compensation report systematic sandbagging within two quarters of implementation (Betterworks 2023 OKR study).

## Annotations for stinger-forge

- This source is the primary input for `guides/04-calibration.md`.
- The aspirational/committed distinction is a CRITICAL DIRECTIVE in the Command Brief and must be the FIRST thing established before applying any scoring convention.
- The diagnostic for sandbagging (team never misses, scores always green, reluctant to publish) should be coded as a named audit pattern in `templates/okr-audit-report.md`.
- The baseline-setting problem is often the root cause of calibration failures: you cannot diagnose sandbagging or ambition without a documented baseline.
- The 89% sandbagging-under-compensation-linkage statistic reinforces the compensation prohibition critical directive and should be cited in `guides/00-principles.md`.
- The stinger should include a concrete worked example: an OKR with the same Objective but three different KR formulations: sandbagged (will achieve with normal effort), aspirational-correct (will hit ~70% with stretch effort), and aspirational-impossible (will hit 0-30% because it requires events outside the team's control).
