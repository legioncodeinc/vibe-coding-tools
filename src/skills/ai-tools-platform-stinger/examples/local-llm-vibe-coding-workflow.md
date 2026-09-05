# Example: Local LLM Vibe Coding Workflow (Ollama + Cursor)

## Goal

Set up a fully local AI coding workflow that works offline, has zero marginal cost, and handles everyday coding tasks, without sending code to external providers.

## Hardware requirements

Minimum: Apple Silicon Mac with 16GB RAM (M1/M2/M3/M4).
Recommended: Mac with 32GB+ RAM or PC with 8GB+ VRAM GPU.

## Step 1: Install Ollama

```bash
# macOS (Homebrew)
brew install ollama

# Start the Ollama service
ollama serve
```

Ollama runs at `http://localhost:11434`. Leave it running in the background.

## Step 2: Pull recommended models

```bash
# Primary coding model (best balance of quality and speed on 16GB)
ollama pull qwen2.5-coder:7b

# Fast general model for chat/explanation
ollama pull llama3.1:8b

# Compact model for quick queries (fast even on CPU)
ollama pull llama3.2:3b

# Optional: vision model for screenshot-to-code
ollama pull llama3.2-vision:11b
```

Verify models are available:
```bash
ollama list
```

## Step 3: Configure Cursor to use Ollama

In Cursor:
1. Open Settings → Features → Models
2. Click "Add Model"
3. Enter:
   - Model name: `qwen2.5-coder:7b`
   - Provider: OpenAI
   - Base URL: `http://localhost:11434/v1`
   - API Key: `ollama` (any non-empty string)
4. Repeat for `llama3.1:8b` (for chat mode)

Now you can select these models in Cursor's model picker.

## Step 4: Project-level MCP config for offline work

Even offline, you can wire MCP tools that don't need internet:

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

This gives your local AI agent file read/write access to your project without leaving the machine.

## Step 5: Model routing for the workflow

Use different models for different tasks in Cursor:

| Task | Model | Reason |
|---|---|---|
| Code completion (Tab) | `qwen2.5-coder:7b` | Best local code quality |
| Chat (explain code, ask questions) | `llama3.1:8b` | Better instruction following |
| Quick refactoring | `qwen2.5-coder:7b` | Specialized for code |
| Screenshot analysis | `llama3.2-vision:11b` | Local multimodal |
| Fast one-liners | `llama3.2:3b` | Speed over quality |

## Performance expectations (M2 16GB Mac)

| Model | Tokens/second | Approx response time (512 tokens) |
|---|---|---|
| llama3.2:3b | ~40 tok/s | ~13 seconds |
| qwen2.5-coder:7b | ~20 tok/s | ~25 seconds |
| llama3.1:8b | ~18 tok/s | ~28 seconds |
| llama3.2-vision:11b | ~12 tok/s | ~43 seconds |

GPU acceleration via Metal on Apple Silicon is automatic: no configuration needed.

## When to switch back to cloud

Use local models for:
- Development iteration and exploration
- Privacy-sensitive tasks (your codebase contains secrets)
- Offline environments

Switch to cloud (Claude/GPT) for:
- Final implementation where quality matters
- Tasks requiring > 8B model capability (complex architecture, subtle bugs)
- Contexts > 32K tokens

A pragmatic workflow: prototype locally, refine with cloud. Keep both configured; switch per task.

## Cost reality check

- Ollama: $0 marginal cost per query (hardware amortized)
- Cloud Claude 3.5 Sonnet: ~$3/1M input + $15/1M output tokens
- For heavy vibe-coding sessions (1M tokens/day of prompts): ~$18/day cloud vs. $0 local

At serious usage levels, local inference pays back the hardware cost in weeks.
