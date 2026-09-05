---
source_type: synthesized-internal
authority: community-practitioner
relevance: critical
topic: estimation
stinger: agile-scrum-stinger
fetched: 2026-05-20
---

# Estimation Techniques: When Each Fits

Synthesized from: Atlassian Fibonacci story points guide (Feb 2026), FreeScrumPoker blog (Nov 2025), TeachingAgile Planning Poker guide, Planning Poker App Sprint Planning guide (Dec 2025), TeachingAgile story points guide (Feb 2026), New Relic planning poker docs.

---

## Important Baseline: What the Scrum Guide Says About Estimation

**The Scrum Guide 2020 does NOT prescribe:**
- Story points
- Fibonacci
- Planning Poker
- Any estimation technique

**What the Guide DOES say:** The Sprint Backlog contains "the work the Developers deem necessary to achieve the Sprint Goal." PBIs in the Product Backlog are "sized" (2020 changed "estimated" to "sized" in the backlog section). The Developers determine how much work fits in the Sprint (not the PO).

Estimation is a community practice layered on top of Scrum, not a Scrum requirement.

---

## Technique 1: Fibonacci Story Points + Planning Poker

### What it is
Story points measure relative complexity, effort, and uncertainty combined, not time. The Fibonacci sequence (1, 2, 3, 5, 8, 13, 21...) deliberately creates increasing gaps to reflect that larger items carry more uncertainty.

Planning Poker: each Developer picks a card privately, reveals simultaneously. The simultaneous reveal prevents anchoring bias. Outliers discuss; team converges.

**Modified Fibonacci used in practice:** 0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100, ∞, ?

### Best fit
- Sprint-level refinement of 5-20 stories
- Teams that need velocity tracking for forecasting
- Teams with ≥ 3 sprints of history to build a velocity baseline
- Teams with 3-9 members (diminishing returns above 9)

### When to avoid
- Teams smaller than 3 (discussion overhead exceeds benefit)
- Teams where work is highly homogeneous (all items are roughly equal)
- New teams with no backlog history (no calibration possible yet)
- Teams planning to adopt #NoEstimates or throughput-based forecasting

### Key mechanics
- Only Developers estimate: PO clarifies but does not vote
- Timebox each story to 5 minutes in Planning Poker; if no consensus, split the story
- Use "reference stories": 2-3 completed stories as calibration anchors per point value
- Never convert story points to hours: use velocity for forecasting
- Velocity = sum of story points for all Done stories in a Sprint (partials count as zero)
- "Yesterday's weather" principle: commit to ~100% of average velocity for next Sprint

### Common failure modes (anti-patterns)
| Anti-pattern | Diagnosis | Repair |
|---|---|---|
| Velocity gaming | Team inflates estimates to look productive | Velocity is a planning tool, not a performance metric; SM educates management |
| PO estimates | PO assigns points before team discusses | Remind: PO clarifies requirements, Developers size work |
| Point-to-hours conversion | "8 points = 2 days" | Remove hours from estimation vocabulary entirely |
| Skipping simultaneous reveal | Senior dev votes first; others follow | Enforce simultaneous card flip; use digital tools for remote teams |
| Story inflation over time | Velocity steadily rises with no explanation | Quarterly re-calibration against reference stories |

---

## Technique 2: T-Shirt Sizing

### What it is
Relative size categories: XS, S, M, L, XL (sometimes XXL). No numeric precision.

### Best fit
- Roadmap-level estimation (quarters, not sprints)
- New teams with no story point history (less intimidating than Fibonacci)
- Stakeholder communication about relative scope
- Sizing epics and features (not individual stories)
- Large backlog triage (50+ items quickly categorized)

### When to avoid
- Sprint planning that requires velocity-based forecasting (must convert to numbers, which adds a step)
- Teams that already have stable Fibonacci velocity

### Conversion pattern (when needed)
Typical mapping: XS=1, S=2-3, M=5, L=8-13, XL=21+. Note: this conversion is team-specific and should be calibrated from historical data.

### Fibonacci vs. T-shirt research finding (FreeScrumPoker 2025)
"Fibonacci teams achieve consistent velocity within 3-4 sprints, while T-shirt teams converting to numbers take 5-6 sprints to stabilize." Use Fibonacci if sprint-level forecasting is the goal. Use T-shirt for roadmap communication.

