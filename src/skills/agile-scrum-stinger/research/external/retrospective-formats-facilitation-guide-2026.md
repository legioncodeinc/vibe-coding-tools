---
source_url: https://docs.gitscrum.com/en/best-practices/sprint-retrospective-formats
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: retrospective
stinger: agile-scrum-stinger
---

# Sprint Retrospective Formats and Facilitation Best Practices (2026)

## Summary
A 2026 practitioner guide covering four primary retrospective formats (Start/Stop/Continue, 4Ls, Mad/Sad/Glad, Sailboat) with timing, facilitation protocol, and action item best practices. Combined with retroflow.org facilitation guide, provides the complete playbook for the retrospective templates folder.

## Key quotations / statistics
- "67% of Scrum Masters say retrospectives are the most valuable Scrum ceremony (State of Agile Report, Digital.ai), yet the quality of facilitation makes or breaks each session." (retroflow.org)
- "Teams that run regular retrospectives are 24% more productive (State of Agile Report), but only if insights translate to action." (retroflow.org)
- "Teams with action item follow-through are 31% more likely to report retro satisfaction." (retroflow.org)
- "Limit to 1-3 actions max per retro; Quality over quantity."

## Format Reference Table
| Format | Best For | Time | Team Context |
|---|---|---|---|
| Start/Stop/Continue | Quick check, new teams | 30-45 min | All teams, especially beginners |
| 4Ls (Liked/Learned/Lacked/Longed For) | Deep reflection, mature teams | 60 min | Learning-focused culture |
| Mad/Sad/Glad | After difficult sprint, emotional check | 45 min | Teams processing conflict or stress |
| Sailboat | Visual teams, upcoming risks | 60 min | Teams wanting forward-looking framing |
| DAKI (Drop/Add/Keep/Improve) | Process optimization | 60 min | Teams optimizing specific practices |

## Start/Stop/Continue - Protocol
1. 5 min: Silent writing (individual sticky notes, no sharing)
2. 5 min: Share START ideas
3. 5 min: Share STOP ideas
4. 5 min: Share CONTINUE items
5. 10 min: Dot vote (3 dots each) and discuss top items
6. 5 min: Pick 1-2 action items with owners

## Sailboat Format Anatomy
- **Island (Goal)**: Where are we trying to go? Sprint goal, quarter objectives
- **Wind (Helping)**: What's pushing us forward? Good practices, tools that work
- **Anchor (Holding back)**: What's slowing us down? Blockers, bad habits, technical debt
- **Rocks (Risks)**: What might hurt us? Dependencies, upcoming concerns

## Action Item Standard (REQUIRED for every retro)
Every retrospective action item must have:
- [ ] **What**: Specific and actionable description (not "improve communication")
- [ ] **Owner**: Single named person (not "the team")
- [ ] **Due date**: Sprint or calendar date
- [ ] **Success criteria**: How will we know it's done?
- **Maximum**: 1-3 action items per retro

Example transformation:
| Vague | Specific |
|---|---|
| "Improve communication" | "Post daily standup summary in Slack by 10am" [Owner: @alex] [Due: starts next sprint] |
| "Better testing" | "Add unit tests for auth module" [Owner: @sarah] [Due: by Friday] |

## Common Retrospective Mistakes (Anti-Patterns)
- Skip retros entirely ("too busy")
- Same format every sprint → team disengages
- No silent writing → loudest voice dominates
- Too many actions → none get done
- No action owners → diffusion of responsibility
- Never review previous action items → team loses faith
- Manager dominates the retro → kills psychological safety
- Blame individuals → destroys safety

## Annotations for stinger-forge
- The four main formats (Start/Stop/Continue, 4Ls, Sailboat, Mad/Sad/Glad) should be in `templates/retrospective-formats.md` with facilitation notes.
- The action item standard (What/Owner/Due/Criteria) must be in every retrospective template: this is a Critical Directive from the Command Brief.
- The five-phase facilitation framework (Set Stage, Gather Data, Generate Insights, Decide, Close) from retroflow.org/blog/post/how-to-facilitate-retrospective is the canonical structure.
- The "31% more likely to report satisfaction when action items are followed through" stat is compelling justification for the owner+deadline requirement.
