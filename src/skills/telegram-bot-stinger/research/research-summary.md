# Research Summary: telegram-bot-stinger

- **Depth tier consumed:** normal
- **Time window covered:** 2025-11-20 to 2026-05-20 (6 months)
- **Files written:** 15 (research-plan.md, index.md, research-summary.md + 12 source files)
- **Subfolders:** `bot-api/` (2), `frameworks/` (3), `mini-apps/` (3), `payments/` (3), `architecture/` (4)
- **Research date:** 2026-05-20

---

## 5 Most Influential Sources

### 1. `bot-api/2026-05-20-bot-api-10-guest-mode.md` - Bot API Changelog (core.telegram.org)
**Why it matters:** This is the authoritative source for ALL 2026 Bot API changes. Bot API 10.0 (May 8, 2026) introduces "guest mode" (bots respond in chats they're not a member of) and "Managed Bots" (bots that create other bots), fundamentally expanding the platform's capabilities. Every guide in `telegram-bot-stinger` must reference this to be current. The guest mode in particular changes the architecture section of `guides/02-bot-features.md` significantly.

### 2. `mini-apps/2026-05-20-initdata-validation-official.md` - initData Validation (docs.telegram-mini-apps.com)
**Why it matters:** This is the only source with the complete, step-by-step HMAC-SHA256 validation algorithm AND the new (March 2026) Ed25519 third-party validation approach. The `guides/03-mini-apps.md` security section MUST be built from this source verbatim. The 6-step algorithm, auth_date expiration, and error types are all documented with code examples that can flow directly into the stinger's guides.

### 3. `payments/2026-05-20-telegram-stars-official-payments.md` - Stars Payments (core.telegram.org/bots/payments-stars)
**Why it matters:** Stars (currency code `XTR`) is now **mandatory** for all digital goods sold via bots or Mini Apps due to Apple/Google app store compliance requirements. The `guides/04-payments.md` must lead with this constraint before showing any code. The official source also clarifies when provider_token should be empty ("") vs populated (physical goods only).

### 4. `architecture/2026-05-20-grammy-deployment-types.md` - grammY Deployment Types Guide (grammy.dev)
**Why it matters:** This is the canonical, well-maintained reference for the webhook vs polling decision with concrete scenario-to-recommendation mappings. It correctly documents the 409 Conflict mutual exclusion bug, the 10-second grammY internal webhook timeout (vs Telegram's 60-second external timeout), the queue recommendation for long-running tasks, and the serverless use case. The `guides/01-webhook-setup.md` should link to this as the primary reference.

### 5. `frameworks/2026-05-20-grammy-latest-version.md` + `frameworks/2026-05-20-aiogram-3x-pypi-status.md` - Framework Status
**Why they matter:** Together these confirm the 2026 framework recommendations and version facts. grammY is on v1.43.0 (NOT v2) as of May 16, 2026. aiogram is on v3.28.2 (May 10, 2026) and explicitly supports Bot API 10.0. Both frameworks track Bot API changes within days of release. These version facts answer the two Command Brief open questions directly.

---

## Key Findings for stinger-forge

### 1. Bot API has had 4 major releases in 2026 (9.4 through 10.0)
- **Bot API 10.0 (May 8, 2026):** Guest mode, bot-to-bot chats, Managed Bots, live photos as paid media.
- **Bot API 9.6 (April 3, 2026):** Managed Bots creation API, Mini Apps `requestChat` method.
- **Bot API 9.5 (March 1, 2026):** Third-party initData Ed25519 validation, date_time entity, sendMessageDraft.
- **Bot API 9.4 (February 9, 2026):** Custom emoji in messages.

### 2. grammY is still v1 (v1.43.0) - no v2 breaking changes
The Command Brief asked whether grammY v2 exists with breaking changes. Answer: No. grammY is on v1.43.0 (May 16, 2026). The v1.x series is actively maintained and tracks Bot API updates within days. Telegraf is effectively abandoned (last npm update 2 years ago).

### 3. aiogram v3.28.2 is the latest Python framework - already supports Bot API 10.0
aiogram had 5 releases in 2026 (Jan-May) and added Bot API 10.0 support within 2 days of its release. No aiogram v4 exists or is announced.

### 4. Telegram Stars are MANDATORY for digital goods - this is the 2026 breaking constraint
All digital goods and services sold via bots or Mini Apps MUST use Stars (XTR currency). This is enforced by Apple/Google app store compliance requirements. Provider tokens are empty strings for Stars. Physical goods can still use fiat. Developers who try to use fiat for digital goods will have their bots blocked from mobile users.

### 5. initData validation has two paths in 2026: HMAC-SHA256 and Ed25519
The traditional HMAC-SHA256 approach requires the bot secret token on the server. The new Ed25519 third-party validation (Bot API 9.5, March 2026) allows validation using only the bot ID, enabling third-party SDK providers to validate initData without touching the secret token. Both paths must be documented in `guides/03-mini-apps.md`.

### 6. Webhook vs long-polling: clear recommendation with quantitative thresholds
- Under 6k msg/h: either mode works; polling is simpler.
- Above 30k msg/h: webhooks win on cost and CPU.
- Webhook median latency 3x lower; CPU 2x lower than aggressive polling.
- Critical: setting webhook blocks getUpdates (409 Conflict). Must `deleteWebhook` before switching.
- Allowed webhook ports: 443, 80, 88, 8443 only. TLS mandatory.

---

## Open Questions for stinger-forge / User to Resolve

1. **Stars payment withdrawal UI changes in 2026?** The research confirmed the 21-day hold and 1000 Stars minimum as of mid-2024. Has the threshold changed by May 2026? The official docs page did not show an updated threshold. Recommend checking https://core.telegram.org/bots/payments-stars directly before publishing `guides/04-payments.md`.

2. **Bot API 10.0 guest mode - precise permission model?** The changelog confirms guest mode exists but the full documentation of which message types bots can receive/respond to in guest mode was not captured in full detail. The official docs at https://core.telegram.org/bots/api likely have the complete `answerGuestQuery` method signature and `guest_message` Update type.

3. **grammY plugin ecosystem for 2026?** The research captured framework-level information but did not survey the grammY plugin ecosystem (sessions, conversations, FSM, i18n, rate-limiter). `guides/02-bot-features.md` will need this. Source: https://grammy.dev/plugins/.

4. **Telethon / TDLib current status for MTProto escalation?** The Command Brief specifies an MTProto escalation guide but the research did not pull current Telethon or TDLib documentation. The `guides/05-mtproto-escalation.md` will need a dedicated research pass on https://docs.telethon.dev/ and https://github.com/tdlib/td.

5. **Inline mode InlineQueryResult shapes for 2026?** The Command Brief specifies inline mode handling but the research did not capture the current InlineQueryResult type variants and caching parameters. This is needed for `guides/02-bot-features.md`.

---

## Sources stinger-forge Should Re-fetch with Deeper Context

1. **https://core.telegram.org/bots/api** - Full Bot API method reference (especially `answerGuestQuery`, `getManagedBotToken`, `sendLivePhoto` - new in Bot API 10.0).
2. **https://grammy.dev/plugins/** - Plugin ecosystem overview for FSM, sessions, conversations.
3. **https://docs.aiogram.dev/en/stable/** - FSMContext and Router documentation for Python examples.
4. **https://core.telegram.org/bots/webapps** - Full WebApp JS SDK events and methods list (hapticFeedback, CloudStorage, MainButton, BackButton, etc.).
5. **https://docs.telethon.dev/** - For `guides/05-mtproto-escalation.md` (not covered in this research pass).
