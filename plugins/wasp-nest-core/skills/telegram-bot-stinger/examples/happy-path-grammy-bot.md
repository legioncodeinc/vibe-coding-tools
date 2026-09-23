# Example: Happy-Path grammY Bot

> Demonstrates: `guides/00-framework-selection.md`, `guides/01-webhook-setup.md`, `guides/02-bot-features.md`

---

## Scenario

A new TypeScript bot needs to handle `/start`, `/help`, and an inline keyboard with a callback. Deployed with webhook on a Node.js server behind nginx, using a Redis session store.

---

## Project setup

```bash
npm init -y
npm install grammy @grammyjs/sessions
npm install -D typescript tsx @types/node

# Create .env
echo "BOT_TOKEN=your_bot_token_here" > .env
echo "WEBHOOK_SECRET=random_secret_string" >> .env
echo "WEBHOOK_URL=https://yourbot.example.com/webhook" >> .env
echo "PORT=3000" >> .env
```

---

## src/bot.ts

```typescript
import { Bot, session, InlineKeyboard } from "grammy";
import { RedisAdapter } from "@grammyjs/storage-redis";
import Redis from "ioredis";

interface SessionData {
  messageCount: number;
}

type MyContext = Context & SessionFlavor<SessionData>;

const redis = new Redis(process.env.REDIS_URL!);
const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

// Session middleware with Redis persistence
bot.use(
  session({
    initial: (): SessionData => ({ messageCount: 0 }),
    storage: new RedisAdapter({ instance: redis }),
  })
);

// Commands
bot.command("start", async (ctx) => {
  await ctx.reply(
    `Welcome ${ctx.from?.first_name}! I'm your bot. Use /help to see commands.`
  );
});

bot.command("help", async (ctx) => {
  await ctx.reply("Commands:\n/start — Welcome message\n/help — This message\n/menu — Show menu");
});

bot.command("menu", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text("Option A", "option_a")
    .text("Option B", "option_b")
    .row()
    .text("Cancel", "cancel");

  await ctx.reply("Choose an option:", { reply_markup: keyboard });
});

// Callback handlers
bot.callbackQuery("option_a", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.messageCount++;
  await ctx.editMessageText(`You chose A (interaction #${ctx.session.messageCount})`);
});

bot.callbackQuery("option_b", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.messageCount++;
  await ctx.editMessageText(`You chose B (interaction #${ctx.session.messageCount})`);
});

bot.callbackQuery("cancel", async (ctx) => {
  await ctx.answerCallbackQuery("Cancelled");
  await ctx.deleteMessage();
});

// Error handling
bot.catch((err) => {
  console.error("Bot error:", err);
});

export { bot };
```

---

## src/server.ts (webhook)

```typescript
import "dotenv/config";
import express from "express";
import { webhookCallback } from "grammy";
import { bot } from "./bot";

const app = express();
app.use(express.json());

// Webhook endpoint with secret token validation
app.post(
  "/webhook",
  (req, res, next) => {
    if (
      req.headers["x-telegram-bot-api-secret-token"] !== process.env.WEBHOOK_SECRET
    ) {
      return res.sendStatus(401);
    }
    next();
  },
  webhookCallback(bot, "express")
);

// Health check
app.get("/health", (_, res) => res.json({ status: "ok" }));

const port = parseInt(process.env.PORT ?? "3000");
app.listen(port, () => {
  console.log(`Bot server listening on :${port}`);
});
```

---

## src/setup.ts (register webhook once)

```typescript
import "dotenv/config";
import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN!);

await bot.api.setWebhook(process.env.WEBHOOK_URL!, {
  secret_token: process.env.WEBHOOK_SECRET!,
  allowed_updates: ["message", "callback_query"],
  max_connections: 40,
});

const info = await bot.api.getWebhookInfo();
console.log("Webhook registered:", info);
```

---

## nginx.conf snippet

```nginx
location /webhook {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_read_timeout 60s;
}
```

---

## What this demonstrates

1. Bot initialized with `BOT_TOKEN` from environment (never hardcoded)
2. Redis session middleware for persistence across restarts
3. `/start`, `/help`, `/menu` commands
4. Inline keyboard with three callback handlers
5. `answerCallbackQuery()` called in every callback handler (within 30-second window)
6. Express webhook server with secret token validation
7. `setWebhook` called once during setup, not on every server start
8. Health check endpoint for uptime monitoring
