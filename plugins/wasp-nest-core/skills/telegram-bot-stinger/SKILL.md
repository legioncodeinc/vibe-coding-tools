---
name: "telegram-bot-stinger"
description: "Build Telegram bots. Use for grammY, aiogram, webhooks, Mini Apps, inline mode, Stars payments, or rate limits. Read README.md for the guide map."
license: AGPL-3.0-or-later
---

# Telegram Bot Stinger

Start with [README.md](README.md) for the workflow map and detailed references.

You are the procedural arsenal for `telegram-bot-wasp-drone`. The research is in `research/`. The guides encode the opinionated 2026 Telegram Bot playbook derived from that research. Read the relevant guide before acting; do not guess from training data alone, because the Bot API has had 4 major releases in 2026 and the payments model changed fundamentally.

---

## Quick scenario routing

| Scenario | First guide to read |
|---|---|
| New bot, which framework? | `guides/00-framework-selection.md` |
| Setting up webhook in production | `guides/01-webhook-setup.md` |
| Commands, keyboards, FSM conversations | `guides/02-bot-features.md` |
| Telegram Mini Apps (WebApp) | `guides/03-mini-apps.md` |
| Telegram Payments / Stars | `guides/04-payments.md` |
| Need to do something Bot API can't do | `guides/05-mtproto-escalation.md` |

---

## Critical constraints for 2026

These are non-negotiable facts that every guide assumes:

1. **Bot API 10.0 is current (May 8, 2026).** New in 10.0: guest mode (bots respond in chats without being a member), Managed Bots (bots that create other bots), bot-to-bot chat, live photos. See `research/bot-api/2026-05-20-bot-api-10-guest-mode.md`.

2. **grammY is v1.43.0 (NOT v2).** No breaking changes from v1. Telegraf is abandoned. grammY is the TypeScript recommendation. See `research/frameworks/2026-05-20-grammy-latest-version.md`.

3. **aiogram v3.28.2 supports Bot API 10.0.** Five releases in 2026. No v4 announced. See `research/frameworks/2026-05-20-aiogram-3x-pypi-status.md`.

4. **Telegram Stars (XTR) are MANDATORY for all digital goods.** Apple/Google compliance enforcement. Empty `provider_token` (`""`) for Stars. Physical goods can still use fiat. See `research/payments/2026-05-20-telegram-stars-official-payments.md`.

5. **initData has TWO validation paths.** HMAC-SHA256 (traditional, requires bot secret token) and Ed25519 (new in Bot API 9.5, March 2026: validates with bot ID only). See `research/mini-apps/2026-05-20-initdata-validation-official.md`.

---

## Guides index

- `guides/00-framework-selection.md`: grammY vs aiogram vs Telegraf (abandoned) vs others; decision tree; version facts as of May 2026.
- `guides/01-webhook-setup.md`: HTTPS requirements, setWebhook call sequence, allowed ports, secret_token header, getWebhookInfo debugging, the 409 Conflict bug, switching between modes.
- `guides/02-bot-features.md`: commands, keyboards (inline/reply), callback queries, FSM conversations (grammY Scenes + aiogram FSMContext), file handling, Bot API 10.0 guest mode.
- `guides/03-mini-apps.md`: initData HMAC-SHA256 and Ed25519 validation algorithms, JS SDK events (MainButton, BackButton, hapticFeedback, CloudStorage), auth_date expiry, security hardening.
- `guides/04-payments.md`: Stars (XTR) mandatory constraint, send_invoice parameters, pre_checkout_query answer window (10 sec), successful_payment handler, physical vs digital goods split.
- `guides/05-mtproto-escalation.md`: when Bot API headroom runs out, Telethon vs TDLib choice, consent and legal considerations.

## Examples index

- `examples/happy-path-grammy-bot.md`: grammY bot from scaffold to production: command handler, session middleware, webhook deploy (Fastify + nginx).
- `examples/mini-apps-initdata-validation.md`: server-side initData validation (both HMAC-SHA256 and Ed25519) with Express + `@tma.js/init-data-node`.

## Templates index

- `templates/new-bot-checklist.md`: pre-launch checklist: token security, webhook vs polling decision, rate-limit awareness, initData validation, Stars payment setup.

---

## Scope boundaries

- **Do own:** Bot API, grammY, aiogram, webhook config, Mini Apps initData + SDK, Telegram Payments/Stars, inline mode, MTProto escalation.
- **Do NOT own:** Mini App frontend UI/React (`react-wasp-drone`), Dockerfile / CI for the bot server (`devops-wasp-drone`), external payment processor details beyond Telegram Payments (`payments-wasp-drone`).
- **Handoff rule:** when the user's question shifts from "how do I wire the Telegram side" to "how do I build the React UI inside the WebView", hand off to `react-wasp-drone`.
