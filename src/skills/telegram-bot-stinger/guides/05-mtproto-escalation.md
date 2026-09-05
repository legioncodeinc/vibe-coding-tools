# Guide 05: MTProto Escalation

> Sources: `research/bot-api/2026-05-20-bot-api-10-guest-mode.md` (Bot API limits context)
>
> TODO: Dedicated Telethon / TDLib research was not conducted in this research pass. The guide below reflects knowledge from the Command Brief and general MTProto architecture. Before implementing MTProto in production, re-run scripture-historian with query "Telethon 2026" and "TDLib TGCalls 2026" to pull current version information. Source: https://docs.telethon.dev/ and https://github.com/tdlib/td.

---

## When to escalate from Bot API to MTProto

The Telegram Bot API is a high-level HTTP interface that deliberately limits what bots can do. MTProto is the underlying protocol that powers the full Telegram client.

Escalate to MTProto when you need to:

| Capability | Bot API | MTProto |
|---|---|---|
| Read messages in a channel the bot isn't a member of | No | Yes |
| Automate user account actions | No | Yes (user sessions) |
| Access full message history | Limited | Yes |
| Participate in voice chats / calls | No | Yes (TGCalls) |
| Create accounts programmatically | No | Yes (with restrictions) |
| High-volume message history extraction | No | Yes |

**Do NOT escalate for:**
- Regular bot features (commands, keyboards, payments): Bot API handles these
- Adding guest mode responses (Bot API 10.0 supports this via `answerGuestQuery`)
- Posting messages as a bot: Bot API handles this

---

## Telethon (Python): recommended MTProto library

Telethon is the most widely-used Python MTProto library. It provides a high-level async interface for user account and bot-account MTProto access.

**Install:**
```bash
pip install telethon
```

**Connecting with a user session:**
```python
from telethon import TelegramClient

# api_id and api_hash from https://my.telegram.org/apps
client = TelegramClient(
    "session_name",   # Session file path (stores auth state)
    api_id=int(os.getenv("TG_API_ID")),
    api_hash=os.getenv("TG_API_HASH"),
)

async def main():
    await client.start()  # Opens interactive auth on first run
    
    # Read from a channel
    async for message in client.iter_messages("@some_channel", limit=100):
        print(message.text)

with client:
    client.loop.run_until_complete(main())
```

**Connecting as a bot:**
```python
client = TelegramClient(
    "bot_session",
    api_id=int(os.getenv("TG_API_ID")),
    api_hash=os.getenv("TG_API_HASH"),
).start(bot_token=os.getenv("BOT_TOKEN"))
```

---

## TDLib (C library with JSON interface): for production-grade use

TDLib is Telegram's official C library that powers all official Telegram clients. It is:
- More stable than Telethon for high-load production use
- Harder to integrate (requires building the C library)
- Available with JSON API, suitable for any language via subprocess or binding

**When to prefer TDLib over Telethon:**
- Production workloads with SLA requirements
- You need voice/video call support (TGCalls is built on TDLib)
- Building a Telegram client replacement

**When Telethon is fine:**
- Scripting and automation tasks
- Data extraction / scraping
- Internal tools

---

## Legal and consent considerations

**This is non-negotiable.** MTProto access to user accounts requires users to:
1. Provide their phone number and Telegram auth code
2. Understand their account is being automated
3. Comply with Telegram's Terms of Service

**Telegram's TOS prohibits:**
- Spam, flooding, or harassment via automated accounts
- Account farming or selling
- CSAM or illegal content distribution

**Safe use patterns:**
- Automate only accounts the users themselves control (with their explicit consent)
- Store session credentials encrypted (AES-256 at minimum)
- Implement rate limiting that stays well below Telegram's flood limits
- Log all actions for audit purposes

**Never:**
- Automate user accounts to send unsolicited messages
- Create fake user accounts at scale
- Store credentials in plaintext or logs

---

## Choosing between Bot API 10.0 and MTProto

Before escalating to MTProto, check Bot API 10.0 first. The May 2026 release added:
- **Guest mode:** bots can respond in chats they're not a member of (via `answerGuestQuery`)
- **Managed Bots:** bots that can create and manage other bots
- **Bot-to-bot chat:** bots can communicate directly

These features cover many use cases that previously required MTProto escalation.

**Decision rule:** If Bot API 10.0 can do it, use Bot API. Escalate to MTProto only when Bot API's documented limitations are explicitly hit and the user consents to the additional complexity and legal responsibilities.
