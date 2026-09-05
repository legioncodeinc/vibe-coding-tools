# Diagnosis: Classifying the Team's Estimation Dysfunction

Always diagnose before recommending. The wrong framework applied to the wrong dysfunction makes things worse. Use this guide to classify what you observe, then navigate to the appropriate technique guide.

## The five dysfunction categories

### Category 1: Anchor bias (estimates are shaped by external pressure)

**Symptoms:**
- "The deadline was set before the requirements were written."
- "We give estimates and then the manager adjusts them to fit the roadmap."
- "Story points always end up at what it takes to fit the sprint."

**Root cause:** Organizational pressure causes estimates to be tweaked toward a pre-set target rather than reflecting genuine complexity assessment. This is Flyvbjerg's "strategic misrepresentation" pattern. See `research/external/04-planning-fallacy.md`.

**Recommended intervention:** Introduce estimation sessions BEFORE roadmap dates are set. Use Planning Poker or T-shirt sizing to produce independently anchored estimates, then let the roadmap adapt. If that is politically impossible, pivot to probabilistic forecasting (Monte Carlo) as the honest conversation tool with stakeholders. See `guides/04-monte-carlo.md`.

---

### Category 2: Planning-fallacy optimism (inside-view estimates)

**Symptoms:**
- "The estimate is always for the happy path: we never account for testing or review."
- "We're consistently off by 2x-3x, even on familiar work."
- "The developer who wrote the code always estimates lower than everyone else."

**Root cause:** Inside-view thinking. Kahneman's planning fallacy. Developers imagine the code-writing path and forget testing, review, deployment, documentation, and surprises. See `guides/05-planning-fallacy.md` for the full treatment.

**Recommended intervention:** Introduce the Cone of Uncertainty to manage stakeholder expectations early. Add a planning-fallacy correction factor (multiply naive estimates by 2 if historically 2x off). For teams with history, use Monte Carlo over story-point velocity.

---

### Category 3: Story-point velocity decay (points lose meaning over time)

**Symptoms:**
- "Our velocity keeps changing even though the team is the same."
- "A '3' story for developer A takes 2 hours; a '3' for developer B takes 3 days."
- "Our burndown charts are meaningless because points are inconsistent."

**Root cause:** Story-point calibration drifts as team composition changes, work type shifts, or the reference story is forgotten. This is why the Maria Chec/Duarte research found that replacing all story points with "1" changed the forecast by only 8%: the size signal had already decayed. See `research/external/01-noestimates.md`.

**Recommended intervention:** Re-anchor with a calibration session (explicit reference stories at 1, 3, 5, 8). If the team has 6+ months of cycle-time data, evaluate switching from story-point velocity to throughput-based forecasting. The data may show the points were never adding accuracy.

---

### Category 4: Stakeholder-commitment trap (estimates are treated as promises)

**Symptoms:**
- "When I estimate 3 weeks, the PM tells the client 3 weeks: no buffer, no confidence level."
- "Developers are scared to give honest estimates because they'll be held to them."
- "Velocity gaming: we inflate points so we 'hit' the sprint."

**Root cause:** The commitment trap from `guides/00-principles.md`. When estimates are contractualized, developers rationally optimize for hitting the number, not for accuracy. The Nokia failure case (Vasco Duarte, 100 teams all said yes) is the enterprise-scale version of this exact pattern. See `research/external/01-noestimates.md`.

**Recommended intervention:** This is an organizational behavior problem, not a framework problem. Changing the framework while keeping the commitment culture will fail. Introduce probabilistic communication ("70% confident we'll finish in 4 weeks; 90% confident in 6 weeks") as a concrete alternative. Monte Carlo output in P50/P85/P95 form is the most defensible format for stakeholder conversations. See `guides/04-monte-carlo.md`.

---

### Category 5: Wrong granularity (estimating at the wrong level)

**Symptoms:**
- "We estimate every ticket to 4 decimal places but our epics have no size."
- "We T-shirt size epics for the roadmap but then don't know how to break them down for sprints."
- "The stakeholder asks for a release date for a 200-ticket project: all we have is sprint velocity."

**Root cause:** The estimation approach doesn't match the planning horizon. T-shirt sizing is appropriate for roadmap-level conversations (months out). Story points are appropriate for sprint-level work (weeks out). Monte Carlo is appropriate for project-level delivery dates (when you have both backlog size and throughput history).

**Recommended intervention:** Use progressive refinement: T-shirt sizes at the epic/feature level → story points at the sprint-ready story level → cycle time data at the ticket level for Monte Carlo. See `guides/02-relative-sizing.md` for the sizing hierarchy and `guides/04-monte-carlo.md` for project-level forecasting.

---

## Decision tree: technique selection

```
Does the team have 6+ months of cycle-time data?
├── YES → Is the primary need a delivery date with confidence?
│   ├── YES → Monte Carlo (guides/04-monte-carlo.md)
│   └── NO → Either NoEstimates (guides/03-noestimates.md) or
│              continue story points as lightweight signal only
└── NO → Does the audience include non-technical stakeholders?
    ├── YES → T-shirt sizing for roadmap (guides/02-relative-sizing.md)
    └── NO → Fibonacci story points + Planning Poker (guides/02-relative-sizing.md)
```

If organizational culture treats estimates as commitments, treat that as Category 4 and address it before selecting a framework.

---

*Worked examples demonstrating this diagnosis process: `examples/fibonacci-estimation-session.md`, `examples/monte-carlo-forecast.md`*
*Cited research: `research/external/01-noestimates.md`, `research/external/04-planning-fallacy.md`, `research/external/05-t-shirt-sizing.md`*
