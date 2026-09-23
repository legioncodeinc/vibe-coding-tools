# Cloud AI Providers: Bedrock, Vertex AI, Azure OpenAI, Direct APIs

## Provider landscape (2026)

Four paths to cloud AI in production:

1. **Direct provider API** (Anthropic, OpenAI, Google AI Studio): simplest; all features day-one; no infra overhead.
2. **AWS Bedrock**: managed AWS service; IAM auth; VPC-private; enterprise compliance; some models lag direct API.
3. **Google Vertex AI**: GCP managed; IAM auth; VPC-private; Gemini parity with AI Studio; additional MLOps tooling.
4. **Azure OpenAI**: OpenAI models on Azure; enterprise SLA; regional deployment; SOC2/HIPAA/FedRAMP.

## When to use direct provider APIs

- You're building a SaaS product and provider compliance is handled at the application level.
- You need the latest models and features on day one.
- You want the simplest possible setup.
- Your security model allows outbound HTTPS to provider endpoints.

**Recommended for:** startups, SaaS, most web applications.

## When to use AWS Bedrock

- Your infrastructure is already on AWS and you want IAM-based auth (no API keys to manage).
- You need VPC endpoints for private connectivity (no public internet egress).
- You require AWS compliance certifications (SOC2, HIPAA, FedRAMP).
- You want cross-region inference for latency or redundancy.

**Available models (2026):** Anthropic Claude 3.x/3.7, Amazon Titan, Meta Llama 3.x, Mistral, Cohere, Stability AI. Note: may lag direct Anthropic/OpenAI API by 1-4 weeks on new model launches.

**Setup pattern (TypeScript with AWS SDK):**
```typescript
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

// Or use the Anthropic Bedrock SDK:
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({
  baseURL: "https://bedrock-runtime.us-east-1.amazonaws.com",
});
```

**Cost consideration:** Bedrock pricing is per-token, same as direct API but with occasional markup. Cross-region inference may have additional costs.

## When to use Google Vertex AI

- Your infrastructure is on GCP.
- You need Gemini with enterprise-grade auth (service accounts, Workload Identity).
- You want model fine-tuning, batch prediction, or Vertex AI Pipelines.
- You need EU/US data residency for Gemini.

**Available models (2026):** Gemini 2.0 Flash, 2.5 Pro, 1.5 Pro/Flash; PaLM 2; Code Bison; Embeddings (textembedding-gecko); Imagen; Chirp (speech).

**Setup pattern (TypeScript):**
```typescript
import { VertexAI } from "@google-cloud/vertexai";

const vertex = new VertexAI({ project: "my-project", location: "us-central1" });
const model = vertex.getGenerativeModel({ model: "gemini-2.0-flash" });
```

**Cost consideration:** Same as AI Studio pricing for most models. Committed use discounts available.

## When to use Azure OpenAI

- You need OpenAI models (GPT-4.1, GPT-4o, o3-mini) in a Microsoft Azure environment.
- Enterprise compliance: Azure provides SOC2, HIPAA BAA, FedRAMP, and EU Data Boundary.
- You need the optional abuse monitoring opt-out (for sensitive use cases).
- Your existing enterprise contract includes Azure credits.

**Available models (2026):** GPT-4.1, GPT-4o, GPT-4o-mini, o3-mini, o1, text-embedding-3-large/small, DALL-E 3, Whisper. Lags direct OpenAI API by 2-8 weeks on new models.

**Setup pattern (TypeScript):**
```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `https://${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: { "api-version": "2024-02-01" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
});
```

## Decision matrix

| Criterion | Direct API | AWS Bedrock | Vertex AI | Azure OpenAI |
|---|---|---|---|---|
| Setup time | 5 min | 30-60 min | 30-60 min | 30-60 min |
| Auth model | API key | IAM role | Service account | Azure AD / API key |
| VPC private | No | Yes | Yes | Yes |
| Compliance certs | Limited | Full AWS suite | Full GCP suite | Full Azure suite |
| Model freshness | Day-one | 1-4 week lag | 1-2 week lag (Gemini) | 2-8 week lag |
| Multi-model access | Provider only | Multi-provider | Google + some others | OpenAI only |
| Cost | Base | Base + markup | Base | Base + small markup |
| Best for | SaaS / startups | AWS-native enterprise | GCP-native enterprise | Microsoft enterprise |

## Recommended path

1. **Start with direct APIs** for development and early production.
2. **Migrate to Bedrock/Vertex/Azure** only when compliance requirements or cloud consolidation justify the migration cost.
3. **Use an AI gateway (Portkey)** in front of either path: it normalizes the API surface and makes future migrations much cheaper.

## Multi-provider resilience

For highest availability, combine providers:
- Primary: direct Anthropic or Bedrock (Claude)
- Fallback: OpenRouter or direct OpenAI (GPT-4o-mini)
- Wire through Portkey for transparent failover

See `guides/01-ai-gateways.md` for the fallback chain recipe.
