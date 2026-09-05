---
source_url: https://grammy.dev/guide/deployment-types
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: webhook-vs-polling
stinger: telegram-bot-stinger
---

# grammY - Long Polling vs. Webhooks (Official Guide)

## Summary

The official grammY guide on deployment types is the definitive practitioner resource for the webhook vs long-polling decision. It accurately explains both models, their tradeoffs, and provides concrete guidance: polling is simpler but expensive under load; webhooks are cheaper under load but add operational complexity. The guide explicitly warns about duplicate update processing via webhooks and recommends queue-based handling. This is the same content the pytopia/project-template-telegram-bot repository uses as its canonical reference.

## Key quotations / statistics

**Long polling:**
- "The main advantage of long polling over webhooks is that it is simpler. You don't need a domain or a public URL. You don't need to fiddle around with setting up SSL certificates in case you're running your bot on a VPS. Use `bot.start()` and everything will work."
- Default polling timeout: 30 seconds per request (connection kept open until update arrives, then reconnected).

**Webhooks:**
- "The main advantage of webhooks over long polling is that they are cheaper. You save a ton of superfluous requests. You don't need to keep a network connection open at all times."
- "You can use services that automatically scale your infrastructure down to zero when no requests are coming." (serverless use case)
- **Critical concurrency behavior:** "When Telegram sends an update from one chat to your bot, it will wait for you to end the request before delivering the next update that belongs to that chat. In other words, Telegram will deliver updates from the same chat in sequence, and updates from different chats are sent concurrently."
- **Duplicate processing danger:** "Telegram has a timeout for each update that it sends to your webhook endpoint. If you don't end a webhook request fast enough, Telegram will re-send the update, assuming that it was not delivered."
- "This is why grammY has its own, shorter timeout inside `webhookCallback` (default: 10 seconds). If your middleware finishes before that, the function `webhookCallback` will respond to the webhook automatically."
- **Queue recommendation:** "Instead of trying to perform all of the work in the small webhook timeout window, just append the task to the queue to be handled separately, and let your middleware complete."

**Decision guidance (from grammY docs):**
- Long polling works for: local dev, no public URL needed, behind firewall, single-instance bots.
- Webhooks work for: serverless (Workers/Lambda), multi-instance scaling, cost optimization under load.

**From gist.github.com/nazt analysis (April 2026):**
```
| Scenario | Pick | Reason |
|---|---|---|
| Local dev, no public URL | Polling | No tunneling needed |
| Production single-instance | Either | Webhook lower-latency |
| Multi-instance / scaled | Webhook + LB | Polling needs a single consumer (offset races) |
| Offline / behind firewall | Polling | Only outbound connections |
| Minimal-latency real-time | Webhook | No poll interval; push is immediate |
| Serverless (Workers, Lambda) | Webhook | Polling needs long-lived process |
```

**Mutual exclusion rule:**
- "You can't run both. `setWebhook` silently blocks `getUpdates`: calling the latter while a webhook is set returns 409 Conflict."
- Fix: always `deleteWebhook` before switching to polling.
- "getWebhookInfo is the source of truth for current mode."

## Annotations for stinger-forge

- `guides/01-webhook-setup.md` should link to this grammY guide as the canonical reference.
- The mutual exclusion rule (409 Conflict) is a common gotcha - highlight prominently.
- The 10-second grammY webhook internal timeout is lower than Telegram's 60-second default - document both and explain why grammY chose 10s.
- The queue recommendation for long-running operations is important for payment handling, AI integrations, etc.
- Allowed webhook ports: **443, 80, 88, 8443** - not arbitrary ports (source: gist analysis).
- TLS is mandatory for webhooks. Telegram rejects self-signed certs as of Bot API v6.
