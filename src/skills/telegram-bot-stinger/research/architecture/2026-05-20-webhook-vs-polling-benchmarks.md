---
source_url: https://pcg-telegram.com/blogs/936816045
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: webhook-vs-polling
stinger: telegram-bot-stinger
---

# Webhook vs Long-Polling Benchmarks - December 2025

## Summary

A December 2025 benchmark article measuring webhook vs long-polling performance with reproducible methodology. The data is current for 2026 (Bot API 7.5 changes noted). Key finding: webhook median latency is 3x lower and CPU burn 2x smaller than aggressive 100ms polling. Also documents Telegram's 2026 QUIC-based webhook roadmap hint. This is the most data-rich source on the performance comparison.

## Key quotations / statistics

**Latency benchmarks:**
| Metric | Webhook | Long-polling 10ms | Long-polling 100ms |
|--------|---------|-------------------|-------------------|
| Median | ~95ms | ~240ms | ~380ms |
| 95th percentile | 290ms | 1,050ms | (higher) |
| CPU core per 1k upd/min | 0.05 | 0.12 | 0.21 |
| SSL handshakes | 0 (reuse) | 14,400/hr | 1,440/hr |

**Bot API 7.5 changes (still relevant in 2026):**
- "Bot API 7.5 (Mar 2025) quietly raised the webhook timeout ceiling from 60 s to 90 s and added automatic gzip compression for payloads larger than 1 kB."
- "Long-polling inherited the same 90 s hang window but kept the 100-updates-per-response hard cap."

**Production recommendations:**
1. "Return 200 immediately, queue locally, respond with empty 200 to Telegram."
2. "Set `secret_token`; reject posts lacking the header." (security)
3. "Cap `max_connections` to the thread pool size of your runtime + 10%."
4. "Enable keep-alive (Telegram reuses TLS sessions aggressively)."
5. "Store `update_id` in a 1h TTL cache to de-duplicate during your own fail-over."
6. "Run a canary bot instance on polling; promote to webhook only when p95 latency < 300ms for 24h."

**Telegram 2026 roadmap hint:**
- "Telegram's 2026 roadmap (public talk, Dec 2025) hints at QUIC-based webhooks to cut handshake RTT. Early tester form is open; expect 15-25ms median savings in regions with 100+ ms TCP handshake loss."

**Rate limits from supplementary source (fyw-telegram.com, Jan 2026):**
- Global (sendMessage): 30 msg/s documented, ~32 msg/s empirical burst
- Per chat: 1 msg/s
- Long polling: 100 updates/call hard cap
- Webhook: 1 concurrent connection per bot (keep-alive 240s)
- Below 6k msg/h: long polling adequate; above 30k msg/h: webhooks win on cost.

**MTProto escalation threshold:**
- "Above ~8,000 msgs/min the TLS handshake overhead alone costs >15% CPU. Solution: keep Bot API for inbound webhooks; offload broadcast bursts to a self-hosted MTProto session."
- MTProto benefits: 2 GB upload size (vs 50 MB Bot API limit), 100 requests per socket pipelining.

## Annotations for stinger-forge

- `guides/01-webhook-setup.md` should include the 6-point production checklist verbatim.
- The 6k/30k msg/h threshold table is useful guidance for the architecture decision section.
- The MTProto escalation threshold (~8k msgs/min) provides a quantitative trigger for `guides/05-mtproto-escalation.md`.
- The QUIC-based webhook hint is forward-looking but worth a brief note in the architecture guide.
- The `update_id` deduplication in a 1h TTL cache is a concrete implementation pattern for the reliability section.
- Rate limit: 100 updates per `getUpdates` call is a hard cap that limits polling throughput to ~6k updates/min maximum.
