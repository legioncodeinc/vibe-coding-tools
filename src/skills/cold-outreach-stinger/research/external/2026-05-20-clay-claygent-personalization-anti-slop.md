---
source_url: https://formanorden.com/blog/ai-cold-email-personalisation/
title: "AI Cold Email Personalisation: What Actually Works in 2026"
source_type: blog
authority: practitioner
relevance: critical
fetched_date: 2026-05-20
topics: [clay, claygent, ai-personalization, slop, prompt-design, first-line]
stinger: cold-outreach-stinger
---

# AI Cold Email Personalisation: What Actually Works in 2026

## Summary

Published February 2026 by a practitioner agency running Claygent-based personalization at scale. This is the most operationally specific source on the "anti-slop" personalization approach. Key findings: Claygent processes 500+ contacts per hour at $0.02-0.05 per personalized line vs $3-5 for a human researcher; AI-personalized sequences produce 1.5-2x the reply rate of template-personalized emails against the same list; and critically, **if Claygent cannot find specific data, it should return "SKIP"** rather than generating a generic fallback.

The core Claygent prompt constraints provided are directly usable as a template:
- Maximum 25 words
- Reference something specific: a LinkedIn post topic, a company milestone, a hiring pattern, or a role change
- Do not use their first name in the sentence
- Do not use phrases like "I noticed" or "I came across"
- Do not use "impressive" or "exciting" or "congrats"
- Write in a casual, direct tone, like a peer, not a salesperson
- If no specific data is available, write "SKIP" instead of a generic line

The SKIP rule is the key quality gate: "Generic AI personalisation is worse than no personalisation: it tells the prospect you tried to fake specificity and couldn't." Roughly 5-10% of contacts return SKIP on a typical SaaS ICP list. For those, send the email without a personalized first line - an honest cold email outperforms a pretend-personalized one.

## Key quotations / statistics

- "Claygent reads a prospect's LinkedIn activity, company news, recent job postings, or product launches and writes a sentence that references something specific about their situation. The throughput is 500+ contacts per hour."
- "Reply rates on AI-personalised sequences consistently run higher than template-based sends: the gap is typically 1.5 to 2x."
- "If Claygent doesn't have enough data to write something specific, it should return 'SKIP' rather than generating a generic line."
- "Roughly 5 to 10% of contacts will return SKIP on a typical SaaS ICP list."
- The slop test checklist: "Is it specific? Does it reference something only this person's profile would produce? Is it under 25 words? Does it avoid generic AI phrases: nothing like 'leverage,' 'seamless,' 'impressive,' or 'exciting'? Does it sound human or AI-generated?"

## Annotations for stinger-forge

- This source is the primary reference for the SKIP rule and the slop test checklist in `guides/04-clay-personalization.md`.
- The Claygent prompt constraints should be reproduced verbatim as a template in `templates/clay-waterfall-formula.md`.
- The $0.02-0.05/line cost figure is useful context for founders evaluating Clay ROI.
- The 1.5-2x reply rate lift vs template personalization is a key selling point for the Clay investment.
- Cross-references: the slop test in the Command Brief ("the 1-in-1000 test") maps directly to this source's specificity criteria.
