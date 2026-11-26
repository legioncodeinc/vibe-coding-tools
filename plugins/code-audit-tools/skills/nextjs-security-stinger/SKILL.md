---
name: nextjs-security-stinger
description: Deep Next.js security audit (13 to 16, App and Pages Router). Version advisories, proxy and middleware auth, Server Actions, Route Handlers, data exposure, caching, config. Read-only.
license: AGPL-3.0-or-later
compatibility: Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex, Cowork. Scan script needs Python 3.9 or newer (standard library only). ripgrep recommended.
metadata:
  author: Legion Code Inc.
  hive-drone: nextjs-security-wasp-drone
  pair-drone: nextjs-security-wasp-drone
  domain: Next.js security audit
  version: 1.0.0
  research-window: 2026-03-30 to 2026-09-30
---

# Next.js Security Stinger

Designed and built by Legion Code Inc.

## Where this skill's files are

Every path below (`guides/`, `references/`, `scripts/`) is relative to the folder that contains this `SKILL.md`. In Claude Code that folder is `${CLAUDE_SKILL_DIR}`. If that text was not replaced with a real path, find the folder yourself (for example with Glob for `**/nextjs-security-stinger/SKILL.md`) and use it as the skill directory in every command.

## Purpose

Run the Next.js-specific part of the security dimension of an `/audit-my-code` run. It finds the installed `next` version in every app of the repo and matches it against a normalized table of 61 GitHub Security Advisories (2024 to 2026-09-30, including CVE-2025-29927 and the React2Shell RSC remote code execution CVE-2025-55182), then reviews the places Next.js apps actually break: authorization that lives only in middleware or `proxy.ts`, Server Actions and Route Handlers that are public endpoints without auth or ownership checks, private data passed to Client Components or baked into static and cached output, `NEXT_PUBLIC_` secrets, broad `images.remotePatterns`, dynamic-host rewrites, CSP and header gaps, and auth-library misuse (Auth.js, Clerk, Supabase SSR). It writes contract-shaped `SEC-NEXT-NNN` findings, metrics, and notes to the run workspace and never changes the audited repository.

## When to use

- The orchestrator routes a `basic`, `full`, or `mario` tier run with `nextjs` in `intake.json.stacks`.
- "Security audit this Next.js app", "are my Server Actions safe", "is our middleware auth enough", "is our Next.js version vulnerable", "check us for CVE-2025-29927 or React2Shell".
- A vibe-coded Next.js app (v0, Cursor, Claude Code, Lovable, Bolt) needs a deep framework pass before launch.

## When not to use

- Generic OWASP review, non-`next` dependency CVEs, SQL injection in plain helpers, secrets scanning of the whole repo: `security-stinger` through `security-wasp-drone` (the generic pass runs alongside this one).
- React client-side patterns (XSS through `dangerouslySetInnerHTML`, unsafe URLs in `href`, client storage of tokens): the `react-security` pair.
- SvelteKit or non-JavaScript backends: `sveltekit-security` and `polyglot-security` pairs.
- Fixing the code. This skill is research-only; remediation planning belongs to the `mario` tier's remediation Drone.
- Testing a live site from the outside: `web-security-posture-stinger`.

## Procedure

1. Read [guides/00-scoping.md](guides/00-scoping.md) and run `scripts/next_audit_scan.py` against the repo with output into `<workspace>/02-security/raw/`. Record versions, router type, deployment target, auth library, and data access pattern in `notes-nextjs-security-wasp-drone.md`.
2. Follow [guides/01-version-and-advisory-check.md](guides/01-version-and-advisory-check.md): confirm lockfile versions, settle advisory preconditions, rewrite or drop scanner findings, append them to `findings-nextjs-security-wasp-drone.jsonl`.
3. Follow [guides/02-proxy-middleware-and-auth-boundaries.md](guides/02-proxy-middleware-and-auth-boundaries.md): build the boundary map, test middleware-only auth, matcher gaps, unverified sessions, and the auth library checks.
4. Follow [guides/03-server-actions-and-route-handlers.md](guides/03-server-actions-and-route-handlers.md): read every action and handler for authentication, ownership, input trust, return values, CSRF, CORS, and SSRF.
5. Follow [guides/04-data-exposure-and-caching.md](guides/04-data-exposure-and-caching.md): secrets and `NEXT_PUBLIC_`, props to Client Components, `server-only`, source maps, taint, `use cache`, `unstable_cache`, static and ISR output.
6. Follow [guides/05-config-and-headers.md](guides/05-config-and-headers.md): images, rewrites and redirects, headers, CSP, build switches, `next/og`.
7. At the end of steps 3 to 6, sweep [references/ai-failure-patterns.md](references/ai-failure-patterns.md) and confirm hits through their owning checks.
8. Follow [guides/06-writing-findings.md](guides/06-writing-findings.md): write and validate findings, metrics measures, and notes. Report the counts and the verdict input to the orchestrator.

## References map

| Path | Load when |
| --- | --- |
| `guides/00-scoping.md` to `guides/06-writing-findings.md` | In order, for every run |
| `references/REFERENCE.md` | Index of all references and the script's inputs, outputs, and limits |
| `references/advisory-table.md` | Any version or advisory question |
| `references/next-advisories.json` | Read by the scanner; edit only when refreshing research |
| `references/checks-proxy-and-auth-boundaries.md` | Guide 02 |
| `references/checks-server-actions-and-route-handlers.md` | Guide 03 |
| `references/checks-data-exposure-and-caching.md` | Guide 04 |
| `references/checks-config-and-headers.md` | Guide 05 |
| `references/ai-failure-patterns.md` | End of guides 02 to 05 |
| `references/finding-templates.md` | Guide 06 |
| `references/research/distilled-nextjs-security.md` | Verifying a claim or settling a dispute |
| Source research archive (not shipped with the plugin) | Source-repository only; the shipped distillation summarizes it, do not require it |
| `scripts/next_audit_scan.py` | Run once in guide 00; rerun after refreshing the advisory table |

## Related drones and stingers

- [nextjs-security-wasp-drone](../../agents/nextjs-security-wasp-drone.md) - The paired agent. The orchestrator dispatches it for every app with the `nextjs` stack.
- `audit-my-code-stinger` - Owns the run contract this skill writes against (`references/audit-contract.md`).
- `security-stinger` - Generic security pass that runs next to this one; overlapping findings are merged by the brief renderer.
- `react-security` pair - Client component patterns in the same app.
- `web-security-posture-stinger` - Passive outside-in checks of a deployed site, if the user wants headers confirmed live.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - `security-stinger` (core Wasp Nest, when installed) - Generic security audit pass that runs alongside this one in the security dimension.
  - [web-security-posture-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/website-audit-tools/skills/web-security-posture-stinger) - Passive external posture checks of a deployed site.

<!-- Ship Gate removed: research-only stinger, produces no committable code. -->

---

Designed and built by Legion Code Inc. Licensed under AGPL-3.0-or-later.
