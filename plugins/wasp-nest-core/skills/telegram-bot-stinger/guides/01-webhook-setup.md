# Guide 01: Webhook Setup

> Sources: `research/architecture/2026-05-20-grammy-deployment-types.md`, `research/architecture/2026-05-20-webhook-setup-production.md`, `research/architecture/2026-05-20-webhook-vs-polling-benchmarks.md`, `research/architecture/2026-05-20-rate-limits-production.md`

---

## Webhook vs long-polling: decision guide

| Condition | Recommendation |
|---|---|
| Local development / testing | Long-polling (`bot.start()`) |
| Under 6,000 msg/h | Either; polling is simpler to set up |
| 6,000 - 30,000 msg/h | Webhooks preferred |
| Over 30,000 msg/h | Webhooks required |
| Serverless (Vercel, Cloudflare Workers) | Webhooks only (no persistent process) |
| Shared hosting without HTTPS | Long-polling only |

**Key benchmarks (from research):**
- Webhook median latency: **3x lower** than aggressive polling
- Webhook CPU usage: **2x lower** than aggressive polling
- These advantages become significant above 10k msg/h

---

## Webhook requirements

Telegram's webhook constraints (all required):

1. **HTTPS only.** Self-signed certificates require the `certificate` parameter to setWebhook; use Let's Encrypt for simplest setup.
2. **Allowed ports:** 443, 80, 88, 8443 only. No custom ports.
3. **Public IP or domain.** Telegram's servers must reach your endpoint.
4. **Response within 60 seconds.** For long-running tasks, return 200 immediately and process asynchronously.

---

## setWebhook call sequence

```
1. Deploy your HTTPS endpoint
2. Test it returns 200 for a POST request
3. Call setWebhook:
   POST https://api.telegram.org/bot{TOKEN}/setWebhook
   {
     "url": "https://yourdomain.com/bot{TOKEN}",
     "secret_token": "your_random_secret",
     "allowed_updates": ["message", "callback_query", "inline_query"],
     "max_connections": 40
   }
4. Verify with getWebhookInfo
5. Delete local polling if you had it running
```

### The 409 Conflict bug

**Critical:** If `setWebhook` is active, calling `getUpdates` returns `409 Conflict`. You CANNOT run webhook and polling simultaneously. Before switching:

```bash
# Delete webhook before starting polling
curl "https://api.telegram.org/bot{TOKEN}/deleteWebhook"
```

---

## secret_token header

Always set `secret_token` in `setWebhook`. Telegram sends it as the `X-Telegram-Bot-Api-Secret-Token` header on every request. Validate it in your handler:

```typescript
// grammY webhook with secret token validation (Fastify example)
app.post("/webhook", async (req, reply) => {
  const token = req.headers["x-telegram-bot-api-secret-token"];
  if (token !== process.env.WEBHOOK_SECRET) {
    return reply.status(401).send("Unauthorized");
  }
  await bot.handleUpdate(req.body);
  reply.send("OK");
});
```

---

## allowed_updates optimization

Only subscribe to update types your bot handles. Reduces Telegram's load and your processing overhead:

```
["message"]                           — text bots
["message", "callback_query"]         — bots with inline keyboards
["message", "callback_query", "inline_query"]  — inline mode bots
["message", "pre_checkout_query", "successful_payment"]  — payment bots
```

---

## getWebhookInfo debugging

```bash
curl "https://api.telegram.org/bot{TOKEN}/getWebhookInfo"
```

Key fields to check:
- `url`: should match your endpoint
- `has_custom_certificate`: should be `false` for Let's Encrypt
- `pending_update_count`: growing number means your server isn't processing fast enough
- `last_error_message`: the most recent delivery failure reason
- `last_error_date`: Unix timestamp

Common errors:
| Error | Fix |
|---|---|
| `SSL_ERROR` | Check TLS cert validity; Let's Encrypt may have expired |
| `Connection refused` | Server not running or wrong port |
| `Timeout` | Response took > 60 sec; move long work to async queue |
| `PEER_CONN_FAILED` | DNS not resolving or port blocked by firewall |

---

## Nginx reverse proxy configuration

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location /bot {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 60s;
    }
}
```

---

## grammY webhook setup (Node.js + Express)

```typescript
import { Bot, webhookCallback } from "grammy";
import express from "express";

const bot = new Bot(process.env.BOT_TOKEN!);
const app = express();

app.use(express.json());

// Register handlers
bot.command("start", (ctx) => ctx.reply("Hello!"));

// Webhook handler with secret token validation
app.post(
  "/webhook",
  (req, res, next) => {
    if (req.headers["x-telegram-bot-api-secret-token"] !== process.env.WEBHOOK_SECRET) {
      return res.sendStatus(401);
    }
    next();
  },
  webhookCallback(bot, "express")
);

app.listen(3000);
```

---

## aiogram webhook setup (aiohttp)

```python
from aiogram import Bot, Dispatcher
from aiogram.webhook.aiohttp_server import SimpleRequestHandler
from aiohttp import web

bot = Bot(token=os.getenv("BOT_TOKEN"))
dp = Dispatcher()

async def on_startup(app):
    await bot.set_webhook(
        url=f"https://yourdomain.com/webhook",
        secret_token=os.getenv("WEBHOOK_SECRET"),
        allowed_updates=["message", "callback_query"],
    )

app = web.Application()
SimpleRequestHandler(dispatcher=dp, bot=bot, secret_token=os.getenv("WEBHOOK_SECRET")).register(app, path="/webhook")
app.on_startup.append(on_startup)

web.run_app(app, port=3000)
```

---

## Local development with ngrok

For local webhook testing, use ngrok to expose localhost:

```bash
ngrok http 3000
# Copy the https URL from ngrok output
# Call setWebhook with ngrok URL
```

**Important:** ngrok free tier URLs change on restart. For stable local dev, prefer long-polling.
