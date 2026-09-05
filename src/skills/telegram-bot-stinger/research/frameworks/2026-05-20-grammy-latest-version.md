---
source_url: https://github.com/grammyjs/grammY
retrieved_on: 2026-05-20
source_type: github-readme
authority: official
relevance: critical
topic: grammy-framework
stinger: telegram-bot-stinger
---

# grammY - The Telegram Bot Framework (TypeScript/JavaScript)

## Summary

grammY is the recommended TypeScript/JavaScript framework for Telegram bots in 2026. It is still on the v1.x series (NOT v2) with latest version v1.43.0 released May 16, 2026. The framework tracks Bot API releases very closely - v1.42.0 (April 3, 2026) added Bot API 9.6 support; v1.40.0 (February 9, 2026) added Bot API 9.4. The GitHub repo has 3,583 stars, 60 contributors, and the last push was May 16, 2026. It runs on Node.js and Deno natively, and has a web bundle for Cloudflare Workers.

## Key quotations / statistics

- **Latest release:** v1.43.0 (2026-05-16) - still v1.x, NO v2 breaking changes detected.
- **GitHub stars:** 3,583 (as of May 2026).
- **v1.42.0 (April 3, 2026):** "feat: support Bot API 9.6" - adds Managed Bots types/methods.
- **v1.40.0 (February 9, 2026):** "feat: support Bot API 9.4" - custom emoji support.
- **v1.39.x (Jan 2026):** "feat: support Bot API 9.3"; "fix: implement constant-time comparison for webhook secret token" (security fix for timing attacks on secret_token validation).
- **Runtimes:** Node.js (`^12.20.0 || >=14.13.1`), Deno, Cloudflare Workers (`import { Bot } from "grammy/web"`).
- **Architecture:** "Processing ~100,000,000 updates per day can be done easily with TypeScript." For higher volume, additional plugins/sharding needed.
- **Migration evidence:** A March 2026 production migration from `node-telegram-bot-api` to grammY removed "~55 lines of watchdog/restart-polling workaround code that is no longer needed" - grammY handles polling reliability natively.
- **Community:** 60 contributors, active since 2021, thriving plugin ecosystem (sessions, FSM, conversations, i18n, etc.).
- **Documentation quality:** "It has the best documentation in town." grammY docs explicitly cover deployment types, scaling, plugins, and framework comparison.
- **grammY vs Telegraf:** "telegraf is largely unmaintained" - last npm publish "2 years ago" as of research date. grammY is the clear successor for TypeScript.
- **Framework comparison page:** https://grammy.dev/resources/comparison - explicitly covers grammY vs Telegraf, vs Go libraries, vs Python libraries.

## Annotations for stinger-forge

- **ANSWER to Command Brief Q:** grammY is still v1 (v1.43.0). No v2 breaking changes. The v1 series is actively maintained and rapidly tracks Bot API updates.
- `guides/00-framework-selection.md`: grammY is the confirmed TypeScript recommendation for 2026. Telegraf is deprecated/unmaintained. python-telegram-bot is the sync Python alternative but aiogram is preferred for performance.
- `guides/01-webhook-setup.md`: Note the v1.39.x security fix for constant-time webhook secret_token comparison - this is important for security hardening.
- The Cloudflare Workers bundle (`grammy/web`) means grammY can run serverless on the edge - document this as a deployment option.
- The grammY docs page on deployment types (https://grammy.dev/guide/deployment-types) is the canonical reference for webhook vs polling - see `2026-05-20-grammy-deployment-types.md`.
