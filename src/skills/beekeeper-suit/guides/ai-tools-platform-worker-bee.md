# ai-tools-platform-worker-bee

## Domain
The single authority on AI tooling infrastructure between a developer's intent and a running LLM: AI gateways (Portkey, OpenRouter), cloud providers (AWS Bedrock, Vertex AI, Azure OpenAI), frontier model selection (Claude, GPT, Gemini) plus cheap-fallback routes (Haiku, Mini, Flash), local LLMs (Ollama, LM Studio), GPU cloud vendors (Runpod, Modal, Together, Fireworks, Groq), and the must-have MCP servers and IDE plugins. Every recommendation is time-stamped and names the cheap fallback.

## Paired Stinger
[ai-tools-platform-stinger](../../ai-tools-platform-stinger) - the seven invocation modes, canonical stack defaults, gateway/provider/model decision matrices, and cost-optimization playbooks.

## Trigger phrases
- "which AI provider should I use"
- "set up Portkey for us"
- "configure OpenRouter with a fallback chain"
- "Ollama for local dev, what hardware do I need"
- "Runpod vs Modal for GPU inference"
- "which MCP servers do I actually need"
- "our LLM spend is too high, help"
- "compare Claude, GPT, and Gemini for this use case"

## Do NOT route when
- The request is cognitive-layer architecture: RAG pipelines, prompt cascades, memory systems; that is mind-worker-bee.
- The request is API key vault, rotation policy, or least-privilege IAM design; that is security-worker-bee. This Bee says which keys are needed, not how to store them.
- The request is Docker/CI wiring for a GPU deploy; that is devops-worker-bee.
- The request is an AI feature PRD (new coach lineup, GraphRAG enablement plan); that is library-worker-bee.
- The request is choosing or configuring a specific coding tool like Cursor or Aider; that is ai-coding-tools-worker-bee, not this Bee.

## Inputs the Bee needs
- Deployment profile: hosted, local, or GPU cloud, since these have different privacy/latency/cost characteristics.
- Budget constraints and whether the workload involves privacy-sensitive data (PII, proprietary code).
- Current provider or gateway, if this is a migration rather than a fresh setup.

## Outputs
- A provider or gateway comparison with winner, runner-up, deciding factor, and configuration snippet.
- A cost estimate worksheet by feature area.
- Setup steps for local LLM workflows or GPU cloud vendor selection.

## Commonly sequenced with
- security-worker-bee: designs the vault, rotation, and IAM for whichever keys this Bee identifies as needed.
- mind-worker-bee: takes the chosen providers and designs the RAG/cognitive-layer architecture on top of them.
- devops-worker-bee: wires the container and CI/CD pipeline for any GPU cloud deploy this Bee recommends.
