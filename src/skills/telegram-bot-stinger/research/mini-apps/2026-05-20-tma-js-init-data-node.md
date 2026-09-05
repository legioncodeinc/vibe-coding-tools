---
source_url: https://docs.telegram-mini-apps.com/packages/tma-js-init-data-node
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: mini-apps-initdata
stinger: telegram-bot-stinger
---

# @tma.js/init-data-node - Server-Side initData Validation Package

## Summary

`@tma.js/init-data-node` is the official server-side validation library for Telegram Mini Apps initData, maintained by Vladislav Kibenko (core Telegram Mini Apps ecosystem contributor). It provides `validate()`, `isValid()`, `validate3rd()`, and `isValid3rd()` functions for both standard HMAC-SHA256 and third-party Ed25519 validation. The package ships separate Node.js and Web Crypto API implementations, with async functions required for Web Crypto. The recommended middleware pattern sends initData in the `Authorization: tma <initData>` header.

## Key quotations / statistics

```typescript
// Standard validation (throws on failure)
import { validate } from '@tma.js/init-data-node';
validate(rawInitDataString, '5768337691:AAH5YkoiEuPk8-FZa32hStHTqXiLPtAEhx8');

// Standard validation (boolean, no throw)
import { isValid } from '@tma.js/init-data-node';
const ok = isValid(rawInitDataString, botToken);

// Third-party validation (async, Ed25519)
import { validate3rd } from '@tma.js/init-data-node';
await validate3rd(rawInitDataString, 7342037359); // uses bot ID, not token
```

**Error types thrown by `validate()`:**
- `AuthDateInvalidError`: `auth_date` is empty or not found
- `SignatureMissingError`: `hash` is empty or not found
- `SignatureInvalidError`: signature is invalid
- `ExpiredError`: init data expired (default 24h = 86,400 seconds)

**Expiration control:**
- "By default, the function checks the expiration of the initialization data. The default expiration duration is set to 1 day (86,400 seconds)."
- "To disable this feature, pass `{ expiresIn: 0 }` as the third argument." (NOT recommended for production)

**Hashed token support:**
- "By 'hashed token,' we mean a token hashed using the HMAC-SHA-256 algorithm with a key derived from `WebAppData`." - Allows reducing how often the raw token is passed around.

**Express middleware pattern (from docs):**
```typescript
import { validate, parse, type InitData } from '@tma.js/init-data-node';
import express, { type RequestHandler } from 'express';

const authMiddleware: RequestHandler = (req, res, next) => {
  const [authType, authData = ''] = (req.header('authorization') || '').split(' ');
  if (authType === 'tma') {
    try {
      validate(authData, botToken, { expiresIn: 3600 }); // 1 hour
      res.locals.initData = parse(authData);
      return next();
    } catch (e) {
      return next(e);
    }
  }
  return next(new Error('Unauthorized'));
};
```

**Third-party validation details:**
- `validate3rd` accepts: initData string, bot ID (number), options object with `expiresIn` and `test` (boolean for test environment).
- Available from both root package import and `web` subdirectory (for browser/edge environments).

## Annotations for stinger-forge

- `guides/03-mini-apps.md` should include the Express middleware pattern verbatim - it's the canonical implementation.
- The `expiresIn: 3600` (1 hour) in the example is more restrictive than the default 24h - document the tradeoff clearly.
- The Web Crypto API versions (`import from '@tma.js/init-data-node/web'`) are important for Cloudflare Workers deployments.
- The `parse()` function should be called AFTER `validate()` to avoid using unvalidated data.
- This package also exists as `@mini-apps/telegram-init-data` (v1.0.0, published June 2025) - may be a repackaging or successor; stinger-forge should check for version alignment.
- The `test` option in `validate3rd` is needed for bots testing in Telegram's test environment (separate from production).
