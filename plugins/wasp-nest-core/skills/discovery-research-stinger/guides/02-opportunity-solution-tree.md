# 02 — Opportunity Solution Tree

How to build, maintain, and read an Opportunity Solution Tree (OST).

**Research source:** `research/external/2026-05-20-opportunity-solution-tree-guide-2026.md`, `research/external/2026-05-20-torres-ai-ost-vistaly-synthesis.md`

---

## Node taxonomy

An OST has four layers:

```
Desired Outcome
└── Opportunity Cluster (top-level customer problem or desire)
    └── Sub-opportunity (specific context or constraint)
        └── Solution (product idea that addresses the sub-opportunity)
            └── Experiment (test for the riskiest assumption of the solution)
```

**Desired Outcome** — the root; one per OST; never changes mid-cycle.

**Opportunity** — a customer problem, pain, or unmet desire expressed in the customer's words. Not a product idea. Derived from interview data. Clusters group related opportunities.

**Sub-opportunity** — a narrower or more contextual version of a parent opportunity. Not always present; add when the parent is too broad to address with a single solution.

**Solution** — a product idea that addresses the parent opportunity. Multiple solutions can compete under one opportunity node. Solutions are hypotheses, not commitments.

**Experiment** — the smallest test that would validate or invalidate the riskiest assumption of the solution. One experiment per solution at a time; run sequentially.

---

## The six-step OST build process

1. **Write the desired outcome** at the root (see `guides/01-desired-outcome.md`).
2. **Cluster opportunities** from your interview data. Start with 5-10 top-level nodes, each expressed as a customer problem/desire statement.
3. **Break down broad opportunities** into sub-opportunities where the cluster is too large to address with one solution.
4. **Propose solutions** under the most-targeted opportunity node the team is working on. 3-5 competing ideas is healthy.
5. **Map experiments** under the most-promising solution: one experiment targeting the highest-risk assumption.
6. **Mark the active path** — the team should be working on one opportunity → one solution → one experiment at a time.

(Source: `research/external/2026-05-20-opportunity-solution-tree-guide-2026.md`)

---

## The living-document rule

The OST is updated every week after interviews — not quarterly, not after sprints. Each interview adds, refines, or invalidates at least one opportunity node. The tree is always a snapshot of the current best understanding, not a finished document.

A tree that hasn't been touched in 3 weeks is likely stale and should be reviewed before planning any new experiments.

---

## Three canonical failure modes

1. **Solution nodes in the opportunity layer.** "Add a dashboard" is a solution, not an opportunity. Rephrase as the customer problem it solves: "Users can't see their progress at a glance." (Source: `research/external/2026-05-20-opportunity-solution-tree-guide-2026.md`)

2. **Too many active paths.** The team is "working on" five different opportunity-solution pairs simultaneously. This means nothing is actually being validated. Prune to one active path; keep others as backlog nodes.

3. **AI-generated nodes without interview evidence.** Using AI to draft the initial OST from market analysis produces plausible-sounding but ungrounded trees. Every node in the opportunity layer must trace to at least one customer interview quote. AI can help structure the tree; AI cannot substitute for the interviews. (Source: `research/external/2026-05-20-torres-ai-ost-vistaly-synthesis.md`)

---

## When to prune

Prune an opportunity node when:
- Three or more interviews produced no new evidence supporting it.
- The team has shipped a solution targeting it and the desired-outcome metric moved.
- A new interview reveals it was a symptom of a deeper opportunity you've since added.

Move pruned nodes to a `## Retired Opportunities` section rather than deleting them; they are part of the learning history.

---

## Output

Write the OST to: `library/discovery/opportunity-solution-tree.md`

Use `templates/opportunity-solution-tree.md` as the structural skeleton.

See `examples/happy-path-saas-onboarding.md` for a worked OST with annotated nodes.
