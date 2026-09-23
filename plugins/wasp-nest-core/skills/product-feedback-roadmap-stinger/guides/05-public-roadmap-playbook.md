# Guide 05: Public Roadmap Playbook

The decision to publish a public roadmap is not a default — it is a trust intervention for a specific set of circumstances. This guide explains when to publish, what to put on it, how to maintain it, and the three anti-patterns that destroy public roadmap trust.

## The transparency spectrum

```
← More control                                More transparency →

Private (internal)  |  Status-only  |  Now/Next/Later  |  Quarterly milestones  |  Dated milestones
```

| Posture | What customers see | Risk level | Maintenance cost |
|---------|-------------------|-----------|-----------------|
| Private | Nothing | None | None |
| Status-only | Items exist, each has a status (Planned / In Progress / Shipped) | Low | Low |
| Now/Next/Later | Items grouped into three time horizons without dates | Medium | Low |
| Quarterly milestones | Items tagged with a quarter (Q3 2026) | Medium-High | Medium |
| Dated milestones | Items with specific release dates | High | High |

**Recommendation for most SaaS teams:** Start with **Status-only** or **Now/Next/Later**. These postures provide meaningful transparency (customers know what's coming) without the sandbagging risk of committed dates.

## When to publish a public roadmap

Publish when **at least two** of the following are true:

- Customer trust is low and needs rebuilding (the "shouting incident" scenario).
- Sales cycles regularly stall on roadmap questions ("will you build X before we sign?").
- Enterprise customers contractually require roadmap access.
- You are directionally stable: ≥ 70% confidence the published items will not change significantly.

**When NOT to publish:**

- Trust is high — customers are not asking for a roadmap; don't create obligation where none exists.
- Strategic flexibility is critical — you are in a pivot or major product shift.
- Competitive dynamics make your roadmap dangerous to expose.
- Internal alignment is shaky — publishing a roadmap your own team hasn't committed to fractures trust faster than not publishing.

## The 20% capacity cap

The most actionable data point from public roadmap deployments:

> "Allocate 20% of your capacity to customer-voted features. The other 80% remains under product leadership control."

This cap is critical. Without it, voting becomes the roadmap and you lose strategic control. With it, customers see their votes matter (their features land in the 20%) while the team retains ownership of the strategic 80%.

Communicate the cap publicly: "We allocate 20% of our quarterly capacity to community-voted features. Here's what's in that bucket for Q3."

## The no-dates discipline

**Never commit specific release dates on a public roadmap.** Reasons:

1. Customers see a Q3 date and expect the feature in Q3. When it slips to Q4, trust erodes.
2. Date commitments become support tickets every time a sprint slips.
3. Dated roadmaps require continuous maintenance as priorities shift.

**What to use instead:**

| Instead of | Use |
|-----------|-----|
| "July 15, 2026" | "In Progress" status |
| "Q3 2026" | "Planned" status (if you must signal a quarter, say "targeting Q3" not "shipping in Q3") |
| "Coming soon" | "Now/Next/Later" horizon |
| "2026" | "Planned" |

If enterprise customers contractually require dates, negotiate to commit dates in a private roadmap shared only with those accounts — not on the public board.

## The Now/Next/Later model

The most maintainable public roadmap format for early-stage teams:

- **Now:** What we are actively building this quarter.
- **Next:** What we plan to build next quarter.
- **Later:** Things on our longer-term horizon (no date commitment; subject to change).

Items graduate from Later → Next → Now as priorities are confirmed. This model is honest about uncertainty without creating date commitments.

## Roadmap format options

| Format | Best for | Maintenance |
|--------|----------|-------------|
| Public kanban (Linear/Productlane-style) | User-facing; mirrors your actual issue tracker | Low (auto-synced if using Productlane) |
| Changelog-first (Notion-style) | Fast-shipping teams; "what we shipped" | Very low |
| Voting board (Raycast-style) | Community-driven; votes drive the Now bucket | Medium |
| Now/Next/Later | Early-stage; flexible; honest | Very low |
| Timeline with swimlanes | Multi-team, enterprise | Medium |

## Anti-patterns

### 1. Sandbagging (the "Q3 forever" problem)

Items sit in a quarter on the public roadmap while internally the team knows they will not be built. Customers track it, ask about it, and eventually call you out.

**Fix:** Apply the 30-day decision SLA from `guides/03-status-transition-policy.md`. Items that are not getting built should move to "Not Planned" with a reason, not sit in "Planned" indefinitely.

### 2. Voting distortion (the "export to CSV" problem)

High-volume B2C user bases vote for generic commodity features (CSV export, dark mode, calendar integration) over strategic differentiators. These requests dominate the public roadmap.

**Fix:** (1) Weight votes by customer MRR or plan tier. (2) Apply the 20% cap: voted features get 20% of capacity, product strategy gets 80%. (3) Segment the voting board by audience: a separate B2B customer portal with authenticated voting prevents mass consumer voting on enterprise features.

### 3. Status rot (the "Under Review" graveyard)

Hundreds of items sit in "Under Review" for months or years. Customers eventually stop submitting feedback because they see nothing gets addressed.

**Fix:** The 30-day SLA. Every item that passes 30 days without a status change gets a decision: Planned or Not Planned. The weekly audit query surfaces the backlog.
