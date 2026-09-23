# Example: Portkey Gateway Setup: Virtual Keys + Fallback + Budget Cap

This is a complete end-to-end Portkey setup for a production SaaS application with Anthropic as primary and OpenAI as fallback.

## Context

- Stack: Next.js 15 App Router with server-side AI calls
- Primary provider: Anthropic Claude 3.5 Sonnet (production chat)
- Fallback: OpenAI GPT-4o (Anthropic outage protection)
- Cheap tier: Claude Haiku 3.5 (classification and routing tasks)
- Requirement: budget cap of $500/month on the production workspace

## Step 1: Create virtual keys in Portkey dashboard

In the Portkey dashboard (app.portkey.ai):
1. "Virtual Keys" → "Add Key"
2. Create: `anthropic-prod` pointing to your Anthropic API key
3. Create: `openai-fallback` pointing to your OpenAI API key
4. Create: `anthropic-haiku` pointing to the same Anthropic key (separate for cost attribution)

## Step 2: Set budget caps

On each virtual key:
- `anthropic-prod`: $400/month cap
- `openai-fallback`: $100/month cap (emergency use only)
- `anthropic-haiku`: $50/month cap

## Step 3: Create a routing config

Save as `portkey.config.json` in your project root (or define via Portkey dashboard):

```json
{
  "strategy": {
    "mode": "fallback",
    "on_status_codes": [429, 500, 502, 503, 524]
  },
  "targets": [
    {
      "virtualKey": "anthropic-prod",
      "weight": 1,
      "override_params": {
        "model": "claude-3-5-sonnet-20241022"
      },
      "cache": {
        "mode": "semantic",
        "max_age": 3600
      }
    },
    {
      "virtualKey": "openai-fallback",
      "weight": 1,
      "override_params": {
        "model": "gpt-4o"
      }
    }
  ]
}
```

## Step 4: Application integration (TypeScript)

```typescript
// lib/ai-client.ts
import Portkey from "portkey-ai";

// Production client (with fallback)
export const portkeyProd = new Portkey({
  apiKey: process.env.PORTKEY_API_KEY!,
  virtualKey: process.env.PORTKEY_VIRTUAL_KEY_ANTHROPIC_PROD!,
  config: {
    strategy: { mode: "fallback" },
    targets: [
      { virtualKey: process.env.PORTKEY_VIRTUAL_KEY_ANTHROPIC_PROD!, weight: 1 },
      { virtualKey: process.env.PORTKEY_VIRTUAL_KEY_OPENAI_FALLBACK!, weight: 1 },
    ],
  },
});

// Cheap client (classification and routing)
export const portkeyHaiku = new Portkey({
  apiKey: process.env.PORTKEY_API_KEY!,
  virtualKey: process.env.PORTKEY_VIRTUAL_KEY_ANTHROPIC_HAIKU!,
});

// Usage in a Server Action or API route
export async function generateResponse(userMessage: string, systemPrompt: string) {
  const response = await portkeyProd.chat.completions.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
    // Portkey metadata for cost attribution
    // @ts-ignore - Portkey extension
    metadata: { feature: "chat", userId: "user-123" },
  });
  return response.choices[0].message.content;
}

export async function classifyIntent(text: string): Promise<string> {
  const response = await portkeyHaiku.chat.completions.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 50,
    messages: [
      {
        role: "user",
        content: `Classify this user intent: "${text}". Reply with one word: "chat", "search", "action", or "other".`,
      },
    ],
  });
  return response.choices[0].message.content?.trim().toLowerCase() ?? "other";
}
```

## Step 5: Environment variables

```bash
# .env.local
PORTKEY_API_KEY=pk-...
PORTKEY_VIRTUAL_KEY_ANTHROPIC_PROD=anthropic-prod
PORTKEY_VIRTUAL_KEY_OPENAI_FALLBACK=openai-fallback
PORTKEY_VIRTUAL_KEY_ANTHROPIC_HAIKU=anthropic-haiku
```

## Step 6: Verify in Portkey dashboard

After running a few test requests:
1. "Logs" → confirm requests are appearing with provider tags.
2. "Analytics" → confirm cost attribution per virtual key.
3. "Budget" → confirm caps are visible and not exceeded.

## What this setup gives you

- Automatic failover: if Anthropic returns 429/5xx, the request retries on OpenAI GPT-4o.
- Semantic caching: repeated similar prompts get zero-cost cache hits.
- Budget protection: $500/month hard cap across all AI spend.
- Cost visibility: dashboard shows cost per virtual key, per feature (via metadata).
- Zero code changes to switch providers: just update the Portkey config.

## Cost estimate for this setup

At 100K production chat messages/month (avg 2K tokens each):
- Without caching: ~$600/month (Claude 3.5 Sonnet)
- With 30% semantic cache hit rate: ~$420/month
- With Haiku for classification (assume 100K classification calls): +$80/month

Total estimate: ~$500/month, within the budget cap.
