---
source_url: https://scrum-master-toolbox.org/2026/04/podcast/bonus/bonus-why-your-plan-is-lying-to-you-noestimates-throughput-and-the-superstition-of-project-management/
retrieved_on: 2026-05-20
source_type: blog
authority: official
relevance: critical
topic: noestimates
stinger: estimation-stinger
additional_sources:
  - https://mariachec.substack.com/p/why-are-we-still-estimating-chat-vasco-duarte
  - https://softwaredevelopmenttoday.com/2021/08/noestimates-for-the-perplexed-a-simple-principle-that-makes-estimations-obsolete/
  - https://magnusd.cc/noestimates-just-story-points-done-right.html
  - https://scrum-master-toolbox.org/tag/noestimates-2/
---

# NoEstimates: Throughput, Planning, and Why Your Plan Is Lying to You

## Summary

The #NoEstimates movement, originated by Vasco Duarte, argues that traditional estimates are not planning tools but psychological shields against accountability and micromanagement. The core claim: replacing estimates with throughput-based forecasting (items delivered per unit of time) produces more honest, more accurate, and less stressful delivery predictions. Teams with 6+ months of cycle-time history can use historical throughput to forecast delivery without story points. The prerequisite is reliable flow metrics; #NoEstimates without data is just "no visibility."

A 2026 podcast episode (Scrum Master Toolbox, April 2026) by Vasco Duarte directly summarizes the practical test: "The PM wanted 15 items per sprint, the team said 'yeah, we can do 15.' I said, this is not gonna happen. The team had been delivering between five and eight items per sprint. I said, I'm gonna be positive - I'm gonna say seven. And no surprise, by the end of the sprint, they delivered seven." The only tool that reflects reality is throughput.

A May 2025 interview (Maria Chec / Substack) added the data-demolishing insight: "We looked at real team data: 3-point stories taking anywhere from a day to 100+ days. Estimates weren't just wrong - they were irrelevant. In fact, replacing all story point values with '1' only changed the forecast by 8%."

## Key quotations / statistics

- "The only tool that reflects reality is throughput - the number of items completed per unit of time." (Vasco Duarte, 2026)
- "Replacing all story point values with '1' only changed the forecast by 8%." (Maria Chec interview, 2025)
- "Track throughput, not predictions. Forecast using what you actually get done." (2025 interview)
- "If you're in software and using Jira, you already have this data. You don't need anyone's permission. You don't need to change anything. Just look at what your team actually delivers versus what they planned to deliver." (Vasco Duarte, 2026)
- The #NoEstimates principle: "the future will look like the past unless something happens. And should something happen, we will know it immediately and act on it." (Duarte, 2021 - still cited as core in 2026)
- At Nokia, Duarte tracked system-level throughput across 500 people on 100 teams. Six months into a 12-month program, the data said they'd be at least 6 months late. The PM email-asked all 100 teams; all said yes. The project was cancelled at 18 months.

## Annotations for stinger-forge

- Core material for `guides/03-noestimates.md` - Duarte's argument, the throughput substitution evidence, and the prerequisite (reliable history)
- The "replacing story points with 1" datum is a killshot against story point precision - use in `guides/00-principles.md` as evidence that size estimation adds little signal
- The Nokia/500-person failure story is a perfect anti-pattern for `guides/01-diagnosis.md` - "stakeholder commitment trap"
- Key tension: #NoEstimates is not "no planning" - it's "replace guesses with actual data." stinger-forge should surface this balance prominently
- The 2026 podcast transcript is the most current primary source; prioritize over the 2015 InfoQ book interview which is foundational but dated
- Open question from Command Brief: "Has the NoEstimates community produced any controlled studies vs. estimation teams?" - short answer from research: No peer-reviewed RCT found. The evidence base is case studies and retrospective analyses (Nokia, F-Secure, Avira). stinger-forge should acknowledge this limitation honestly in `guides/03-noestimates.md`
