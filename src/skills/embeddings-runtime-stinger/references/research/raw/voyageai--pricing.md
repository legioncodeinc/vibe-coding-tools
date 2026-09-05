# Pricing - Voyage AI Docs
- URL: https://docs.voyageai.com/docs/pricing
- Fetched: 2026-08-14
- Source type: official-docs
- Component: embeddings-runtime (Voyage AI embedding pricing, free tiers, batch discount)

## Summary

Voyage's text-embedding pricing is token-based with a large free tier per account, plus a discounted asynchronous Batch API.

## Text embedding pricing (per this fetch)

| Model | Price per million tokens | Free tokens per account |
|---|---|---|
| `voyage-4-large` | $0.12 | 200 million |
| `voyage-4` | $0.06 | 200 million |
| `voyage-4-lite` | $0.02 | 200 million |
| `voyage-context-4` | $0.12 | 200 million |
| `voyage-code-4` | $0.12 | 200 million |
| `voyage-finance-2` / `voyage-law-2` / `voyage-code-2` | $0.12 | 50 million |

For comparison, OpenAI's `text-embedding-3-small` is $0.02/M tokens and `text-embedding-3-large` is $0.13/M tokens (see the OpenAI source); Voyage's cheapest current-generation model (`voyage-4-lite`) matches OpenAI's small model on price, while `voyage-4-large` undercuts `text-embedding-3-large` slightly.

## Batch and Files API

- Batch API: 12-hour completion window, **33% discount** versus standard synchronous pricing. Free token credits do not apply to Batch API usage; batch tokens are always billed at the discounted rate.
- Files API: upload batch requests / download results, unlimited file count, 30-day automatic retention, storage priced at $0.05/GB/month.

## Relevance to batching and backfill strategy

The batch discount plus free-tier token allowance both point toward the same operational pattern documented in the caching/batching sources: run large backfills or model-swap re-embeds through the discounted async batch lane rather than the synchronous endpoint, both to reduce cost and to avoid competing with live query-embedding traffic for the same rate limit.
