---
title: "Adjacent Stinger Review: devops-stinger, Escalation Boundary"
source_url: internal://legion-code/.claude/skills/devops-stinger/SKILL.md
source_type: internal-stinger
authority: high
relevance: medium
date_retrieved: 2026-05-20
topics:
  - escalation-paths
  - domain-boundaries
  - devops
  - kanban-method
stinger: kanban-flow-stinger
---

# Adjacent Stinger Review: devops-stinger Escalation Boundary

**Source:** Internal: `.claude/skills/devops-stinger/SKILL.md`
**Purpose:** Clarify the boundary between `kanban-flow-worker-bee` and `devops-worker-bee` to avoid domain overlap and ensure correct escalation paths in SKILL.md.

## Summary

The `devops-stinger` skill covers: Docker and Docker Compose pipeline configuration, GitHub Actions CI/CD architecture, Depot build acceleration, Trivy/Scout image scanning, and local-CI parity. It explicitly does NOT cover: cloud provisioning, DB schema migrations (except wiring the migration step), security CVE deep audits, or PRD authoring.

**Key escalation boundary with `kanban-flow-worker-bee`:**

The two worker-bees are clearly separated by their level of abstraction:
- `kanban-flow-worker-bee` owns the **human delivery process** and **board discipline**: how teams decide what to work on, in what order, with what WIP constraints, and how they measure whether work is flowing well.
- `devops-worker-bee` owns the **automated software delivery pipeline**: the CI/CD tooling, container build process, and deployment infrastructure that carries code from commit to production.

**Where the two overlap (and how to handle it):**
1. **Deployment frequency** (DORA metric): Both worker-bees care about it. `kanban-flow-worker-bee` treats deployment frequency as a throughput measure visible on the Kanban board (deployed cards per week). `devops-worker-bee` owns the CI/CD pipeline that enables frequent deployment. Rule: when the conversation is about "how often are we deploying and does it match our throughput target," that is `kanban-flow-worker-bee`. When the conversation is about "how do we make our CI/CD pipeline capable of deploying more frequently," that is `devops-worker-bee`.

2. **Lead time for changes** (DORA metric): `kanban-flow-worker-bee` measures lead time as defined in Kanban: from ticket creation to deployment. The DORA "lead time for changes" (commit to production) is a subset. If a team's lead time is dominated by CI/CD pipeline wait times (slow builds, manual gates), `kanban-flow-worker-bee` should flag this and escalate to `devops-worker-bee`.

3. **Blocked items due to infrastructure dependencies**: A Kanban card blocked because it is waiting for a CI environment, a deployment credential, or an infrastructure prerequisite is in `devops-worker-bee`'s domain. `kanban-flow-worker-bee` surfaces the blockage via its flow metrics analysis; `devops-worker-bee` resolves the infrastructure cause.

**Escalation triggers in `kanban-flow-stinger` (when to hand off to `devops-worker-bee`):**
- Team's cycle time is dominated by CI/CD wait time (>50% of cycle time in a "Waiting for Build/Deploy" state)
- Team wants to implement custom Kanban tooling (automated board state transitions, GitHub Actions for WIP limit enforcement)
- Deployment cadence is constrained by pipeline infrastructure, not team WIP discipline

## Annotations for stinger-forge

- **Supports** SKILL.md "escalation paths" section: stinger-forge should encode the three escalation triggers above as explicit routing rules.
- The DORA metric overlap (deployment frequency, lead time for changes) should be acknowledged in `guides/02-flow-metrics.md` with a note that `kanban-flow-worker-bee` uses Kanban-native definitions (not DORA definitions), and the two measurement systems produce different but complementary numbers.
- The GitHub Actions WIP limit enforcement workaround (writing a GitHub Action to count column cards and post warnings) is technically in `devops-worker-bee`'s implementation domain. If a user asks `kanban-flow-worker-bee` to implement this, the worker-bee should describe WHAT to build (the policy and thresholds) and hand off to `devops-worker-bee` or `react-worker-bee` for the actual implementation.
