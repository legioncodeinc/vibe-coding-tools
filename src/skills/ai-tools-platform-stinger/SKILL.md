---
name: "ai-tools-platform-stinger"
description: "The vibe coder's AI toolbox: AI gateways (Portkey, OpenRouter), cloud providers (Bedrock, Vertex AI), frontier model selection (Claude, GPT, Gemini), cheap-fallback routes (Haiku, Mini, Flash), local LLMs (Ollama, LM Studio), GPU cloud (Runpod, Modal, Together, Fireworks), and must-have MCPs and IDE plugins. Use when the user says \\\\\\\\\\\\\\\"which AI provider should I use\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"set up Portkey\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"Ollama for local dev\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"Runpod vs Modal\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"which MCP servers do I need\\\\\\\\\\\\\\\", or asks to optimize AI spend. Do NOT use for cognitive-layer architecture (mind-worker-bee), API key security (security-worker-bee), or PRD authorship (library-worker-bee)."
---

# ai-tools-platform Stinger

You are the playbook for `ai-tools-platform-worker-bee`. Every invocation produces one concrete artifact: a recommendation, a comparison matrix, a configuration snippet, or a setup guide. Every claim is backed by the research in `research/`.

## Invocation modes (routing table)

Read the user's request and match to one mode. Most requests match one primary mode with one supporting mode.

| Mode | Trigger phrases | Primary guide |
|---|---|---|
| `gateway-setup` | "set up Portkey", "configure OpenRouter", "AI gateway", "virtual keys", "budget cap on LLM spend" | `guides/01-ai-gateways.md` |
| `provider-selection` | "Bedrock vs Vertex", "which cloud AI provider", "Azure OpenAI", "enterprise AI", "private VPC AI" | `guides/02-cloud-providers.md` |
| `model-selection` | "which model should I use", "Claude vs GPT vs Gemini", "best model for code", "context window comparison" | `guides/03-model-selection.md` |
| `cost-optimization` | "LLM spend too high", "prompt caching", "batch API", "cheap model fallback", "token cost" | `guides/04-cost-optimization.md` |
| `local-llm-workflow` | "Ollama", "LM Studio", "local LLM", "offline dev", "privacy-first AI", "llama.cpp" | `guides/05-local-llms.md` |
| `gpu-cloud-selection` | "Runpod", "Modal", "Together AI", "Fireworks", "Groq", "GPU inference", "serverless GPU" | `guides/06-gpu-cloud.md` |
| `mcp-plugin-setup` | "MCP server", "which MCPs", "IDE plugin", "Cursor plugin", "tool use setup", "agent toolbox" | `guides/07-mcp-and-ide-plugins.md` |

## First action on every invocation

1. Read `guides/00-principles.md`: the non-negotiables that govern every output.
2. Match the request to the routing table above.
3. Open the relevant guide(s) before producing any output.

## Folder layout

```text
ai-tools-platform-stinger/
├── SKILL.md                         (this file — master index)
├── guides/
│   ├── 00-principles.md             (non-negotiables: pricing, privacy, fallback discipline)
│   ├── 01-ai-gateways.md            (Portkey vs OpenRouter vs LiteLLM; virtual keys; fallback chains)
│   ├── 02-cloud-providers.md        (Bedrock vs Vertex AI vs Azure OpenAI vs direct; when to use each)
│   ├── 03-model-selection.md        (2026 frontier landscape; capability tiers; cheap-fallback table)
│   ├── 04-cost-optimization.md      (prompt caching; batch API; tiering strategy; spend telemetry)
│   ├── 05-local-llms.md             (Ollama; LM Studio; llama.cpp; model selection; OpenAI-compat wiring)
│   ├── 06-gpu-cloud.md              (Runpod vs Modal vs Together vs Fireworks vs Groq; price table)
│   └── 07-mcp-and-ide-plugins.md    (must-have MCPs; Cursor plugin setup; IDE extension picks)
├── examples/
│   ├── gateway-setup-portkey.md     (Portkey virtual keys + fallback + budget cap end-to-end)
│   ├── model-selection-matrix.md    (filled-in comparison for a SaaS product)
│   └── local-llm-vibe-coding-workflow.md  (Ollama + Cursor offline workflow)
├── templates/
│   ├── provider-comparison.md       (canonical comparison table skeleton)
│   └── cost-estimate.md             (monthly cost estimate sheet)
├── reports/
│   └── README.md                    (describes how past recommendation reports accumulate)
└── research/
    ├── research-plan.md
    ├── research-summary.md
    ├── index.md
    ├── internal/
    │   └── command-brief-notes.md
    └── external/
        ├── portkey-openrouter-gateways.md
        ├── aws-bedrock-vertex-azure-comparison.md
        ├── frontier-model-landscape-2026.md
        ├── gpu-cloud-inference-vendors.md
        ├── ollama-local-llm-workflows.md
        └── mcp-servers-ide-plugins-2026.md
```

## Canonical stack defaults

These are the recommended defaults. Deviating requires explicit rationale.

| Decision | Recommended default | Rationale |
|---|---|---|
| AI gateway | **Portkey** | Unified virtual keys, budget caps, fallback routing, observability; OpenRouter preferred when pure model routing with no ops overhead needed |
| Primary frontier model (capability) | **Claude 3.7 Sonnet / Opus** or **GPT-4.1** | Top-tier reasoning, long context; choose by use case (see `guides/03-model-selection.md`) |
| Cheap fallback (cloud) | **Claude Haiku 3.5** or **Gemini 2.0 Flash** | Sub-cent per 1K tokens; fast; adequate for classification, summarization, simple generation |
| Local LLM runtime | **Ollama** | Easiest setup; OpenAI-compatible REST; cross-platform; large model library |
| Local model (8B class) | **Llama 3.1 8B / 3.2 3B** or **Gemma 3 9B** | Best quality-per-GB in the 4-bit quantized range |
| GPU cloud (serverless) | **Modal** | Best developer experience; container caching; Python-native; pay-per-second |
| GPU cloud (persistent) | **Runpod** | Lowest price-per-GPU-hour; good for always-on inference |
| Fast inference (Llama) | **Groq** | Sub-100ms latency for Llama 3.1 70B; free tier available |
| MCP toolbox | See `guides/07-mcp-and-ide-plugins.md` | Context-dependent; filesystem + Supabase + GitHub are near-universal |

## Severity rubric

Used to classify findings when auditing an existing AI tooling stack.

- **Must-fix:** No fallback model configured (single point of failure); API keys committed to code; no spend cap on gateway; PII sent to a provider without a DPA.
- **Should-refactor:** Using a frontier model for tasks a cheap model handles adequately; no prompt caching on repeated system prompts; local-capable workloads running on expensive cloud inference.
- **Style / nice-to-have:** Observability dashboard not configured; no cost attribution per feature; MCP server count excessive for the project size.

## Cross-Bee handoffs

Surface these explicitly rather than attempting them inline:

- **security-worker-bee**: for API key vault strategy, PII audit in prompts, DPA compliance verification, model provider's data-retention policies.
- **mind-worker-bee**: for cognitive-layer architecture: RAG pipeline design, prompt cascade, three-tier memory, evaluation, coach routing. This Bee picks the providers; mind-worker-bee decides how to use them architecturally.
- **devops-worker-bee**: for Docker container setup for GPU cloud deploys, CI/CD wiring for model inference services, secret injection from environment.
- **library-worker-bee**: for PRD authorship when a new AI tooling decision needs to be documented as a feature requirement.
