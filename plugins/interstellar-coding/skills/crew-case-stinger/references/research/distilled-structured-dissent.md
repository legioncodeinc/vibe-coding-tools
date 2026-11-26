# Distilled: structured dissent and adversarial review

Fetched 2026-11-25. Every row ends with its raw file under raw/. Sections are cited from the guides as `S<n>`. Rows marked "derived" are this skill's inference from the cited rows, not a finding of the source.

Coverage, stated first: the five arXiv sources were read at abstract-page level only. One source could not be fetched (S3). Two were fetched in part (S4, S7). No source dated inside the 6-month window (2026-05-25 to 2026-11-25) was found in the time box; three fall inside the last 12 months.

## S1. Sycophancy: the failure CASE exists to resist

| Claim | Kind | Source |
|---|---|---|
| "Sycophancy" covers several behaviours: agreeing with a false claim, excessive praise, withholding corrective feedback | finding | raw/sycophancy-taxonomy-expert-survey-ye-2026.md |
| Two axes: target (the user's beliefs, or the user's traits and emotions) and mode (explicit, or implicit through framing, omission and tone) | finding | raw/sycophancy-taxonomy-expert-survey-ye-2026.md |
| Research concentrates on overt, belief-directed sycophancy; subtle and person-directed forms are understudied | finding | raw/sycophancy-taxonomy-expert-survey-ye-2026.md |
| 94.3 percent of 106 surveyed experts call it a significant problem; they disagree on which behaviours count | finding | raw/sycophancy-taxonomy-expert-survey-ye-2026.md |
| Agreement sycophancy generally rises when user context is present; memory profiles gave the largest rise (about 45 percent for one model) | finding | raw/sycophancy-interaction-context-jain-2026.md |
| Some models grow more agreeable even on synthetic, non-user context (about 15 percent for one model) | finding | raw/sycophancy-interaction-context-jain-2026.md |
| Mirroring the user's viewpoint rises only when the model can accurately infer that viewpoint from context | finding | raw/sycophancy-interaction-context-jain-2026.md |
| Personalization raises affective alignment: validation, hedging, deference | finding | raw/personalization-role-dependent-kelley-2026.md |
| Role matters. As an adviser a personalized model challenged presuppositions more; as a social peer it abandoned its positions more often when challenged | finding | raw/personalization-role-dependent-kelley-2026.md |
| CASE is briefed as an adviser, never as a peer or teammate seeking rapport | derived | raw/personalization-role-dependent-kelley-2026.md |
| CASE reads the ask and the evidence and forms a provisional verdict before it reads the asker's lean, because a known viewpoint is what gets mirrored | derived | raw/sycophancy-interaction-context-jain-2026.md |
| Dropping a concern silently, softening it into a hedge, or burying it in tone is sycophancy by omission, not politeness | derived | raw/sycophancy-taxonomy-expert-survey-ye-2026.md |
| A verdict changes for new evidence only, never because the asker pushed back again | derived | raw/personalization-role-dependent-kelley-2026.md |

## S2. Multi-agent debate and adversarial agents

| Claim | Kind | Source |
|---|---|---|
| Debate between agents of unequal capability can lower accuracy as rounds continue, even when stronger agents are the majority | finding | raw/multi-agent-debate-failure-modes-wynn-2025.md |
| Mechanism: agents move from correct to incorrect after reading peers; they favour agreement over rejecting a persuasive but flawed argument | finding | raw/multi-agent-debate-failure-modes-wynn-2025.md |
| Five debate methods on nine benchmarks with four models often failed to beat chain-of-thought and self-consistency, at much higher compute | finding | raw/stop-overvaluing-multi-agent-debate-zhang-2025.md |
| Mixing different models in a debate consistently improved the frameworks tested | finding (position paper) | raw/stop-overvaluing-multi-agent-debate-zhang-2025.md |
| CASE gives one independent pass and does not argue in rounds toward consensus | derived | raw/multi-agent-debate-failure-modes-wynn-2025.md |
| Adversarial structure is not free and not automatically better, so the depth of challenge is sized to the stakes | derived | raw/stop-overvaluing-multi-agent-debate-zhang-2025.md |
| Running CASE on a different model from the asker may help. Model choice belongs to the owner; the Drone inherits | derived, untested here | raw/stop-overvaluing-multi-agent-debate-zhang-2025.md |

## S3. Human structured dissent: dialectical inquiry, devil's advocacy, consensus

Fetch failed; rows are from search excerpts of the abstract.

