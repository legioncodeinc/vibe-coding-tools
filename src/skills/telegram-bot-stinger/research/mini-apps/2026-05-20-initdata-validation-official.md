---
source_url: https://docs.telegram-mini-apps.com/platform/init-data
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: mini-apps-initdata
stinger: telegram-bot-stinger
---

# Telegram Mini Apps - Init Data Validation (Official)

## Summary

The official Mini Apps documentation defines the two validation approaches for initData: (1) Standard HMAC-SHA256 validation using the bot secret token, and (2) Third-party Ed25519 validation without knowing the bot token (added in Bot API 9.5, March 2026). This is one of the most security-critical aspects of the entire Telegram bot platform. The documentation community (docs.telegram-mini-apps.com) is maintained by Vladislav Kibenko who is also the core contributor to @tma.js packages.

## Key quotations / statistics

### Standard Validation Algorithm (HMAC-SHA256):
1. "Iterate over all key-value pairs and create an array of string values in format `{key}={value}`. Key `hash` should be excluded, but memoized."
2. "Sort the computed array in the alphabetical order."
3. "Create HMAC-SHA256 using key `WebAppData` and apply it to the Telegram Bot token, that is bound to your Mini App."
4. "Create HMAC-SHA256 using the result of the previous step as a key. Apply it to the pairs array joined with linebreak (`\n`) received in the 2nd step and present the result as hex symbols sequence."
5. "Compare the `hash` value received in the 1st step with the result of the 4th step."
6. "If these values are equal, passed init data can be trusted."

### Third-Party Validation Algorithm (Ed25519, added March 2026):
- "Another useful feature Telegram provides is it allows validating init data without knowing the bot secret token, but its identifier."
- Uses Ed25519 signature from the `signature` parameter (separate from `hash`).
- Steps: sort key=value pairs (excluding `hash` and `signature`), concatenate bot ID with "WebAppData" using ":", verify Ed25519 signature.
- "Unlike the `validate` function, `validate3rd` uses only Web Crypto API."

### Security warning from official source:
- "In real-world applications, it is recommended to use additional mechanisms for verifying initialization data. For example, add their expiration date. This check can be implemented using the `auth_date` parameter."
- "Default expiration duration is set to 1 day (86,400 seconds)."
- "It is recommended to always check the expiration of the initialization data, as it could be stolen but still remain valid."

### initData parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `auth_date` | number | Unix timestamp of when init data was created |
| `hash` | string | Initialization data signature (HMAC) |
| `signature` | string | Ed25519 signature for third-party validation |
| `user` | object | Current user info (id, first_name, username, etc.) |
| `query_id` | string | Optional unique identifier for answering web_app_query |
| `chat` | object | Optional - chat info for Mini Apps opened from group |
| `chat_type` | string | Type of chat (private/group/supergroup/channel) |
| `chat_instance` | string | Global chat identifier |

### Passing init data to server:
- Frontend: `const initData = window.Telegram.WebApp.initData;`
- Standard pattern: pass as `Authorization: tma <initData>` header
- Server must validate BEFORE using ANY data from initData

## Annotations for stinger-forge

- `guides/03-mini-apps.md` MUST include both validation approaches:
  1. Standard HMAC-SHA256 (with known bot token) - for bot's own Mini Apps
  2. Third-party Ed25519 (without bot token) - for third-party Mini App builders/SDK providers
- The 6-step validation algorithm should be shown verbatim with code examples in both TypeScript (using `@tma.js/init-data-node`) and Python.
- The auth_date expiration check (default 24h) is a REQUIRED security control - document as a critical directive.
- The `initDataUnsafe` vs `initData` distinction is critical: `initDataUnsafe` should NEVER be trusted directly by the server - only `initData` after HMAC validation.
- The `window.Telegram.WebApp.initData` value is the raw string to send and validate; `initDataUnsafe` is the already-parsed version (but unverified).
- Contradictions to resolve: The `hash` is used for HMAC validation; the newer `signature` is used for Ed25519 third-party validation. Both may be present simultaneously in initData.
