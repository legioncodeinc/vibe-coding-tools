# 11 — License, Provenance & Versioning

**Source:** `LICENSE`, `NOTICE.md`, `package.json`, `README.md`, `impeccable.style/robots.txt`

## License

- **Apache-2.0** (`LICENSE`; `package.json` `"license": "Apache-2.0"`; `cli/engine/detect-antipatterns.mjs` header: "SPDX-License-Identifier: Apache-2.0").
- Vendoring guidance content into the stinger is license-clean with attribution. Keep the NOTICE/attribution (`NOTICE.md` exists in the repo).
- Author: Paul Bakaus. Homepage: impeccable.style. npm: `impeccable`.

## Site content signals (compliance)

- `impeccable.style/robots.txt`: `Content-Signal: search=yes, ai-train=no, use=reference` (Cloudflare managed; also disallows GPTBot, ClaudeBot, CCBot, etc.).
- Implication: the stinger must be built from the **repo** (Apache-2.0), not scraped from the site. Site text is reference-only for understanding, not a training/vendoring source.

## Versioning

- Repo `package.json`: `3.5.0` (npm package version). Site markets **v4** ("A leaner core, tuned on frontier models like Fable and GPT-5.6-Sol. Four visitor modes.").
- Content is in sync: the repo's `SKILL.src.md` has all four modes (Persuade/Operate/Read/Experience); the site docs are generated from the repo's `skill/reference/` files.
- Upstream is actively maintained (repo HEAD `aee6ce9`, 2026-08-04; sitemap lastmods through 2026-07-22).
- Implication: the stinger's vendored reference docs need a refresh cadence; the installed side self-updates via `npx impeccable check`/`update`.

## Research provenance

- Clone: `/tmp/impeccable-RZVWdD` (shallow, depth 1, commit `aee6ce9`).
- Detector verified live: `node cli/bin/cli.js detect tests/fixtures` produced line-numbered findings (side-tab, design-system-color, etc.).
- Site pages fetched for reference: `/`, `/docs*`, `/slop`, `/research`, `/designing`, `/cases/neo-mirai`, `/tutorials/*`.
