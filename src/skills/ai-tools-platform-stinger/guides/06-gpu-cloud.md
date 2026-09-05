# GPU Cloud: Runpod, Modal, Together AI, Fireworks, Groq

GPU cloud inference is the right choice when:
- You need more compute than local hardware provides but want privacy (your container, your model weights).
- You're deploying an open-weight model (Llama, Mistral, Gemma) in production.
- You need serverless auto-scaling for variable inference load.
- You want to fine-tune a model without buying GPUs.

## Vendor comparison (2026)

| Vendor | Type | Best for | Cold start | Pricing model | GPU options |
|---|---|---|---|---|---|
| **Modal** | Serverless | Developers; Python-native; best DX | 10-30s (cached) | Per-second; A10G/A100/H100 | A10G, A100, H100 |
| **Runpod** | Persistent + Serverless | Lowest $/GPU-hour; always-on | 0s (persistent) | Per-hour (persistent); per-request (serverless) | 4090, A40, A100, H100 |
| **Together AI** | Hosted inference | Pre-deployed open models; no infra | <1s | Per-token | Managed (not exposed) |
| **Fireworks AI** | Hosted inference | Fastest open-model inference; function calling | <1s | Per-token | Managed |
| **Groq** | Hardware inference | Fastest Llama inference; ~2000 tok/s | <1s | Per-token (free tier available) | LPU (proprietary) |

## Modal

**Best developer experience.** Python-native; container images cached between invocations; scales to zero instantly; pay-per-second.

```python
import modal

app = modal.App("llm-inference")

@app.function(
    gpu="A10G",
    image=modal.Image.debian_slim().pip_install("vllm"),
    timeout=300,
)
def run_inference(prompt: str) -> str:
    from vllm import LLM, SamplingParams

    llm = LLM(model="meta-llama/Llama-3.1-8B-Instruct")
    params = SamplingParams(temperature=0.7, max_tokens=512)
    output = llm.generate([prompt], params)
    return output[0].outputs[0].text

# Deploy as web endpoint
@app.function(gpu="A10G")
@modal.web_endpoint(method="POST")
def inference_endpoint(item: dict) -> dict:
    return {"output": run_inference.local(item["prompt"])}
```

**GPU pricing (2026-Q2):**
- A10G: ~$0.20/GPU-hour
- A100 40GB: ~$0.85/GPU-hour
- H100 80GB: ~$2.20/GPU-hour
- Free tier: $30/month credits for new accounts

**Recommended for:** custom model deployment, Python ML workflows, serverless inference with variable load.

## Runpod

**Lowest cost persistent GPUs.** Best for always-on inference servers where you want predictable latency and the lowest possible $/GPU-hour.

**Persistent pod setup:**
1. Select a pod template (vLLM, Ollama, TGI pre-installed).
2. Choose GPU type and count.
3. SSH in or use the web terminal.
4. Start your inference server.

**Community cloud GPU pricing (2026-Q2 approximate):**
- RTX 4090: ~$0.44/GPU-hour
- A40 48GB: ~$0.55/GPU-hour
- A100 80GB: ~$1.64/GPU-hour
- H100 80GB: ~$2.49/GPU-hour

**Serverless endpoint (Runpod Serverless):**
- Deploy a Docker container as a serverless function.
- Auto-scales to zero.
- Cold start 15-60s (depending on model size).
- Pay per request.

**Recommended for:** cost-sensitive production inference; persistent dev servers; teams already managing containers.

## Together AI

**Pre-deployed open models.** No infrastructure to manage; query 50+ open-weight models via an OpenAI-compatible API.

```typescript
import OpenAI from "openai";

const together = new OpenAI({
  baseURL: "https://api.together.xyz/v1",
  apiKey: process.env.TOGETHER_API_KEY,
});

const response = await together.chat.completions.create({
  model: "meta-llama/Llama-3-70b-chat-hf",
  messages: [{ role: "user", content: "Hello" }],
});
```

**Pricing (2026-Q2):** Llama 3.1 70B ~$0.88/1M tokens; Llama 3.1 8B ~$0.18/1M tokens.

**Recommended for:** applications that need Llama-class models with hosted reliability; no infra management.

## Fireworks AI

**Fastest open-model inference.** Sub-200ms latency for Llama 70B; strong function-calling support.

```typescript
import Fireworks from "@fireworks-ai/inference";

const client = new Fireworks({ apiKey: process.env.FIREWORKS_API_KEY });

const response = await client.chat.completions.create({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  messages: [{ role: "user", content: "Hello" }],
});
```

**Pricing (2026-Q2):** Llama 3.1 70B ~$0.90/1M tokens; specialized serverless pricing available.

**Recommended for:** latency-sensitive production workloads with open-weight models.

## Groq

**Fastest inference available.** LPU hardware delivers ~2000 tokens/second for Llama 3.1 70B: 10-20x faster than GPU-based inference. Zero cold start.

```typescript
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const response = await groq.chat.completions.create({
  model: "llama-3.1-70b-versatile",
  messages: [{ role: "user", content: "Hello" }],
});
```

**Available models (2026):** Llama 3.1 8B, 70B; Llama 3.2 1B, 3B, 11B Vision, 90B Vision; Llama 3.3 70B; Mixtral 8x7B; Gemma 2 9B.

**Pricing:** Free tier (14,400 requests/day for Llama 3.1 70B). Pay-as-you-go: ~$0.59/1M tokens for Llama 3.1 70B.

**Recommended for:** cheap-tier Llama inference in production; applications where latency is critical; developer prototyping (free tier is generous).

## Decision guide

| Scenario | Recommended |
|---|---|
| Custom model, production serverless | Modal |
| Lowest cost persistent GPU | Runpod |
| Llama 70B + OpenAI-compatible, no infra | Together AI or Fireworks |
| Fastest possible Llama inference | Groq |
| Fine-tuning a custom model | Modal or Runpod |
| Mixed open + closed model routing | OpenRouter (routes to all of the above) |

## Privacy note

Together AI, Fireworks, and Groq are SaaS: your prompts pass through their infrastructure. For private data, use Modal or Runpod with your own model deployment in a private network.
