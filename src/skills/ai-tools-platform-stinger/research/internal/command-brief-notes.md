# Command Brief Notes: ai-tools-platform-stinger

## Source

`ai-tools/command-briefs/ai-tools-platform-worker-bee-command-brief.md`

## Key scope decisions captured in brief

**In scope:**
- AI gateway selection and configuration (Portkey, OpenRouter, LiteLLM)
- Cloud provider comparison (Bedrock, Vertex, Azure OpenAI, direct APIs)
- Frontier model selection and the three-tier system
- Cost optimization (prompt caching, batch API, model tiering)
- Local LLM workflows (Ollama, LM Studio, llama.cpp)
- GPU cloud inference (Runpod, Modal, Together, Fireworks, Groq)
- MCP server selection and IDE plugin recommendations

**Explicitly out of scope (handed to other Bees):**
- Cognitive-layer architecture (RAG pipelines, prompt cascade, memory) → `mind-worker-bee`
- API key security and vault strategy → `security-worker-bee`
- PRD authorship for AI features → `library-worker-bee`
- Docker/CI wiring for GPU cloud deploys → `devops-worker-bee`

## Critical directives from brief

1. Always cite current pricing with date.
2. Distinguish hosted / local / GPU cloud profiles.
3. Name the cheap fallback for every frontier recommendation.
4. Privacy-sensitive workloads default to local or private VPC.
5. Defer key security to security-worker-bee.
6. Never strand a user mid-migration.

## Refresh cadence

Re-research at `normal` depth every quarter or on major model releases. AI pricing and model capabilities shift every 60-90 days.
