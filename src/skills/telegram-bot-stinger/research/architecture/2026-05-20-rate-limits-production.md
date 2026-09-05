---
source_url: https://fyw-telegram.com/blogs/316740277/
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: rate-limits
stinger: telegram-bot-stinger
---

# Best Practices for High-Volume Telegram Bots (January 2026)

## Summary

A detailed January 2026 article on rate limits, 429 errors, and high-volume bot architecture. Published on fyw-telegram.com, a Telegram-focused technical blog. Covers specific rate limit numbers, the empirical burst measurements above the documented limits, the webhook vs polling throughput decision matrix, and a real-world MTProto hybrid approach for exceeding Bot API limits. Also includes a detailed 429 retry strategy.

## Key quotations / statistics

**Documented rate limits:**
| Scope | Documented | Empirical Burst | Cost Signal |
|-------|-----------|-----------------|-------------|
| Global sendMessage | 30 msg/s | ~32 msg/s | P95 latency +18ms |
| sendMediaGroup | 1 media = 1 unit | burst 6 → 429 | Retry-After 35s |
| getUpdates (long polling) | no hard QPS | 1 req/1.2s stable | CPU -12% idle |
| Webhook incoming | 1 concurrent | keep-alive 240s | TLS handshake |

**Throughput thresholds:**
- "Below 6k msg/h choose long polling; above 30k msg/h webhooks win on cost."
- "Long-poll is rate-limited to 100 updates per call; with 1s latency you can ingest 6,000 upd/min max."
- Webhooks: "This single change raised sustainable intake from 9k to 28k upd/min on a 2 vCPU container (DigitalOcean, Jan 2026)." (switching from long-poll to webhook + Nginx buffer)

**MTProto hybrid approach:**
- "Keep Bot API for inbound webhooks; offload broadcast bursts to a self-hosted MTProto session using the same bot identity."
- Benefits: "Inherit 2 GB upload size and can pipeline 100 requests per socket, cutting kernel time by roughly one order."
- "Route only `messages.sendMessage` calls through MTProto; leave webhooks on Bot API so Telegram still signs updates."

**Key rate limit facts (from 429-errors article, Dec 2025):**
- Per-chat limit: 1 msg/s (applies to all chats, including groups and channels)
- sendMediaGroup: each photo/document counts as 1 unit toward the global 30 msg/s limit
- 30 msg/s is a fixed window, NOT token-bucket (though TDLib draft shows token-bucket hints for future)
- Retry-After header: "Sub-second precision; safe to retry at value -0.1s"
- Multiple tokens to circumvent limits: "Against ToS; verified accounts have been banned."

**Practical 429 handling:**
```typescript
// Token-bucket + exponential backoff with jitter
async function sendWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (e.error_code === 429) {
        const retryAfter = e.parameters?.retry_after ?? Math.pow(2, i);
        await sleep((retryAfter + Math.random()) * 1000);
      } else throw e;
    }
  }
}
```

**Production reality (from paid broadcast case study):**
- "Paid broadcasts can scale up to 1000/sec with Stars." (new feature for Telegram Stars-based broadcasts)
- Groups have 20 messages-per-minute cap.
- Bulk messaging free baseline: ~30/sec.

## Annotations for stinger-forge

- `guides/01-webhook-setup.md` should include the rate limits table and the 6k/30k msg/h decision matrix.
- `guides/05-mtproto-escalation.md`: The "8k msgs/min" or "above ~30k msg/h" threshold with MTProto hybrid is the quantitative trigger.
- The sendMediaGroup counting (each item = 1 global unit) is a subtle gotcha for media-heavy bots.
- The per-chat 1 msg/s limit applies to groups AND channels - not just private chats.
- The "multiple tokens to circumvent limits = ToS ban" warning should be in the directives section.
- The Stars-based paid broadcast at 1000/sec is new and relevant to high-volume notification bots.
