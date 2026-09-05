# Example: Mini Apps initData Validation

> Demonstrates: `guides/03-mini-apps.md`

---

## Scenario

A Telegram Mini App sends the user's `initData` to a backend API for authentication. The backend validates it using both the HMAC-SHA256 path (traditional) and via `@tma.js/init-data-node` middleware. After validation, the user's Telegram ID is used to look up their profile.

---

## Frontend (Mini App JavaScript)

```javascript
// index.html / main.js
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Get initData (the auth token from Telegram)
const initData = tg.initData;

// Send to your backend for validation
async function loadProfile() {
  const response = await fetch("https://api.yourapp.com/profile", {
    headers: {
      "X-Telegram-Init-Data": initData,
    },
  });
  const data = await response.json();
  document.getElementById("name").textContent = data.firstName;
}

loadProfile();
```

---

## Backend: manual HMAC-SHA256 validation (TypeScript)

```typescript
// validation.ts
import { createHmac } from "crypto";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export function validateInitData(
  initData: string,
  botToken: string
): TelegramUser {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) throw new Error("Missing hash");

  params.delete("hash");

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const computedHash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (computedHash !== hash) {
    throw new Error("Invalid initData signature");
  }

  const authDate = parseInt(params.get("auth_date") ?? "0", 10);
  if (Date.now() / 1000 - authDate > 3600) {
    throw new Error("initData expired (auth_date older than 1 hour)");
  }

  const userParam = params.get("user");
  if (!userParam) throw new Error("Missing user field");

  return JSON.parse(userParam) as TelegramUser;
}
```

---

## Backend: using @tma.js/init-data-node middleware (Express)

```typescript
// server.ts
import express from "express";
import { validate, parse } from "@tma.js/init-data-node";

const app = express();

// Middleware: validate initData and attach user to request
function telegramAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const initData = req.headers["x-telegram-init-data"] as string;

  if (!initData) {
    return res.status(401).json({ error: "Missing X-Telegram-Init-Data header" });
  }

  try {
    // Validate (throws on failure)
    validate(initData, process.env.BOT_TOKEN!, { expiresIn: 3600 });

    // Parse user data
    const parsed = parse(initData);
    (req as any).telegramUser = parsed.user;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid initData",
      detail: err instanceof Error ? err.message : "unknown",
    });
  }
}

// Protected endpoint
app.get("/profile", telegramAuth, async (req, res) => {
  const user = (req as any).telegramUser;

  // Look up user in your database
  const dbUser = await db.users.findOrCreate({
    telegramId: user.id,
    firstName: user.first_name,
    username: user.username,
  });

  res.json({
    id: dbUser.id,
    firstName: dbUser.first_name,
    username: dbUser.username,
    telegramId: dbUser.telegramId,
  });
});

app.listen(3000);
```

---

## What this demonstrates

1. Mini App sends `initData` via a custom header (never in URL params)
2. Manual HMAC-SHA256 validation in 6 steps (authoritative algorithm)
3. `auth_date` expiry check (1-hour window)
4. `@tma.js/init-data-node` middleware as a cleaner alternative
5. `findOrCreate` pattern: auto-provision users on first Mini App open
6. `BOT_TOKEN` is only on the server, never exposed to the frontend

## Edge cases handled

- Missing `hash` → 401 (not 500)
- Expired `auth_date` → 401 with clear message
- Missing `user` field → 401 (not 500)
- Invalid JSON in `user` field → caught by JSON.parse
