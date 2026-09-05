# Source: Ollama and Local LLM Workflows (2026)

**Source type:** Official documentation + community
**Authority:** High
**Date fetched:** 2026-05-20
**URLs:** ollama.ai, github.com/ollama/ollama, lmstudio.ai

## Key findings

### Ollama

- Single binary; cross-platform (macOS/Linux/Windows); zero configuration for basic setup.
- Model library with 50+ curated models available via `ollama pull <model>`.
- OpenAI-compatible REST API at `localhost:11434/v1`: zero code changes to switch from cloud.
- Metal GPU acceleration on Apple Silicon; CUDA on NVIDIA; ROCm on AMD.
- Multi-model serving: load multiple models; Ollama manages memory and context.
- GGUF quantization: Q4_K_M is the sweet spot for quality/size on consumer hardware.
- Modelfile system for custom model configurations (system prompts, parameters, templates).

### LM Studio

- GUI for downloading and running GGUF models from HuggingFace.
- Built-in OpenAI-compatible local server.
- Model search and one-click download.
- Better UX for non-technical users; more friction for automation/scripting.

### Model size vs hardware guide (2026)

- 3B models: any modern hardware; ~2GB; fast even on CPU.
- 7-8B models: 8GB RAM (CPU) or 4-8GB VRAM (GPU); best quality-per-GB.
- 13-14B models: 16GB RAM or 8-16GB VRAM; noticeably stronger on complex tasks.
- 27B models: 32GB+ RAM or 20GB+ VRAM; approaching cloud mid-tier quality.
- 70B models (Q4): 48GB+ RAM or 40GB+ VRAM; cloud-competitive for many tasks.

### Best local models by use case (2026)

- Code: Qwen2.5-Coder 7B, CodeLlama 13B
- Chat/reasoning: Llama 3.1 8B, Gemma 3 9B
- Compact: Phi-3.5 Mini 3.8B, Llama 3.2 3B
- Vision: Llama 3.2 Vision 11B
- GDPR/Europe: Mistral 7B (French company, EU data processing)

## Synthesis for stinger

- Ollama is the unambiguous default for local LLM setup in 2026: best ecosystem, easiest setup, OpenAI compat.
- LM Studio for GUI users and Windows-first environments.
- llama.cpp for production server deployments needing fine-grained control.
- Apple Silicon (M2/M3 16GB+) is the most practical local inference hardware for developers.
- Qwen2.5-Coder 7B is the best local model for code generation tasks as of 2026-05.
