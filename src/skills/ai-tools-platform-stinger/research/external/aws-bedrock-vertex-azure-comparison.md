# Source: AWS Bedrock vs Vertex AI vs Azure OpenAI (2026)

**Source type:** Official documentation + analyst reports
**Authority:** High
**Date fetched:** 2026-05-20
**URLs:** aws.amazon.com/bedrock, cloud.google.com/vertex-ai, azure.microsoft.com/products/cognitive-services/openai-service

## Key findings

### AWS Bedrock

- Managed service in AWS ecosystem; IAM-based auth (no API keys to manage separately).
- Private VPC connectivity via VPC endpoints; no public internet egress required.
- Multi-provider model catalog: Anthropic Claude, Amazon Titan, Meta Llama, Mistral, Cohere, Stability AI.
- Cross-region inference: route to lowest-latency region or for redundancy.
- Compliance: SOC 2, HIPAA, FedRAMP, ISO 27001: full AWS compliance suite.
- Model freshness: Claude models on Bedrock typically lag direct Anthropic API by 1-4 weeks on new versions.
- Bedrock Agents: built-in agent orchestration with knowledge bases; useful for enterprise but locks into AWS ecosystem.

### Google Vertex AI

- GCP managed; service account auth with Workload Identity; no API keys.
- Private connectivity via VPC Service Controls.
- Gemini family parity: all Gemini models available with same pricing as AI Studio.
- Additional: PaLM 2, Imagen (image generation), Chirp (speech), embedding models.
- MLOps: model registry, training pipelines, evaluation; useful if already on GCP.
- Compliance: SOC 2, HIPAA, ISO 27001, FedRAMP High: GCP suite.
- Model freshness: Gemini on Vertex typically has 0-1 week lag vs AI Studio; other providers may lag.

### Azure OpenAI

- OpenAI models only (GPT-4.1, GPT-4o, o3, embeddings, DALL-E, Whisper).
- Resource deployment: you provision specific model versions in your Azure region.
- Abuse monitoring opt-out available (useful for sensitive content moderation bypass).
- BYOD (bring your own data) with Azure Cognitive Search integration.
- Compliance: SOC 2, HIPAA BAA, FedRAMP, EU Data Boundary: Azure suite.
- Model freshness: typically 2-8 week lag behind direct OpenAI API for new models.
- Named instances: your Azure OpenAI endpoint is scoped to your subscription.

## Synthesis for stinger

- **Bedrock is the natural choice if your infra is AWS**: IAM auth, VPC private, no key management, multi-provider.
- **Vertex AI is the natural choice if your infra is GCP**: Gemini parity, service accounts, MLOps integration.
- **Azure OpenAI is the natural choice if your infra is Azure AND you need OpenAI models**, but note it only has OpenAI models; pair with Bedrock or Vertex for Anthropic/Google access.
- **Direct APIs are better for startups**: simpler, latest models immediately, no cloud lock-in.
- The gateway pattern (Portkey in front of whichever cloud) means you can start with direct APIs and migrate to Bedrock/Vertex later with minimal code changes.
