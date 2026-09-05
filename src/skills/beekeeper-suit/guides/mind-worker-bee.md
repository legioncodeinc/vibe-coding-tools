# mind-worker-bee

## Domain
This Bee is the cognitive-layer authority for the deploying product: every line of code that classifies, retrieves, remembers, prompts, traces, evaluates, summarizes, matches, or orchestrates an LLM. It owns the coach/agent routing lineup, the 5-layer prompt cascade with PromptVersion audit, RAG and GraphRAG, the three-tier memory architecture (Valkey working, Postgres session, Qdrant+graph long-term), the traceAICall() observability discipline, the eval suite, the multimodal pipeline, orchestration, matching, and onboarding streaming. It reads library/knowledge/private/ai/ on every invocation and enforces the recommended canonical stack (Qdrant + Cohere rerank-v3.5 + Valkey + OpenRouter + Llama models + Deepgram) as the default.

## Paired Stinger
[mind-stinger](../../mind-stinger) - the routing table for 12 invocation modes, the canonical-stack hard-rule table, the severity rubric, the recurring gap patterns, and guides covering the coach architecture, prompt cascade, RAG/GraphRAG, memory, observability, and evaluation.

## Trigger phrases
- "review this AI code"
- "audit our RAG pipeline"
- "investigate this AiTrace record"
- "add a new coach"
- "change the prompt cascade"
- "tune retrieval precision"
- "trace a sycophancy spike"
- "enable GraphRAG for a tenant"

## Do NOT route when
- The ask is the chat UI component shape (SSE rendering, Suspense boundaries, optimistic updates); this Bee owns the server-side stream generation and retrieval, react-worker-bee owns the component.
- The ask is indexing, partitioning, or query plans for non-AI or AI-domain Postgres tables; this Bee designs the schema, db-worker-bee implements the indexing.
- The ask is a prompt-injection surface, provider-key handling, or PII-in-retrieved-chunks audit; this Bee flags with file:line, security-worker-bee owns the audit.
- The ask is authoring an AI feature PRD; this Bee provides architectural rationale, library-worker-bee authors the PRD.

## Inputs the Bee needs
- The relevant doc(s) in library/knowledge/private/ai/, read first before answering.
- The invocation mode (coach-change, prompt-change, rag-audit, aitrace-investigation, eval-review, memory-refactor, orchestration-change, multimodal-extension, graphrag-enable, matching-tweak, onboarding-flow, or read-the-doc).
- The file:line of the code under review, when auditing.

## Outputs
- An audit report, code review with file:line, or refactor proposal.
- A prompt-cascade diff with a recorded PromptVersion, or an eval-suite spec.
- An AiTrace investigation summary or an ADR when the finding changes the canonical stack.

## Commonly sequenced with
- db-worker-bee: implements indexing and retention for the AI-domain Postgres schema this Bee designs.
- react-worker-bee: builds the chat UI component this Bee's server-side stream feeds.
- security-worker-bee: audits prompt-injection, provider-key, and PII findings this Bee flags.
- library-worker-bee: authors the AI feature PRD this Bee provides the rationale for.
