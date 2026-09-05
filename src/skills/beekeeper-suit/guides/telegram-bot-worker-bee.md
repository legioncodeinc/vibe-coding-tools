# telegram-bot-worker-bee

## Domain
Owns the full Telegram Bot development surface for 2026: the Bot API up to 10.0 (including guest mode and Managed Bots), grammY (TypeScript, the recommended framework) and aiogram 3.x (Python, async-native), webhook-vs-long-polling architecture with quantitative thresholds, Telegram Mini Apps `initData` validation (HMAC-SHA256 and Ed25519 paths), Telegram Stars payments (mandatory for digital goods), inline mode, and MTProto escalation via Telethon/TDLib when Bot API limits are exhausted.

## Paired Stinger
[telegram-bot-stinger](../../telegram-bot-stinger) - framework selection, webhook setup, bot features, Mini Apps initData validation, Stars payments, and the MTProto escalation guide.

## Trigger phrases
- "build a Telegram bot"
- "why is our webhook not delivering updates"
- "wire up a Telegram Mini App"
- "implement Telegram Stars payments"
- "should we use grammY or aiogram"
- "our bot got a 409 Conflict"
- "validate Mini App initData server-side"

## Do NOT route when
- The ask is the Mini App frontend UI/React layer rather than the bot-side initData wiring: route to react-worker-bee.
- The ask is Docker/CI/CD for the bot server: route to devops-worker-bee.
- The ask is an external payment processor beyond Telegram Payments/Stars: route to payments-worker-bee.
- The user wants to automate a user account (not a bot) without explicit consent: stop and explain the legal/ToS implications rather than providing code.
- The user wants to charge fiat for digital goods: redirect to Stars and explain the Apple/Google enforcement consequences rather than building the fiat path.

## Inputs the Bee needs
- Target framework/language (grammY/TypeScript or aiogram/Python) and whether it's a fresh bot or an existing one.
- Webhook vs. polling, and expected message volume (webhook is recommended above 6k msg/h).
- Whether a Mini App, payments, or MTProto escalation is in scope.
- Confirmation the bot token is stored in an environment variable, never hardcoded.

## Outputs
- A grammY or aiogram bot scaffold with persistent session storage.
- Webhook configuration with `secret_token` header verification, or a polling setup with `deleteWebhook` called first.
- Server-side `initData` HMAC-SHA256 (or Ed25519) validation code for Mini Apps.
- A pre-launch checklist covering token security, rate limits, and Stars payment wiring.

## Commonly sequenced with
- react-worker-bee: for the Mini App's frontend UI once initData validation is wired.
- devops-worker-bee: for deploying and running the bot server.
- payments-worker-bee: when the product also needs a non-Telegram payment processor for physical goods.
