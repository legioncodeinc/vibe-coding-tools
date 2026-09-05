---
source_url: https://docs.slack.dev/changelog/2024/12/10/dev-policy-update/
retrieved_on: 2026-05-20
source_type: changelog
authority: official
relevance: high
topic: policy
stinger: slack-app-stinger
---

# Slack App Developer Policy Updates: December 10, 2024

## Summary

On December 10, 2024, Slack updated its App Developer Policy with two significant changes: (1) explicitly requiring that apps intended for commercial distribution at scale submit to Slack Marketplace review (closing the loophole of distributing an unlisted app alongside a Marketplace-listed version), and (2) explicitly prohibiting the use of Slack data to train LLMs "under any circumstances." These policy changes are directly relevant to the App Directory guide and any AI-powered Slack app the stinger covers.

## Key quotations / statistics (verbatim from source)

**Business section addition:**
> "Apps intended for commercial distribution at scale should be submitted for Marketplace review. For clarity, this prohibition extends to listing an Application in the Marketplace and also offering mutual customers a parallel unlisted or custom Application (distributed beyond your organization) that violates our Marketplace guidelines."

**Use of Data section update:**
> "Applications and developers are prohibited from: ... Using Data to train an LLM under any circumstances."

## What changed

1. **Mandatory Marketplace review for commercial-scale apps**: Previously, developers could distribute apps at scale without going through Marketplace review by keeping them unlisted. This loophole is now explicitly closed.
2. **LLM training prohibition made explicit**: The earlier policy implied data usage restrictions; the December 2024 update makes the LLM training prohibition unambiguous and absolute ("under any circumstances").

## Policy context

- This is a policy update, not a technical API change. No Bolt SDK or Events API behavior changed.
- Apps already in the Marketplace at the time of the update were not grandfathered from the LLM prohibition.
- Apps building AI features (Slack bots powered by LLMs, assistant-type apps) must be careful not to route user message content through LLM training pipelines.

## Annotations for stinger-forge

- Maps directly to `guides/06-app-directory.md`: include a "Policy Compliance" subsection.
- The LLM training prohibition is the most consequential new constraint for developers building AI Slack bots in 2025-2026. Stinger-forge must flag it as a prominent warning.
- The commercial-scale distribution rule means developers can no longer avoid Marketplace review by distributing "privately" at scale: stinger-forge should advise starting the Marketplace submission early in the app lifecycle.
- This changelog entry is the most recent policy change found in the research window; no further policy updates were found between December 2024 and May 2026.