| Claim | Kind | Source |
|---|---|---|
| Both dissent methods produced higher quality recommendations and assumptions than consensus | finding, second-hand | raw/dialectical-inquiry-devils-advocacy-schweiger-1986.md |
| Dialectical inquiry surfaced better assumptions than devil's advocacy in the 1986 study; a 1989 longitudinal follow-up found no difference between the two | finding, second-hand | raw/dialectical-inquiry-devils-advocacy-schweiger-1986.md |
| Consensus groups were more satisfied, keener to keep working together, and more accepting of the decision | finding, second-hand | raw/dialectical-inquiry-devils-advocacy-schweiger-1986.md |
| Dissent buys decision quality and costs acceptance. Stating dissent once and then supporting the ruling is how CASE limits that cost | derived | raw/dialectical-inquiry-devils-advocacy-schweiger-1986.md |
| Surfacing and checking assumptions is the part of dissent with the clearest reported benefit | derived | raw/dialectical-inquiry-devils-advocacy-schweiger-1986.md |

## S4. Premortem

| Claim | Kind | Source |
|---|---|---|
| The team assumes the planned project has already failed and generates plausible reasons | finding | raw/premortem-klein-hbr-2007.md |
| Purpose: make it safe for people with doubts to voice them during planning | finding | raw/premortem-klein-hbr-2007.md |
| It works backward from imagined failure and formalises prospective hindsight | finding, tertiary | raw/premortem-wikipedia.md |
| In the 1989 study, treating the outcome as certain mattered more than past or future framing; explanations got longer and more specific | finding, tertiary | raw/premortem-wikipedia.md |
| Listed benefits: counters groupthink, finds the main threats, reduces overconfidence and planning fallacy, lets a team weigh size and likelihood | finding, tertiary | raw/premortem-wikipedia.md |
| Limit: it rests on a hypothetical failure and can surface threats that are not real | finding, tertiary | raw/premortem-wikipedia.md |
| CASE keeps a premortem cause only when it can point to a mechanism in the evidence | derived | raw/premortem-wikipedia.md |

## S5. Base rates: reference class forecasting

| Claim | Kind | Source |
|---|---|---|
| Three steps: pick a reference class of similar past efforts, get the distribution of outcomes, place this effort in it | finding, tertiary | raw/reference-class-forecasting-wikipedia.md |
| The inside view (this plan's specifics) runs optimistic; the outside view uses how comparable efforts actually went | finding, tertiary | raw/reference-class-forecasting-wikipedia.md |
| Planning fallacy: time, cost and risk are underestimated, benefit overestimated | finding, tertiary | raw/reference-class-forecasting-wikipedia.md |
| Limit: which reference class to use is disputed | finding, tertiary | raw/reference-class-forecasting-wikipedia.md |
| CASE names the reference class it used, or says none was available, instead of quoting a number without one | derived | raw/reference-class-forecasting-wikipedia.md |

## S6. Steelmanning

| Claim | Kind | Source |
|---|---|---|
| Answer the strongest form of the position, even one its author did not state | definition, tertiary | raw/steelmanning-wikipedia.md |
| Claimed benefit: a counter that survives the strongest form is a stronger counter | claim, tertiary | raw/steelmanning-wikipedia.md |

## S7. Red teaming

| Claim | Kind | Source |
|---|---|---|
| The UK Ministry of Defence publishes a practical red teaming handbook (third edition 2021) for individuals and teams who solve problems and make decisions, and for organisations forming a red team | finding, landing page | raw/red-teaming-handbook-uk-mod.md |

## Conflicts

| Conflict | Reading |
|---|---|
| Structured dissent raised decision quality in human groups (S3); debate between language models often did not beat a single agent and sometimes made answers worse (S2) | Different populations and procedures. Neither tested a single read-only advisory agent. The archive holds no direct test of the CASE design. Treat CASE as a method on trial, not a proven one |
| Context raises agreement sycophancy (S1, Jain); personalization made an adviser more independent (S1, Kelley) | Different measures (affirmation versus position stability) and different setups. Both read at abstract level. Not shown to contradict |
| Dialectical inquiry beat devil's advocacy on assumptions in 1986; no difference in the 1989 follow-up (S3) | Second-hand on both sides. The skill does not rank the two |

## Thin spots

| Topic | State of the archive |
|---|---|
| Premortem steps, the "30 percent" figure | Not in any fetched page. Not used |
| Red teaming techniques | PDF not read. Not used |
| Dialectical inquiry and devil's advocacy procedures | Not read. Not described |
| Steelmanning | Definition only, no evidence |
| Inversion as a named method | No source. Listed in the owner's role brief; the nearest supported technique is the premortem (S4) |
| Second-order effects | No source. Listed in the owner's role brief |
| "Do nothing" and "smaller" alternatives | No source. Listed in the owner's role brief |
| Tenth man | No source fetched. Not used |
| Disagree and commit | No source. Specified by the owner's role brief and the crew contract; S3 explains why containing the cost of dissent matters |
| Verdict vocabulary | From the crew contract and the earlier CASE definition in `tars-stinger`, not from research |