---

## Technique 3: Affinity Estimation

### What it is
Silent grouping of stories into Fibonacci buckets by relative size. Each team member moves stories on a wall (or digital board) without discussion until consensus emerges. Used for large batches.

### Best fit
- Large backlog triage (50-200 stories)
- Initial sprint sizing at project kickoff
- Teams with established point calibration who need to move fast

### Speed: 10-20 seconds per story (vs. 2-5 minutes for Planning Poker)

---

## Technique 4: Bucket System

### What it is
Stories are physically distributed into labeled buckets (Fibonacci values). One story is placed in a reference bucket; others are sorted relative to it. Faster than Planning Poker for large quantities.

### Best fit
- 50-200 stories
- Teams with 5-15 members
- Large-scale estimation sessions (program increment planning, SAFe PI planning)

---

## Technique 5: #NoEstimates

### What it is
Throughput-based forecasting: count stories completed per sprint (or per week) rather than estimating them. Requires that stories be roughly equal in size. Forecasting uses Monte Carlo simulation over historical story counts.

### Best fit
- Mature teams with stable, well-sized story throughput
- Teams where work is highly homogeneous
- Teams with ≥ 6 months of history
- Continuous delivery environments (not sprint-committed delivery)

### Key prerequisite
Stories must be consistently small (fits in 1-3 days of work). If stories vary wildly in size, throughput counting is unreliable.

### Common misconception
#NoEstimates does not mean "no planning" or "no forecasting": it means counting stories instead of sizing them in points. Monte Carlo simulation over story count still produces probabilistic forecasts.

### When to avoid
- New teams with no throughput history
- Teams with widely variable story sizes
- Environments where external stakeholders expect velocity-based burn-up charts

---

## Decision Matrix: Which Technique to Use

| Context | Recommended technique |
|---|---|
| New team, <3 sprints | T-shirt sizing for roadmap; start with ideal days for sprint planning |
| Growing team, 3-12 sprints | Fibonacci + Planning Poker for sprint planning |
| Mature team, stable velocity | Fibonacci (continue) or #NoEstimates (if stories are small + consistent) |
| Roadmap planning | T-shirt sizing or Affinity |
| Large batch triage (50+ items) | Affinity Estimation or Bucket System |
| Sprint-level refinement (10-20 stories) | Planning Poker |
| Remote teams | Digital Planning Poker tools (PlanningPoker.com, Parabol, PointingPoker) |

---

## Estimation Anti-Patterns Catalog

| Anti-pattern | Description | Fix |
|---|---|---|
| **Velocity as KPI** | Management uses velocity to compare teams or measure performance | Velocity is a planning tool for the team, not a management metric |
| **Velocity gaming** | Team inflates estimates or marks incomplete stories as Done to hit velocity targets | Treat velocity as an input to planning, not a goal |
| **Sprint stuffing** | PO adds work when team finishes Sprint Goal early | Sprint Goal is sufficient; extra work is team's discretion |
| **Points inflation** | Same work gets more points over time with no actual change in complexity | Quarterly re-estimation calibration against reference stories |
| **PO estimates** | PO assigns estimates before team discussion | Estimation is Developers' prerogative; PO only clarifies |
| **Estimation theater** | Hours spent in estimation sessions that generate no consensus or useful data | Timebox hard (5 min/story); split any story with no consensus |
| **Hardening sprint** | Teams reserve a sprint for "testing and bug fixing" after development sprints | Every sprint must produce a Done increment; testing is part of every sprint |

---

## Key Quotations for the Bee to Cite

> "Velocity is a planning tool, not a performance metric. It tells you how much a team can realistically deliver — not how hard they're working." (Community consensus)

> "Partially completed stories contribute zero to velocity. Only stories that meet the Definition of Done count." (TeachingAgile story points guide, 2026)

> "The most important thing to remember about planning poker is that it's the discussion, not the agreement that's important." (New Relic Agile Handbook)

> "Some teams practicing continuous delivery skip estimation entirely, focusing on keeping work small and maintaining consistent throughput. This can work for mature teams with truly consistent story sizes, but most teams benefit from the planning visibility that story point estimation provides." (FreeScrumPoker beginner's guide, Nov 2025)
