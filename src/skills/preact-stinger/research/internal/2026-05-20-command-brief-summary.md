---
source_type: internal
authority: high
relevance: high
topic: command-brief
---

# Command Brief Summary: preact-worker-bee

Synthesized from `ai-tools/command-briefs/preact-worker-bee-command-brief.md`.

## Key decisions from the brief

1. **Scope**: Preact 11 specialist: signals, compat, embed, Astro, Fresh. NOT a React architecture guide.
2. **On-demand vs proactive**: the brief suggests proactive, but the domain is narrow enough that on-demand may be more appropriate.
3. **Primary use cases** (from ACTION): classify scenario, audit/author code, review bundle config, produce recommendation, surface "when React is better" decision.
4. **Critical directive summary**: Never recommend Preact without naming the concrete benefit; always check compat compatibility surface; scope signals to specific use case; don't modify Next.js/React tooling; defer to react-worker-bee for React architecture.

## Open questions answered by research

1. **Does signals v2 warrant a separate guide section?** YES: `createModel`/`useModel`/`action` is a substantial new pattern (see `external/2026-05-20-signals-api-v2-guide.md`).
2. **What is the current state of RSC + preact/compat?** BLOCKED: see `external/2026-05-20-preact-compat-compatibility.md`.

## Proposed guide structure (from brief, validated against research)

- `guides/00-when-to-choose-preact.md`: tradeoff matrix
- `guides/01-signals-api.md`: primitives + v2 model pattern
- `guides/02-compat-migration.md`: alias setup, known gaps, migration checklist
- `guides/03-embed-widget.md`: third-party embed pattern
- `guides/04-astro-integration.md`: islands, client directives
- `guides/05-fresh-framework.md`: Fresh 2.x, islands, serializable props
