---
source_url: https://core.telegram.org/bots/api-changelog
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: bot-api-changelog
stinger: telegram-bot-stinger
---

# Telegram Bot API Changelog 2026 (9.4 - 10.0)

## Summary

The Telegram Bot API released four major versions in the first half of 2026. Bot API 10.0 (May 8, 2026) is the most significant, introducing "guest mode" that allows bots to receive messages and reply in chats they are not a member of. Bot API 9.6 (April 3, 2026) introduced "Managed Bots" - bots that can create and manage other bots. Bot API 9.5 (March 2026) added chat tags and date_time entity type. Bot API 9.4 (February 2026) allowed custom emoji. The Telegram blog (May 7, 2026) announced this as an "AI Bot Revolution" update with 10+ new features.

## Key quotations / statistics

- **Bot API 10.0 (May 8, 2026):** "Introduced support for guest mode, allowing bots to receive certain messages and issue replies within chats they are not a member of."
- **Bot API 10.0 new fields:** `supports_guest_queries` (User), `guest_bot_caller_user`, `guest_bot_caller_chat` (Message), new class `SentGuestMessage`, new method `answerGuestQuery`.
- **Bot API 10.0:** "Added the ability to see certain messages sent by other bots in groups." (bot-to-bot chat capability)
- **Bot API 10.0:** Added `InputMediaSticker`, `InputMediaLocation`, `InputMediaVenue`, `PollMedia`, live photos as paid media via `sendLivePhoto`.
- **Bot API 9.6 (April 3, 2026):** "Added the field `can_manage_bots` to the class User." "Added the class `PreparedKeyboardButton` and the method `savePreparedKeyboardButton`, allowing bots to request users, chats and managed bots from Mini Apps."
- **Bot API 9.6:** "Added the method `requestChat` to the class `WebApp`." (Mini Apps can now request chats)
- **Bot API 9.5 (March 1, 2026):** "Added the `MessageEntity` type `date_time`, allowing bots to show a formatted date and time to the user."
- **Bot API 9.5:** "Allowed all bots to use the method `sendMessageDraft`."
- **Bot API 9.5:** Third-party validation for Mini Apps: "Third parties (e.g., Mini App builders, external SDKs etc.) that receive or process data on behalf of Mini Apps are now able to validate init data without knowing the bot secret token."
- **Bot API 9.4 (February 9, 2026):** "Allowed bots to use custom emoji in messages."
- **Telegram Blog (May 7, 2026):** "Today's update is an AI Bot Revolution and more, adding over 10 new features and hundreds of improvements to Telegram."
- **aiogram v3.28.2:** Explicitly states "Supports Telegram Bot API 10.0" on PyPI (May 10, 2026).

## Annotations for stinger-forge

- The `guides/00-framework-selection.md` should note that both grammY and aiogram track Bot API updates very rapidly (grammY v1.42.0 added 9.6 support on April 3, 2026; aiogram v3.28.2 supports 10.0 by May 10, 2026).
- The guest mode (Bot API 10.0) is a breaking new paradigm - the `guides/02-bot-features.md` should cover `answerGuestQuery` and the new update type `guest_message`.
- Managed Bots (Bot API 9.6) adds a new use case for `telegram-bot-worker-bee`: bots that spawn and manage other bots via `getManagedBotToken` / `replaceManagedBotToken`.
- The Mini Apps `requestChat` method (added in 9.6) should go in `guides/03-mini-apps.md`.
- Third-party initData validation (Bot API 9.5) is a security upgrade to document in `guides/03-mini-apps.md` - now can validate without knowing the bot secret token.
- Changelog reference URL: https://core.telegram.org/bots/api-changelog
