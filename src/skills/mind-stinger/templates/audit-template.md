# {{Audit Type}}: {{tenant or scope}}

**Date:** {{YYYY-MM-DD}}
**Author:** mind-worker-bee
**Scope:** {{tenant ID, codebase scope, time window}}
**Stack confirmed:** {{vector store + reranker + cache + LLM provider + models: populate from the project's `library/knowledge/private/ai/` index}}

---

## Executive summary

{{2-4 sentence synthesis. Lead with the headline finding. Mention severity counts.}}

**Severity counts:** must-fix: __ · should-refactor: __ · style: __

---

## Pillar ratings

Ratings: 🟢 Solid · 🟡 Drifting · 🔴 Needs work

| Pillar | Rating | Headline finding |
|---|---|---|
| Stack discipline (`guides/01`) | | |
| Coach architecture (`guides/02`) | | |
| Prompt cascade (`guides/03`) | | |
| Prompt engineering (`guides/04`) | | |
| Prompt versioning (`guides/05`) | | |
| Onboarding flow (`guides/06`) | | |
| Knowledge base (`guides/07`) | | |
| RAG strategy (`guides/08`) | | |
| Vector payload schema (`guides/09`) | | |
| Cohere embedding & rerank (`guides/10`) | | |
| GraphRAG (`guides/11`) | | |
| Three-tier memory (`guides/12`) | | |
| Context continuity (`guides/13`) | | |
| Multimodal pipeline (`guides/14`) | | |
| Agent orchestration (`guides/15`) | | |
| Observability (`guides/16`) | | |
| Evaluation discipline (`guides/17`) | | |
| Matching (`guides/18`) | | |
| LLM provider config (`guides/19`) | | |
| Common failure modes (`guides/20`) | | |

---

## Findings

### Must-fix ({{count}})

1. **`{{file:line}}`**: {{one-line summary}}
   - Reason: `library/knowledge/private/ai/{{doc}}.md §X` + `guides/{{n}}.md §Y`
   - Fix: {{how}}
   - Severity reasoning: {{why must-fix per the rubric}}

2. ...

### Should-refactor ({{count}})

1. **`{{file:line}}`**: ...

### Style ({{count}})

1. **`{{file:line}}`**: ...

---

## The recurring gap patterns

| Open | Status this audit | Notes |
|---|---|---|
| 1.1 Routing-call tracing gap | open / closed | |
| 1.2 Auxiliary-collection retrieval gap | open / closed | |
| 1.3 Vector-backup automation gap | open / closed | |
| 1.4 Module path RAG gap | open / closed | |
| 1.5 KB chunk leak on partial-update | open / closed | |

---

## Eval signals (where applicable)

| Metric | Window | Mean | Target | Status |
|---|---|---|---|---|
| Retrieval precision (`AiTrace.retrievalScore`) | | | > 0.7; alert < 0.4 | |
| Routing accuracy (`AiTrace.routingCorrect`) | | | > 90% | |
| Sycophancy / agreement (`AiTrace.agreementScore`) | | | < 0.6 tenant-wide | |
| LLM latency (`AiTrace.llmLatencyMs`) P50/P95/P99 | | | | |
| Retrieval latency (`AiTrace.retrievalLatencyMs`) P50/P95 | | | | |

---

## Cross-Bee handoffs

- **`db-worker-bee`**: {{specific items, file:line + reason}}
- **`react-worker-bee`**: {{specific items}}
- **`security-worker-bee`**: {{prompt-injection / key-handling / PII items}}
- **`library-worker-bee`**: {{PRD-shaped items}}
- **`quality-worker-bee`**: {{eval-suite-as-evidence items}}
- **`asset-worker-bee`**: {{coach-registry items}}

---

## Recommended actions

1. {{Action 1: must-fix}}
2. {{Action 2: should-refactor}}
3. {{Action 3: follow-up}}

---

## Sources

- `library/knowledge/private/ai/<doc>.md`: relevant docs cited in this audit
- `.claude/skills/mind-stinger/guides/<n>.md`: relevant guides
- `.claude/skills/mind-stinger/research/<note>.md`: relevant research notes

---

*Authored by mind-worker-bee. Audit shape canonicalized in `.claude/skills/mind-stinger/templates/audit-template.md`.*
