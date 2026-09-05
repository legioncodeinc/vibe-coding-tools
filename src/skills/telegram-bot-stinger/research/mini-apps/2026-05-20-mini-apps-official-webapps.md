---
source_url: https://core.telegram.org/bots/webapps
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: mini-apps-sdk
stinger: telegram-bot-stinger
---

# Telegram Mini Apps Official Documentation

## Summary

The official Telegram Mini Apps docs at core.telegram.org/bots/webapps document the `window.Telegram.WebApp` JavaScript object, the initData format, launch parameters, and the changelog of Mini Apps API changes. As of the research date, the two most recent significant changes are: (April 3, 2026 / Bot API 9.6) the `requestChat` method was added to the `WebApp` class; (March 1, 2026 / Bot API 9.5) third-party initData validation was enabled.

## Key quotations / statistics

**SDK integration:**
- "To connect your Mini App to the Telegram client, place the script `telegram-web-app.js` in the `<head>` tag before any other scripts."
- `<script src="https://telegram.org/js/telegram-web-app.js"></script>`

**Critical WebApp fields:**
| Field | Type | Description |
|-------|------|-------------|
| `initData` | String | Raw data string. **WARNING: Validate data from this field before using it on the bot's server.** |
| `initDataUnsafe` | WebAppInitData | Parsed object. **WARNING: Data from this field should not be trusted.** |
| `version` | String | Bot API version available in user's Telegram app |
| `platform` | String | Platform name (ios/android/tdesktop/web) |

**sendData method:**
- `sendData(data)`: "A method used to send data to the bot. When this method is called, a service message is sent to the bot containing the data data of the length up to 4096 bytes, and the Mini App is closed."
- "This method is only available for Mini Apps launched via a Keyboard button." (NOT inline buttons)

**2026 changelog entries:**
- **April 3, 2026 (Bot API 9.6):** "Added the method `requestChat` to the class `WebApp`."
- **March 1, 2026 (Bot API 9.5):** "Third parties (e.g., Mini App builders, external SDKs etc.) that receive or process data on behalf of Mini Apps are now able to validate init data without knowing the bot secret token."
- **March 1, 2026:** "Added the method `offClick` to `MainButton`."
- **March 1, 2026:** "Added the fields `chat`, `can_send_after` to the class `WebAppInitData`."
- **March 1, 2026:** "Added the events `backButtonClicked`, `settingsButtonClicked`, `invoiceClosed`."

## Annotations for stinger-forge

- `guides/03-mini-apps.md` should document the `sendData` limitation (only works from Keyboard buttons, NOT inline buttons) - this is a common gotcha.
- The `initDataUnsafe` field name is confusing because it's ALSO available safely via `window.Telegram.WebApp.initDataUnsafe` for UI purposes - the warning is specifically about trusting it for authorization on the server. Document this nuance.
- The `version` field is important for feature detection: before calling any Mini Apps method, check that the version supports it (use `window.Telegram.WebApp.isVersionAtLeast('6.0')`).
- The `requestChat` method (Bot API 9.6) allows Mini Apps to open a chat picker and return the selected chat to the bot. This is new functionality for 2026 that `guides/03-mini-apps.md` should document.
- The SDK changelog is at the official docs URL - bookmark for `stinger-forge` to pull the full events/methods list.
