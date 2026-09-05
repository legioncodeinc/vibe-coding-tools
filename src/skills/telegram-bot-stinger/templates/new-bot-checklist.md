# New Bot Pre-Launch Checklist

Use this checklist before putting any Telegram bot into production.

## Security

- [ ] `BOT_TOKEN` stored in environment variable (not in source code, not in `.env` committed to git)
- [ ] `.env` is in `.gitignore`
- [ ] Webhook `secret_token` is set and validated on every incoming request
- [ ] Mini App `initData` is validated server-side (HMAC-SHA256) before trusting user identity
- [ ] `auth_date` expiry check is implemented (reject `initData` older than 1 hour)
- [ ] Bot token has not been shared in Slack, Discord, or any chat tool

## Delivery mechanism

- [ ] Decision made: webhook (production) or long-polling (local dev / simple bot)?
- [ ] Webhook: HTTPS endpoint with valid TLS cert (Let's Encrypt recommended)
- [ ] Webhook: port is 443, 80, 88, or 8443 (Telegram only allows these)
- [ ] Webhook: `setWebhook` called with `allowed_updates` scoped to only the update types you handle
- [ ] Webhook: `getWebhookInfo` returns no error and the correct URL
- [ ] NOT running both webhook and polling simultaneously (409 Conflict risk)

## Bot features

- [ ] All `answerCallbackQuery` calls happen within 30 seconds
- [ ] All `answerPreCheckoutQuery` calls happen within 10 seconds
- [ ] Session state is persistent (Redis, Postgres): not in-memory (lost on restart)
- [ ] Error handler installed (`bot.catch(...)`)
- [ ] Update deduplication in place if multiple bot instances may run (idempotent `update_id` handling)

## Payments (if applicable)

- [ ] Selling digital goods → using Stars (`XTR`) with empty `provider_token`
- [ ] Selling physical goods → using fiat with valid `provider_token` from BotFather
- [ ] `pre_checkout_query` handler answers within 10 seconds
- [ ] `successful_payment` handler is idempotent (handles duplicate events safely)
- [ ] Order fulfillment logic is tested with Telegram's test payment mode

## Mini Apps (if applicable)

- [ ] `initData` validated server-side before any access is granted
- [ ] `tg.ready()` called on Mini App load
- [ ] App tested at 375px width (iPhone SE) and 390px (iPhone 14)
- [ ] `tg.viewportHeight` used instead of `window.innerHeight` for layout calculations
- [ ] MainButton text is set before `show()` is called

## Rate limits

- [ ] Global rate limit awareness: 30 messages/second
- [ ] Per-chat rate limit awareness: 1 message/second
- [ ] Broadcast to multiple chats: implemented with delay between sends
- [ ] Auto-retry plugin enabled (grammY: `@grammyjs/auto-retry` | aiogram: built-in)

## Deployment

- [ ] Health check endpoint exists and returns 200
- [ ] Bot restarts gracefully (systemd, PM2, Docker restart policy)
- [ ] Logs don't include bot token or user PII
- [ ] Monitoring / alerting set up for webhook delivery errors (`last_error_message` in getWebhookInfo)
