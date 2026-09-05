# Source: GPU Cloud Inference Vendors (2026)

**Source type:** Official documentation + community benchmarks
**Authority:** Medium-High
**Date fetched:** 2026-05-20
**URLs:** modal.com/docs, runpod.io/console, together.ai/docs, fireworks.ai/docs, console.groq.com/docs

## Key findings

### Modal

- Python-native serverless GPU functions; container images cached between invocations.
- Pay-per-second; scales to zero; cold start 10-30s for cached containers, 60-120s for first-time images.
- GPU options: A10G (~$0.20/hr), A100 40GB (~$0.85/hr), H100 80GB (~$2.20/hr).
- Best developer experience of any GPU cloud vendor in 2026.
- Free tier: $30/month credits for new accounts.
- Web endpoint support: single decorator to expose function as HTTPS endpoint.

### Runpod

- Both persistent pods (always-on) and serverless functions.
- Community cloud GPU pricing (2026-Q2): RTX 4090 ~$0.44/hr, A40 ~$0.55/hr, A100 ~$1.64/hr, H100 ~$2.49/hr.
- Secure cloud (dedicated hardware): premium pricing; better isolation.
- Templates for popular frameworks: Ollama, vLLM, TGI, A1111, ComfyUI pre-installed.
- Serverless cold start: 15-60 seconds depending on container size.

### Together AI

- Hosted inference across 50+ open models; OpenAI-compatible API.
- No infrastructure to manage; pay-per-token.
- Pricing (2026-Q2): Llama 3.1 70B ~$0.88/1M tokens; Llama 3.1 8B ~$0.18/1M tokens.
- Supports fine-tuning, batch inference, and custom model deployment.

### Fireworks AI

- Sub-200ms latency for Llama 70B; optimized for production inference.
- Strong function-calling support on open models.
- Pricing similar to Together AI; optimized for throughput.
- FireOptimizer: automatic model quantization and batching for cost reduction.

### Groq

- LPU (Language Processing Unit) hardware: purpose-built for LLM inference.
- ~2000 tokens/second for Llama 3.1 70B: 10-20x faster than GPU inference.
- No cold start; sub-second latency for first token.
- Available models: Llama 3.1/3.2/3.3 family, Mixtral, Gemma 2, Whisper.
- Free tier: 14,400 requests/day for Llama 3.1 70B.
- Pricing: ~$0.59/1M tokens for Llama 3.1 70B; ~$0.05/1M for Llama 3.1 8B.

## Synthesis for stinger

- **Modal = best DX** for Python developers; container caching reduces cold start significantly.
- **Runpod = lowest cost** for persistent workloads; RTX 4090 at $0.44/hr is hard to beat.
- **Together + Fireworks = hosted inference** when you want open models without ops overhead; similar offerings; Fireworks slightly faster.
- **Groq = fastest inference** available; free tier is developer-friendly; model selection limited to Llama family.
- **Routing**: for mixed workloads, route to Groq for Llama speed-sensitive tasks and Modal for custom model containers.
