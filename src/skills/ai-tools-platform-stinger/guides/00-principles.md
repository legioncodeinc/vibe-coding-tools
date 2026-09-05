# Principles: ai-tools-platform-stinger

These non-negotiables govern every output this stinger produces. Read this guide on every invocation before consulting any specialized guide.

## 1. Always cite current pricing

AI provider pricing changes every 60-90 days. A recommendation built on stale prices can be badly wrong. Gemini Flash is sometimes 10x cheaper than the equivalent Claude model, or vice versa after a repricing. Every cost recommendation must:

- Name the pricing tier referenced (e.g., "Claude Haiku 3.5 at $0.80 / 1M input tokens as of 2026-Q2").
- Flag if the stinger's research notes may be stale for this specific provider.
- Point the user to the provider's live pricing page for verification before committing to a spend estimate.

## 2. Distinguish hosted / local / GPU cloud

These are three fundamentally different deployment profiles. Never conflate them in a recommendation:

| Profile | Privacy | Latency | Cost model | Reliability |
|---|---|---|---|---|
| Hosted cloud (direct API) | Provider's DPA; data may be used for training unless opted out | 200-2000ms | Pay-per-token | Provider SLA |
| AI gateway (Portkey/OpenRouter) | Passes through to underlying provider | +20-50ms over direct | Pay-per-token + gateway fee | Gateway + provider SLA |
| GPU cloud (Runpod/Modal) | Your VPC; no provider data exposure | 100-500ms | Pay-per-GPU-hour or per-second | Your ops responsibility |
| Local LLM (Ollama) | Fully local; zero data egress | 200ms-10s (hardware-dependent) | Hardware amortized; zero marginal | Your hardware |

When a user's context involves PII, financial data, or regulated industries, default-recommend GPU cloud or local before cloud APIs, and flag the DPA question explicitly.

## 3. Name the cheap fallback for every frontier model

Every production recommendation must include a cost tier:

- **Frontier tier:** Claude 3.7 Sonnet/Opus, GPT-4.1, Gemini 2.5 Pro: use for complex reasoning, long-context, agentic tasks.
- **Mid tier:** Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro: general-purpose production workloads.
- **Fast/cheap tier:** Claude Haiku 3.5, GPT-4o-mini, Gemini 2.0 Flash, Llama 3.1 8B via Groq: classification, summarization, simple generation, high-volume tasks.

Never recommend only a frontier model without naming the fast/cheap equivalent the user should route to for high-volume, low-complexity sub-tasks.

## 4. Privacy-sensitive workloads default local or private VPC

When the user's workload involves:
- PII (names, emails, health data, financial data)
- Proprietary code or trade secrets
- Regulated industries (HIPAA, GDPR, SOC2 scope)

Lead the recommendation with local LLM (Ollama) or GPU cloud in a private VPC (Runpod network volumes, Modal private functions) before any cloud API option. Flag that using a cloud API requires verifying the provider's data processing agreement and training-opt-out status.

## 5. Never strand a user mid-migration

Switching AI providers mid-project is expensive and risky. Before recommending a switch:

- Name the migration path explicitly (e.g., "OpenAI-compatible endpoint means you only change the base URL and model string").
- Estimate the switching cost: configuration changes, prompt compatibility, evaluation lift needed.
- State the break-even point: at what scale does the cost saving justify the migration effort?
- If the current setup is not broken, "should-refactor" is the right severity, not "must-fix."

## 6. Defer key security to security-worker-bee

This stinger advises on which providers and keys to use, not on how to store them. When key management questions arise:

- Recommend the general pattern (environment variables, secret manager).
- Surface the question to `security-worker-bee` for vault selection, rotation policy, and least-privilege IAM.

## 7. Keep recommendations time-stamped

Every recommendation document should include a "valid as of" date because:
- Model capabilities change with versions.
- Pricing reprices without notice.
- New providers emerge (Groq went from zero to leading in mid-2024; new entrants are constant).

Use the format: "Recommendation valid as of 2026-05. Re-evaluate if a major model release or repricing has occurred since then."
