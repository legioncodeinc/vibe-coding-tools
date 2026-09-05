# Guide 00: Framework Selection

> Source: `research/frameworks/2026-05-20-grammy-latest-version.md`, `research/frameworks/2026-05-20-aiogram-3x-pypi-status.md`, `research/frameworks/2026-05-20-grammy-vs-aiogram-comparison.md`

---

## Decision tree

```
Is the project in TypeScript / JavaScript?
  YES → Use grammY v1.x
  NO (Python)?
    Async-native, modern patterns → Use aiogram 3.x
    Legacy codebase / PTB 20+ existing → python-telegram-bot 21.x (compatible, not preferred)
    
Are you migrating from Telegraf?
  → Migrate to grammY. Telegraf has had zero npm releases in 2+ years (abandoned).
```

---

## grammY (TypeScript): recommended for 2026

**Version as of May 2026:** v1.43.0 (released May 16, 2026). No v2 exists; no breaking changes from v1 are announced.

**Why grammY over Telegraf:**
- Telegraf is abandoned (last publish: ~2 years ago on npm)
- grammY tracks Bot API changes within days of each release
- Full TypeScript types for every API method and result
- Plugin ecosystem: sessions, conversations (FSM), i18n, rate-limiter, auto-retry, parse-mode
- Works in Node.js, Deno, Bun, and serverless (Cloudflare Workers, Vercel Edge)

**Install:**
```bash
npm install grammy
```

**Minimal command bot:**
```typescript
import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN!);

bot.command("start", (ctx) => ctx.reply("Hello!"));
bot.command("help", (ctx) => ctx.reply("Commands: /start /help"));

// Long-polling (development)
bot.start();

// Webhook (production) — see guides/01-webhook-setup.md
```

---

## aiogram 3.x (Python): recommended for Python

**Version as of May 2026:** v3.28.2 (released May 10, 2026). Supports Bot API 10.0 (added within 2 days of Telegram's release).

**Why aiogram 3.x over python-telegram-bot:**
- Async-native (asyncio throughout; no sync wrappers)
- Router-based handler organization (scales to large bots)
- FSMContext for conversation state (Redis/memory/JSON storage)
- Active maintenance: 5 releases in 2026 alone

**Install:**
```bash
pip install aiogram==3.28.2
# Or for webhook support:
pip install "aiogram[fast]"
```

**Minimal command bot:**
```python
import asyncio
from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart

bot = Bot(token=os.getenv("BOT_TOKEN"))
dp = Dispatcher()

@dp.message(CommandStart())
async def handle_start(message: Message):
    await message.answer("Hello!")

async def main():
    await dp.start_polling(bot)

asyncio.run(main())
```

---

## Framework comparison table (May 2026)

| Criterion | grammY | aiogram 3.x | Telegraf | python-telegram-bot |
|---|---|---|---|---|
| Language | TypeScript | Python | TypeScript | Python |
| Bot API support | 10.0 (days lag) | 10.0 (days lag) | **Abandoned** | 21.x (tracks) |
| Async model | Native | Native asyncio | Callback/Promise | Optional (20+) |
| Serverless support | Yes (all runtimes) | Limited | No | No |
| Plugin ecosystem | Rich (official) | Community | Stale | Stale |
| Maintenance | Active | Very active | ABANDONED | Active |
| **Recommendation** | **Use for TS** | **Use for Python** | **Avoid** | Acceptable |

---

## When to use python-telegram-bot instead of aiogram

Use python-telegram-bot 21.x only when:
- The team has deep existing familiarity with its API and migration cost is high
- The bot requires synchronous code paths that don't fit asyncio well

Otherwise prefer aiogram 3.x for all new Python bots.

---

## Open question flagged from research

> TODO: grammY plugin ecosystem survey: `guides/02-bot-features.md` covers core features. For FSM conversations specifically, the `@grammyjs/conversations` plugin and `@grammyjs/sessions` plugin details were not fully captured in this research pass. Check https://grammy.dev/plugins/ before implementing complex conversation flows.
