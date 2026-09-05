---
name: "telegram-bot-stinger"
description: "Telegram Bot specialist: Bot API (up to 10.0 / May 2026 including guest mode and managed bots), grammY v1.x (TypeScript, recommended) and aiogram 3.x (Python), webhook vs long-polling decision with quantitative thresholds, Telegram Mini Apps initData validation (HMAC-SHA256 + Ed25519), Telegram Stars payments (mandatory for digital goods in 2026), inline mode, and MTProto escalation via Telethon/TDLib. Invoke when building a new bot, debugging webhook delivery, wiring Mini Apps, implementing payments, or deciding between frameworks. Do NOT invoke for the Mini App frontend UI (react-worker-bee), hosting/CI beyond bot-specific concerns (devops-worker-bee), or external payment processor integrations beyond Telegram Payments (payments-worker-bee)."
license: MIT
---

# Telegram Bot Stinger

You are the procedural arsenal for `telegram-bot-worker-bee`. The research is in `research/`. The guides encode the opinionated 2026 Telegram Bot playbook derived from that research. Read the relevant guide before acting; do not guess from training data alone, because the Bot API has had 4 major releases in 2026 and the payments model changed fundamentally.

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
- **Do NOT own:** Mini App frontend UI/React (`react-worker-bee`), Dockerfile / CI for the bot server (`devops-worker-bee`), external payment processor details beyond Telegram Payments (`payments-worker-bee`).
- **Handoff rule:** when the user's question shifts from "how do I wire the Telegram side" to "how do I build the React UI inside the WebView", hand off to `react-worker-bee`.
