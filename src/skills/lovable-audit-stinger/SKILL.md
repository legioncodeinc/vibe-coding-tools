---
name: "lovable-audit-stinger"
description: "Audit Lovable-built Supabase apps: RLS denials, role-differential reads, function gating, auth posture, bundle-forensics key/endpoint extraction, findings triage, reporting."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: worker
  paired-bee: lovable-audit-worker-bee
  domain: security-audit
---

# Lovable Audit Stinger

This stinger audits Lovable-built applications on Supabase backends: Postgres/RLS posture, Edge Function gating, the authentication plane's configuration, and what the shipped client bundle exposes. It produces findings ledgers, control-effectiveness attestations, and known-unknowns — reports, never patches. Every factual claim it makes traces to its own research archive under `references/research/`; if a claim isn't in the archive, it isn't a fact yet.

## When to use

- Auditing a Lovable-built web app or its Supabase project (RLS, functions, auth, storage surface)
- Classifying observed denials — embedded `42501`-class codes, `PGRST2xx`, function gating — into verified controls vs findings
- Extracting embedded keys, endpoints, and third-party hosts from a shipped JS bundle as audit evidence
- Triaging audit observations into the operator's tier taxonomy and shaping them into a report

## When not to use

- Generic web-app security review with no Supabase/Lovable stack — route to `security-stinger` instead
- Fixing what an audit finds — this stinger reports; remediation is a separate, separately-authorized engagement
- Harness-format or Hive-component questions — `queen-bee-stinger` owns creation, `beekeeper-suit` owns routing

## Procedure

1. Confirm the audit surface splits into its four layers — auth, data, functions, client-side exposure — and confirm authority over the target before any probe.
2. Run **bundle forensics** first (`guides/bundle-forensics.md`): keys, endpoints, table/RPC inventories out of the shipped JS, archived with documented offsets. The inventories become the named inputs to everything downstream — nothing is guessed.
3. Run **auth-posture readout** (`guides/auth-posture.md`): settings, confirmation gating, rate-limit shapes, token anatomy. Non-mutating or fully-disclosed synthetic probes only.
4. Run **differential visibility** (`guides/differential-visibility.md`) per resource: the anon-vs-authenticated delta is the policy signal; reads only.
5. Run **write-denial discrimination** (`guides/write-denial-discrimination.md`) where write-path controls must be proven: minimal labeled writes, embedded-code classification, mandatory cleanup and post-cleanup re-read.
6. Run **RPC & function-surface enumeration** (`guides/rpc-function-enumeration.md`) on the client-named inventory: gates, role deltas, availability failures isolated from configuration.
7. Close with **audit reporting** (`guides/audit-reporting.md`): ledger hygiene, tier assignment per the operator taxonomy, unknowns stated, hygiene section attested.

## References map

- `references/probe-tables.md` — load when: classifying any observed denial, shape, or gating response; the embedded-code table is authoritative over HTTP status.
- `references/worked-examples.md` — load when: a probe sequence needs its validated shape before execution; six worked sequences with observed outcomes.
- `references/reporting.md` — load when: shaping findings into the report; ledger schema, tier mapping, skeleton, grounding line.
- `references/research/distillation.md` — load when: a domain claim needs verification or a dispute needs settling; the cited distillation of this component's own archive.
- `references/research/raw/` — load when: tracing any distilled claim back to its primary source, official or empirical.
- `guides/` (six verb guides) — load when: executing a specific audit verb; each states preconditions, procedure, validated expected shapes, anti-patterns.

## Related bees and stingers

- [security-stinger](../security-stinger) — general security audit passes; owns non-Supabase surface and the Ship Gate's first gate.
- [auth-stinger](../auth-stinger) — authentication-flow deep work; this stinger stops at posture readout and defers flow-level analysis.
- [beekeeper-suit](../beekeeper-suit) — roster and routing; owns dispatch decisions and hosts this pair's registration.
- [lovable-audit-worker-bee](../../agents/lovable-audit-worker-bee) — the paired worker agent; the orchestrator delegates sustained audit waves to it rather than running them inline.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [security-stinger](../security-stinger) — general security audit; first gate of the Ship Gate pipeline.
  - [auth-stinger](../auth-stinger) — authentication-flow analysis and remediation design.
  - [beekeeper-suit](../beekeeper-suit) — roster and routing for the Bee Army.

<!-- Ship Gate removed: research-only stinger, produces no committable code. -->
