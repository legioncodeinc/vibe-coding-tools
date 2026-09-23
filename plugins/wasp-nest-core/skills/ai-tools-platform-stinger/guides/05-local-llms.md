# Local LLMs: Ollama, LM Studio, llama.cpp

## When to run LLMs locally

Local inference is the right choice when:
- **Privacy:** the prompt contains PII, proprietary code, or regulated data that cannot leave the machine.
- **Cost:** development iteration doesn't need production-quality; local is zero marginal cost.
- **Offline:** the development environment has no internet access.
- **Latency testing:** you want to prototype without worrying about API rate limits.
- **Customization:** you need a fine-tuned model or a model not available via any cloud provider.

Local inference is NOT the right choice when:
- You need frontier-tier quality (Claude 3.7, GPT-4.1): 70B+ models require > 40GB VRAM to run quantized.
- Latency matters more than privacy: even on good hardware, local 8B models are slower than cloud Haiku.

## Ollama (recommended)

**Why Ollama first:** Simplest setup (one binary), cross-platform (macOS/Linux/Windows), OpenAI-compatible REST API, large model library, excellent community support.

### Install

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download installer from ollama.ai

# Docker
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

### Pull and run a model

```bash
# Best all-rounder for 8B class (requires ~5GB)
ollama pull llama3.1:8b

# Smallest useful model (requires ~2GB)
ollama pull llama3.2:3b

# Strong reasoning at 27B (requires ~15GB, GPU recommended)
ollama pull gemma3:27b

# Code-specialized
ollama pull qwen2.5-coder:7b

# Vision (multimodal)
ollama pull llama3.2-vision:11b

# Serve (starts automatically; runs at localhost:11434)
ollama serve
```

### OpenAI-compatible wiring

Ollama exposes an OpenAI-compatible API at `http://localhost:11434/v1`. Drop in as a provider:

```typescript
import OpenAI from "openai";

const localClient = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama", // Any non-empty string
});

const response = await localClient.chat.completions.create({
  model: "llama3.1:8b",
  messages: [{ role: "user", content: "Hello" }],
});
```

### Recommended models by use case (2026)

| Use case | Model | Size | RAM required |
|---|---|---|---|
| General coding + chat | `llama3.1:8b` | 4.7GB | 8GB |
| Fast classification | `llama3.2:3b` | 2.0GB | 4GB |
| Complex reasoning | `llama3.1:70b-q4` | 40GB | 48GB |
| Code generation | `qwen2.5-coder:7b` | 4.7GB | 8GB |
| Multimodal | `llama3.2-vision:11b` | 7.9GB | 12GB |
| Ultra-compact | `phi3.5:3.8b` | 2.2GB | 4GB |
| European/GDPR | `mistral:7b` | 4.1GB | 8GB |

### Cursor integration (local models)

In Cursor settings → Models → Add model:
- Model name: `llama3.1:8b` (or any Ollama model)
- Base URL: `http://localhost:11434/v1`
- API Key: `ollama`

Or use the Continue.dev extension for VS Code/Cursor with Ollama as the provider.

## LM Studio

**Best for:** Users who want a GUI; non-technical teammates; easy model management; Windows-first users.

- GUI for downloading and running models from HuggingFace.
- Built-in OpenAI-compatible server on `http://localhost:1234`.
- Model search + one-click download from HuggingFace.
- GGUF quantization format (same models as Ollama).

**Setup:** Download from lmstudio.ai → download a model → start the server → use the same OpenAI-compatible wiring as Ollama.

**Prefer Ollama for:** CLI/automation, Docker, CI environments, scripted model management.
**Prefer LM Studio for:** GUI exploration, non-technical users, Windows environments.

## llama.cpp (advanced)

**Best for:** Maximum performance tuning; custom GGUF quantization; embedding models; production server on bare metal.

```bash
# Install
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make -j8

# Run server (OpenAI-compatible)
./llama-server -m models/llama-3.1-8b-q4_k_m.gguf --port 8080 -c 4096

# Context: -c sets context window size; larger uses more RAM
# Threads: --threads $(nproc) for CPU inference
# GPU layers: --n-gpu-layers 32 to offload layers to GPU
```

**Use when:** you need a specific quantization, want to run an embedding model locally (e.g., `nomic-embed-text-v1.5`), or are building a production server that needs fine-grained control.

## Hardware guide

| Hardware | Suitable model class | Notes |
|---|---|---|
| MacBook M1/M2/M3 (16GB) | 8B models at Q4 | Excellent; Metal GPU acceleration via Ollama |
| MacBook M1/M2/M3 (32GB+) | 27B+ models | Full Gemma 3 27B fits; very usable |
| PC with 8GB VRAM GPU | 7-8B models | Llama 3.1 8B Q4 comfortably |
| PC with 16GB VRAM GPU | 13-14B models | Phi-3 medium, Mistral 7B |
| PC with 24GB+ VRAM GPU | 70B models (Q4) | Production-grade local inference |
| CPU-only (8GB RAM) | 3B models only | Phi-3.5 mini, Llama 3.2 3B; slow but works |

## Privacy checklist before switching to local

1. Confirm the use case requires local (PII, trade secrets, regulated data, offline).
2. Verify the model fits your hardware (use the size guide above).
3. Test quality on your specific task before committing: local 8B is meaningfully weaker than cloud Sonnet.
4. For production, use a GPU cloud private deployment (Modal or Runpod) if local hardware isn't feasible: same privacy guarantee, more compute.
