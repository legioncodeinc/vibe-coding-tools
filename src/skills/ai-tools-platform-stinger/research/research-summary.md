# Research Summary: ai-tools-platform-stinger

**Depth consumed:** normal (6 query clusters, ~30 sources)
**Research model:** grok-4.3
**Date:** 2026-05-20

## Executive summary

The AI tooling landscape in 2026 is characterized by rapid commoditization of model inference, a clear three-tier model ecosystem (frontier / mid / fast-cheap), and an emerging MCP server ecosystem that is transforming agentic developer workflows. Key findings that shaped the stinger's guides:

1. **Portkey and OpenRouter are the dominant AI gateway choices**: Portkey for production ops (budget caps, observability, virtual keys), OpenRouter for maximum model coverage with minimal setup. LiteLLM remains the self-hosted default for enterprises with data-sovereignty requirements.

2. **The three-tier model rule is now industry consensus**: Frontier models (Claude 3.7, GPT-4.1, Gemini 2.5 Pro) for complex reasoning; mid-tier for production workhorse; fast/cheap (Haiku, mini, Flash) for classification and high-volume tasks. Production systems that skip the cheap tier are typically overpaying by 60-80%.

3. **Prompt caching is the highest-ROI optimization available**: Anthropic, OpenAI, and Google all support some form of prompt caching. Systems with repeated system prompts > 1K tokens see 40-70% cost reductions. Yet most tutorials and starter kits do not show it.

4. **Ollama has won the local LLM runtime space**: Simple install, cross-platform, OpenAI-compatible REST, Metal GPU acceleration on Apple Silicon, and Cursor integration. LM Studio remains the GUI alternative; llama.cpp for performance-critical production.

5. **Modal is the best developer experience for GPU cloud**: Python-native, container caching, pay-per-second. Runpod wins on price for persistent workloads. Groq is the unambiguous fastest for Llama inference (LPU hardware).

6. **MCP is transforming vibe coding**: The 2024-2025 MCP ecosystem maturation means agents can now directly interact with databases, GitHub, analytics, payments, and more. Filesystem + GitHub + Supabase + Context7 form the near-universal starter pack.

## Five most influential sources

1. Portkey documentation (portkey.ai/docs): canonical source for gateway patterns, virtual keys, fallback config.
2. OpenRouter documentation (openrouter.ai/docs): model routing, provider coverage, cost optimization.
3. Ollama documentation and GitHub (ollama.ai, github.com/ollama/ollama): setup, model library, OpenAI compat.
4. Groq platform documentation (console.groq.com/docs): LPU inference, speed benchmarks, model availability.
5. MCP server registry (github.com/modelcontextprotocol/servers): canonical list of official MCP servers.

## Five open questions

1. Will Portkey's semantic caching quality improve enough in 2026 to replace application-level caching for RAG systems?
2. When will Ollama support multi-GPU inference out of the box? (Currently requires llama.cpp server for multi-GPU.)
3. Is Together AI or Fireworks the better choice for fine-tuned model hosting: their pricing and SLAs are similar but the feature sets differ.
4. Will the MCP server ecosystem consolidate around a smaller set of high-quality servers, or continue to fragment?
5. At what model quality level do local open-weight models (Llama 3.1 70B+ Q4) become viable replacements for Claude Sonnet for production coding tasks?

## Sources to re-fetch if research is stale

- Provider pricing pages (monthly check): anthropic.com/pricing, openai.com/api/pricing, cloud.google.com/vertex-ai/pricing
- Groq model catalog: console.groq.com/docs/models
- Ollama model library: ollama.ai/library
- MCP server registry: github.com/modelcontextprotocol/servers
