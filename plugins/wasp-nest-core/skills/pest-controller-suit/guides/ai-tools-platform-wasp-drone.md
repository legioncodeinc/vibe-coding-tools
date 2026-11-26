# ai-tools-platform-wasp-drone

**Plugin owner:** `data-and-ai-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
The single authority on AI tooling infrastructure between a developer's intent and a running LLM: AI gateways (Portkey, OpenRouter), cloud providers (AWS Bedrock, Vertex AI, Azure OpenAI), frontier model selection (Claude, GPT, Gemini) plus cheap-fallback routes (Haiku, Mini, Flash), local LLMs (Ollama, LM Studio), GPU cloud vendors (Runpod, Modal, Together, Fireworks, Groq), and the must-have MCP servers and IDE plugins. Every recommendation is time-stamped and names the cheap fallback.

## Paired Stinger
[ai-tools-platform-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/data-and-ai-tools/skills/ai-tools-platform-stinger) - the seven invocation modes, canonical stack defaults, gateway/provider/model decision matrices, and cost-optimization playbooks.

## Trigger phrases
- "which AI provider should I use"
- "set up Portkey for us"
- "configure OpenRouter with a fallback chain"
- "Ollama for local dev, what hardware do I need"
- "Runpod vs Modal for GPU inference"
- "which MCP servers do I actually need"
- "our LLM spend is too high, help"
- "protect this AI feature margin with retry and cache-miss scenarios"
- "compare Claude, GPT, and Gemini for this use case"

## Do NOT route when
- The request is cognitive-layer architecture: RAG pipelines, prompt cascades, memory systems; that is mind-wasp-drone.
- The request is API key vault, rotation policy, or least-privilege IAM design; that is security-wasp-drone. This Drone says which keys are needed, not how to store them.
- The request is Docker/CI wiring for a GPU deploy; that is devops-wasp-drone.
- The request is an AI feature PRD (new coach lineup, GraphRAG enablement plan); that is library-wasp-drone.
- The request is choosing or configuring a specific coding tool like Cursor or Aider; that is ai-coding-tools-wasp-drone, not this Drone.

## Inputs the Drone needs
- Deployment profile: hosted, local, or GPU cloud, since these have different privacy/latency/cost characteristics.
- Budget constraints and whether the workload involves privacy-sensitive data (PII, proprietary code).
- Current provider or gateway, if this is a migration rather than a fresh setup.

## Outputs
- A provider or gateway comparison with winner, runner-up, deciding factor, and configuration snippet.
- A cost estimate worksheet by feature area.
- Setup steps for local LLM workflows or GPU cloud vendor selection.

## Commonly sequenced with
- security-wasp-drone: designs the vault, rotation, and IAM for whichever keys this Drone identifies as needed.
- mind-wasp-drone: takes the chosen providers and designs the RAG/cognitive-layer architecture on top of them.
- devops-wasp-drone: wires the container and CI/CD pipeline for any GPU cloud deploy this Drone recommends.

## Feature margin handoff

Load the paired [feature margin guide](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/data-and-ai-tools/skills/ai-tools-platform-stinger/guides/08-protect-feature-margin.md). Preserve complete usage/cost units and Unknown rates; resolve selected Operating Cost and Unit Economics owners for arithmetic. Mind retains quality/evaluation and Security retains independent control review. Proposed budgets, alerts and rate limits require observed enforcement proof.

## Bounded attempts and local hardware

Route token/tool/retry/fallback budgets to [guide 09](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/data-and-ai-tools/skills/ai-tools-platform-stinger/guides/09-bound-request-retries-and-fallbacks.md), and local-model fit to [guide 10](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/data-and-ai-tools/skills/ai-tools-platform-stinger/guides/10-qualify-local-model-hardware.md). Preserve supplied rates, atomic reservations, concurrent ownership and uncertain billing; use selected Economics owners for arithmetic. Require actual artifact/runtime/hardware/context/load/evaluation evidence before local-fit conclusions. No settings, provider execution, model downloads or spend follow from a source worksheet.
