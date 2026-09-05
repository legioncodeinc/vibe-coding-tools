# gaps.md: mind-stinger

Areas where mind-worker-bee's coverage is partial or absent. Listed for transparency so the orchestrator can route awkward edge cases correctly.

---

## 1. LangFuse integration: planned, not built

`AiTrace` is the canonical observability store. LangFuse would add a UI layer over the same data but is **not built**. mind-worker-bee flags LangFuse adoption proposals as substitutions requiring policy compliance per `guides/01-stack-enforcement.md §2`. See `guides/16-observability.md §7`.

## 2. Streaming STT: out of scope

Current Deepgram usage is batch-only (REST). Streaming STT (websocket) would enable real-time voice coaching but isn't built. Adopting requires substitution policy.

## 3. Multi-agent dispatcher (the planned full orchestrator)

`runOrchestrator()` is currently classify → assemble → dispatch (single-shot). The planned multi-agent dispatcher with tool-call handoff is documented in `guides/15-agent-orchestration.md §7` but not built. mind-worker-bee's coverage of "the planned dispatcher" is shallower than its coverage of the current implementation.

## 4. Per-tenant GraphRAG flag

`enableGraphRAG` is currently a platform-wide flag in `PlatformConfig.systemPromptBlocks`. Per-tenant enablement requires schema work documented in `examples/05-graphrag-enable-for-new-tenant.md` but not yet implemented.

## 5. Semantic-fact consolidation worker

The three-tier memory architecture has Tier 3 (semantic facts) but the consolidation job that promotes episodic → semantic is **planned, not active**. The `consolidated` boolean field exists on the payload schema but is always `false` today.

## 6. LangFuse-style trace visualization UI

mind-worker-bee audits and investigations rely on raw SQL against `AiTrace`. A visualization UI would speed investigations but doesn't exist. Workaround: hand-built reports in the host repo's `library/requirements/reports/ai/`.

## 7. PromptVersion correlation tooling

Manual correlation between `PromptVersion.createdAt` and `AiTrace` metric trends is the current investigation pattern. Automated correlation (e.g., "show me the metric drift for every prompt change") isn't built. Workaround: investigation queries documented in `examples/03-aitrace-investigation-low-retrieval.md`.

## 8. Cohere outage handling

Code-level fallback (rerank fails → top-K-by-ANN) is in place. Operational alert on sustained Cohere failures is **not yet wired**. Should-refactor (observability).

## 9. OpenRouter $0 balance alert

Documented as required (per `guides/19-llm-provider-config.md §8`) but the wiring (low-balance webhook → Slack/PagerDuty) needs verification on a per-deployment basis. Each deploy should confirm.

## 10. Asset registry for new coach types

When a new coach type is added, `asset-worker-bee` should register it. The Hive-level integration is documented in the cross-Bee handoff section but the actual asset-worker-bee invocation pattern is gentle, easy to forget. Document this in onboarding for new coach contributors.

## 11. Multilingual support

Stack is English-only. Cohere `embed-english-v3.0`, Cohere `rerank-v3.5` (English variant), Deepgram `nova-3` (English-tuned). Multilingual support requires substitutions across the stack.

## 12. Image/video for non-English content

Vision model (Llama 3.2 11B) handles non-English text in images, but downstream embedding (Cohere English) doesn't. So a Spanish-language whiteboard description gets embedded with English embeddings, lossy.

## 13. Voice input quality

Voice-transcribed messages are flagged with `fromVoice: true` but no per-source-type quality differentiation. A poorly transcribed voice message embeds the same as a clean one.

## 14. Multi-modal cross-retrieval

Image + video content lives in `media-{tenantId}`. Knowledge docs in `knowledge-{tenantId}`. A query can hit both, but RRF-fusion across collections isn't the canonical path: each collection is queried separately and concatenated. A more sophisticated cross-collection fusion isn't built.

## 15. Training-data-vs-RAG decision surface

When a new coaching pattern emerges, the question "should this be in `KnowledgeDocument` (RAG) or in the system prompt (`AiCoachConfig`)?" is judgment-driven. Documented in guides but not formalized as a decision tree.
