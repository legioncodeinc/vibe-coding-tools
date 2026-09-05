---
source_url: https://grammy.dev/resources/comparison
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: framework-selection
stinger: telegram-bot-stinger
---

# grammY Framework Comparison Page - Official

## Summary

The official grammY comparison page at grammy.dev/resources/comparison provides grammY's own framing of the framework landscape. It covers grammY vs Telegraf, vs node-telegram-bot-api (NTBA), and vs Go/Python libraries. The key decision logic: use grammY for TypeScript/JavaScript if you want best-in-class DX, type safety, and ecosystem; use Go if you know exactly what you're building and need raw compile-time CPU throughput; use Python (aiogram) if you prefer Python. The page is written from grammY's perspective but contains factual comparisons that are well-sourced.

## Key quotations / statistics

- **On Telegraf:** "Everything except grammY, Telegraf, and NTBA is largely unmaintained and thus horribly out of date." (Note: Telegraf npm data shows "2 years ago" last update as of research - effectively abandoned)
- **On NTBA (`node-telegram-bot-api`):** "Any code base with more than 50 lines that uses NTBA ends up being a terrible mess of spaghetti-like cross-references."
- **On TypeScript types:** "grammY is significantly better than any library written in Go. This is mainly due to TypeScript's advanced type system which grammY leverages in sophisticated ways. As a result, you can explore the Bot API interactively right from inside your editor."
- **On scale:** "Processing ~100,000,000 updates per day can be done easily with TypeScript, but going beyond that will require extra work, such as using one more grammY plugin."
- **On Go vs grammY:** "Pick a library written in Go if you already know fairly well what you will be building... Go outperforms TypeScript at raw CPU speed by several orders of magnitude."
- **On Python vs grammY:** "Pick grammY if you are not completely sure what you are building. TypeScript lets you iterate on your code base at incredible speeds. It is great for rapid prototyping."
- **npm comparison data (npm-compare.com):**
  - grammY: 55,060 weekly downloads, 3,151 stars
  - Telegraf: 131,705 weekly downloads, 9,004 stars, **last updated 2 years ago**
  - grammY growing faster despite lower total downloads - Telegraf is legacy traffic

## Annotations for stinger-forge

- `guides/00-framework-selection.md`: The comparison creates a clear 3-way decision tree:
  1. TypeScript/JavaScript -> **grammY** (DX, types, active maintenance)
  2. Python -> **aiogram 3.x** (async-native, high performance)
  3. Legacy/existing codebases -> either python-telegram-bot (sync Python) or a migration path
- Telegraf's higher download count is misleading - it's legacy traffic from unmaintained projects. grammY should be recommended categorically for new TypeScript bots.
- The "100M updates/day" benchmark for TypeScript grammY is useful for the capacity planning section.
- NTBA (`node-telegram-bot-api`) should be listed as explicitly discouraged - this is a real footgun that developers hit.
- The production migration example (TinyAGI removing 55 lines of watchdog code by migrating from NTBA to grammY) is a compelling real-world case study for the guide.
