# Guide 03: Telegram Mini Apps

> Sources: `research/mini-apps/2026-05-20-initdata-validation-official.md`, `research/mini-apps/2026-05-20-tma-js-init-data-node.md`, `research/mini-apps/2026-05-20-mini-apps-official-webapps.md`

---

## What is a Telegram Mini App?

A Mini App (WebApp) is a web application that runs inside the Telegram client in a bottom sheet or fullscreen view. It is opened from a bot command, an inline keyboard button with `web_app` type, or directly via a link. The Mini App is a normal HTTPS web page that loads the Telegram WebApp JS SDK.

---

## CRITICAL: initData validation: do this first, always

The Telegram WebApp SDK passes user data to your Mini App via `Telegram.WebApp.initData`: a URL-encoded string. This data includes the authenticated user's ID, name, and other context. **It can be forged if you don't validate it server-side.**

### Validation algorithm (HMAC-SHA256: standard path)

From `research/mini-apps/2026-05-20-initdata-validation-official.md`:

1. Parse `initData` as a URL query string.
2. Extract `hash` from the parsed object. Remove `hash` from the remaining fields.
3. Sort the remaining fields alphabetically by key.
4. Join them as `key=value\nkey=value\n...` (newline-separated, no trailing newline).
5. Compute `secret_key = HMAC-SHA256("WebAppData", bot_token)` (i.e., HMAC the string `"WebAppData"` using `bot_token` as key).
6. Compute `data_hash = HMAC-SHA256(data_check_string, secret_key)`.
7. Compare `data_hash` to the extracted `hash`. If equal, the data is authentic.
8. Check `auth_date`: reject if older than 1 hour (3600 seconds).

```typescript
// Node.js / TypeScript validation
import { createHmac } from "crypto";

function validateTelegramInitData(initData: string, botToken: string): boolean {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  params.delete("hash");

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (computedHash !== hash) return false;

  const authDate = parseInt(params.get("auth_date") ?? "0", 10);
  if (Date.now() / 1000 - authDate > 3600) return false;

  return true;
}
```

```python
# Python validation
import hashlib
import hmac
from urllib.parse import parse_qsl, urlencode

def validate_telegram_init_data(init_data: str, bot_token: str) -> bool:
    params = dict(parse_qsl(init_data))
    received_hash = params.pop("hash", None)
    if not received_hash:
        return False

    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(params.items())
    )

    secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    if computed_hash != received_hash:
        return False

    import time
    if time.time() - int(params.get("auth_date", 0)) > 3600:
        return False

    return True
```

### New Ed25519 path (Bot API 9.5, March 2026)

Bot API 9.5 added a third-party validation mechanism using Ed25519 signatures. This allows validation using only the bot's **public key** (derived from bot ID): the bot token secret is not required.

This is useful for:
- Third-party analytics/auth providers that process Mini App data without your bot token
- Multi-tenant platforms where you don't want to expose bot tokens to sub-services

> TODO: Complete Ed25519 validation code was not captured in this research pass. The `@tma.js/init-data-node` library supports it. Check https://docs.telegram-mini-apps.com/packages/telegram-apps-init-data-node for the Ed25519 path implementation.

---

## Using @tma.js/init-data-node (Express middleware)

```typescript
import { parse, validate, isValid } from "@tma.js/init-data-node";
import express from "express";

const app = express();
app.use(express.json());

// Validation middleware
function telegramAuth(req, res, next) {
  const initData = req.headers["x-telegram-init-data"] as string;
  try {
    validate(initData, process.env.BOT_TOKEN!);
    req.telegramUser = parse(initData).user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid initData" });
  }
}

app.get("/api/profile", telegramAuth, (req, res) => {
  res.json({ user: req.telegramUser });
});
```

---

## WebApp JS SDK: key APIs

Load in your Mini App's HTML:
```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

Or use the npm package: `@tma.js/sdk`

### Initialization
```javascript
const tg = window.Telegram.WebApp;
tg.ready(); // Tell Telegram the Mini App is ready
tg.expand(); // Expand to full height
```

### MainButton (primary action button at bottom)
```javascript
tg.MainButton.text = "Submit";
tg.MainButton.show();
tg.MainButton.onClick(() => {
  tg.MainButton.showProgress(); // Loading spinner
  // ... submit data ...
  tg.close(); // Close Mini App
});
```

### BackButton
```javascript
tg.BackButton.show();
tg.BackButton.onClick(() => {
  // Navigate back within your app
});
```

### Haptic feedback
```javascript
tg.HapticFeedback.impactOccurred("medium"); // light | medium | heavy | rigid | soft
tg.HapticFeedback.notificationOccurred("success"); // success | warning | error
tg.HapticFeedback.selectionChanged();
```

### CloudStorage (persistent key-value, per-bot per-user)
```javascript
tg.CloudStorage.setItem("user_prefs", JSON.stringify({ theme: "dark" }), (err, saved) => {
  if (!err && saved) console.log("Saved");
});

tg.CloudStorage.getItem("user_prefs", (err, value) => {
  if (!err) console.log(JSON.parse(value));
});
```

### Theme and viewport
```javascript
// Theme colors (adjusts to Telegram's current theme)
const bgColor = tg.themeParams.bg_color;
const textColor = tg.themeParams.text_color;

// Viewport height (use this, not window.innerHeight)
const height = tg.viewportHeight;
tg.onEvent("viewportChanged", () => {
  const newHeight = tg.viewportHeight;
});
```

---

## Opening a Mini App from a bot

### Via inline keyboard button
```typescript
// grammY
import { InlineKeyboard } from "grammy";

const kb = new InlineKeyboard().webApp("Open App", "https://yourminiapp.com");
await ctx.reply("Open the app:", { reply_markup: kb });
```

### Via bot command
Register your Mini App URL in BotFather with `/newapp` or link it to a command via `/setmenubutton`.

---

## Security hardening checklist

- [ ] Always validate `initData` server-side before trusting user identity
- [ ] Check `auth_date` is not older than 1 hour
- [ ] Never expose the bot token to the frontend
- [ ] Use `secret_token` on the webhook endpoint (separate from bot token)
- [ ] Serve the Mini App over HTTPS only
- [ ] Validate `user.id` against your own user table before granting access
