# Generic Orchestration Frameworks (DEMOTED: the deploying product uses a homegrown orchestrator)

> **Status:** Demoted reference. the deploying product's coaching system uses a homegrown `runOrchestrator()` in `lib/agent-orchestrator.ts`, wired into the 5-layer prompt cascade, three-tier memory, and `traceAICall()` observability.
>
> The frameworks below were considered and not adopted. This document exists for context when comparing approaches.

---

## When the deploying product's homegrown orchestrator is the right call

- **Tight integration with Cohere / Qdrant / Valkey / Postgres pipelines**: the deploying product's `assembleContextPacket()` does parallel I/O across all four; framework abstractions add layers without reducing complexity.
- **Specific cascade architecture**: the 5-layer prompt cascade with `PromptVersion` audit doesn't map cleanly onto generic prompt-templating systems.
- **Explicit `AgentContextConfig` thread-scope policy**: the deploying product's per-agent memory-access rules are encoded in a Postgres table, not a framework abstraction.
- **`AiTrace` observability**: first-class, fire-and-forget, stored in the application's Postgres. Generic OpenTelemetry approaches add complexity without lift.

A push to adopt a framework would require the substitution policy in `guides/01-stack-enforcement.md §2`.

---

## The alternatives (for context)

### Mastra

- **Pitch:** TS-first agent framework. Workflows, evals, RAG tools bundled.
- **Why we didn't pick:** Our orchestrator is already wired into Cohere + Qdrant + Valkey through application code. Adopting Mastra would mean rewriting the `assembleContextPacket()` parallel-I/O dance and the prompt cascade in Mastra primitives: significant migration cost for a benefit (workflow primitives) we don't currently need.
- **When it'd be the right call:** New TS-first agent product without an existing orchestration layer.

### Vercel AI SDK (`ai`)

- **Pitch:** Streaming, tools, UI primitives for Next.js + edge.
- **Why we didn't pick:** the deploying product's API is Fastify + Postgres, not Next.js edge. The streaming we need (SSE for onboarding) is straightforward without the SDK abstraction. Their UI primitives are React-side; `react-worker-bee` evaluates them separately.
- **When it'd be the right call:** Next.js app with streaming chat as the primary surface.

### LangGraph (LangChain)

- **Pitch:** Stateful multi-agent orchestration with explicit state machines.
- **Why we didn't pick:** the deploying product doesn't yet need multi-agent state machines. The current routing pattern is "classify → assemble → dispatch": a single-shot decision, not a state machine. The planned full multi-agent dispatcher (per `guides/15-agent-orchestration.md §7`) might benefit from LangGraph IF we adopt it; until then, premature.
- **When it'd be the right call:** Multi-agent flows with explicit handoff state, retries, parallel execution.

### Pydantic AI

- **Pitch:** Typed Python agents with validation.
- **Why we didn't pick:** the deploying product's API is TypeScript. Adopting Pydantic AI would require a Python service for AI calls, splitting the codebase.
- **When it'd be the right call:** Python-first AI codebase.

### LlamaIndex

- **Pitch:** RAG-heavy framework with retrieval + indexing primitives.
- **Why we didn't pick:** Cohere + Qdrant integration is already direct in `cohere-client.ts` + `qdrant-client.ts`. LlamaIndex's abstractions (Index, Retriever, NodeParser) would replace direct code without reducing surface area.
- **When it'd be the right call:** RAG-heavy Python product where the integration layer is the value.

### CrewAI

- **Pitch:** Multi-agent collaboration with role-based agents.
- **Why we didn't pick:** the deploying product's coach lineup is opinionated and small (7 + module variants). The "team of agents" framing doesn't map onto coaching, which is one-coach-at-a-time per session.
- **When it'd be the right call:** Multi-role agent collaboration tasks (research → write → review).

### DSPy

- **Pitch:** Programmatic prompt optimization.
- **Why we didn't pick:** the deploying product's prompts are hand-crafted, audit-versioned, and tuned via eval. DSPy's auto-optimization would conflict with the `PromptVersion` audit trail and the explicit-cascade architecture.
- **When it'd be the right call:** Research-flavored prompt-optimization workflows.

---

## The decision-tree summary

| Project shape | Framework |
|---|---|
| TS-first agent product (greenfield) | Mastra |
| Next.js streaming + tools + UI | Vercel AI SDK |
| Multi-agent state machines (TS or Python) | LangGraph |
| Typed Python agents | Pydantic AI |
| RAG-heavy Python | LlamaIndex |
| Multi-agent collaboration (Python) | CrewAI |
| Programmatic prompt optimization (research) | DSPy |
| **Existing the host codebase + opinionated cognitive layer** | **homegrown `runOrchestrator()` (canonical)** |

---

## Source: original mind-stinger research

Research notes from the retired mind-stinger:

- `2026-04-25-orchestration-frameworks-2026.md` (carried over to `research/`)
- `2026-04-25-mastra-positioning.md` (carried over)
