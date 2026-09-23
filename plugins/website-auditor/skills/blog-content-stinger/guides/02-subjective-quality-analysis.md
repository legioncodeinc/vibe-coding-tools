# 02. Subjective semantic/quality analysis

How to write the `[subjective]` per-post quality read PRD-018 AC-2 requires, and why it has to stay visibly separate from the quantified word count and from the AI-authorship probability band.

## Why the label matters

PRD-018's conduct rules state plainly: "Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports." This is not a formatting nicety. A reader of the final audit (customer or auditor report, assembled downstream by `audit-reporting-wasp-drone`) needs to be able to tell, at a glance, which findings are measured facts (word count, structured-data field presence) and which are this Drone's own reasoned judgment (does this post actually deliver on its headline). Blending the two erodes trust in both.

## What to evaluate per post

Cover, in 2-4 sentences per post (see `references/templates/post-finding-template.md`):

- **Clarity and structure.** Does the post have a legible throughline, or does it wander? Are headings/sections doing real organizational work?
- **Depth versus surface-level treatment.** Does the post go beyond a listicle-level restatement of common knowledge, or does it actually add something (a worked example, a specific number, a named source)?
- **Promise delivery.** Does the post deliver on what its own headline/intro claims it will cover? A post titled "The Complete Guide to X" that covers three of ten obvious subtopics is failing its own promise, regardless of word count.
- **Audience fit.** Is the reading level, jargon density, and assumed prior knowledge appropriate for what the rest of the site signals about its audience (informed by `icp-positioning-wasp-drone`'s output where available)?

## What NOT to do here

- Do not turn this section into a disguised AI-authorship claim ("this reads like it was written by AI" belongs in the AI-authorship section, under its own probability-band-and-method discipline, see [03-ai-authorship-probability-band-reporting.md](03-ai-authorship-probability-band-reporting.md), never smuggled into the quality read as an unqualified aside).
- Do not cite a word count or a structured-data field inside the `[subjective]` prose as if it were part of the judgment call, those are quantified findings and belong in their own rows.
- Do not pad every post with the same boilerplate sentence. If two posts genuinely read the same way, say so briefly, do not manufacture false variety.

## Handling disagreement or low confidence

If a post is genuinely hard to assess (e.g. a listicle format that isn't trying to be deep, so "lacks depth" is not a fair criticism), say that explicitly rather than forcing every post into the same four-question mold. A subjective read that acknowledges its own uncertainty is more useful than one that fakes confidence.
