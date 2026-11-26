---
name: "traffic-capacity-stinger"
description: "Plan traffic spikes from measured request, latency, resource, DB and queue data. Produce capacity, SLO, cost, admission and recovery proposals with bounded future validation scope."
license: AGPL-3.0-or-later
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-drone: traffic-capacity-wasp-drone
  pair-drone: traffic-capacity-wasp-drone
  domain: traffic capacity
  research-window: 2026-10-08 primary-source capture
---

# Traffic capacity
Produce a read-only measured traffic-spike planning packet. Start with [README](README.md). Trigger on traffic spikes, concurrency bottlenecks, queue overload, admission/recovery planning or capacity versus cost from supplied metrics. Staffing and hire-versus-services questions belong to Capacity Planning.

## Procedure
1. Read [measurement](guides/01-measure-traffic-and-bottlenecks.md), pin actual scope and observation quality, and fill the [worksheet](references/templates/measurement-worksheet.md). Missing target facts remain gaps.
2. Read [capacity/SLO/cost](guides/02-bound-capacity-slo-and-cost.md), use dated actual provider constraints and matched units. Little law applies to steady-state matched averages; tails need actual distributions.
3. Read [admission/recovery/validation](guides/03-propose-admission-recovery-and-validation.md). Propose bounded policies and an owner-accepted future test scope; execute no load, probe, provisioning or setting change.
4. Deliver observations, assumptions, cited constraints, arithmetic, cost unknowns, admission/recovery decisions and explicit NOT_RUN labels. Inspect the [fictional case](examples/fictional-spike.md) for negative branches; it proves no actual performance or scaling result.

## Boundary and evidence
Read-only advisory runtime. No actual load/probe, account, credentials, autoscaler, production settings, spend, distributed benchmark or new tool. Resolve selected owners using [Core routing](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/pest-controller-suit/SKILL.md); source owner comes from root catalog. Sentry owns telemetry wiring, Vercel/DevOps actual platform execution, Operating Cost invoice-aware budget modeling, DB query/pool changes and Security privacy/tenant/abuse policy. No server/customer/native/performance promise follows from source checks or toy arithmetic.

Claims trace to [digest](references/research/distillation.md) and sources. Reports belong to the user's existing capacity/operations report location or an agreed local artifact destination. Write no report during a readonly native role unless its carrier permits artifact output; return the packet in the response instead.

<!-- Ship Gate removed: research-only runtime. Source component construction still requires parent Security, Quality and Repository Health before any authorized commit. -->

## Critical Directive
- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [sentry-stinger](../sentry-stinger/SKILL.md) - Measurement and alert wiring, subject to actual owner selection.
  - [vercel-stinger](../vercel-stinger/SKILL.md) - Actual runtime and platform constraints/configuration.
  - [security-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/security-stinger/SKILL.md) - Privacy, tenant, abuse and implementation audit decisions.
  - [guide map](README.md) - Resolve other optional owners through selected routing before dependent work.
